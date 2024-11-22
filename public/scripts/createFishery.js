const map = new MapBox();

map.onclick((e) => {


    map.removeDefaultMarkers();
    map.setDefaultMarker([e.lngLat.lng, e.lngLat.lat]);
});


async function loadSelects() {
    const selectHarbor = document.getElementById("harbor");
    const selectBoat = document.getElementById("boat");

    const reqHarbors = await fetch("/harbor");

    if (!reqHarbors.ok) {
        return setModal("Erro ao carregar portos", "Tente novamente mais tarde...", "error");
    }

    const resHarbors = await reqHarbors.json();

    selectHarbor.innerHTML += resHarbors.map(harbor => {
        return `<option longitude="${harbor.longitude}" latitude="${harbor.latitude}" value="${harbor.idHarbor}">${harbor.name}</option>`;
    }).join("");


    const reqBoats = await fetch("/boat/get");

    if (!reqBoats.ok) {
        return setModal("Erro ao carregar barcos", "Tente novamente mais tarde...", "error");
    }

    const resBoats = await reqBoats.json();

    selectBoat.innerHTML += resBoats.map(boat => {
        return `<option value="${boat.idBoat}">${boat.name}</option>`;
    }).join("");
}

loadSelects();

function showSelectedHarborInMap(event) {
    map.removeHarborMarkers();

    const longitude = event.target.selectedOptions[0].getAttribute("longitude");
    const latitude = event.target.selectedOptions[0].getAttribute("latitude");

    map.setHarborMarker([longitude, latitude]);
}


const harborSelect = document.getElementById("harbor");
harborSelect.onchange = (event) => {
    showSelectedHarborInMap(event);
};


function isChecked(event, id) {
    const inputRadio = document.getElementById(event.target.htmlFor);

    document.querySelectorAll(`#${id} label`).forEach(label => {
        label.classList.remove("checked");
    })

    if (!inputRadio.checked) {
        event.target.classList.add("checked");
    }
}


function validateData() {
    const description = document.getElementById("description").value;
    const harbor = document.getElementById("harbor").value;
    const boat = document.getElementById("boat").value;
    const departureDate = document.getElementById("departure-date").value;
    const departureTime = document.getElementById("departure-time").value;
    const returnDate = document.getElementById("return-date").value;
    const returnTime = document.getElementById("return-time").value;
    const price = document.getElementById("price").value.replace(/\D/g, "") / 100;

    if (!description || !lunch || !harbor || !boat || !departureDate || !departureTime || !returnDate || !returnTime) {
        setModal("Todos os campos são obrigatórios", "", "error");

        return false;
    }

    if (description.length > 20) {
        setModal("Descrição não pode ser maior que 20 caracteres", "", "error");

        return false;
    }

    if (new Date(departureDate) > new Date(returnDate)) {
        setModal("Data de retorno não pode ser menor que a data de partida", "", "error");

        return false;
    }

    if (new Date(departureDate) === new Date(returnDate) && departureTime > returnTime) {
        setModal("Hora de retorno não pode ser menor que a hora de partida", "", "error");

        return false;
    }

    if (new Date(departureDate) === new Date(returnDate) && departureTime === returnTime) {
        setModal("Hora de retorno não pode ser igual a hora de partida", "", "error");

        return false;
    }

    if (new Date(departureDate) < new Date()) {
        setModal("Data de partida não pode ser menor que a data atual", "", "error");

        return false;
    }

    if (price <= 0) {
        setModal("Preço não pode ser zero ou menor que zero", "", "error");

        return false;
    }

    return true;
}

function priceMask() {
    const price = document.getElementById("price");

    price.value = price.value.replace(/\D/g, "");


    // Documentação: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
    price.value = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(price.value / 100);
}

const price = document.getElementById("price");
price.oninput = priceMask;

async function createFishery() {
    // if (!validateData()) return;

    const description = document.getElementById("description").value;
    const lunch = Array.from(document.getElementsByName("lunch")).filter(radio => radio.checked)[0].value;
    const harbor = document.getElementById("harbor").value;
    const boat = document.getElementById("boat").value;
    const departureDate = document.getElementById("departure-date").value;
    const departureTime = document.getElementById("departure-time").value;

    console.log(`${departureDate}: ${departureTime}`);

}

document.getElementById("save").onclick = createFishery;