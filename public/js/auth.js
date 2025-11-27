
document.addEventListener("DOMContentLoaded", function() {
    const token = getToken();
    const userMenu = document.getElementById("user-menu");

    if (token) {
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
        contentType: "application/json",
        data: JSON.stringify({
            email: email,
            password: password
        }),
        success: function (res) {
            
            setAuthData(res);

            const params = new URLSearchParams(window.location.search);
            const redirectPage = params.get("redirect");

            if (redirectPage) {
                window.location.href = redirectPage;
            } else {
                window.location.href = "/home";
            }
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

function getToken() {
    if (isBrowser()) {
        return getCookie("jwt");
    }
    return null;
}


function isAuthenticated() {
    console.log('isAuthenticated called');
    const token = getToken();
    console.log('token ..', token);
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        if (isExpired) {
            clearAuth();
            return false;
        }
        return true;
    } catch (e) {
        return false;
    }
}

// function requireLogin(redirectUrl) {
//     const token = getCookie("jwt");

//     if (!token) {
//         window.location.href = "/signin?redirect=" + encodeURIComponent(redirectUrl);
//         return false;
//     }
//     return true;
// }

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
    }
}

function isBrowser() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function setCookie(name, value, hours) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (hours * 60 * 60 * 1000));
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// function getLoggedInUserId() {
//     const token = localStorage.getItem("access_token");
//     if (!token) return null;

//     const payload = JSON.parse(atob(token.split(".")[1]));
//     return payload.userId;
// }
