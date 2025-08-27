"use strict"

window.onload = init;

function init() {
    const url = "http://127.0.0.1:3000/api/menu";

    initForm(url);
}

//function to get the (dish)id from the url and init fetch to get data
async function initForm(url) {
    const form = document.getElementById("edit-dish");
    const urlParams = new URLSearchParams(window.location.search);
    const dishId = urlParams.get("id");

    //call fetchData if there is a dishId
    if (dishId) {
        form.dataset.editId = dishId;
        await fetchData(url, dishId, form);
    }

    //eventlistener to the form to submit updated data
    form.addEventListener("submit", function (e) {
        addUpdatedData(e, url, form);
    });
}

//fetch data for specific dish
async function fetchData(url, dishId) {
    try {
        const response = await fetch(`${url}/${dishId}`);

        if (!response.ok) throw new Error("Kunde inte hämta data");

        const data = await response.json();

        //fill form with the fetched data
        fillForm(data);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

//fetch input elements
let nameInput = document.getElementById("name");
let categoryInput = document.getElementById("category");
let ingredientsInput = document.getElementById("ingredients");
let priceInput = document.getElementById("price");

//fill the form with the fetched data
function fillForm(dish) {
    nameInput.value = dish.name;
    categoryInput.value = dish.category;
    ingredientsInput.value = dish.ingredients;
    priceInput.value = dish.price;
}

//function to update the data in the API
async function addUpdatedData(e, url, form) {
    e.preventDefault();

    const editId = form.dataset.editId;

    //create object with updated data
    const updatedData = {
        name: nameInput.value,
        category: categoryInput.value,
        ingredients: ingredientsInput.value,
        price: priceInput.value
    }

    const token = localStorage.getItem("admin-token");

    //fetch data and update the dish
    try {
        const response = await fetch(`${url}/${editId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) throw new Error("Kunde inte uppdatera rätten");

        const results = await response.json();
        console.log("Dish updated successfully:", results);

        const message = document.getElementById("msg");
        message.textContent = "Rätten har uppdaterats!";

        form.reset();

    } catch (error) {
        console.error("Error updating dish:", error);
    }
}