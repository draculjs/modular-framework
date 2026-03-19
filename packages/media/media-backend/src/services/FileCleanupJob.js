import { DefaultLogger as winston } from "@dracul/logger-backend"
import FileService from "./FileService"

console.log("CleanupJob file loaded")

class CleanupScheduler {
    constructor() {
        console.log("CleanupScheduler constructor started")
        this.timer = null
        this.isRunning = false
        this.isEnabled = true
        this.MAX_NODE_TIMEOUT = 2147483647 // 32-bit signed int limit (~24.8 days)

        if (FileService && typeof FileService.on === 'function') {
             console.log("CleanupScheduler: FileService event listener attached")
             FileService.on('expirationChanged', () => {
                if (this.isEnabled) {
                    winston.info("CleanupJob: Expiration changed, rescheduling...")
                    this.schedule()
                }
            })
        } else {
            console.error("CleanupScheduler: FileService is NOT an EventEmitter or is undefined!", FileService)
        }
    }

    async schedule(options = {}) {
        console.log("CleanupJob.schedule called", options)
        if (options.enabled !== undefined) this.isEnabled = options.enabled
        
        if (!this.isEnabled) {
            winston.info('CleanupJob: Cleanup is disabled')
            this.stop()
            return
        }

        if (this.timer) clearTimeout(this.timer)
        if (this.isRunning) {
            console.log("CleanupJob.schedule: already running, skipping")
            return
        }

        try {
            // First, run a cleanup to clear any already expired files
            await this.execute(false)

            const nextTs = await FileService.getNextExpirationTimestamp()
            console.log("CleanupJob.schedule: next expiration at", nextTs)
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
            winston.info("CleanupJob: Running reactive cleanup...")
            console.log("CleanupJob.execute: starting FileService.executeCleanup")
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
    console.log("startFileCleanupJob function called")
    const enabled = options.enabled ?? process.env.MEDIA_FILE_CLEANUP_ENABLED !== 'false'
    scheduler.schedule({ enabled })
}

export const stopFileCleanupJob = function () {
    scheduler.stop()
}

export default {
    startFileCleanupJob,
    stopFileCleanupJob
}
