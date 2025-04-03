/**
 * Utilidades para manejar peticiones fetch adaptadas para Netlify
 * Este archivo normaliza las rutas y maneja errores comunes
 */

// Wrapper para fetch que normaliza las rutas
const fetchWrapper = {
  /**
   * Realiza una petición GET normalizada
   * @param {string} url - URL a la que hacer la petición
   * @returns {Promise} - Promesa que resuelve con la respuesta
   */
  get: async function(url) {
    try {
      // Normalizar URL para Netlify (quitar slash inicial)
      const normalizedUrl = this.normalizeUrl(url);
      
      // Realizar petición
      const response = await fetch(normalizedUrl);
      
      // Verificar si la respuesta es correcta
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      console.error(`Error en fetchWrapper.get para ${url}:`, error);
      throw error;
    }
  },
  
  /**
   * Obtiene un recurso JSON
   * @param {string} url - URL del recurso JSON
   * @returns {Promise} - Promesa que resuelve con el objeto JSON
   */
  getJson: async function(url) {
    try {
      const response = await this.get(url);
      return await response.json();
    } catch (error) {
      console.error(`Error obteniendo JSON desde ${url}:`, error);
      throw error;
    }
  },
  
  /**
   * Obtiene un recurso HTML como texto
   * @param {string} url - URL del recurso HTML
   * @returns {Promise} - Promesa que resuelve con el texto HTML
   */
  getHtml: async function(url) {
    try {
      const response = await this.get(url);
      return await response.text();
    } catch (error) {
      console.error(`Error obteniendo HTML desde ${url}:`, error);
      throw error;
    }
  },
  
  /**
   * Normaliza una URL para Netlify (quita el slash inicial)
   * @param {string} url - URL a normalizar
   * @returns {string} - URL normalizada
   */
  normalizeUrl: function(url) {
    // Si la URL comienza con slash, quitarlo
    if (url.startsWith('/')) {
      return url.substring(1);
    }
    return url;
  },
  
  /**
   * Carga un componente HTML en un contenedor
   * @param {string} url - URL del componente HTML
   * @param {string} containerId - ID del contenedor donde cargar el HTML
   * @returns {Promise} - Promesa que resuelve cuando se carga el componente
   */
  loadComponent: async function(url, containerId) {
    try {
      const html = await this.getHtml(url);
      
      const container = document.getElementById(containerId);
      if (!container) {
        throw new Error(`Contenedor con ID '${containerId}' no encontrado`);
      }
      
      container.innerHTML = html;
      
      // Ejecutar scripts en el contenedor
      const scripts = container.querySelectorAll('script');
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        
        // Copiar atributos
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        
        // Copiar contenido
        if (oldScript.innerHTML) {
          newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        }
        
        // Reemplazar script
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
      
      return true;
    } catch (error) {
      console.error(`Error cargando componente desde ${url} en #${containerId}:`, error);
      
      // Mostrar mensaje de error en el contenedor
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = `
          <div class="alert alert-danger">
            <strong>Error cargando componente:</strong> ${error.message}
          </div>
        `;
      }
      
      return false;
    }
  }
};

// Exportar como global
window.fetchWrapper = fetchWrapper;