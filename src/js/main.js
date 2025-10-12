"use strict";

window.onload = init;

const menu = document.getElementById("menu");
//nav-menu elements
let header = document.querySelector("header");
let navMenuEl = document.getElementById("nav-menu");
let openBtn = document.getElementById("open-menu");
let closeBtn = document.getElementById("close-menu");

function init() {
    if (menu) {
        fetchMenu();
    }

    //logout-function
    const logOutBtn = document.querySelector(".log-out-btn");

    if (logOutBtn) {
        logOutBtn.addEventListener("click", () => {
            localStorage.removeItem("admin-token");
            window.location.href = "index.html";
        });
    }
}

//eventlisteners
openBtn.addEventListener('click', toggleMenu);
closeBtn.addEventListener('click', toggleMenu);

function toggleMenu() {
    header.classList.toggle("menu-open");
    navMenuEl.classList.toggle("active");
}

//fetch menu from API
async function fetchMenu() {
    try {
        const response = await fetch("http://127.0.0.1:3000/api/menu")

        if (response.ok) {
            const data = await response.json();
            displayMenu(data);
        }
    } catch (error) {
        console.log("Error fetching data:", error);
    }
}

//display fetched menu from API
async function displayMenu(data) {
    menu.innerHTML = "";

    if (data.length === 0) {
        menu.textContent = "Det finns inga inlägg att visa";
        return;
    }

    //loop data and create elements for menu-items
    data.forEach(dish => {
        const dishBox = document.createElement("div");
        dishBox.classList.add("dish-box");
        const name = document.createElement("h2");

        const nameAndPrice = document.createElement("div");
        nameAndPrice.classList.add("name-and-price");

        const ingredients = document.createElement("p");
        ingredients.classList.add("ingredients");

        const price = document.createElement("p");
        price.classList.add("price");

        const btnDiv = document.createElement("div");
        btnDiv.classList.add("btn-div");
        const changeBtn = document.createElement("button");
        changeBtn.classList.add("change-btn");
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");

        //set content for elements from data
        name.textContent = dish.name;

        if (dish.ingredients) {
            ingredients.textContent = dish.ingredients;
        } else {
            ingredients.textContent = "";
        }

        price.textContent = dish.price + " kr";

        //set text for buttons
        changeBtn.textContent = "Ändra";
        deleteBtn.textContent = "Ta bort";

        //eventlisteners for buttons
        changeBtn.addEventListener("click", () => {
            window.location.href = `edit-dish.html?id=${dish._id}`;
        });

        //delete dish
        deleteBtn.addEventListener("click", async () => {
            console.log("rätt raderad i databasen");

            const token = localStorage.getItem("admin-token");
            try {
                await fetch(`http://127.0.0.1:3000/api/menu/${dish._id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                });

                //remove the dish from the DOM
                dishBox.remove();

            } catch (error) {
                console.error("Kunde inte uppdatera status" + error);
            }
        });


        //put the elements together
        nameAndPrice.appendChild(name);
        nameAndPrice.appendChild(price);
        dishBox.appendChild(nameAndPrice);
        dishBox.appendChild(ingredients);
        btnDiv.appendChild(changeBtn);
        btnDiv.appendChild(deleteBtn);
        dishBox.appendChild(btnDiv);

        menu.appendChild(dishBox);
    });
}
