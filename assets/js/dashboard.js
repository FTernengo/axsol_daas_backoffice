/**
 * Dashboard specific functionality for AXSOL DaaS Backoffice
 * This file contains functions for initializing and updating the dashboard
 * Optimized for deployment on Netlify
 */

const dashboard = {
  // Initialize dashboard
  initialize() {
    console.log('Initializing dashboard...');
    // Render KPI cards
    this.renderKPICards();
        
    // Render recent items
    this.renderRecentItems();
        
    // Setup quick access buttons
    this.setupQuickAccess();
  },
    
  // Setup quick access buttons
  setupQuickAccess() {
    const quickAccessButtons = document.querySelectorAll('.quick-access-btn');
        
    quickAccessButtons.forEach(button => {
      button.addEventListener('click', () => {
        const module = button.getAttribute('data-module');
        const view = button.getAttribute('data-view');
        navigation.navigateTo(module, view);
      });
    });
  },
    
  // Format date for display
  formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  },
    
  // Format estado for display
  formatEstado(estado) {
    const estadoMap = {
      'pendiente': 'Pendiente',
      'en_progreso': 'En Progreso',
      'completado': 'Completado',
      'aprobado': 'Aprobado',
      'rechazado': 'Rechazado',
      'activo': 'Activo',
      'entregado': 'Entregado',
      'pagado': 'Pagado'
    };
        
    return estadoMap[estado] || estado;
  },
    
  // Format currency for display
  formatCurrency(value) {
    if (value === undefined || value === null) return '€0.00';
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(value);
  },
    
  // Render KPI cards with data
  renderKPICards() {
    try {
      // Get data either from mockData or localStorage
      const getEntityData = (entity) => {
        if (typeof mockData !== 'undefined' && mockData[entity]) {
          return mockData[entity];
        }
        
        const localData = localStorage.getItem(entity);
        if (localData) {
          try {
            return JSON.parse(localData);
          } catch (e) {
            console.error(`Error parsing ${entity} from localStorage:`, e);
          }
        }
        
        return [];
      };
      
      const clientes = getEntityData('clientes');
      const proyectos = getEntityData('proyectos');
      const contratos = getEntityData('contratos');
            
      const totalClientes = clientes.length;
      const totalProyectos = proyectos.length;
      const proyectosActivos = proyectos.filter(p => p.estado === 'en_progreso' || p.estado === 'En Progreso').length;
      const totalContratos = contratos.length;
            
      // Get containers
      const clientesKPI = document.getElementById('kpi-clientes');
      const proyectosKPI = document.getElementById('kpi-proyectos');
      const proyectosActivosKPI = document.getElementById('kpi-proyectos-activos');
      const contratosKPI = document.getElementById('kpi-contratos');
            
      // Update values
      if (clientesKPI) {
        clientesKPI.querySelector('.card-value').textContent = totalClientes;
      }
            
      if (proyectosKPI) {
        proyectosKPI.querySelector('.card-value').textContent = totalProyectos;
      }
            
      if (proyectosActivosKPI) {
        proyectosActivosKPI.querySelector('.card-value').textContent = proyectosActivos;
      }
            
      if (contratosKPI) {
        contratosKPI.querySelector('.card-value').textContent = totalContratos;
      }
    } catch (error) {
      console.error('Error rendering KPI cards:', error);
    }
  },
    
  // Render recent items list
  renderRecentItems() {
    try {
      // Get data either from mockData or localStorage
      const getEntityData = (entity) => {
        if (typeof mockData !== 'undefined' && mockData[entity]) {
          return mockData[entity];
        }
        
        const localData = localStorage.getItem(entity);
        if (localData) {
          try {
            return JSON.parse(localData);
          } catch (e) {
            console.error(`Error parsing ${entity} from localStorage:`, e);
          }
        }
        
        return [];
      };
      
      // Get containers
      const clientesContainer = document.getElementById('recent-clientes');
      const proyectosContainer = document.getElementById('recent-proyectos');
      const contratosContainer = document.getElementById('recent-contratos');
            
      // Render recent clientes if container exists
      if (clientesContainer) {
        const clientes = getEntityData('clientes');
        const recentClientes = [...clientes]
          .sort((a, b) => {
            // Handle missing fechaCreacion
            if (!a.fechaCreacion) return 1;
            if (!b.fechaCreacion) return -1;
            return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
          })
          .slice(0, 5);
                    
        if (recentClientes.length > 0) {
          const clientesHTML = recentClientes.map(cliente => `
                        <tr>
                            <td>${cliente.nombre || 'N/A'}</td>
                            <td>${cliente.empresa || cliente.nombre || 'N/A'}</td>
                            <td>${this.formatDate(cliente.fechaCreacion)}</td>
                        </tr>
                    `).join('');
                    
          clientesContainer.querySelector('tbody').innerHTML = clientesHTML;
        } else {
          clientesContainer.querySelector('tbody').innerHTML = `
                        <tr>
                            <td colspan="3" class="text-center">No hay clientes registrados</td>
                        </tr>
                    `;
        }
      }
            
      // Render recent proyectos if container exists
      if (proyectosContainer) {
        const proyectos = getEntityData('proyectos');
        const clientes = getEntityData('clientes');
                
        const recentProyectos = [...proyectos]
          .sort((a, b) => {
            // Handle missing fechaCreacion
            if (!a.fechaCreacion) return 1;
            if (!b.fechaCreacion) return -1;
            return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
          })
          .slice(0, 5);
                    
        if (recentProyectos.length > 0) {
          const proyectosHTML = recentProyectos.map(proyecto => {
            // Get cliente name
            const cliente = clientes.find(c => Number(c.id) === Number(proyecto.clienteId)) || { nombre: 'N/A' };
                        
            // Safely handle estado classes
            let estadoClass = '';
            if (proyecto.estado) {
              estadoClass = proyecto.estado.replace(' ', '-').toLowerCase();
            }
                            
            return `
                            <tr>
                                <td>${proyecto.nombre || 'N/A'}</td>
                                <td>${cliente.nombre}</td>
                                <td><span class="badge badge-${estadoClass}">${this.formatEstado(proyecto.estado)}</span></td>
                            </tr>
                        `;
          }).join('');
                    
          proyectosContainer.querySelector('tbody').innerHTML = proyectosHTML;
        } else {
          proyectosContainer.querySelector('tbody').innerHTML = `
                        <tr>
                            <td colspan="3" class="text-center">No hay proyectos registrados</td>
                        </tr>
                    `;
        }
      }
            
      // Render recent contratos if container exists
      if (contratosContainer) {
        const contratos = getEntityData('contratos');
        const proyectos = getEntityData('proyectos');
                
        const recentContratos = [...contratos]
          .slice(0, 5);
                    
        if (recentContratos.length > 0) {
          const contratosHTML = recentContratos.map(contrato => {
            // Get proyecto info
            const proyecto = proyectos.find(p => Number(p.id) === Number(contrato.proyectoId)) || { nombre: 'N/A' };
                        
            return `
                            <tr>
                                <td>${contrato.id}</td>
                                <td>${proyecto.nombre}</td>
                                <td>${this.formatCurrency(contrato.valor || 0)}</td>
                                <td><span class="badge bg-success">Activo</span></td>
                            </tr>
                        `;
          }).join('');
                    
          contratosContainer.querySelector('tbody').innerHTML = contratosHTML;
        } else {
          contratosContainer.querySelector('tbody').innerHTML = `
                        <tr>
                            <td colspan="4" class="text-center">No hay contratos registrados</td>
                        </tr>
                    `;
        }
      }
    } catch (error) {
      console.error('Error rendering recent items:', error);
    }
  }
};