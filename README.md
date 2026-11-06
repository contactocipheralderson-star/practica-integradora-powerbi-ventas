<div align="center">

# 📊 GAD-2401 | Sales Dashboard Web

### Práctica Integradora: Análisis y Visualización de Datos

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)](https://www.chartjs.org/)

<br>

| 👨‍🎓 Alumno | 👨‍🏫 Profesor | 🏫 Grupo | ⏰ Turno |
| :--- | :--- | :--- | :--- |
| **Brandon Fuentes Serrano** | **Fabian Soberanes Martín** | **6951** | **Vespertino** |

</div>

---

## 📖 Descripción del Proyecto

Este proyecto consiste en un **Dashboard Web Interactivo** diseñado con una interfaz moderna basada en *Glassmorphism* (paneles de cristal). La aplicación web replica fielmente las visualizaciones, KPIs, tablas dinámicas y análisis estadísticos de un modelo realizado previamente en Power BI.

El sistema incluye **filtros interactivos globales (Slicers)** para Año, Región, Segmento y Categoría, los cuales recalculan en tiempo real los gráficos y el coeficiente Tau de Kendall.

<br>

## 🛠️ Tecnologías y Versiones

A continuación se detallan las herramientas y librerías utilizadas para el desarrollo:

| Tecnología | Versión | Propósito en el Proyecto |
| :--- | :--- | :--- |
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) | **5** | Estructura semántica del sitio y formularios de carga. |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | **3** | Diseño responsivo, animaciones complejas y efectos visuales. |
| ![JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | **ES6+** | Lógica de filtrado, agregación de datos y cálculo de KPIs. |
| ![PapaParse](https://img.shields.io/badge/PapaParse-5.4.1-00a65a?style=flat-square) | **5.4.1** | Parseo y lectura de los archivos `.csv` subidos por el usuario. |
| ![Chart.js](https://img.shields.io/badge/Chart.js-4.x-FF6384?style=flat-square&logo=chart.js&logoColor=white) | **4.x** | Renderización de los gráficos (barras, líneas, donas, dispersión). |
| ![DataLabels](https://img.shields.io/badge/DataLabels-2.0.0-333333?style=flat-square) | **2.0.0** | Plugin para mostrar porcentajes dentro de los gráficos. |
| ![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=flat-square&logo=github&logoColor=white) | **Latest** | Plataforma de despliegue y hosting público del sitio. |

<br>

## 🚨 Instrucciones de Uso Obligatorio

> [!WARNING]
> **Carga de archivos requerida:** Para inicializar el sistema, desbloquear los filtros y visualizar los gráficos, **es estrictamente necesario descargar los archivos de datos** y cargarlos manualmente en la interfaz. El sistema no incluye los datos pre-cargados por defecto para garantizar la transparencia del análisis.

Sigue estos pasos para visualizar el dashboard:

1. Ingresa a la página web desplegada.
2. En la ventana inicial ("Inicializar Dashboard"), haz clic en **"Seleccionar Archivos CSV"** o arrastra los archivos hacia el recuadro.
3. Debes seleccionar los **3 archivos** correspondientes al modelo:
   - 📄 `hechos_ventas.csv`
   - 📄 `dim_cliente.csv`
   - 📄 `dim_producto.csv`
4. Una vez procesados, se habilitará automáticamente la barra de filtros y las pestañas de navegación.
5. Utiliza los filtros superiores para segmentar la información (Año, Región, Segmento, Categoría).
6. Puedes descargar el archivo original de Power BI usando el botón verde en la cabecera.

<br>

## 📂 Entregables

> [!NOTE]
> El proyecto consta de los siguientes entregables principales:

- 🌐 **URL Pública de la Página Web** (Desplegada en GitHub Pages).
- 📦 **Archivo de Power BI** (`GAD_2401_Sales_Report.pbix`) disponible en la carpeta `/report` del repositorio y descargable desde la web.
- 📁 **Código Fuente Web** (HTML, CSS, JS).

<br>

<div align="center">
  <sub>Desarrollado para la práctica integradora del curso <b>GAD-2401</b>.</sub>
</div>
