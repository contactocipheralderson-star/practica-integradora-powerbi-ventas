# Práctica Integradora: GAD-2401 Sales Dashboard

**Alumno:** Brandon Fuentes Serrano  
**Profesor:** Fabian Soberanes Martín  
**Grupo:** 6951 | **Turno:** Vespertino  
**Curso:** GAD-2401 Análisis y Visualización de Datos

## Descripción
Este proyecto consiste en un dashboard web interactivo diseñado con una interfaz moderna basada en Glassmorphism. Replica las visualizaciones, KPIs y análisis estadísticos de un modelo realizado previamente en Power BI. 

La aplicación incluye **filtros interactivos globales (Slicers)** para Año, Región, Segmento y Categoría, los cuales recalculan en tiempo real los gráficos, tablas y el coeficiente Tau de Kendall.

## 🛠️ Tecnologías y Versiones
- **HTML5** (Estructura, Slicers y paginación)
- **CSS3** (Glassmorphism, animaciones fluidas y diseño responsivo)
- **JavaScript (ES6+)** (Lógica de filtrado, agregación de datos y cálculos estadísticos)
- **PapaParse (v5.4.1)** (Parseo de archivos CSV)
- **Chart.js (v4+)** (Renderización de gráficos)
- **chartjs-plugin-datalabels (v2.0.0)** (Etiquetas de datos)
- **GitHub Pages** (Despliegue público)

## 🚨 Instrucciones de Uso Obligatorio: Carga de Archivos

Para inicializar el sistema y desbloquear los filtros, **es estrictamente necesario descargar los archivos de datos** y cargarlos manualmente.

1. Ingresa a la página web.
2. En la ventana inicial, arrastra o selecciona **los 3 archivos CSV** (`hechos_ventas.csv`, `dim_cliente.csv`, `dim_producto.csv`).
3. Una vez procesados, se habilitará la barra de filtros y las pestañas de navegación.
4. Utiliza los filtros superiores para segmentar la información (ej. Filtrar solo el año 2025 y la Región Centro).
5. Puedes descargar el archivo original de Power BI usando el botón en la cabecera.

*(Nota: Este proyecto no altera, modifica ni inventa datos. Todos los cálculos se realizan a partir de los archivos CSV proporcionados).*
