let doctors = [];
let specialities = [];
let cities = [];
let results = [];

function init() {
    fetchData();
}

function toggleDatalists(value1, value2) {
    let list1 = document.getElementById('datalist-field');
    let list2 = document.getElementById('datalist-location');
    list1.style.display = value1;
    list2.style.display = value2;
}

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

async function handleResponse(response) {
    let result = await response.json();
    console.log(result);

    if (result.status == 500) {
        showResultWrapper();
        showResult('error');
    } else {
        pushResultTodoctors(result);
    }
}

function pushResultTodoctors(result) {
    result.forEach(e => doctors.push(e));
    let set1 = new Set();
    doctors.forEach(e => e.specialities.forEach(a => set1.add(a)));
    specialities = Array.from(set1);
    let allCities = doctors.map(e => [`${e.zipcode}`, `${e.city}`]);
    let set2 = new Set(allCities.map(JSON.stringify));
    cities = Array.from(set2).map(JSON.parse);
}

function filterNameAndSpecialities() {
    let search = document.getElementById('field').value;
    search = search.toLowerCase();
    let datalist = document.getElementById('datalist-field');
    datalist.innerHTML = '';
    let specialitiesAvailable = false;
    let namesAvailable = false;

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

    datalist.innerHTML += `<div class="category">Namen</div>`;
    for (let index = 0; index < doctors.length; index++) {
        const element = doctors[index];
        if (element.first_name.toLowerCase().includes(search) || element.last_name.toLowerCase().includes(search) || element.title.toLowerCase().includes(search)) {
            namesAvailable = true;
            datalist.innerHTML += `<div class="data-elements" onmousedown="openResult(${element.id})">${element.title} ${element.first_name} ${element.last_name}</div>`;
        }
    }
    if (!namesAvailable) {
        datalist.innerHTML += `<div class="data-elements-none">kein Treffer</div>`;
    }
}

function filterLocation() {
    let search = document.getElementById('location').value;
    search = search.toLowerCase();
    let datalist = document.getElementById('datalist-location');
    datalist.innerHTML = '';
    let streetAvailable = false;
    let cityAvailable = false;

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

function openResult(id) {
    let index = id - 1;
    showResultWrapper();
    showResult(index);
}

function addResultToField(searchValue) {
    let search = document.getElementById('field');
    search.value = searchValue;
}

function addResultToLocation(searchValue) {
    let search = document.getElementById('location');
    search.value = `${searchValue[0]} ${searchValue[1]}`;
}

function showResultWrapper() {
    let resultWrapperElement = document.getElementById('resultwrapper');
    resultWrapperElement.classList.add('show');
}

function hideResultWrapper() {
    let resultWrapperElement = document.getElementById('resultwrapper');
    resultWrapperElement.classList.remove('show');
}

function showResult(value) {
    let resultElement = document.getElementById('results');
    resultElement.innerHTML = '';

    if (value == 'error') {
        resultElement.innerHTML = `<div style="color:red; text-align: center;"><h4>Ein Fehler ist aufgetreten. Bitte versuchen Sie es später nochmal.</h4></div>`;
    } if (value == 'no-result') {
        resultElement.innerHTML = `<div style="text-align: center;"><h4>Es wurden keine Treffer für Ihre Suche gefunden.</h4></div>`;
    } if (value == 'results') {
        results.forEach(e => {
            console.log(e);
            let index = e.id -1;
            resultElement.innerHTML += renderResultDetails(results, index);
        })
    }   else {
        resultElement.innerHTML = renderResultDetails(doctors, value);
    }
}

function renderResultDetails(array, value) {
    return `
    <div class="result-item">
        <div class="result-header" id="${array[value].id}">
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
        <div>
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
    </div>
    
    `;
}

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
    if(results.length > 0) {
        showResultWrapper();
        showResult('results');
    } else {
        showResultWrapper();
        showResult('no-result');
    }
}

function checkDoctors(str1, str2) {
    doctors.forEach(e => {
        for (let index = 0; index < str1.length; index++) {
            let element = str1[index];

            if (e.first_name.toLowerCase().includes(element) || e.last_name.toLowerCase().includes(element) || e.title.toLowerCase().includes(element)) {
                if (checkAdress(e, str2)) {
                    results.push(e);
                }
            }

            e.specialities.forEach(s => {
                if (s.toLowerCase().includes(element)) {
                    if (checkAdress(e, str2) && !checkIfIsInResults(element)) {
                        results.push(e);
                    }
                }
            })
        }


    });
}

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


function checkIfIsInResults(element) {
    let found = results.filter(e => e.id == element.id);
    return found.length;
}