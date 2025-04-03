# AXSOL DaaS Backoffice MVP

Este proyecto implementa un mockup de un sistema de backoffice para la gestión de servicios DaaS (Data as a Service) de AXSOL. Es una aplicación frontend estática diseñada para visualización y demostración.

## Descripción

AXSOL DaaS Backoffice es una aplicación web que permite gestionar:
- Clientes y proyectos
- Contratos y pedidos
- Estimaciones y órdenes de venta
- Inspecciones y entregables (con validaciones)

La aplicación utiliza datos mockeados y almacenamiento local para simular la persistencia durante la sesión.

## Estructura del proyecto

El proyecto está organizado según la siguiente estructura:

```
/src/axsol-daas-backoffice/
│
├── index.html                # Página principal/Dashboard
├── assets/                   # Recursos estáticos
│   ├── css/                  # Hojas de estilo
│   ├── js/                   # Scripts JavaScript
│   └── img/                  # Imágenes e iconos
│
├── components/               # Componentes HTML reutilizables
│
├── modules/                  # Módulos funcionales
│   ├── clientes/             # Gestión de clientes y proyectos
│   ├── contratos/            # Gestión de contratos y pedidos
│   ├── estimaciones/         # Gestión de estimaciones y órdenes de venta
│   └── inspecciones/         # Gestión de inspecciones y entregables
│
└── data/                     # Datos mockeados en formato JSON
```

## Tecnologías utilizadas

- HTML5
- CSS3 (Bootstrap 5)
- JavaScript (ES6+)
- Bootstrap 5 para UI
- Font Awesome para iconos
- localStorage para persistencia de datos

## Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet para cargar las dependencias desde CDN

## Despliegue local

Para ejecutar localmente la aplicación:

1. Clona este repositorio
2. Navega al directorio `src/axsol-daas-backoffice`
3. Utiliza un servidor web local (como `serve`, `http-server`, etc.)

Ejemplo con `serve`:
```bash
npx serve src/axsol-daas-backoffice
```

## Despliegue en Netlify

Este proyecto está optimizado para ser desplegado en Netlify. Sigue los pasos en la guía de despliegue para más detalles.

## Características

- SPA (Single Page Application) con carga dinámica de contenido
- Administración de clientes y sus proyectos
- Gestión de contratos y pedidos
- Proceso de estimación y órdenes de venta
- Sistema de inspecciones y entregables con validaciones
- Dashboard con KPIs y listas de elementos recientes
- Persistencia de datos mediante localStorage

## Limitaciones

- Esta es una versión MVP para fines de demostración solamente
- Usa datos mockeados y localStorage para simular persistencia
- No tiene backend real (todos los datos se manejan en el cliente)
- No implementa autenticación ni autorización

## Contribuciones

Para contribuir a este proyecto, por favor abre un issue o envía un pull request.

## Licencia

[Incluir información de licencia aquí]