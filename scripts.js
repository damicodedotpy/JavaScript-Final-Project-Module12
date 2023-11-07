// Get category name
let categoryName = document.getElementById("databaseSelector");
// Get movie/serie title name 
let titleName = document.getElementById("title");
// Get search button
let button = document.getElementById("button");
// Get the ul list that cointains the titles matched
let ulList = document.getElementById("ulList");
// Store search coincidences
let coincidences = [];
// Store database
let database;




// This function prevents the input of numbers and symbols in a text input field
function checkKey(event) {
    // Validate if the key pressed is different than letter, space o delete
    if (!(
        (event.keyCode >= 65 && event.keyCode <= 90) || 
        (event.keyCode >= 97 && event.keyCode <= 122))) {
            if (!(
                (event.keyCode === 32) || 
                (event.keyCode === 8))) {
                    event.preventDefault()
        }
    }
}

// This function return the data from a given .json file and get the coincidences with the inputted title
function databaseLoader() {
    // Make the url of the right .json file
    var databaseJSONurl = `./static/src/${categoryName.value}.json`;

    // Take the data of the .json file and return it
    fetch(databaseJSONurl)
    .then(database => database.json())
    .then((output) => {
        database = output;
        getCoincidences(database);
    })
}

// This function finds the coincidences of a given title name VS the titles stored in a database
function getCoincidences(database) {
    // Reset the list of coincidences
    coincidences = [];
    // Iterate over the titles containes on the given database
    for (let content of database["data"]) {
        // Check if the title name iterated coincide with the title name provided
        if ((content["nombre"] === titleName.value.toUpperCase()) || 
            content["nombre"].startsWith(titleName.value.toUpperCase())) {
            // If does, then add that title to the list of coincidences
            coincidences.push(content);
        }
    }
    // Fill the ul list with the coincidenes founded
    listTitles()
}

// This function fill the ul list with all the coincidences founded
function listTitles() {
    // Restart the ul list to clean it
    while (ulList.firstChild) {
        ulList.removeChild(ulList.firstChild);
    }
    
    // Iterate over the list of coincidences to create li element for the ul list
    for (let title of coincidences) {
        // Create a new li element with the name of the coincidence iterated
        var newTitle = document.createElement("li");
        // Create a new p element with the sinopsis of the coincidence iterated
        var sinopsis = document.createElement("p");
        
        // Fill the li with the name of the coincidence founded
        newTitle.textContent = title["nombre"];
        // Fill the p with the sinopsis of the coincidence founded
        sinopsis.textContent = title["sinopsis"]
        // Add the p element to the il element created
        newTitle.appendChild(sinopsis)
        // Add the li element to the ul list of the html
        ulList.appendChild(newTitle);
        // Hidde sinopsis by default
        sinopsis.style.display = "none";
        // Show on screen the content sinopsis when 'mouseover' event occurs
        newTitle.addEventListener("mouseover", function() {
            this.children[0].style = "display: block;";
        });
        // Hide from screen the content sinopsis when 'mouseover' event occurs
        newTitle.addEventListener("mouseout", function() {
            this.children[0].style = "display: none;"
        });
    }
}




// Add a "keydown" listener to the text input html field
titleName.addEventListener("keydown", checkKey)

// Load the correct database according to the cathegory selected
button.addEventListener("click", databaseLoader);

    // Add a "change" listener to the select html element
    categoryName.addEventListener("change", function() {
        // Get the pure text of the category name
        var name = categoryName.value;
        // Create a custome event whith a message
        var customEvent = new CustomEvent("alertMessage", 
        {
            detail: { message: `Se ha seleccionado ${name}` }
        });
        // Trigger the event when select is triggered.
        categoryName.dispatchEvent(customEvent);
});

    // Show alert when the custom event "alertMessage" is listened
    categoryName.addEventListener("alertMessage", function(event) {
    alert(event.detail.message);
})