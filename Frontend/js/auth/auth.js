// ==============================
// AUTHENTICATION
// ==============================

function getLoggedInUser() {
    const userData = localStorage.getItem("user");

    if (!userData) {
        return null;
    }

    try {
        return JSON.parse(userData);
    } catch (error) {
        console.error("Invalid user data:", error);

        localStorage.removeItem("user");

        return null;
    }
}


// ==============================
// LOGIN STATE
// ==============================

function isLoggedIn() {
    return getLoggedInUser() !== null;
}


// ==============================
// LOGOUT
// ==============================

function logoutUser() {
    localStorage.removeItem("user");

    window.location.href = "login.html";
}


// ==============================
// PROTECT HOME PAGE
// ==============================

function protectPage() {
    if (!isLoggedIn()) {
        window.location.href = "login.html";
    }
}