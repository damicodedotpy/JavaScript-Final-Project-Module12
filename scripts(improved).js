window.onload = function () {
  // Get category name
  let selectCategoryInput = document.getElementById('databaseSelector');
  let categoryName;
  // Get movie/serie title name
  let searchInput = document.getElementById('title');
  // Get search button
  let button = document.getElementById('button');
  // Get the ul list that cointains the titles matched
  let ulList = document.getElementById('ulList');

  // This function prevents the input of numbers and symbols in a text input field
  function checkKey(event) {
    // Validate if the key pressed is different than letter, space o delete
    if (
      !(
        (event.keyCode >= 65 && event.keyCode <= 90) ||
        (event.keyCode >= 97 && event.keyCode <= 122)
      )
    ) {
      if (!(event.keyCode === 32 || event.keyCode === 8)) {
        event.preventDefault();
      }
    }
  }

  // This function return the data from a given .json file and get the coincidences with the inputted title
  function databaseLoader() {
    // Make the url of the right .json file
    const databaseJSONurl = `./static/src/${categoryName}.json`;

    // Take the data of the .json file and return it
    fetch(databaseJSONurl)
      .then((database) => database.json())
      .then((database) => {
        const coincidences = getCoincidences(database.data);
        // Fill the ul list with the coincidenes founded
        listTitles(coincidences);
      });
  }

  // This function finds the coincidences of a given title name VS the titles stored in a database
  function getCoincidences(data) {
    const search = searchInput.value.toUpperCase();
    return data.filter(
      ({ nombre }) => nombre === search || nombre.startsWith(search)
    );
  }

  // This function fill the ul list with all the coincidences founded
  function listTitles(coincidences) {
    // Restart the ul list to clean it
    while (ulList.firstChild) {
      ulList.removeChild(ulList.firstChild);
    }

    // Iterate over the list of coincidences to create li element for the ul list
    for (let { nombre, sinopsis } of coincidences) {
      // Create a new p element with the sinopsis of the coincidence iterated
      var paragraph = document.createElement('p');
      // Fill the p with the paragraph of the coincidence founded
      paragraph.textContent = sinopsis;
      // Hidde paragraph by default
      paragraph.style.display = 'none';

      // Create a new li element with the name of the coincidence iterated
      var tagLi = document.createElement('li');
      // Fill the li with the name of the coincidence founded
      tagLi.textContent = nombre;
      // Add the p element to the il element created
      tagLi.appendChild(paragraph);
      // Show on screen the content sinopsis when 'mouseover' event occurs
      tagLi.addEventListener('mouseover', function () {
        this.children[0].style = 'display: block;';
      });
      // Hide from screen the content sinopsis when 'mouseover' event occurs
      tagLi.addEventListener('mouseout', function () {
        this.children[0].style = 'display: none;';
      });

      // Add the li element to the ul list of the html
      ulList.appendChild(tagLi);
    }
  }

  // Add a "keydown" listener to the text input html field
  searchInput.addEventListener('keydown', checkKey);

  // Load the correct database according to the cathegory selected
  button.addEventListener('click', databaseLoader);

  // Add a "change" listener to the select html element
  selectCategoryInput.addEventListener('change', function () {
    // Get the pure text of the category name
    var name = selectCategoryInput.value;
    categoryName = name;
    // Create a custome event whith a message
    var customEvent = new CustomEvent('alertMessage', {
      detail: { message: `Se ha seleccionado ${name}` },
    });
    // Trigger the event when select is triggered.
    selectCategoryInput.dispatchEvent(customEvent);
  });

  // Show alert when the custom event "alertMessage" is listened
  selectCategoryInput.addEventListener('alertMessage', function (event) {
    alert(event.detail.message);
  });
};
