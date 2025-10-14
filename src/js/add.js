"use strict";

const addDish = document.getElementById("add-dish");

if (addDish) {
    addDish.addEventListener("submit", createDish);
} else {
    console.log("addDish form not found");
}

//create a new dish
async function createDish(e) {
    e.preventDefault();

    //fetch input values
    let nameInput = document.getElementById("name").value;
    let catergoryInput = document.getElementById("category").value;
    let ingredientsInput = document.getElementById("ingredients").value;
    let priceInput = document.getElementById("price").value;
    let errorMsg = document.getElementById("error-msg");

    //validate required input
    if (!nameInput) {
        errorMsg.textContent = "Fyll i alla namnet på rätten!";
        return;
    }

    if (!catergoryInput) {
        errorMsg.textContent = "Välj kategori!";
        return;
    }

    if (!priceInput) {
        errorMsg.textContent = "Fyll i pris!";
        return;
    }

    let dish = {
        name: nameInput,
        category: catergoryInput,
        ingredients: ingredientsInput,
        price: priceInput
    }

    const token = localStorage.getItem("admin-token");

    //POST new dish to API
    try {
        const response = await fetch("https://projekt-api-73oa.onrender.com/api/menu", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(dish)
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);

            //message to user
            errorMsg.textContent = "Rätten är tillagd!";

            //clear form
            addDish.reset();

        } else {
            errorMsg.textContent = "Ett fel uppstod vid uppladdning av rätt";
            throw new Error("Dish creation failed");
        }

    } catch (error) {
        console.log("Något blev fel när rätten lades till:", error);
        errorMsg.textContent = "Ett fel uppstod vid uppladdning av rätten";
    }
}