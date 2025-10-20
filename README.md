# Frontend-applikation för pizzeria
En frontend-applikation skapad för att administrera en pizzerias webbplats med krav på att vara inloggad. Som autentiserad användare kan man se menyn och
lägga till, ändra och ta bort rätter i den. Auktoriserade användare kan även se meddelanden eller frågor från kunder och se status om de fått återkoppling
ännu eller inte. [Publicerad applikation](https://pizzeriavenedig-admin.netlify.app/)  kräver inloggningsuppgifter för att komma vidare från inloggningssidan. Applikationen använder HTML, JavaScript, Parcel 
och SASS (SCSS), samt är kopplad till en RESTful webbtjänst. API:et erhåller data genom dokumentdatabasen MongoDB (se [API](https://projekt-api-73oa.onrender.com/api/menu) 
och [API repo](https://github.com/rare2400/projekt-api) ). 

## Funktioner
- Lista rätter i en meny
- Lägga till rätter i menyn
- Ändra information om rätter
- Ta bort rätter
- Se inskickade meddelanden/frågor
- Ta bort inskickade meddelanden/frågor
- Se om person som skrivit meddelande blivit kontaktad
- SCSS för förbättrad struktur av CSS
- Kommunicerar med API via `fetch` tillsammans med `async/await` och `try/catch`:
```js
async function fetchMenu() {
    try {
        const response = await fetch("https://projekt-api-73oa.onrender.com/api/menu")

        if (response.ok) {
            const data = await response.json();
            dishes = data;
            displayMenu(dishes);
        }
    } catch (error) {
        console.log("Error fetching data:", error);
    }
}
```

## Verktyg
- HTML5
- JavaScript
- Parcel
- SASS/SCSS
- REST-webbtjänst (eget API)

## Installation
1. **Klona repot:**
```bash
git clone https://github.com/rare2400/projekt-admin.git
cd projekt-admin
```

2. **Installera paket:**
```bash
npm install
```

3. **starta utvecklingsserver:**
```bash
npm run start
```

4. **Applikation körs på** `http://localhost:1234`

## Bygga för produktion
```bash
npm run build
```

## Skapad av
Skapad som en del av en projektuppgift   
Mittuniversitetet, Webbutvecklingsprogrammet    
Ramona Reinholdz      
[rare2400@student.miun.se](rare2400@student.miun.se)      
2025-10-20
