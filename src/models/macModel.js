import { databaseCojowa, databaseUnifi } from "../config/firebaseKeys.js";
import { get, child, ref } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

export async function getJsonData(type) {
    const dbRef = ref(type === "cojowa" ? databaseCojowa : databaseUnifi);
    try {
        const snapshot = await get(child(dbRef, "/"));
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        console.error("Error obteniendo datos: ", error);
        return null;
    }
}
