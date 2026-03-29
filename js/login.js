document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    // Clear previous error messages
    emailError.textContent = "";
    passwordError.textContent = "";

    let isValid = true;

    // Validation
    if (email === "") { 
        emailError.textContent = "Email is required"; 
        isValid = false; 
    } else {
        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!emailPattern.test(email)) { 
            emailError.textContent = "Enter a valid email"; 
            isValid = false; 
        }
    }

    if (password === "") { 
        passwordError.textContent = "Password is required"; 
        isValid = false; 
    } else if (password.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters";
        isValid = false;
    }

    if (!isValid) return;

    // Fetch data from LocalStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        alert("Login Successful! Welcome, " + user.name + " ✅");
        localStorage.setItem("loggedInUser", user.name); 
        
        // CLEAR FIELDS
        document.getElementById("loginForm").reset();
        
        // Redirect to dashboard
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid Email or Password!");
    }
});