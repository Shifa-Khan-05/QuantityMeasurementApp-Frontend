document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signupForm");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Inputs
        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const mobileInput = document.getElementById("mobile");

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const mobile = mobileInput.value.trim();

        // Error Elements
        const nameError = document.getElementById("nameError");
        const emailError = document.getElementById("emailError");
        const passwordError = document.getElementById("passwordError");
        const mobileError = document.getElementById("mobileError");

        // Reset error messages
        [nameError, emailError, passwordError, mobileError].forEach(err => err.textContent = "");

        let isValid = true;

        // Validation - Name
        if (name === "") { 
            nameError.textContent = "Name is required"; 
            isValid = false; 
        } else if (name.length < 3) {
            nameError.textContent = "Name must be at least 3 characters";
            isValid = false;
        }
        
        // Validation - Email
        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (email === "") { 
            emailError.textContent = "Email is required"; 
            isValid = false; 
        } else if (!emailPattern.test(email)) { 
            emailError.textContent = "Enter a valid email"; 
            isValid = false; 
        }

        // Validation - Password
        if (password === "") { 
            passwordError.textContent = "Password is required"; 
            isValid = false; 
        } else if (password.length < 6) { 
            passwordError.textContent = "Password must be at least 6 characters"; 
            isValid = false; 
        }

        // Validation - Mobile
        const mobilePattern = /^[0-9]{10}$/;
        if (mobile === "") { 
            mobileError.textContent = "Mobile number is required"; 
            isValid = false; 
        } else if (!mobilePattern.test(mobile)) { 
            mobileError.textContent = "Enter a valid 10-digit number"; 
            isValid = false; 
        }

        // Local Storage Logic
        if (isValid) {
            // Get existing users or empty array
            let users = JSON.parse(localStorage.getItem("users")) || [];

            // Check if user already exists
            const userExists = users.some(u => u.email === email);

            if (userExists) {
                emailError.textContent = "User with this email already exists!";
            } else {
                // Add new user
                users.push({ name, email, password, mobile });
                localStorage.setItem("users", JSON.stringify(users));

                alert("Signup Successful! ✅ Redirecting to login...");

                // CLEAR ALL FIELDS
                form.reset(); 
                
                // Redirect to login after signup
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1000);
            }
        }
    });
});