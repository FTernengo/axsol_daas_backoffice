/**
 * Mock data for AXSOL DaaS Backoffice
 * This file provides mock data for the application when no backend is available
 */

// Mock data object with initial data
const mockData = {
  // Clientes (desde data/clientes.json)
  clientes: [
    {
      id: 1,
      nombre: "Energías Renovables S.A.",
      contacto: "María Fernández",
      email: "mfernandez@energren.com",
      estado: "Activo"
    },
    {
      id: 2,
      nombre: "Industrias Solares del Norte",
      contacto: "Juan Pérez",
      email: "jperez@indsol.com",
      estado: "Activo"
    },
    {
      id: 3,
      nombre: "Distribuidora Energética Central",
      contacto: "Carlos Mendoza",
      email: "cmendoza@distec.com",
      estado: "Inactivo"
    },
    {
      id: 4,
      nombre: "Corporación Solar Pacífico",
      contacto: "Ana Torres",
      email: "atorres@solpac.com",
      estado: "Activo"
    },
    {
      id: 5,
      nombre: "Fundación Energía Limpia",
      contacto: "Roberto Gómez",
      email: "rgomez@funlimpia.org",
      estado: "Activo"
    },
    {
      id: 6,
      nombre: "AgroSolar Servicios",
      contacto: "Laura Martínez",
      email: "lmartinez@agrosolar.com",
      estado: "Inactivo"
    }
  ],
  
  // Proyectos (simplificados a partir de data/proyectos.json)
  proyectos: [
    {
      id: 1,
      nombre: "Instalación Central Fotovoltaica",
      clienteId: 1,
      ubicacion: "Sevilla, España",
      fechaInicio: "2023-08-15",
      estado: "En Progreso"
    },
    {
      id: 2,
      nombre: "Mantenimiento Torres Eólicas",
      clienteId: 1,
      ubicacion: "Cádiz, España",
      fechaInicio: "2023-06-10",
      estado: "Completado"
    },
    {
      id: 3,
      nombre: "Instalación Paneles Comerciales",
      clienteId: 2,
      ubicacion: "Barcelona, España",
      fechaInicio: "2023-09-22",
      estado: "En Progreso"
    },
    {
      id: 4,
      nombre: "Auditoría Energética Industrial",
      clienteId: 3,
      ubicacion: "Madrid, España",
      fechaInicio: "2023-07-05",
      estado: "Completado"
    }
  ],
  
  // Contratos (simplificados a partir de data/contratos.json)
  contratos: [
    {
      id: 1,
      proyectoId: 1,
      clienteId: 1,
      fechaInicio: "2025-01-01",
      fechaFin: "2025-12-31",
      tipoServicio: "Inspección Drones",
      frecuencia: "Mensual",
      tarifas: ["Tarifa Estándar", "Tarifa Premium"]
    },
    {
      id: 2,
      proyectoId: 2,
      clienteId: 1,
      fechaInicio: "2025-02-15",
      fechaFin: "2025-08-15",
      tipoServicio: "Análisis de Datos",
      frecuencia: "Semanal",
      tarifas: ["Tarifa Básica"]
    },
    {
      id: 3,
      proyectoId: 3,
      clienteId: 2,
      fechaInicio: "2025-03-01",
      fechaFin: "2026-03-01",
      tipoServicio: "Mantenimiento",
      frecuencia: "Trimestral",
      tarifas: ["Tarifa Empresarial", "Tarifa Personalizada"]
    }
  ],
  
  // Referencias a otras entidades 
  // Nota: El resto de entidades se cargarán desde los archivos JSON correspondientes
  pedidos: null,
  estimaciones: null,
  ordenes: null,
  activos: null,
  inspecciones: null,
  entregables: null,
  validaciones: null
};

// Función para inicializar los datos en localStorage (si no existen ya)
function initMockData() {
  console.log('Initializing mock data...');
  
  // Inicializar cada entidad si no existe en localStorage
  for (const entity in mockData) {
    if (mockData[entity] && !localStorage.getItem(entity)) {
      try {
        localStorage.setItem(entity, JSON.stringify(mockData[entity]));
        console.log(`Initialized mock data for ${entity}`);
      } catch (e) {
        console.error(`Error storing ${entity} in localStorage:`, e);
      }
    }
  }
}

// Auto-inicializar al cargar
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    initMockData();
  });
}