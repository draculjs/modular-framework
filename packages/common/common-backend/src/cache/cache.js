require('dotenv').config()
import { DefaultLogger } from '@dracul/logger-backend'

/**
 * Una clase de caché en memoria con un TTL (Time To Live) para cada entrada.
 */
class Cache {
    /** @private */
    _data
    /** @private */
    _timers
    /** @private */
    _ttl

    /**
     * @param {number} [timeToLive=60000] - El tiempo de vida (TTL) por defecto en milisegundos.
     */
    constructor(timeToLive = 60000) {
        this._data = new Map()
        this._timers = new Map()
        this._ttl = timeToLive
        DefaultLogger.info(`[Cache] Instancia creada con TTL: ${this._ttl}ms`)
    }

    /**
     * Almacena un valor en la caché con una clave y un TTL opcional.
     * @param {string} key - La clave para almacenar el valor.
     * @param {*} value - El valor a almacenar.
     * @param {number} [timeToLive] - El TTL específico para esta entrada en milisegundos.
     */
    set(key, value, timeToLive) {
        if (this._timers.has(key)) {
            clearTimeout(this._timers.get(key))
        }

        const effectiveTTL = timeToLive ?? this._ttl
        const timer = setTimeout(() => {
            DefaultLogger.debug(`[Cache] TTL Expirado: Clave '${key}'`)
            this.delete(key)
        }, effectiveTTL)
        
        DefaultLogger.info(`[Cache] SET: Clave '${key}' guardada con TTL de ${effectiveTTL}ms`)
        this._timers.set(key, timer)
        this._data.set(key, value)
    }

    /**
     * Obtiene un valor de la caché por su clave.
     * @param {string} key - La clave del valor a obtener.
     * @returns {*|undefined} El valor si existe, o undefined si no.
     */
    get(key) {
        return this._data.get(key)
    }

    /**
     * Comprueba si una clave existe en la caché.
     * @param {string} key - La clave a comprobar.
     * @returns {boolean}
     */
    has(key) {
        return this._data.has(key)
    }

    /**
     * Elimina una entrada de la caché por su clave.
     * @param {string} key - La clave a eliminar.
     * @returns {boolean} True si un elemento existía y ha sido eliminado.
     */
    delete(key) {
        if (this._timers.has(key)) {
            clearTimeout(this._timers.get(key))
        }
        this._timers.delete(key)
        
        const deleted = this._data.delete(key)
        if (deleted) {
            DefaultLogger.info(`[Cache] DELETE: Clave '${key}' eliminada`)
        }
        return deleted
    }

    /**
     * Limpia toda la caché, eliminando todos los datos y temporizadores.
     */
    clear() {
        this._data.clear()
        for (const timer of this._timers.values()) {
            clearTimeout(timer)
        }
        this._timers.clear()
        DefaultLogger.warn('[Cache] CLEAR: Caché completamente limpiado')
    }

    /**
     * Obtiene un valor de la caché. Si no existe, lo carga usando la función `loader`,
     * lo almacena en caché y luego lo devuelve.
     * @param {string} key - La clave del valor a obtener o cargar.
     * @param {function(string): Promise<*>} loader - Una función asíncrona que carga el valor.
     * @param {number} [timeToLive] - Un TTL específico para esta entrada si se carga.
     * @returns {Promise<*|undefined>} El valor obtenido de la caché o cargado.
     */
    async getOrLoad(key, loader, timeToLive) {
        if (this._data.has(key)) {
            DefaultLogger.debug(`[Cache] HIT: Clave '${key}' encontrada en caché`)
            return this._data.get(key)
        }
        
        DefaultLogger.info(`[Cache] MISS: Clave '${key}' no encontrada. Cargando...`)
        try {
            const effectiveTTL = timeToLive ?? this._ttl
            const value = await loader(key)
            
            if (value !== undefined) {
                this.set(key, value, effectiveTTL)
            }
            return value
        } catch (error) {
            DefaultLogger.error(`[Cache] ERROR: Error al cargar el valor para la clave '${key}':`, error)
            throw error
        }
    }
}

module.exports = Cache