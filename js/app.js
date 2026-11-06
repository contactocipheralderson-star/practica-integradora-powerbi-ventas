Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = '#475569';
Chart.register(ChartDataLabels);

const coloresPBI = ['#4F46E5', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'];

let rawHechos = [], rawClientes = [], rawProductos = [];
let chartsInstanciados = {};
let chartsRefs = {}; // Para guardar las instancias de Chart.js y destruirlas al filtrar

const formatMoney = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
const formatMill = (val) => (val / 1000000).toFixed(2) + ' mill.';
const formatNum = (val) => new Intl.NumberFormat('en-US').format(val);

// Pestañas
const tabs = document.querySelectorAll('#nav-tabs a');
const sections = document.querySelectorAll('.page-section');
tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        tabs.forEach(t => t.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
    });
});

// Carga de Archivos
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', (e) => { e.preventDefault(); dropZone.classList.remove('dragover'); procesarArchivos(e.dataTransfer.files); });
fileInput.addEventListener('change', (e) => procesarArchivos(e.target.files));

function procesarArchivos(files) {
    if (files.length === 0) return;
    Array.from(files).forEach(file => {
        if (!file.name.endsWith('.csv')) return;
        Papa.parse(file, {
            header: true, dynamicTyping: true,
            complete: function(results) {
                const data = results.data.filter(r => Object.keys(r).length > 1);
                if (data.length > 0) {
                    const keys = Object.keys(data[0]);
                    if (keys.includes('VentaID')) rawHechos = data;
                    else if (keys.includes('ClienteID') && keys.includes('Segmento')) rawClientes = data;
                    else if (keys.includes('ProductoID') && keys.includes('Categoria')) rawProductos = data;
                }
                verificarCarga();
            }
        });
    });
}

function verificarCarga() {
    if (rawHechos.length > 0 && rawClientes.length > 0 && rawProductos.length > 0) {
        document.getElementById('upload-status').innerHTML = "<p style='color: #10b981; font-weight: bold;'>✅ Datos procesados. Desbloqueando Dashboard...</p>";
        
        setTimeout(() => {
            document.getElementById('carga').style.display = 'none';
            document.getElementById('main-nav').style.display = 'flex';
            document.getElementById('dashboard-container').style.display = 'block';
            
            llenarFiltrosRegiones();
            generarDashboard(); // Primera generación
        }, 800);
    }
}

function llenarFiltrosRegiones() {
    const regiones = [...new Set(rawClientes.map(c => c.Region))];
    const selectRegion = document.getElementById('filter-region');
    regiones.forEach(reg => {
        if(reg) selectRegion.innerHTML += `<option value="${reg}">${reg}</option>`;
    });
}

// Escuchar cambios en los filtros
document.querySelectorAll('.filter-group select').forEach(select => {
    select.addEventListener('change', generarDashboard);
});

function generarDashboard() {
    // 1. Obtener valores de los filtros
    const fYear = document.getElementById('filter-year').value;
    const fRegion = document.getElementById('filter-region').value;
    const fSegmento = document.getElementById('filter-segmento').value;
    const fCategoria = document.getElementById('filter-categoria').value;

    // 2. Filtrar diccionarios
    const dictClientesFiltrados = {};
    rawClientes.forEach(c => {
        if ((fRegion === 'Todas' || c.Region === fRegion) && 
            (fSegmento === 'Todos' || c.Segmento === fSegmento)) {
            dictClientesFiltrados[c.ClienteID] = c;
        }
    });

    const dictProductosFiltrados = {};
    rawProductos.forEach(p => {
        if (fCategoria === 'Todas' || p.Categoria === fCategoria) {
            dictProductosFiltrados[p.ProductoID] = p;
        }
    });

    // 3. Filtrar Hechos
    const hechosFiltrados = rawHechos.filter(h => {
        const cli = dictClientesFiltrados[h.ClienteID];
        const prod = dictProductosFiltrados[h.ProductoID];
        const anio = h.Fecha.split('-')[0];
        
        return cli && prod && (fYear === 'Todos' || anio === fYear);
    });

    // 4. Destruir gráficos anteriores si existen
    Object.values(chartsRefs).forEach(chart => { if(chart) chart.destroy(); });
    chartsRefs = {};

    // 5. Recalcular datos agregados
    let totalVentas = 0, totalCantidad = 0;
    let ventasRegion = {}, ventasCat = {}, ventasProd = {};
    let ventasSegRegion = { Retail: {}, Mayoreo: {} };
    let ventasMes = {};
    let datosClientes = {};
    let matrizRegion = {};

    hechosFiltrados.forEach(h => {
        const monto = h.Importe; const cant = h.Cantidad;
        totalVentas += monto; totalCantidad += cant;
        const cli = dictClientesFiltrados[h.ClienteID];
        const prod = dictProductosFiltrados[h.ProductoID];

        ventasRegion[cli.Region] = (ventasRegion[cli.Region] || 0) + monto;
        ventasCat[prod.Categoria] = (ventasCat[prod.Categoria] || 0) + monto;
        
        if (cli.Segmento && cli.Region) ventasSegRegion[cli.Segmento][cli.Region] = (ventasSegRegion[cli.Segmento][cli.Region] || 0) + monto;
        
        if (!matrizRegion[cli.Region]) matrizRegion[cli.Region] = { "Accesorio": 0, "Computo": 0, total: 0 };
        matrizRegion[cli.Region][prod.Categoria] += monto;
        matrizRegion[cli.Region].total += monto;

        if (!ventasProd[prod.Producto]) ventasProd[prod.Producto] = { ventas: 0, cant: 0 };
        ventasProd[prod.Producto].ventas += monto; ventasProd[prod.Producto].cant += cant;

        const fechaObj = new Date(h.Fecha);
        const mesName = fechaObj.toLocaleString('en-US', { month: 'long' });
        const anio = fechaObj.getFullYear();
        if (!ventasMes[mesName]) ventasMes[mesName] = { 2024: 0, 2025: 0 };
        ventasMes[mesName][anio] += monto;

        if (!datosClientes[h.ClienteID]) datosClientes[h.ClienteID] = { ventas: 0, tickets: 0, nombre: cli.Cliente };
        datosClientes[h.ClienteID].ventas += monto; datosClientes[h.ClienteID].tickets += 1;
    });

    // 6. Renderizar KPIs
    document.getElementById('kpi-ventas').innerText = formatMill(totalVentas);
    document.getElementById('kpi-tickets').innerText = formatNum(hechosFiltrados.length);
    document.getElementById('kpi-ticket-prom').innerText = hechosFiltrados.length > 0 ? formatMill(totalVentas / hechosFiltrados.length) : '$0';

    // 7. Renderizar Gráficos (Solo si hay datos)
    if(hechosFiltrados.length > 0) {
        
        // Regiones
        const sortedRegiones = Object.keys(ventasRegion).sort((a,b) => ventasRegion[b] - ventasRegion[a]);
        chartsRefs.regiones = new Chart(document.getElementById('chartRegiones'), {
            type: 'bar',
            data: { labels: sortedRegiones, datasets: [{ data: sortedRegiones.map(r => ventasRegion[r]), backgroundColor: coloresPBI[0], borderRadius: 6 }] },
            options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, datalabels: { display: false } }, scales: { x: { ticks: { callback: (val) => formatMill(val) } } } }
        });

        // Categorías
        chartsRefs.categorias = new Chart(document.getElementById('chartCategorias'), {
            type: 'doughnut',
            data: { labels: Object.keys(ventasCat), datasets: [{ data: Object.values(ventasCat), backgroundColor: [coloresPBI[0], coloresPBI[1]], borderWidth: 0 }] },
            options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'right' }, datalabels: { color: '#fff', formatter: (val, ctx) => { const total = ctx.dataset.data.reduce((a,b)=>a+b,0); return (val/total*100).toFixed(1)+'%'; } } } }
        });

        // Tabla Productos
        const tbodyProd = document.querySelector('#tablaProductos tbody');
        tbodyProd.innerHTML = '';
        Object.keys(ventasProd).sort((a,b) => ventasProd[b].ventas - ventasProd[a].ventas).forEach(prodName => {
            tbodyProd.innerHTML += `<tr><td>${prodName}</td><td>${formatMoney(ventasProd[prodName].ventas)}</td><td>${formatNum(ventasProd[prodName].cant)}</td></tr>`;
        });
        document.getElementById('tot-ventas-tabla').innerText = formatMoney(totalVentas);
        document.getElementById('tot-cant-tabla').innerText = formatNum(totalCantidad);

        // Segmento y Región
        const regionesLista = ['Centro', 'Norte', 'Occidente', 'Sur'];
        const datasetsSegRegion = regionesLista.map((reg, i) => ({
            label: reg, data: [ventasSegRegion['Retail'][reg] || 0, ventasSegRegion['Mayoreo'][reg] || 0], backgroundColor: coloresPBI[i]
        }));
        chartsRefs.segRegion = new Chart(document.getElementById('chartSegmentoRegion'), {
            type: 'bar', data: { labels: ['Retail', 'Mayoreo'], datasets: datasetsSegRegion },
            options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: { display: false }, legend: { position: 'bottom' } }, scales: { x: { stacked: true }, y: { stacked: true, ticks: { callback: (val) => formatMill(val) } } } }
        });

        // Tendencia Mensual
        const mesesOrden = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const labelsTendencia = mesesOrden.filter(m => ventasMes[m]);
        const data2024 = labelsTendencia.map(m => ventasMes[m][2024] || 0);
        const data2025 = labelsTendencia.map(m => ventasMes[m][2025] || 0);

        chartsRefs.tendencia = new Chart(document.getElementById('chartTendenciaMensual'), {
            type: 'line', data: { labels: labelsTendencia, datasets: [{ label: 'Ventas 2024', data: data2024, borderColor: coloresPBI[0], tension: 0.4, pointRadius: 4 }, { label: 'Ventas 2025', data: data2025, borderColor: coloresPBI[1], tension: 0.4, pointRadius: 4 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: { display: false }, legend: { position: 'bottom' } }, scales: { y: { ticks: { callback: (val) => formatMill(val) } } } }
        });

        // Variación
        const varData = labelsTendencia.map((m, i) => { const v24 = data2024[i]; const v25 = data2025[i]; return v24 === 0 ? 0 : (v25 - v24) / v24; });
        chartsRefs.variacion = new Chart(document.getElementById('chartVariacion'), {
            type: 'bar', data: { labels: labelsTendencia, datasets: [{ data: varData, backgroundColor: coloresPBI[0], borderRadius: 6 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: { display: false }, legend: { display: false } }, scales: { y: { ticks: { callback: (val) => val.toFixed(1) } } } }
        });

        // Scatter
        const scatterData = Object.values(datosClientes).map(c => ({ x: c.ventas, y: c.ventas / c.tickets, name: c.nombre }));
        chartsRefs.scatter = new Chart(document.getElementById('chartScatter'), {
            type: 'scatter', data: { datasets: [{ label: 'Clientes', data: scatterData, backgroundColor: coloresPBI[0], pointRadius: 8, pointHoverRadius: 10 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: { display: false }, legend: { display: false } }, scales: { x: { title: { display: true, text: 'Ventas Totales' }, ticks: { callback: (val) => formatMill(val) } }, y: { title: { display: true, text: 'Ticket Promedio' }, ticks: { callback: (val) => formatMill(val) } } } }
        });

        // Tabla Matriz
        const tbodyMatriz = document.querySelector('#tablaMatriz tbody');
        tbodyMatriz.innerHTML = '';
        let tAcc = 0, tComp = 0, tGlobal = 0;
        for (const [reg, vals] of Object.entries(matrizRegion)) {
            const pAcc = vals["Accesorio"] / vals.total;
            const pComp = vals["Computo"] / vals.total;
            tAcc += vals["Accesorio"]; tComp += vals["Computo"]; tGlobal += vals.total;
            tbodyMatriz.innerHTML += `<tr><td>${reg}</td><td>${pAcc.toFixed(2)}</td><td>${pComp.toFixed(2)}</td><td><strong>1.00</strong></td></tr>`;
        }
        document.getElementById('tot-acc').innerText = tGlobal > 0 ? (tAcc / tGlobal).toFixed(2) : '0.00';
        document.getElementById('tot-comp').innerText = tGlobal > 0 ? (tComp / tGlobal).toFixed(2) : '0.00';

        // Tau Kendall
        const arrClientes = Object.values(datosClientes);
        let conc = 0, disc = 0;
        for (let i = 0; i < arrClientes.length; i++) {
            for (let j = i + 1; j < arrClientes.length; j++) {
                const t1 = arrClientes[i].ventas / arrClientes[i].tickets;
                const t2 = arrClientes[j].ventas / arrClientes[j].tickets;
                const difV = arrClientes[i].ventas - arrClientes[j].ventas;
                const difT = t1 - t2;
                if (difV * difT > 0) conc++; else if (difV * difT < 0) disc++;
            }
        }
        const tau = (conc - disc) / (conc + disc || 1); // Evitar división por cero si no hay datos
        document.getElementById('tau-value').innerText = isNaN(tau) ? '0.00' : tau.toFixed(2);
        let interp = tau >= 0.7 ? "Asociación positiva fuerte" : tau >= 0.4 ? "Asociación positiva moderada" : tau >= 0.1 ? "Asociación positiva débil" : "Asociación negativa o nula";
        document.getElementById('tau-interpretacion').innerText = arrClientes.length > 1 ? interp : "Datos insuficientes";

    } else {
        // Limpiar si no hay datos (ej. filtro no arroja resultados)
        document.getElementById('tau-value').innerText = '0.00';
        document.getElementById('tau-interpretacion').innerText = 'Sin datos';
        document.querySelector('#tablaProductos tbody').innerHTML = '<tr><td colspan="3">Sin datos</td></tr>';
        document.querySelector('#tablaMatriz tbody').innerHTML = '<tr><td colspan="4">Sin datos</td></tr>';
    }
}