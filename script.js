let resultArray = [];
let specialities = [];

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
    }

    pushResultToResultArray(result);
}

function pushResultToResultArray(result) {
    result.forEach(e => resultArray.push(e));
    let set1 = new Set();
    resultArray.forEach(e => e.specialities.forEach(a => set1.add(a)));
    specialities = Array.from(set1);
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
    if(!specialitiesAvailable) {
        datalist.innerHTML += `<div class="data-elements-none">kein Treffer</div>`;
    }

    datalist.innerHTML += `<div class="category">Namen</div>`;
    for (let index = 0; index < resultArray.length; index++) {
        const element = resultArray[index];
        if (element.first_name.toLowerCase().includes(search) || element.last_name.toLowerCase().includes(search)) {
            namesAvailable = true;
            datalist.innerHTML += `<div class="data-elements" onmousedown="openResult(${element.id})">${element.title} ${element.first_name} ${element.last_name}</div>`;
        }
    }
    if(!namesAvailable) {
        datalist.innerHTML += `<div class="data-elements-none">kein Treffer</div>`;
    }
}

function filterLocation() {
    let search = document.getElementById('location').value;
    search = search.toLowerCase();
    let datalist = document.getElementById('datalist-location');
    datalist.innerHTML = '';
    let locationAvailable = false;

    datalist.innerHTML += `<div class="category">Anschrift</div>`;
    for (let index = 0; index < resultArray.length; index++) {
        let element = resultArray[index];

        if (element.zipcode.includes(search) || element.city.toLowerCase().includes(search) || element.street.toLowerCase().includes(search)) {
            locationAvailable = true;
            datalist.innerHTML += `<div class="data-elements" onmousedown="addResultToLocation(${element.id})">${element.street}, ${element.zipcode} ${element.city}</div>`;
        }
    }
    if(!locationAvailable) {
        datalist.innerHTML += `<div class="data-elements-none">kein Treffer</div>`;
    }
}

function openResult(value) {
    console.log(value);
}

function addResultToField(searchValue) {
    let search = document.getElementById('field');
    search.value = searchValue;
}

function addResultToLocation(searchValue) {
    let search = document.getElementById('location');
    let index = resultArray.map(e => e.id).indexOf(searchValue);
    search.value = `${resultArray[index].street}, ${resultArray[index].zipcode} ${resultArray[index].city}`;
}

function showResultWrapper() {
    let resultWrapperElement = document.getElementById('resultwrapper');
    resultWrapperElement.style.display = "block";
}

function hideResultWrapper() {
    let resultWrapperElement = document.getElementById('resultwrapper');
    resultWrapperElement.style.display = "none";
}

function showResult(text) {
    let resultElement = document.getElementById('results');

    if (text == 'error') {
        resultElement.innerHTML = `<div style="color:red; text-align: center;"><h4>Ein Fehler ist aufgetreten. Bitte veruschen Sie es später nochmal.</h4></div>`;
    } else {
        resultElement.innerHTML = `${text[0].title}`;
    }
}

function searchDoctor() {
    console.log('search');
}