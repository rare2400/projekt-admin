"use strict";

window.addEventListener("load", init);

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
        const response = await fetch("https://projekt-api-73oa.onrender.com/api/messages", {
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
        const createdAt = document.createElement("p");

        //button
        const btnDiv = document.createElement("div");
        btnDiv.classList.add("btn-div");
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");

        //checkbox with label
        const label = document.createElement("label");
        label.textContent = "Kontaktad";
        label.classList.add("checkbox-label");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkbox");
        checkbox.checked = message.contacted;

        //put label and checkbox together
        label.appendChild(checkbox);

        //set content for elements from data
        name.textContent = message.name;
        email.textContent = "E-post: " + message.email;
        customerMessage.textContent = message.message;
        createdAt.textContent = new Date(message.createdAt).toLocaleString();

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

        //update contacted-status
        checkbox.addEventListener("change", async () => {

            //get token from localStorage
            const token = localStorage.getItem("admin-token");

            //update status in database
            try {
                await fetch(`https://projekt-api-73oa.onrender.com/api/messages/${message._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify({ contacted: checkbox.checked })
                });
            } catch (error) {
                console.error("Kunde inte uppdatera status" + error);
            }
        });


        //delete message
        deleteBtn.addEventListener("click", async () => {
            console.log("meddelande raderat i databasen");

            const token = localStorage.getItem("admin-token");
            try {
                await fetch(`https://projekt-api-73oa.onrender.com/api/messages/${message._id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                });

                //remove message from DOM
                messageBox.remove();

            } catch (error) {
                console.error("Kunde inte radera meddelandet" + error);
            }
        });

        //put all the elements together
        messageBox.appendChild(email);
        messageBox.appendChild(customerMessage);
        messageBox.appendChild(createdAt);
        btnDiv.appendChild(label);
        btnDiv.appendChild(deleteBtn);
        messageBox.appendChild(btnDiv);
        messages.appendChild(messageBox);
    });
}