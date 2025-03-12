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

let mac_cojowa = [];
let mac_unifi_2 = [];

// Cargar datos
getJsonData(databaseCojowa).then(data => mac_cojowa = data);
getJsonData(databaseUnifi).then(data => mac_unifi_2 = data);

window.buscarMac = function buscarMac() {
    const mac = document.getElementById("mac").value.trim().toLowerCase();
    if (!mac) {
        alert("Ingrese una dirección MAC válida.");
        return;
    }

    const filtradoCojowa = mac_cojowa.filter(row => Object.values(row).some(value => 
        typeof value === "string" && value.toLowerCase() === mac
    ));

    const filtradoUnifi = mac_unifi_2.filter(row => Object.values(row).some(value => 
        typeof value === "string" && value.toLowerCase() === mac
    ));

    mostrarResultados(filtradoCojowa, filtradoUnifi);
};

function mostrarResultados(cojowa, unifi) {
    const tabla = document.getElementById("resultadoTabla").getElementsByTagName("tbody")[0];
    tabla.innerHTML = "";

    const agregarFila = (fuente, id, mac, detalles) => {
        const fila = tabla.insertRow();
        fila.insertCell(0).textContent = fuente;
        fila.insertCell(1).textContent = id;
        fila.insertCell(2).textContent = mac;
        fila.insertCell(3).textContent = detalles;
    };

    if (cojowa.length > 0) {
        cojowa.forEach(item => {
            let macsAsociadas = [
                item.MAC_CEL, 
                item.MAC_TV,
                item.MAC_ADICIONAL_1,
                item.MAC_ADICIONAL_2,
                item.MAC_ADICIONAL_3
            ].filter(mac => mac).join(", ");

            let detalles = `Nombre: ${item.NOMBRE_COMPLETO}, MACs: [${macsAsociadas}]`;

            agregarFila("mac_cojowa", item.NUMERO || "N/A", macsAsociadas, detalles);
        });
    }

    if (unifi.length > 0) {
        unifi.forEach(item => {
            agregarFila("mac_unifi_2", item.ID || "N/A", item.MAC_UNIFI || "N/A", `Estado: ${item.ESTADO || "Desconocido"}`);
        });
    }

    if (cojowa.length === 0 && unifi.length === 0) {
        const fila = tabla.insertRow();
        const celda = fila.insertCell(0);
        celda.colSpan = 4;
        celda.textContent = "❌ No se encontró la MAC en ninguna base de datos.";
        celda.style.textAlign = "center";
    }
}
