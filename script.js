document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Stop form submission

    let fullname = document.getElementById("fullname").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let age = document.getElementById("age").value;

    const message = document.getElementById("message");
    message.textContent = ""; // Clear previous message
    message.style.color = "red";

    let error = ""; // This variable will track any validation errors

    // Full name validation
    if (fullname.split(" ").length < 2) {
        error = "Full name must contain at least two words.";
    }
    // Email validation
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        error = "Please enter a valid email address.";
    }
    // Password validation
    else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        error = "Password must be at least 8 characters, include one uppercase letter, one number, and one special character.";
    }
    // Confirm password
    else if (password !== confirmPassword) {
        error = "Passwords do not match.";
    }
    // Age validation
    else if (age < 18) {
        error = "You must be 18 years or older.";
    }

    // Show error or success
    if (error !== "") {
        message.textContent = error; // Show the error in red
    } else {
        message.style.color = "green";
        message.textContent = "Registration successful!";
    }
});
