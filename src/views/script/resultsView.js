export function mostrarResultado(resultadoCojowa, resultadoUnifi) {
    let mensaje = "";

    if (resultadoCojowa.length > 0) {
        mensaje += "🔹 Resultado en mac_cojowa:\n" + JSON.stringify(resultadoCojowa, null, 2);
    } else if (resultadoUnifi.length > 0) {
        mensaje += "🔹 MAC encontrada en mac_unifi_2:\n" + JSON.stringify(resultadoUnifi, null, 2);
    } else {
        mensaje += "❌ La MAC no se encontró en ninguno de los registros.";
    }

    document.getElementById("resultado").textContent = mensaje;
}
