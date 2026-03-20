import { DefaultLogger as winston } from "@dracul/logger-backend"
import FileService from "./FileService"

winston.info("CleanupJob: Module loaded")

/**
 * @class CleanupScheduler
 * @classdesc Scheduler que gestiona la ejecución periódica del cleanup de archivos expirados.
 *              Usa setTimeout en lugar de cron externo para mayor control.
 * 
 * **Manejo del Límite Técnico de setTimeout:**
 * Node.js setTimeout tiene un límite de ~24.8 días (2^31-1 ms). El scheduler divide
 * delays mayores en múltiples ciclos automáticamente, lo cual es transparente para el usuario.
 * 
 * **Flujo con reinicios frecuentes:**
 * Al iniciar, el scheduler ejecuta cleanup inmediatamente (execute(false)) para:
 * - Borrar archivos que expiraron mientras el servidor estaba apagado
 * - Verificar que archivos vivos no sean borrados por error
 * 
 * **Edge cases manejados:**
 * - Expiraciones > 24.8 días → múltiples ciclos de setTimeout
 * - Cleanup ya en ejecución → previene ejecuciones concurrentes
 * - Sin expiraciones pendientes → standby mode
 * - Errores → retry automático en 1 minuto
 * 
 * @listens FileService#expirationChanged
 */
class CleanupScheduler {
    /**
     * @constructs CleanupScheduler
     * @description Inicializa el scheduler y se suscribe al evento expirationChanged.
     * 
     * @property {number} MAX_NODE_TIMEOUT - Límite de setTimeout (~24.8 días).
     *              Delays mayores se dividen en múltiples ciclos automáticamente.
     * @property {NodeJS.Timeout|null} timer - Timer activo del scheduler.
     * @property {boolean} isRunning - Flag que previene ejecuciones concurrentes.
     * @property {boolean} isEnabled - Habilita/deshabilita el scheduler.
     */
    constructor() {
        winston.info("CleanupScheduler: Constructor started")
        this.timer = null
        this.isRunning = false
        this.isEnabled = true
        this.MAX_NODE_TIMEOUT = 2147483647

        if (FileService && typeof FileService.on === 'function') {
             winston.info("CleanupScheduler: Subscribed to expirationChanged events")
             FileService.on('expirationChanged', () => {
                if (this.isEnabled) {
                    winston.info("CleanupJob: Expiration changed, rescheduling...")
                    this.schedule()
                }
            })
        } else {
            winston.error("CleanupScheduler: FileService is NOT an EventEmitter or is undefined!")
        }
    }

    /**
     * @description Programa la próxima ejecución del cleanup.
     *              1) Ejecuta cleanup inmediatamente, 2) Calcula próxima expiración,
     *              3) Programa setTimeout hasta ese momento.
     * @async
     * @param {Object} [options={}]
     * @param {boolean} [options.enabled] - Habilitar/deshabilitar cleanup
     */
    async schedule(options = {}) {
        winston.info("CleanupJob: Scheduling cleanup, enabled=" + options.enabled)
        if (options.enabled !== undefined) this.isEnabled = options.enabled
        
        if (!this.isEnabled) {
            winston.info('CleanupJob: Cleanup is disabled')
            this.stop()
            return
        }

        if (this.timer) clearTimeout(this.timer)
        if (this.isRunning) {
            winston.info("CleanupJob: Already running, skipping")
            return
        }

        try {
            await this.execute(false)

            const nextTs = await FileService.getNextExpirationTimestamp()
            winston.info("CleanupJob: Next expiration: " + (nextTs ? new Date(nextTs).toISOString() : "none"))
            if (!nextTs) {
                winston.info("CleanupJob: No pending expirations. Sentinel in standby.")
                return
            }

            const now = Date.now()
            const delay = Math.max(0, nextTs - now)
            const safeDelay = Math.min(delay, this.MAX_NODE_TIMEOUT)

            winston.info(`CleanupJob: Next cleanup scheduled in ${Math.round(safeDelay / 1000 / 60)} minutes`)
            
            this.timer = setTimeout(() => this.execute(), safeDelay)
        } catch (error) {
            winston.error(`CleanupJob.schedule error: ${error}`)
            this.timer = setTimeout(() => this.schedule(), 60000)
        }
    }

    /**
     * @description Ejecuta el cleanup y reagenda para la siguiente ejecución.
     * @async
     * @param {boolean} [reSchedule=true] - Si true, reagenda después de ejecutar
     */
    async execute(reSchedule = true) {
        if (this.isRunning) return
        if (!this.isEnabled) return
        this.isRunning = true

        try {
            winston.info("CleanupJob: Starting file expiration cleanup...")
            const stats = await FileService.executeCleanup()
            winston.info(`CleanupJob: Cleanup finished. Deleted: ${stats.deletedCount}, Errors: ${stats.errorCount}`)
        } catch (error) {
            winston.error(`CleanupJob.execute error: ${error}`)
        } finally {
            this.isRunning = false
            if (reSchedule) await this.schedule()
        }
    }

    /**
     * @description Detiene el scheduler, cancelando el timer pendiente.
     */
    stop() {
        if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null
        }
        winston.info('CleanupJob: Scheduler stopped')
    }
}

const scheduler = new CleanupScheduler()

/**
 * @description Inicia el scheduler de cleanup. Llamar desde el punto de entrada de la aplicación.
 * @param {Object} [options={}]
 * @param {boolean} [options.enabled=true] - Habilitar/deshabilitar
 */
export const startFileCleanupJob = function (options = {}) {
    winston.info("CleanupJob: startFileCleanupJob called, enabled=" + (options.enabled ?? process.env.MEDIA_FILE_CLEANUP_ENABLED !== 'false'))
    scheduler.schedule(options)
}

/**
 * @description Detiene el scheduler de cleanup.
 */
export const stopFileCleanupJob = function () {
    scheduler.stop()
}

export const executeCleanupJob = (reSchedule = false) => scheduler.execute(reSchedule)

export default {
    startFileCleanupJob,
    stopFileCleanupJob,
    execute: (reSchedule = false) => scheduler.execute(reSchedule)
}
