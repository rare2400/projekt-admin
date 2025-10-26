"use strict";


export async function fetchCategories() {
    //select element
    const categorySelect = document.getElementById("category");

    try {
        //fetch categories from API
        const response = await fetch("https://projekt-api-73oa.onrender.com/api/menu");
        if (!response.ok) throw new Error("Fel vid hämtning av kategorier:", response.status);

        //get the categories
        const dishes = await response.json();
        const categories = [...new Set(dishes.map(dish => dish.category))];

        //order of categories
        const menuOrder = [
            "Pizza klass 1",
            "Pizza klass 2",
            "Pizza klass 3",
            "Pizza klass 4",
            "Italian Pizza",
            "Sallad",
            "Kebab",
            "Hamburgare",
            "Såser",
            "Tillbehör",
            "Dryck"
        ];

        //order categories based on index in menuOrder array
        categories.sort((a, b) => menuOrder.indexOf(a) - menuOrder.indexOf(b));

        //clear existing options
        categorySelect.innerHTML = `<option value="" disabled selected>Välj kategori</option>`;

        //fill select element with options categories
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Fel vid hämtning av kategorier:", error);
    }
}