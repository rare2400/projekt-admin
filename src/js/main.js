"use strict";

window.onload = init;

const menu = document.getElementById("menu");

function init() {
    if (menu) {
        fetchPosts();
    }
}

//fetch posts from API
async function fetchPosts() {
    try {
        const response = await fetch("http://127.0.0.1:3000/api/menu")

        if (response.ok) {
            const data = await response.json();
            displayPosts(data);
        }
    } catch (error) {
        console.log("Error fetching data:", error);
    }
}

//display fetched posts from API
async function displayPosts(data) {
    menu.innerHTML = "";
    
    if(data.length === 0) {
        menu.textContent = "Det finns inga inlägg att visa";
        return;
    }

    //loop data and create elements for menu-items
    data.forEach(dish => {
        const dishBox = document.createElement("div");
        dishBox.classList.add("dish-box");
        const name = document.createElement("h3");
        const ingredients = document.createElement("p");
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
        ingredients.textContent = dish.ingredients;
        price.textContent = dish.price + " kr";

        //set text for buttons
        changeBtn.textContent = "Ändra";
        deleteBtn.textContent = "Ta bort";

        //put the elements together
        dishBox.appendChild(name);
        dishBox.appendChild(ingredients);
        dishBox.appendChild(price);
        btnDiv.appendChild(changeBtn);
        btnDiv.appendChild(deleteBtn);
        dishBox.appendChild(btnDiv);

        menu.appendChild(dishBox);
    });
}
