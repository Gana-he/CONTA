const IVA_GENERAL = 0.15;
const IVA_CONSTRUCCION = 0.05;
const IVA_CERO = 0.00;

const productos = [
    // --- PRODUCTOS GENERALES (15%) ---
    { name: "Yogurt Natural", base: 2.50, tipoIva: "general", img: "yogurt.jpg", color: "#fdf2f8" },
    { name: "Celular Smartphone", base: 450.00, tipoIva: "general", img: "celular.avif", color: "#f8fafc" },
    { name: "Botella de Alcohol", base: 35.00, tipoIva: "general", img: "botella.jpg", color: "#fef2f2" },
    { name: "Base Maquillaje", base: 18.00, tipoIva: "general", img: "base.jpg", color: "#faf5ff" },
    { name: "Servicio Computación", base: 30.00, tipoIva: "general", img: "servicio.jpg", color: "#f0fdf4" },
    { name: "Vehículo SUV", base: 22000.00, tipoIva: "general", img: "carro.png", color: "#f1f5f9" },
    { name: "Computadora", base: 850.00, tipoIva: "general", img: "pc.webp", color: "#ecfeff" },
    { name: "Salsa de Tomate", base: 1.60, tipoIva: "general", img: "salsa.png", color: "#fff1f2" },
    { name: "Ropa Casual", base: 25.00, tipoIva: "general", img: "ropa.jpeg", color: "#faf5ff" },
    { name: "Perfume Elegance", base: 45.00, tipoIva: "general", img: "perfume.png", color: "#fdf2f8" },

    // --- MATERIALES DE CONSTRUCCIÓN (5%) ---
    { name: "Cemento Selva Alegre", base: 7.50, tipoIva: "construccion", img: "cemento.jpg", color: "#f1f5f9" },
    { name: "Bloque de Puzolana", base: 0.45, tipoIva: "construccion", img: "bloque.jpg", color: "#f8fafc" },

    // --- PRODUCTOS/SERVICIOS PÚBLICOS Y BÁSICOS (0%) ---
    { name: "Leche Entera", base: 1.20, tipoIva: "cero", img: "leche.jpg", color: "#f0f9ff" },
    { name: "Carne de Res (kg)", base: 6.50, tipoIva: "cero", img: "carne.webp", color: "#fef2f2" },
    { name: "Pan de Casa", base: 0.15, tipoIva: "cero", img: "pan.jpg", color: "#fffbeb" },
    { name: "Medicamentos", base: 12.00, tipoIva: "cero", img: "medi.jpg", color: "#f0fdf4" },
    { name: "Semillas Plantas", base: 3.20, tipoIva: "cero", img: "semilla.jpg", color: "#f0fdf4" },
    { name: "Agua Potable", base: 2.00, tipoIva: "cero", img: "agua.jpeg", color: "#f0f9ff" }
];

function calcularIva(item) {
    if (item.tipoIva === "general") return item.base * IVA_GENERAL;
    if (item.tipoIva === "construccion") return item.base * IVA_CONSTRUCCION;
    return 0;
}

function obtenerEtiquetaIva(tipo) {
    if (tipo === "general") return "IVA 15%";
    if (tipo === "construccion") return "IVA CONSTRUCCIÓN 5%";
    return "TARIFA 0%";
}

function init() {
    const grid = document.getElementById('grid-productos');
    const qrAdminContainer = document.getElementById('contenedor-qrs');

    if (grid) grid.innerHTML = "";
    if (qrAdminContainer) qrAdminContainer.innerHTML = "";

    productos.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => verDetalle(item);
        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}" style="object-fit: cover;" onerror="this.src='https://via.placeholder.com/300?text=Imagen'">
            <h3>${item.name}</h3>
        `;
        grid.appendChild(card);

        const qrDiv = document.createElement('div');
        qrDiv.className = 'qr-item';
        qrDiv.innerHTML = `<p style="font-weight:bold; font-size:12px;">${item.name}</p><div id="canvas-${index}"></div>`;
        qrAdminContainer.appendChild(qrDiv);

        setTimeout(() => {
            const el = document.getElementById(`canvas-${index}`);
            if (el) {
                const idProducto = encodeURIComponent(item.name.replace(/\s/g, ""));
                const urlBase = window.location.href.split('#')[0];
                new QRCode(el, {
                    text: urlBase + "#" + idProducto,
                    width: 130, height: 130,
                    colorDark: "#000000", colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
            }
        }, 100 * (index + 1));
    });

    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
        revisarRutaQR();
    }, 1500);
}

function revisarRutaQR() {
    const hash = decodeURIComponent(window.location.hash.replace("#", ""));
    if (hash) {
        const encontrado = productos.find(p => p.name.replace(/\s/g, "") === hash);
        if (encontrado) verDetalle(encontrado);
    }
}

function verDetalle(item) {
    const vistaCatalogo = document.getElementById('vista-catalogo');
    const vistaDetalle = document.getElementById('vista-detalle');
    const detalleContenido = document.getElementById('detalle-contenido');

    const valorIva = calcularIva(item);
    const total = item.base + valorIva;

    detalleContenido.style.backgroundColor = item.color;
    detalleContenido.innerHTML = `
        <div class="detalle-card">
            <img src="${item.img}" class="detalle-img" onerror="this.src='https://via.placeholder.com/400?text=Error'">
            <div class="detalle-info">
                <span style="font-weight:700; color:#475569; letter-spacing:1px;">${obtenerEtiquetaIva(item.tipoIva)}</span>
                <h1 style="margin:10px 0;">${item.name}</h1>
                <div style="font-size:2.8rem; font-weight:800; color:#1e293b; margin-bottom:15px;">$${total.toFixed(2)}</div>
                
                <div style="background:rgba(255,255,255,0.5); padding:15px; border-radius:12px; border:1px solid rgba(0,0,0,0.05); margin-bottom: 20px;">
                    <p style="display:flex; justify-content:space-between;"><span>Subtotal:</span> <b>$${item.base.toFixed(2)}</b></p>
                    <p style="display:flex; justify-content:space-between;"><span>Impuesto:</span> <b>$${valorIva.toFixed(2)}</b></p>
                    <hr style="border:0; border-top:1px solid #cbd5e1; margin:10px 0;">
                    <p style="display:flex; justify-content:space-between; font-size:1.1rem; color:#000;"><span>Total Final:</span> <b>$${total.toFixed(2)}</b></p>
                </div>

                <button onclick="irAlCatalogo()" class="btn-home-formal">⌂</button>
            </div>
        </div>
    `;

    vistaCatalogo.classList.add('hidden');
    vistaDetalle.classList.remove('hidden');
    window.location.hash = item.name.replace(/\s/g, ""); 
}

function irAlCatalogo() {
    document.getElementById('vista-catalogo').classList.remove('hidden');
    document.getElementById('vista-detalle').classList.add('hidden');
    history.replaceState(null, null, window.location.pathname); 
}

function abrirAdmin() { document.getElementById('panel-admin').classList.remove('hidden'); }
function cerrarAdmin() { document.getElementById('panel-admin').classList.add('hidden'); }

window.onload = init;