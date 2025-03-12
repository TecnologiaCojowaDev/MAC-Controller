import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

const firebaseConfigCojowa = {
    apiKey: "AIzaSyCLYvdRrnUaJKMiEX0Z_D-74l9f3krSeRk",
    authDomain: "maccontroller-ea665.firebaseapp.com",
    databaseURL: "https://maccontroller-ea665-default-rtdb.firebaseio.com",
    projectId: "maccontroller-ea665",
    storageBucket: "maccontroller-ea665.firebasestorage.app",
    messagingSenderId: "1002566286049",
    appId: "1:1002566286049:web:07f688dbea0f50758e15a0",
    measurementId: "G-BVW570CEPW"
};

const firebaseConfigUnifi = {
    apiKey: "AIzaSyBVNl-r0s1YqBwtRHOMfVLQfAmFhLrm580",
    authDomain: "macunifi2.firebaseapp.com",
    databaseURL: "https://macunifi2-default-rtdb.firebaseio.com",
    projectId: "macunifi2",
    storageBucket: "macunifi2.firebasestorage.app",
    messagingSenderId: "620730259352",
    appId: "1:620730259352:web:bb0e6352b8f04361a1fded",
    measurementId: "G-Z9NFD2Y4D1"
};

// Inicializar Firebase
const appCojowa = initializeApp(firebaseConfigCojowa, "appCojowa");
const appUnifi = initializeApp(firebaseConfigUnifi, "appUnifi");

const databaseCojowa = getDatabase(appCojowa);
const databaseUnifi = getDatabase(appUnifi);

export { databaseCojowa, databaseUnifi, ref, get, child };
