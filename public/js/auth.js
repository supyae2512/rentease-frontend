document.addEventListener("DOMContentLoaded", function() {
    console.log("Auth JS loaded");
    const userMenu = document.getElementById("user-menu");

    if (isAuthenticated() === true) {
        // Logged in
        userMenu.innerHTML = `
            <li><a href="#">My Account</a></li>
            <li><a href="#" id="logoutBtn">Sign Out</a></li>
        `;

        document.getElementById("logoutBtn").addEventListener("click", function() {
            clearAuth();
            window.location.reload();
        });

    } else {
        // Not logged in
        userMenu.innerHTML = `
            <li><a href="/signin">Sign In</a></li>
            <li><a href="#">Register</a></li>
        `;
    }
});

$('.cl_btn_login').on('click', function(e) {
    e.preventDefault();
    var $this = $(this);
    var email = $('input[name="email"]').val();
    var password = $('input[name="password"]').val();

    $.ajax({
        url: `${window.APP_CONFIG.BACKEND_URL}/api/users/login`,
        type: "POST",
        // xhrFields: {
        //     withCredentials: true
        // },
        contentType: "application/json",
        data: JSON.stringify({
            email: email,
            password: password
        }),
        success: function (res) {
            
            setAuthData(res);

            $.post("/auth/store-token", { token: res.token })
                .done(function () {
                    const params = new URLSearchParams(window.location.search);
                    const redirectPage = params.get("redirect") || "/home";
                    window.location.href = redirectPage;
                })
                .fail(function (xhr, status, error) {
                    console.error("Failed to store auth token:", status, error);
                    // Optional fallback: force logout or redirect
                    window.location.href = "/signin";
                });

        },
        error: function () {
            alert("Invalid email or password");
        }
    });
});

function setAuthData(res) {
    this.setCookie("jwt", res.token, 2);
    localStorage.setItem("userId", res.userId);
    localStorage.setItem("user", JSON.stringify(res));
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// function getToken() {
//     if (isBrowser()) {
//         return getCookie("jwt");
//     }
//     return null;
// }

async function getToken() {
    try {
        const response = await fetch("/auth/token", {
            method: "GET",
            credentials: "include"
        });
        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error("Error checking auth status:", error);
        return false;
    }
}


// function isAuthenticated() {
//     const token = getToken();
//     console.log("Checking auth for token:", token);
//     if (!token) return false;
    
//     try {
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         const isExpired = payload.exp * 1000 < Date.now();
//         if (isExpired) {
//             clearAuth();
//             return false;
//         }
//         return true;
//     } catch (e) {
//         return false;
//     }
// }

async function isAuthenticated() {
    try {
        const response = await fetch("/auth/status", {
            method: "GET",
            credentials: "include"
        });
        const data = await response.json();
        return data.authenticated;
    } catch (error) {
        console.error("Error checking auth status:", error);
        return false;
    }
}

function requireLogin(redirectUrl) {
    if (!isAuthenticated()) {
        window.location.href = "/signin?redirect=" + encodeURIComponent(redirectUrl || window.location.pathname);
        return false;
    }
    return true;
}

function clearAuth() {
    if (isBrowser()) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
        setCookie("jwt", "", -1); // Expire cookie 
        fetch("/auth/logout", {
            method: "POST",
            credentials: "same-origin"
        }).then(() => window.location.reload());
    }
}

function isBrowser() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function setCookie(name, value, hours) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (hours * 60 * 60 * 2000));
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// function getLoggedInUserId() {
//     const token = localStorage.getItem("access_token");
//     if (!token) return null;

//     const payload = JSON.parse(atob(token.split(".")[1]));
//     return payload.userId;
// }
