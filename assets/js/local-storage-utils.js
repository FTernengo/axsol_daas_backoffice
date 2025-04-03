/**
 * Utilidades para gestionar el almacenamiento local
 * Este archivo proporciona funciones para trabajar con localStorage de forma segura
 */

const localStorageUtils = {
    /**
     * Verifica si localStorage está disponible
     * @returns {boolean} - true si localStorage está disponible
     */
    isAvailable: function() {
      try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch (e) {
        console.warn('localStorage no está disponible:', e);
        return false;
      }
    },
    
    /**
     * Obtiene un valor de localStorage con manejo de errores
     * @param {string} key - Clave para obtener
     * @param {*} defaultValue - Valor por defecto si no se encuentra la clave o hay error
     * @returns {*} - Valor almacenado o defaultValue
     */
    get: function(key, defaultValue = null) {
      if (!this.isAvailable()) {
        return defaultValue;
      }
      
      try {
        const item = localStorage.getItem(key);
        if (item === null) {
          return defaultValue;
        }
        
        return JSON.parse(item);
      } catch (e) {
        console.warn(`Error al obtener ${key} de localStorage:`, e);
        return defaultValue;
      }
    },
    
    /**
     * Guarda un valor en localStorage con manejo de errores
     * @param {string} key - Clave para guardar
     * @param {*} value - Valor a guardar
     * @returns {boolean} - true si se guardó correctamente
     */
    set: function(key, value) {
      if (!this.isAvailable()) {
        return false;
      }
      
      try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
        return true;
      } catch (e) {
        console.error(`Error al guardar ${key} en localStorage:`, e);
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
          console.error('Se ha excedido la cuota de localStorage. Intente liberar espacio.');
        }
        return false;
      }
    },
    
    /**
     * Elimina una clave de localStorage con manejo de errores
     * @param {string} key - Clave a eliminar
     * @returns {boolean} - true si se eliminó correctamente
     */
    remove: function(key) {
      if (!this.isAvailable()) {
        return false;
      }
      
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.error(`Error al eliminar ${key} de localStorage:`, e);
        return false;
      }
    },
    
    /**
     * Limpia todo el localStorage con manejo de errores
     * @returns {boolean} - true si se limpió correctamente
     */
    clear: function() {
      if (!this.isAvailable()) {
        return false;
      }
      
      try {
        localStorage.clear();
        return true;
      } catch (e) {
        console.error('Error al limpiar localStorage:', e);
        return false;
      }
    },
    
    /**
     * Obtiene todas las claves de localStorage
     * @returns {Array} - Array con todas las claves
     */
    getKeys: function() {
      if (!this.isAvailable()) {
        return [];
      }
      
      try {
        return Object.keys(localStorage);
      } catch (e) {
        console.error('Error al obtener claves de localStorage:', e);
        return [];
      }
    },
    
    /**
     * Verifica si una clave existe en localStorage
     * @param {string} key - Clave a verificar
     * @returns {boolean} - true si la clave existe
     */
    exists: function(key) {
      if (!this.isAvailable()) {
        return false;
      }
      
      try {
        return localStorage.getItem(key) !== null;
      } catch (e) {
        console.error(`Error al verificar existencia de ${key} en localStorage:`, e);
        return false;
      }
    },
    
    /**
     * Obtiene el tamaño aproximado usado en localStorage
     * @returns {number} - Tamaño en bytes
     */
    getUsedSpace: function() {
      if (!this.isAvailable()) {
        return 0;
      }
      
      try {
        let totalSize = 0;
        for (let key in localStorage) {
          if (localStorage.hasOwnProperty(key)) {
            totalSize += localStorage.getItem(key).length + key.length;
          }
        }
        return totalSize;
      } catch (e) {
        console.error('Error al calcular espacio usado en localStorage:', e);
        return 0;
      }
    },
    
    /**
     * Inicializa una entidad en localStorage si no existe
     * @param {string} entity - Nombre de la entidad
     * @param {Array} defaultData - Datos por defecto
     * @returns {boolean} - true si se inicializó correctamente
     */
    initEntity: function(entity, defaultData = []) {
      if (!this.exists(entity)) {
        return this.set(entity, defaultData);
      }
      return true;
    },
    
    /**
     * Inicializa múltiples entidades en localStorage
     * @param {Object} entitiesData - Objeto con nombres de entidades y datos por defecto
     * @returns {boolean} - true si todas las entidades se inicializaron correctamente
     */
    initEntities: function(entitiesData) {
      if (!this.isAvailable()) {
        return false;
      }
      
      let allSuccess = true;
      
      for (const [entity, defaultData] of Object.entries(entitiesData)) {
        const success = this.initEntity(entity, defaultData);
        allSuccess = allSuccess && success;
      }
      
      return allSuccess;
    }
  };