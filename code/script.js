import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDLe5UAVUYYfFZxIdaEIqz875uqAT2xEHA",
    authDomain: "spotlight-430c6.firebaseapp.com",
    projectId: "spotlight-430c6",
    storageBucket: "spotlight-430c6.firebasestorage.app",
    messagingSenderId: "37283174582",
    appId: "1:37283174582:web:eb0edb53f88786b8ecae17",
    measurementId: "G-MRHV343K1W"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginLink = document.getElementById("navLogin");
const signupLink = document.getElementById("navGetStarted");
const accountLink = document.getElementById("navAccount");
const logoutButton = document.getElementById("navLogout");

onAuthStateChanged(auth, async user => {
    if (!loginLink || !signupLink || !accountLink || !logoutButton) return;

    if (!user) {
        loginLink.hidden = false;
        signupLink.hidden = false;
        accountLink.hidden = true;
        logoutButton.hidden = true;
        accountLink.href = "artist-dashboard.html";
        return;
    }

    loginLink.hidden = true;
    signupLink.hidden = true;
    accountLink.hidden = false;
    logoutButton.hidden = false;

    try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const role = snap.exists() ? snap.data().accountType : "artist";
        accountLink.href = role === "venue" ? "venue-dashboard.html" : "artist-dashboard.html";
        accountLink.textContent = role === "venue" ? "Venue Account" : "My Account";
    } catch (error) {
        console.error("Could not load account type:", error);
        accountLink.href = "login.html";
        accountLink.textContent = "My Account";
    }
});

logoutButton?.addEventListener("click", async () => {
    logoutButton.disabled = true;
    logoutButton.textContent = "Logging out...";
    try {
        await signOut(auth);
        window.location.reload();
    } catch (error) {
        console.error("Logout failed:", error);
        logoutButton.disabled = false;
        logoutButton.textContent = "Log Out";
        alert("Could not log out. Please try again.");
    }
});
