"use strict";

window.onload = init;

const messages = document.getElementById("messages");


function init() {
    if (messages) {
        fetchMessages();
    }
}


//fetch messages from API
async function fetchMessages() {
    try {
        //get token from localStorage
        const token = localStorage.getItem("admin-token")

        //fetch data from API with token in header
        const response = await fetch("http://127.0.0.1:3000/api/messages", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (response.ok) {
            const data = await response.json();
            displayMessages(data);
        }
    } catch (error) {
        console.log("Error fetching data:", error);
    }
}

//display fetched messages from API
async function displayMessages(data) {
    messages.innerHTML = "";

    if (data.length === 0) {
        messages.textContent = "Det finns inga inlägg att visa";
        return;
    }

    //loop data and create elements for menu-items
    data.forEach(message => {
        const messageBox = document.createElement("div");
        messageBox.classList.add("msg-box");
        const name = document.createElement("h2");
        const email = document.createElement("p");
        const customerMessage = document.createElement("p");

        //button and checkbox
        const btnDiv = document.createElement("div");
        btnDiv.classList.add("btn-div");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkbox");
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");

        //set content for elements from data
        name.textContent = message.name;
        email.textContent = "E-post: " + message.email;
        customerMessage.textContent = message.message;

        //set text for button
        deleteBtn.textContent = "Ta bort";

        //put the elements together
        messageBox.appendChild(name);

        //only show phone number if it exists
        if (message.phoneNumber) {
            const phoneNr = document.createElement("p");
            phoneNr.textContent = "Telefonnr: " + message.phoneNumber;
            messageBox.appendChild(phoneNr);
        }

        //put the elements together
        messageBox.appendChild(email);
        messageBox.appendChild(customerMessage);


        btnDiv.appendChild(checkbox);
        btnDiv.appendChild(deleteBtn);
        messageBox.appendChild(btnDiv);


        messages.appendChild(messageBox);
    });
}