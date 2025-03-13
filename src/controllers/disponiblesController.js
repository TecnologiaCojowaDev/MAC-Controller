import { databaseCojowa, databaseUnifi, ref, get, child } from "../config/firebaseKeys.js";

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
    const mac_cojowa = await getJsonData(databaseCojowa);
    const mac_unifi = await getJsonData(databaseUnifi);
    mostrarDisponibles(mac_cojowa, mac_unifi);
}

function mostrarDisponibles(usuariosCojowa, macsUnifi) {
    const tabla = document.getElementById("macsUnifiTabla").getElementsByTagName("tbody")[0];
    tabla.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos

    const macsCojowaSet = new Set();
    usuariosCojowa.forEach(usuario => {
        [usuario.MAC_CEL, usuario.MAC_TV, usuario.MAC_ADICIONAL_1, usuario.MAC_ADICIONAL_2, usuario.MAC_ADICIONAL_3]
            .filter(mac => mac)
            .forEach(mac => macsCojowaSet.add(mac.toLowerCase()));
    });

    macsUnifi.forEach((item, index) => {
        const fila = tabla.insertRow();
        const mac = item.MAC_UNIFI?.toLowerCase() || "N/A";
        const estado = macsCojowaSet.has(mac) ? "Ocupado" : "Disponible";

        fila.insertCell(0).textContent = index + 1; // Número de fila
        fila.insertCell(1).textContent = mac;
        fila.insertCell(2).textContent = estado;

        fila.classList.add(estado === "Disponible" ? "disponible" : "ocupado");
    });
}

document.addEventListener("DOMContentLoaded", cargarDatos);
