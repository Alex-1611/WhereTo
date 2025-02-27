document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const alreadyLoggedIn = document.getElementById('already-logged-in');
    const logoutBtn = document.getElementById('logout-btn');

    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            loginForm.style.display = 'none';
            alreadyLoggedIn.style.display = 'block';
        } else {
            loginForm.style.display = 'block';
            alreadyLoggedIn.style.display = 'none';
        }
    }

    checkLoginStatus();

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                checkLoginStatus();
            } else {
                alert('Invalid username or password');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred during login');
        });
    });

    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        checkLoginStatus();
    });
});