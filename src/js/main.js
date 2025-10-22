"use strict";

window.onload = init;

const menu = document.getElementById("menu");
const btnConatiner = document.getElementById("filter-btns");

//array for the dishes in the API
let dishes = [];

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
        const response = await fetch("https://projekt-api-73oa.onrender.com/api/menu");

        if (response.ok) {
            const data = await response.json();
            dishes = data;

            //create filterbuttons from categories in the fetched data
            createFilterBtns(dishes);

            //display the menu
            displayMenu(dishes);
        } else {
            console.error("Fel vid hämtning:", response.status);
        }
    } catch (error) {
        console.log("Error fetching data:", error);
    }
}

//create filterbuttons
function createFilterBtns(data) {
    btnConatiner.innerHTML = "";

    //get unique categories from data
    const categories = [...new Set(data.map(dish => dish.category))];

    //button showing all dishes
    const allBtn = document.createElement("button");
    allBtn.textContent = "Visa alla";
    allBtn.dataset.category = "";
    btnConatiner.appendChild(allBtn);

    //create buttons för every unique category
    categories.forEach(category => {
        const btn = document.createElement("button");
        btn.textContent = category;
        btn.dataset.category = category;
        btnConatiner.appendChild(btn);
    });

    //add eventlistener to buttons
    const filterBtns = btnConatiner.querySelectorAll("button");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            applyFilter(btn.dataset.category);

            //activate style on clicked button
            activateBtn(btn)
        });
    });
}

//add style on active button
function activateBtn(activeBtn) {
    const filterBtn = document.querySelectorAll("#filter-btns button");
    filterBtn.forEach(btn => btn.classList.remove("active"));
    activeBtn.classList.add("active");
}


//apply filter to menu
function applyFilter(category) {

    if (category === "") {
        displayMenu(dishes);
    } else {
        const filteredDishes = dishes.filter(dish => dish.category === category);
        displayMenu(filteredDishes);
    }
}

//display fetched menu from API
function displayMenu(data) {
    menu.innerHTML = "";

    if (data.length === 0) {
        menu.textContent = "Det finns inga rätter att visa";
        return;
    }


    const menuOrder = [
        "Pizza klass 1",
        "Pizza klass 2",
        "Pizza klass 3",
        "Pizza klass 4",
        "Italian Pizza",
        "Sallad",
        "Kebab",
        "Hamburger",
        "Sauce",
        "Sides",
        "Dryck"
    ];

    //sort the data based on the menuOrder array index defined above
    data.sort((a, b) => {
        const indexA = menuOrder.indexOf(a.category);
        const indexB = menuOrder.indexOf(b.category);

        //sort dishes outside of the menuOrder array to the end
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    })

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

        //if there are ingredients, set textcontent, else set it to empty string
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
                await fetch(`https://projekt-api-73oa.onrender.com/api/menu/${dish._id}`, {
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
