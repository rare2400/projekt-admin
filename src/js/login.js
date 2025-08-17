"use strict";

const loginForm = document.getElementById("login-form");

window.onload = init;

function init() {

    //add event listener to the login-form
    if (loginForm) {
        loginForm.addEventListener("submit", loginUser);
    }

}

//function to handle user login
async function loginUser(e) {
    e.preventDefault();

    //fetch form input-values
    let usernameInput = document.getElementById("username").value;
    let passwordInput = document.getElementById("password").value;
    let errorMsg = document.getElementById("error-msg");

    //check if inputs are empty
    if (!usernameInput || !passwordInput) {
        errorMsg.textContent = "Användarnamn och lösenord krävs!";
        return;
    }

    //user-object
    let user = {
        username: usernameInput,
        password: passwordInput
    }

    //send login request to the server
    try {
        const response = await fetch("http://127.0.0.1:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })

        //check if the response is ok
        if (response.ok) {
            const data = await response.json();

            //save token in localStorage and redirect to menu-page
            localStorage.setItem("admin-token", data.response.token);
            window.location.href = "menu.html";

        } else {
            throw new Error("Login failed");
        }

    } catch (error) {
        console.error("Error during login:", error);
        errorMsg.textContent = "Felaktigt användarnamn eller lösenord";
    }
}