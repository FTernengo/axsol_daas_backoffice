// init.js
(function() {
    // Determinar la ruta base para la aplicación
    window.appBasePath = './';
    
    // Crear una función de utilidad para resolver rutas
    window.resolvePath = function(path) {
      if (path.startsWith('/')) {
        return window.appBasePath + path.substring(1);
      }
      return path;
    };
    
    console.log('Inicialización completada. Ruta base:', window.appBasePath);
  })();