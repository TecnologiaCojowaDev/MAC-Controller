import { databaseCojowa, databaseUnifi, ref, get, child } from "../config/firebaseKeys.js";

let usuariosCojowa = [];
let macsUnifiSet = new Set();
let usuarioSeleccionado = null;

async function getJsonData(database) {
    const dbRef = ref(database);
    try {
        const snapshot = await get(child(dbRef, `/`));
        return snapshot.exists() ? snapshot.val() : [];
    } catch (error) {
        console.error("Error obteniendo datos:", error);
        return [];
    }
}

async function cargarDatos() {
    usuariosCojowa = await getJsonData(databaseCojowa);
    const mac_unifi = await getJsonData(databaseUnifi);

    macsUnifiSet = new Set(mac_unifi.map(item => item.MAC_UNIFI?.toLowerCase()));

    mostrarUsuarios(usuariosCojowa);
}

function mostrarUsuarios(usuarios) {
    const tabla = document.querySelector("#usuariosTabla tbody");
    tabla.innerHTML = ""; 

    usuarios.forEach(usuario => {
        const fila = tabla.insertRow();
        fila.dataset.id = usuario.NUMERO;

        const macsUsuario = [
            usuario.MAC_CEL,
            usuario.MAC_TV,
            usuario.MAC_ADICIONAL_1,
            usuario.MAC_ADICIONAL_2,
            usuario.MAC_ADICIONAL_3
        ].filter(mac => mac).map(mac => mac.toLowerCase());

        const enUnifi = macsUsuario.some(mac => macsUnifiSet.has(mac)) ? "Sí" : "No";

        fila.insertCell(0).textContent = usuario.NUMERO || "N/A";
        fila.insertCell(1).textContent = usuario.NOMBRE_COMPLETO || "Desconocido";
        fila.insertCell(2).textContent = usuario.MAC_CEL || "N/A";
        fila.insertCell(3).textContent = usuario.MAC_TV || "N/A";
        fila.insertCell(4).textContent = usuario.MAC_ADICIONAL_1 || "N/A";
        fila.insertCell(5).textContent = usuario.MAC_ADICIONAL_2 || "N/A";
        fila.insertCell(6).textContent = usuario.MAC_ADICIONAL_3 || "N/A";
        fila.insertCell(7).textContent = enUnifi;

        fila.style.backgroundColor = enUnifi === "Sí" ? "#e3f2fd" : "#fbe9e7";

        fila.addEventListener("click", () => seleccionarUsuario(fila, usuario));
    });
}

function seleccionarUsuario(fila, usuario) {
    if (usuarioSeleccionado && usuarioSeleccionado.NUMERO === usuario.NUMERO) {
        usuarioSeleccionado = null;
        fila.classList.remove("selected");
    } else {
        document.querySelectorAll("#usuariosTabla tbody tr").forEach(f => f.classList.remove("selected"));
        fila.classList.add("selected");
        usuarioSeleccionado = usuario;
    }

    document.getElementById("editBtn").disabled = !usuarioSeleccionado;
    document.getElementById("deleteBtn").disabled = !usuarioSeleccionado;
}

function filtrarUsuarios() {
    const input = document.getElementById("searchInput");
    const criterio = input?.value.toLowerCase() || "";
    const tipo = document.getElementById("searchType")?.value || "nombre";

    const usuariosFiltrados = usuariosCojowa.filter(usuario => {
        return (tipo === "nombre" && usuario.NOMBRE_COMPLETO.toLowerCase().includes(criterio)) ||
               (tipo === "id" && usuario.NUMERO?.toString().includes(criterio)) ||
               (tipo === "mac" && [usuario.MAC_CEL, usuario.MAC_TV, usuario.MAC_ADICIONAL_1, usuario.MAC_ADICIONAL_2, usuario.MAC_ADICIONAL_3]
                   .some(mac => mac?.toLowerCase().includes(criterio)));
    });

    mostrarUsuarios(usuariosFiltrados);
}

document.addEventListener("DOMContentLoaded", () => {
    cargarDatos();
    document.getElementById("searchBtn").addEventListener("click", filtrarUsuarios);
});
