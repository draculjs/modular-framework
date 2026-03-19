import { DefaultLogger as winston } from "@dracul/logger-backend"
import FileService from "./FileService"

winston.info("CleanupJob: Module loaded")

class CleanupScheduler {
    constructor() {
        winston.info("CleanupScheduler: Constructor started")
        this.timer = null
        this.isRunning = false
        this.isEnabled = true
        this.MAX_NODE_TIMEOUT = 2147483647 // 32-bit signed int limit (~24.8 days)

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
            // First, run a cleanup to clear any already expired files
            await this.execute(false)

            const nextTs = await FileService.getNextExpirationTimestamp()
            winston.info("CleanupJob: Next expiration: " + (nextTs ? new Date(nextTs).toISOString() : "none"))
            if (!nextTs) {
                winston.info("CleanupJob: No pending expirations. Sentinel in standby.")
                return
            }

            const now = Date.now()
            const delay = Math.max(0, nextTs - now)
            
            // If it's more than 24 days, schedule for 24 days and it will re-evaluate then
            const safeDelay = Math.min(delay, this.MAX_NODE_TIMEOUT)

            winston.info(`CleanupJob: Next cleanup scheduled in ${Math.round(safeDelay / 1000 / 60)} minutes`)
            
            this.timer = setTimeout(() => this.execute(), safeDelay)
        } catch (error) {
            winston.error(`CleanupJob.schedule error: ${error}`)
            // Retry in 1 minute on error
            this.timer = setTimeout(() => this.schedule(), 60000)
        }
    }

    async execute(reSchedule = true) {
        if (this.isRunning) return
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

    stop() {
        if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null
        }
        winston.info('CleanupJob: Scheduler stopped')
    }
}

const scheduler = new CleanupScheduler()

export const startFileCleanupJob = function (options = {}) {
    winston.info("CleanupJob: startFileCleanupJob called, enabled=" + (options.enabled ?? process.env.MEDIA_FILE_CLEANUP_ENABLED !== 'false'))
    scheduler.schedule(options)
}

export const stopFileCleanupJob = function () {
    scheduler.stop()
}

export default {
    startFileCleanupJob,
    stopFileCleanupJob
}
