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
    const mac_unifi_2 = await getJsonData(databaseUnifi);

    mostrarUsuarios(mac_cojowa, mac_unifi_2);
}

function mostrarUsuarios(usuariosCojowa, macsUnifi) {
    const tabla = document.getElementById("usuariosTabla").getElementsByTagName("tbody")[0];
    tabla.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos

    const macsUnifiSet = new Set(macsUnifi.map(item => item.MAC_UNIFI?.toLowerCase()));

    usuariosCojowa.forEach(usuario => {
        const fila = tabla.insertRow();

        // Obtener todas las MAC del usuario
        const macsUsuario = [
            usuario.MAC_CEL,
            usuario.MAC_TV,
            usuario.MAC_ADICIONAL_1,
            usuario.MAC_ADICIONAL_2,
            usuario.MAC_ADICIONAL_3
        ].filter(mac => mac).map(mac => mac.toLowerCase());

        // Verificar si alguna MAC está en Unifi
        const enUnifi = macsUsuario.some(mac => macsUnifiSet.has(mac)) ? "Sí" : "No";

        // Insertar celdas con datos
        fila.insertCell(0).textContent = usuario.NUMERO || "N/A";
        fila.insertCell(1).textContent = usuario.NOMBRE_COMPLETO || "Desconocido";
        fila.insertCell(2).textContent = usuario.MAC_CEL || "N/A";
        fila.insertCell(3).textContent = usuario.MAC_TV || "N/A";
        fila.insertCell(4).textContent = usuario.MAC_ADICIONAL_1 || "N/A";
        fila.insertCell(5).textContent = usuario.MAC_ADICIONAL_2 || "N/A";
        fila.insertCell(6).textContent = usuario.MAC_ADICIONAL_3 || "N/A";
        fila.insertCell(7).textContent = enUnifi;

        // Cambiar color según estado Unifi
        fila.style.backgroundColor = enUnifi === "Sí" ? "#e3f2fd" : "#fbe9e7";
    });
}

// Llamar la función cuando cargue la página
document.addEventListener("DOMContentLoaded", cargarDatos);
