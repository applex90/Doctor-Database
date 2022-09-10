/**
 * Initialize variables.
 * 
 */
let doctors = [];
let specialities = [];
let cities = [];
let results = [];

/**
 * Initial function which is called onload.
 * 
 */
function init() {
    fetchData();
}

/**
 * Fetched the data from URL and catched error.
 * 
 */
async function fetchData() {
    let url = 'https://alexander-bachmann.developerakademie.net/doctordatabase/get_doctors.php';

    try {
        let response = await fetch(url);
        if (response.status == 200 && response.ok == true) {
            handleResponse(response);

        } else {
            throw 'error'
        }

    } catch (e) {
        showResultWrapper();
        showResult('error');
    }
}

/**
 * Handled the response of fetch.
 * 
 * @param {Promise} response 
 */
async function handleResponse(response) {
    let result = await response.json();

    if (result.status == 500) {
        showResultWrapper();
        showResult('error');
    } else {
        pushResultToDoctorsArray(result);
    }
}


/**
 * The function creates arrays with unique data. To later handle search.
 * 
 * @param {Array} result 
 */
function pushResultToDoctorsArray(result) {
    result.forEach(e => doctors.push(e));
    let set1 = new Set();
    doctors.forEach(e => e.specialities.forEach(a => set1.add(a)));
    specialities = Array.from(set1);
    let allCities = doctors.map(e => [`${e.zipcode}`, `${e.city}`]);
    let set2 = new Set(allCities.map(JSON.stringify));
    cities = Array.from(set2).map(JSON.parse);
}

/**
 * This function creates the data list for first input-field, depending on input value.
 * 
 */
function filterNameAndSpecialities() {
    let search = document.getElementById('field').value;
    search = search.toLowerCase();

    let datalist = document.getElementById('datalist-field');
    datalist.innerHTML = '';

    let specialitiesAvailable = false;
    let namesAvailable = false;

    createCategorySpecialities(datalist, specialitiesAvailable, search);
    createCategoryNames(datalist, namesAvailable, search);
}


/**
 * The function is rendering the html for the first data list (category "Fachgebiete").
 * 
 * @param {HTMLElement} datalist 
 * @param {boolean} specialitiesAvailable 
 * @param {string} search 
 */
function createCategorySpecialities(datalist, specialitiesAvailable, search) {
    datalist.innerHTML += `<div class="category">Fachgebiet</div>`;
    for (let index = 0; index < specialities.length; index++) {
        let element = specialities[index];

        if (element.toLowerCase().includes(search)) {
            specialitiesAvailable = true;
            datalist.innerHTML += `<div class="data-elements" onmousedown="addResultToField('${element}')">${element}</div>`;
        }
    }

    if (!specialitiesAvailable) {
        datalist.innerHTML += `<div class="data-elements-none">kein Treffer</div>`;
    }
}


/**
 * The function is rendering the html for the first data list (category "Namen").
 * 
 * @param {HTMLElement} datalist 
 * @param {boolean} namesAvailable 
 * @param {string} search 
 */
function createCategoryNames(datalist, namesAvailable, search) {
    datalist.innerHTML += `<div class="category">Namen</div>`;
    for (let index = 0; index < doctors.length; index++) {
        const element = doctors[index];

        if (searchIsIncludedInFirstnameLastnameTitle(element, search)) {
            namesAvailable = true;
            datalist.innerHTML += `<div class="data-elements" onmousedown="openResult(${element.id})">${element.title} ${element.first_name} ${element.last_name}</div>`;
        }
    }

    if (!namesAvailable) {
        datalist.innerHTML += `<div class="data-elements-none">kein Treffer</div>`;
    }
}


/**
 * The function returned a boolen depending on searchresult.
 * 
 * @param {Object} element 
 * @param {string} search 
 * @returns 
 */
function searchIsIncludedInFirstnameLastnameTitle(element, search) {
    return element.first_name.toLowerCase().includes(search) || element.last_name.toLowerCase().includes(search) || element.title.toLowerCase().includes(search);
}

/**
 * This function creates the data list for second input-field, depending on input value.
 * 
 */
function filterLocation() {
    let search = document.getElementById('location').value;
    search = search.toLowerCase();

    let datalist = document.getElementById('datalist-location');
    datalist.innerHTML = '';

    let streetAvailable = false;
    let cityAvailable = false;

    createCategoryStreet(datalist, streetAvailable, search);
    createCategoryCity(datalist, cityAvailable, search);
}


/**
 * The function is rendering the html for the second data list (category "Straße").
 * 
 * @param {HTMLElement} datalist 
 * @param {boolean} streetAvailable 
 * @param {string} search 
 */
function createCategoryStreet(datalist, streetAvailable, search) {
    datalist.innerHTML += `<div class="category">Straße</div>`;
    for (let index = 0; index < doctors.length; index++) {
        let element = doctors[index];

        if (element.zipcode.includes(search) || element.city.toLowerCase().includes(search) || element.street.toLowerCase().includes(search)) {
            streetAvailable = true;
            datalist.innerHTML += `<div class="data-elements" onmousedown="openResult(${element.id})">${element.street}, ${element.zipcode} ${element.city}</div>`;
        }
    }
    if (!streetAvailable) {
        datalist.innerHTML += `<div class="data-elements-none">kein Treffer</div>`;
    }
}


/**
 * The function is rendering the html for the second data list (category "Ort").
 * 
 * @param {HTMLElement} datalist 
 * @param {boolean} cityAvailable 
 * @param {string} search 
 */
function createCategoryCity(datalist, cityAvailable, search) {
    datalist.innerHTML += `<div class="category">Ort</div>`;
    for (let index = 0; index < cities.length; index++) {
        let element = cities[index];

        if (element[0].includes(search) || element[1].toLowerCase().includes(search)) {
            cityAvailable = true;
            datalist.innerHTML += `<div class="data-elements" onmousedown="addResultToLocation(['${element[0]}', '${element[1]}'])">${element[0]} ${element[1]}</div>`;
        }
    }
    if (!cityAvailable) {
        datalist.innerHTML += `<div class="data-elements-none">kein Treffer</div>`;
    }
}

/**
 * Toggle the datalist onblur or onfucus of input fields.
 * 
 * @param {string} value1 - 'block' or 'none'
 * @param {string} value2 - 'block' or 'none'
 */
function toggleDatalists(value1, value2) {
    let list1 = document.getElementById('datalist-field');
    let list2 = document.getElementById('datalist-location');
    list1.style.display = value1;
    list2.style.display = value2;
}

/**
 * This function is called if an element of datalist is clicked.
 * 
 * @param {number} id 
 */
function openResult(id) {
    let index = id - 1;
    showResultWrapper();
    showResult(index);
}

/**
 * This function adds the selected result to input field - field for name, specialities.
 * 
 * @param {string} searchValue 
 */
function addResultToField(searchValue) {
    let search = document.getElementById('field');
    search.value = searchValue;
}

/**
 * This function adds the selected result to input field - field for location.
 * 
 * @param {string} searchValue 
 */
function addResultToLocation(searchValue) {
    let search = document.getElementById('location');
    search.value = `${searchValue[0]} ${searchValue[1]}`;
}

/**
 * This function shows the result-wrapper.
 * 
 */
function showResultWrapper() {
    let resultWrapperElement = document.getElementById('resultwrapper');
    resultWrapperElement.classList.add('show');
}


/**
 * This function hides the result-wrapper.
 * 
 */
function hideResultWrapper() {
    let resultWrapperElement = document.getElementById('resultwrapper');
    resultWrapperElement.classList.remove('show');
}

/**
 * This function shows the result, depending on the input value.
 * 
 * @param {string, number} value 
 */
function showResult(value) {
    let resultElement = document.getElementById('results');
    resultElement.innerHTML = '';

    if (value == 'error') {
        resultElement.innerHTML = `<div style="color:red; text-align: center;"><h4>Ein Fehler ist aufgetreten. Bitte versuchen Sie es später nochmal.</h4></div>`;
    }

    if (value == 'no-result') {
        resultElement.innerHTML = `<div style="text-align: center;"><h4>Es wurden keine Treffer für Ihre Suche gefunden.</h4></div>`;
    }

    if (value == 'results') {
        results.forEach(e => {
            let index = e.id - 1;
            resultElement.innerHTML += renderResultDetails(doctors, index);
        })
    }

    if (value >= 0) {
        resultElement.innerHTML = renderResultDetails(doctors, value);
    }
}

/**
 * This function renders the html for result details.
 * 
 * @param {array} array 
 * @param {number} value 
 * @returns 
 */
function renderResultDetails(array, value) {
    return `
    <div class="result-item">
        <div class="result-header">
        <img src="${array[value].img}">
        <div>
            <h2>${array[value].title} ${array[value].first_name} ${array[value].last_name}</h2>
            <h4>${array[value].specialities.join(', ')}</h4>
        </div>
        </div>
        <div>
        <h3><div class="material-symbols-outlined">location_on</div><div>Adresse</div></h3>
            <div class="location">
            <div>${array[value].street}</div>
            <div>${array[value].zipcode} ${array[value].city}</div>
        </div>
        </div>
        <div class="expand-panel" onclick="expand(${array[value].id})">
        <span class="material-symbols-outlined" id="btn-${array[value].id}">expand_more</span></div>
        <div class="panel" id="${array[value].id}">
        <h3><div class="material-symbols-outlined">schedule</div><div>Sprechzeiten</div></h3>
            <div class="opening-hours">
            <table>
                <tr>
                    <td>Montag</td>
                    <td>${array[value].opening_hours.monday}</td>
                </tr>
                <tr>
                    <td>Dienstag</td>
                    <td>${array[value].opening_hours.tuesday}</td>
                </tr>
                <tr>
                    <td>Mittwoch</td>
                    <td>${array[value].opening_hours.wednesday}</td>
                </tr>
                <tr>
                    <td>Donnerstag</td>
                    <td>${array[value].opening_hours.thursday}</td>
                </tr>
                <tr>
                    <td>Freitag</td>
                    <td>${array[value].opening_hours.friday}</td>
                </tr>
                <tr>
                    <td>Samstag</td>
                    <td>${array[value].opening_hours.saturday}</td>
                </tr>
                <tr>
                    <td>Sonntag</td>
                    <td>${array[value].opening_hours.sunday}</td>
                </tr>
            </table>
        </div>
        </div>
    </div>`;
}


/**
 * The function starts the search (onsubmit) depending on input values.
 * 
 */
function searchDoctor() {
    results = [];
    let field = document.getElementById('field');
    let location = document.getElementById('location');
    let fieldValue = field.value;
    let locationValue = location.value;
    field.value = '';
    location.value = '';
    let searchString1 = `${fieldValue}`;
    searchString1 = searchString1.toLowerCase();
    let searchString2 = `${locationValue}`;
    searchString2 = searchString2.toLowerCase();
    let splitStringAsArray1 = searchString1.split(' ').filter(e => e != '');
    let splitStringAsArray2 = searchString2.split(' ').filter(e => e != '');

    checkDoctors(splitStringAsArray1, splitStringAsArray2);
    console.log(results);
    if (results.length > 0) {
        showResultWrapper();
        showResult('results');
    } else {
        showResultWrapper();
        showResult('no-result');
    }
}

/**
 * This function iterates through all elements and looks for the input value.
 * 
 * @param {array} str1 - searchstrings of first field
 * @param {array} str2 - searchstrings of second field
 */
function checkDoctors(str1, str2) {
    doctors.forEach(e => {
        for (let index = 0; index < str1.length; index++) {
            let element = str1[index];

            checkIfValuesIncludesSearch(e, element, str2);
            e.specialities.forEach(s => {
                if (s.toLowerCase().includes(element)) {
                    if ((checkAdress(e, str2)) && (!checkIfIsInResults(e))) {
                        results.push(e);
                    }
                }
            })
        }
    })
}

/**
 * The function checks if the inputstrings of the first field exists in doctors.
 * 
 * @param {object} e 
 * @param {object} element 
 * @param {array} str2 
 */
function checkIfValuesIncludesSearch(e, element, str2) {
    if (e.first_name.toLowerCase().includes(element) || e.last_name.toLowerCase().includes(element) || e.title.toLowerCase().includes(element)) {
        if (checkAdress(e, str2) && !checkIfIsInResults(e)) {
            results.push(e);
        }
    }
}

/**
 * This function checks if the searchstring of the second input matches with doctors array.
 * 
 * @param {object} e 
 * @param {array} str2 
 * @returns 
 */
function checkAdress(e, str2) {
    for (let index = 0; index < str2.length; index++) {
        let element = str2[index];

        if (e.street.toLowerCase().includes(element) || e.zipcode.toLowerCase().includes(element) || e.city.toLowerCase().includes(element)) {
            return true;
        } else {
            return false;
        }
    }
}

/**
 * The functio check if the element already exists in array.
 * 
 * @param {object} element 
 * @returns - lenght of filter result.
 */
function checkIfIsInResults(element) {
    let found = results.filter(e => e.id == element.id);
    return found.length;
}


/**
 * The function expands or collapses the selected result.
 * 
 * @param {number} i 
 */
function expand(i) {
    let panelElement = document.getElementById(i);
    let panelButton = document.getElementById(`btn-${i}`);

    if (panelElement.style.maxHeight) {
        panelElement.style.maxHeight = null;
        panelButton.innerHTML = 'expand_more';

    } else {
        panelElement.style.maxHeight = panelElement.scrollHeight + "px";
        panelButton.innerHTML = 'expand_less';
    }
}