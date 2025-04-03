/**
 * Main JavaScript file for AXSOL DaaS Backoffice
 * This file contains core functionality for the application
 * Optimized for deployment on Netlify
 */

// State management object
const appState = {
  currentModule: null,
  currentView: null,
  userData: null,
    
  // Initialize application state from localStorage if available
  init() {
    const savedState = localStorage.getItem('axsolDaasState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        this.currentModule = parsedState.currentModule || 'dashboard';
        this.currentView = parsedState.currentView || null;
        this.userData = parsedState.userData || null;
      } catch (e) {
        console.error('Error parsing saved state:', e);
        this.reset();
      }
    } else {
      this.reset();
    }
  },
  
  // Reset state to defaults
  reset() {
    this.currentModule = 'dashboard';
    this.currentView = null;
    this.userData = null;
    this.save();
  },
    
  // Save current state to localStorage
  save() {
    try {
      localStorage.setItem('axsolDaasState', JSON.stringify({
        currentModule: this.currentModule,
        currentView: this.currentView,
        userData: this.userData
      }));
    } catch (e) {
      console.error('Error saving state:', e);
    }
  },
    
  // Update state and save changes
  update(updates) {
    Object.assign(this, updates);
    this.save();
  }
};

// DOM utility functions
const domUtils = {
  // Load HTML component into a container
  async loadComponent(url, containerId) {
    try {
      console.log(`Loading component from ${url} into #${containerId}`);
            
      // Normalize URL to ensure it doesn't start with a slash for Netlify compatibility
      const normalizedUrl = url.startsWith('/') ? url.substring(1) : url;
      
      // Add timestamp to prevent caching issues during development
      const timestampedUrl = `${normalizedUrl}?t=${new Date().getTime()}`;
      const response = await fetch(timestampedUrl);
            
      if (!response.ok) {
        throw new Error(`Error loading component: ${response.status} ${response.statusText}`);
      }
            
      const html = await response.text();
      const container = document.getElementById(containerId);
            
      if (!container) {
        console.error(`Container #${containerId} not found in DOM`);
        return false;
      }
            
      container.innerHTML = html;
            
      // Execute any script tags in the loaded HTML
      const scriptTags = container.querySelectorAll('script');
      scriptTags.forEach(oldScript => {
        const newScript = document.createElement('script');
                
        // Copy all attributes
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
                
        // Copy inline script content
        if (oldScript.innerHTML) {
          newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        }
                
        // Replace old script with new one to execute it
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
            
      return true;
    } catch (error) {
      console.error(`Error loading component from ${url}:`, error);
      return false;
    }
  },
    
  // Create element with attributes and child nodes
  createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
        
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'innerHTML') {
        element.innerHTML = value;
      } else {
        element.setAttribute(key, value);
      }
    });
        
    // Append children
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
        
    return element;
  }
};

// Navigation manager
const navigation = {
  // Navigate to a specific module
  navigateTo(module, view = null) {
    appState.update({
      currentModule: module,
      currentView: view
    });
        
    // Load appropriate content based on module and view
    this.loadContent(module, view);
  },
    
  // Load content for the current module/view
  async loadContent(module, view) {
    try {
      // First check if it's the dashboard
      if (module === 'dashboard') {
        const result = await domUtils.loadComponent('components/dashboard.html', 'main-content');
        if (result && typeof dashboard !== 'undefined') {
          dashboard.initialize();
        } else {
          console.error('Failed to initialize dashboard module');
          document.getElementById('main-content').innerHTML = 
                        '<div class="alert alert-danger">Error loading dashboard component</div>';
        }
        return;
      }
            
      // Otherwise, load the appropriate module view
      let contentPath;
            
      if (view && view.includes('form')) {
        // Load form view
        contentPath = `modules/${module}/${view}.html`;
      } else {
        // Load list view
        contentPath = `modules/${module}/${view || module}.html`;
      }
            
      console.log(`Loading content from: ${contentPath}`);
      const result = await domUtils.loadComponent(contentPath, 'main-content');
            
      if (!result) {
        console.error(`Failed to load module content from: ${contentPath}`);
        document.getElementById('main-content').innerHTML = 
                    `<div class="alert alert-danger">
                        <h4>Error loading content</h4>
                        <p>The requested module (${module}${view ? '/' + view : ''}) could not be loaded.</p>
                        <button class="btn btn-primary" onclick="navigation.navigateTo('dashboard')">
                            Go to Dashboard
                        </button>
                    </div>`;
        return;
      }
            
      // Initialize module-specific functionality if needed
      if (module === 'clientes' && !view) {
        if (typeof clientesModule !== 'undefined') {
          clientesModule.initialize();
        } else {
          console.log('clientesModule is not defined yet, will be initialized by the module itself');
        }
      } else if (module === 'proyectos' && !view) {
        if (typeof proyectosModule !== 'undefined') {
          proyectosModule.initialize();
        } else {
          console.log('proyectosModule is not defined yet, will be initialized by the module itself');
        }
      }
      // Add similar initializations for other modules
    } catch (error) {
      console.error('Error in navigation.loadContent:', error);
      document.getElementById('main-content').innerHTML = 
                `<div class="alert alert-danger">
                    <h4>Error loading content</h4>
                    <p>An unexpected error occurred: ${error.message}</p>
                    <button class="btn btn-primary" onclick="navigation.navigateTo('dashboard')">
                        Go to Dashboard
                    </button>
                </div>`;
    }
  }
};

// Funciones para gestión de datos (DataService integrado)
const DataService = {
  /**
     * Obtiene todos los registros de una entidad
     * @param {string} entity - Nombre de la entidad (ej: 'clientes', 'proyectos')
     * @returns {Array} - Array de objetos de la entidad
     */
  getAll: function(entity) {
    // First check localStorage
    const localItems = localStorage.getItem(entity);
    if (localItems) {
      try {
        return JSON.parse(localItems);
      } catch (e) {
        console.error(`Error parsing ${entity} from localStorage:`, e);
      }
    }
    
    // Then check mockData (direct access for MVP)
    if (typeof mockData !== 'undefined' && mockData[entity]) {
      // Store in localStorage for future use
      try {
        localStorage.setItem(entity, JSON.stringify(mockData[entity]));
      } catch (e) {
        console.error(`Error storing ${entity} in localStorage:`, e);
      }
      return mockData[entity];
    }
    
    // Attempt to fetch from JSON file as fallback
    console.warn(`No data found for ${entity} in memory, attempting to fetch from file`);
    this.fetchEntityData(entity);
    
    // Return empty array as immediate fallback
    return [];
  },

  /**
   * Fetch entity data from JSON file and store in localStorage
   * @param {string} entity - Entity name
   * @returns {Promise<Array>} - Promise resolving to array of entity objects
   */
  async fetchEntityData(entity) {
    try {
      const response = await fetch(`data/${entity}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      localStorage.setItem(entity, JSON.stringify(data));
      return data;
    } catch (e) {
      console.error(`Error fetching ${entity} data:`, e);
      return [];
    }
  },

  /**
     * Initialize all entities with mock data
     * This method is used for the MVP to ensure all data is loaded
     */
  initializeAllData: async function() {
    const entities = [
      'clientes', 'proyectos', 'contratos', 'pedidos', 
      'estimaciones', 'ordenes', 'activos', 'inspecciones', 
      'entregables', 'validaciones'
    ];
    
    console.log('Initializing data for all entities...');
    
    // Check if we already have mockData in memory
    if (typeof mockData !== 'undefined') {
      console.log('Using mockData from memory');
      
      entities.forEach(entity => {
        if (mockData[entity] && !localStorage.getItem(entity)) {
          try {
            localStorage.setItem(entity, JSON.stringify(mockData[entity]));
            console.log(`Initialized ${entity} data from mockData in memory`);
          } catch (e) {
            console.error(`Error storing ${entity} in localStorage:`, e);
          }
        }
      });
      
      return;
    }
    
    // If mockData isn't available, load from JSON files
    console.log('Loading data from JSON files');
    
    const loadPromises = entities.map(entity => {
      // Skip if already in localStorage
      if (localStorage.getItem(entity)) {
        console.log(`${entity} already in localStorage, skipping`);
        return Promise.resolve();
      }
      
      return this.fetchEntityData(entity)
        .then(data => {
          if (data && data.length > 0) {
            console.log(`Loaded ${entity} data from file: ${data.length} items`);
          }
        })
        .catch(error => {
          console.error(`Failed to load ${entity} data:`, error);
        });
    });
    
    try {
      await Promise.all(loadPromises);
      console.log('All entity data initialized');
    } catch (error) {
      console.error('Error during data initialization:', error);
    }
  },

  /**
     * Obtiene un registro por su ID
     * @param {string} entity - Nombre de la entidad
     * @param {number} id - ID del registro a obtener
     * @returns {Object|null} - Objeto encontrado o null
     */
  getById: function(entity, id) {
    const items = this.getAll(entity);
    return items.find(item => Number(item.id) === Number(id)) || null;
  },

  /**
     * Guarda un nuevo registro
     * @param {string} entity - Nombre de la entidad
     * @param {Object} item - Datos del registro a guardar
     * @returns {Object} - Registro guardado con ID asignado
     */
  save: function(entity, item) {
    const items = this.getAll(entity);
    const newItem = { ...item };
        
    if (newItem.id) {
      // Actualizar existente
      const index = items.findIndex(i => Number(i.id) === Number(newItem.id));
      if (index !== -1) {
        items[index] = { ...items[index], ...newItem };
      } else {
        // ID provided but not found, append as new
        items.push(newItem);
      }
    } else {
      // Crear nuevo
      const newId = this.getNextId(items);
      newItem.id = newId;
      items.push(newItem);
    }
        
    try {
      localStorage.setItem(entity, JSON.stringify(items));
    } catch (e) {
      console.error(`Error saving ${entity} to localStorage:`, e);
    }
    
    return newItem;
  },

  /**
     * Elimina un registro por su ID
     * @param {string} entity - Nombre de la entidad
     * @param {number} id - ID del registro a eliminar
     * @returns {boolean} - true si se eliminó correctamente
     */
  delete: function(entity, id) {
    const items = this.getAll(entity);
    const filteredItems = items.filter(item => Number(item.id) !== Number(id));
        
    if (items.length !== filteredItems.length) {
      try {
        localStorage.setItem(entity, JSON.stringify(filteredItems));
        return true;
      } catch (e) {
        console.error(`Error deleting item from ${entity}:`, e);
        return false;
      }
    }
    return false;
  },

  /**
     * Obtiene el siguiente ID disponible
     * @param {Array} items - Array de objetos
     * @returns {number} - Siguiente ID
     */
  getNextId: function(items) {
    if (items.length === 0) {
      return 1;
    }
    return Math.max(...items.map(item => Number(item.id))) + 1;
  },

  /**
     * Filtra registros según criterios
     * @param {string} entity - Nombre de la entidad
     * @param {Object} criteria - Criterios de filtrado
     * @returns {Array} - Registros filtrados
     */
  filter: function(entity, criteria) {
    const items = this.getAll(entity);
        
    return items.filter(item => {
      for (const key in criteria) {
        if (criteria[key] && criteria[key] !== '') {
          if (typeof item[key] === 'string' && typeof criteria[key] === 'string') {
            if (!item[key].toLowerCase().includes(criteria[key].toLowerCase())) {
              return false;
            }
          } else if (item[key] !== criteria[key]) {
            return false;
          }
        }
      }
      return true;
    });
  }
};

// Funciones de utilidad y validación
const Utils = {
  /**
     * Valida un formulario HTML5
     * @param {HTMLFormElement} form - Elemento form a validar
     * @returns {boolean} - true si el formulario es válido
     */
  validateForm: function(form) {
    if (!form) {
      console.error('Form element is null or undefined');
      return false;
    }
    return form.checkValidity();
  },

  /**
     * Muestra mensajes de error en el formulario
     * @param {HTMLFormElement} form - Elemento form
     */
  showValidationErrors: function(form) {
    if (!form) {
      console.error('Form element is null or undefined');
      return;
    }
    form.classList.add('was-validated');
  },

  /**
     * Muestra un mensaje de notificación
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de alerta (success, danger, warning, info)
     */
  showNotification: function(message, type = 'success') {
    const alertPlaceholder = document.getElementById('alertsContainer');
    if (!alertPlaceholder) {
      console.warn('Contenedor de alertas no encontrado, usando alert nativo');
      alert(message);
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
    alertPlaceholder.append(wrapper);
        
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
      const alert = wrapper.querySelector('.alert');
      if (alert && typeof bootstrap !== 'undefined') {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
      } else if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    }, 5000);
  },

  /**
     * Formatea una fecha para mostrar
     * @param {string} dateString - Fecha en formato ISO
     * @returns {string} - Fecha formateada
     */
  formatDate: function(dateString) {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString || '';
    }
  },

  /**
     * Obtiene parámetros de la URL
     * @param {string} param - Nombre del parámetro
     * @returns {string|null} - Valor del parámetro
     */
  getUrlParam: function(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },

  /**
     * Redirige a otra página
     * @param {string} url - URL de destino
     */
  redirect: function(url) {
    // Normalize URL for Netlify
    const normalizedUrl = url.startsWith('/') ? url.substring(1) : url;
    window.location.href = normalizedUrl;
  },

  /**
     * Confirma una acción con el usuario
     * @param {string} message - Mensaje a mostrar
     * @returns {Promise} - Promesa que se resuelve con true o false
     */
  confirm: function(message) {
    return new Promise((resolve) => {
      const confirmed = window.confirm(message);
      resolve(confirmed);
    });
  }
};

// Utility for handling forms
const formUtils = {
  // Get form data as object
  getFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) {
      console.error(`Form with id '${formId}' not found`);
      return null;
    }
        
    const formData = new FormData(form);
    const data = {};
        
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
        
    return data;
  },
    
  // Fill form with data
  fillForm(formId, data) {
    const form = document.getElementById(formId);
    if (!form) {
      console.error(`Form with id '${formId}' not found`);
      return false;
    }
        
    Object.entries(data).forEach(([key, value]) => {
      const field = form.elements[key];
      if (field) {
        if (field.type === 'checkbox') {
          field.checked = Boolean(value);
        } else {
          field.value = value !== null && value !== undefined ? value : '';
        }
      }
    });
        
    return true;
  },
    
  // Validate form data
  validateForm(formId, rules) {
    const form = document.getElementById(formId);
    if (!form) return { isValid: false, errors: ['Form not found'] };
        
    const data = this.getFormData(formId);
    const errors = [];
        
    Object.entries(rules).forEach(([field, rule]) => {
      if (rule.required && !data[field]) {
        errors.push(`${field} is required`);
      }
            
      if (rule.minLength && data[field] && data[field].length < rule.minLength) {
        errors.push(`${field} must be at least ${rule.minLength} characters`);
      }
            
      // Add more validation rules as needed
    });
        
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// Helper function for loading components from modules
function loadComponent(id, url) {
  // Normalize URL for Netlify (ensure no leading slash)
  const normalizedUrl = url.startsWith('/') ? url.substring(1) : url;
  
  return fetch(normalizedUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load component: ${response.status} ${response.statusText}`);
      }
      return response.text();
    })
    .then(html => {
      const container = document.getElementById(id);
      if (container) {
        container.innerHTML = html;
      } else {
        console.error(`Container with id '${id}' not found`);
      }
    })
    .catch(error => {
      console.error(`Error loading component ${url}:`, error);
    });
}