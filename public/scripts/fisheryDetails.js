const [empty, path, param] = window.location.pathname.split("/");

const map = new MapBox();

const loadPage = async () => {
    setLoader();
    const reqFishery = await fetch(`/fishery/get/${param}`);

    removeLoader();

    if (!reqFishery.ok) {

        if (reqFishery.status === 404) {
            return setModal("Pescaria não encontrada", "", "error");
        }

        return setModal("Erro ao carregar pescaria", "Tente novamente mais tarde...", "error");
    }



    const resFishery = await reqFishery.json();

    // - 
    document.getElementById("boat-name").innerHTML = resFishery.boatName;
    document.getElementById("destination").innerHTML = resFishery.fisheryPointName;
    document.getElementById("departure").innerHTML = `<a href="https://www.google.com/maps?q=${resFishery.harborLatitude},${resFishery.harborLongitude}" target="blank">${resFishery.harborName} </a>`;
    document.getElementById("dormitory").innerHTML = resFishery.dormitory ? "Sim" : "Não";
    document.getElementById("lunch").innerHTML = resFishery.lunchIncludes ? "Sim" : "Não";
    document.getElementById("restroom").innerHTML = resFishery.restroom ? "Sim" : "Não";
    document.getElementById("capacity-avalable").innerHTML = resFishery.availableCapacity;
    document.getElementById("departure-date").innerHTML = formatDateTime(resFishery.dateTimeDeparture);
    document.getElementById("return-date").innerHTML = formatDateTime(resFishery.dateTimeReturn);
    document.getElementById("duration").innerHTML = (Date.parse(resFishery.dateTimeReturn) - Date.parse(resFishery.dateTimeDeparture)) / 1000 / 60 / 60 + " Horas";
    document.getElementById("price").innerHTML = parseFloat(resFishery.price).toLocaleString("PT-BR", { style: "currency", currency: "BRL" });
    document.getElementById("boat-image").src = `/${resFishery.boatPhotoPath}`;

    map.onload(() => {
        map.setHarborMarker([resFishery.harborLongitude, resFishery.harborLatitude], resFishery.idHarbor);
        map.setDefaultMarker([resFishery.fisheryPointLon, resFishery.fisheryPointLat]);
    });

    changeActionButton(resFishery);
}


function changeActionButton({ isCreatedByUser, isReservedByUser, availableCapacity, dateTimeDeparture, idFishery }) {
    const button = document.getElementById("action-button");

    if (new Date() > new Date(dateTimeDeparture)) {
        button.style.backgroundColor = "#666673";
        button.style.cursor = "default";
        button.innerHTML = "Pesca Encerrada";

        return;
    }

    if (isCreatedByUser) {
        button.style.backgroundColor = "#121F2B";
        button.style.color = "red";
        button.innerHTML = "Eliminar Pescaria";

        return button.onclick = async () => {
            const reqDelete = await fetch(`/fishery/delete/${idFishery}`, {
                method: "DELETE"
            });

            if (!reqDelete.ok) {
                return setModal("Erro ao eliminar pescaria", "Tente novamente mais tarde...", "error");
            }

            setModal("Pescaria eliminada com sucesso", "", "success");

            setTimeout(() => {
                window.location.href = "/fish"
            }, 5000);
        };
    }

    if (isReservedByUser) {
        button.style.backgroundColor = "#121F2B";
        button.style.color = "red";
        button.innerHTML = "Cancelar Pescaria"

        return button.onclick = async () => {
            const reqDelete = await fetch(`/fishery/cancel/participant/${param}`, {
                method: "DELETE"
            });

            if (!reqDelete.ok) {
                return setModal("Erro ao cancelar pescaria", "Tente novamente mais tarde...", "error");
            }

            return loadPage();
        };
    }

    if (availableCapacity === 0) {
        button.style.backgroundColor = "#666673";
        button.style.cursor = "default";
        button.innerHTML = "Vagas Esgotadas";

        return button.onclick = () => setModal("Vagas esgotadas", "", "message");
    }

    button.style.backgroundColor = "#5EBEF2";
    button.style.color = "white";
    button.innerHTML = "Reservar Vaga"

    return button.onclick = async () => {
        const reqReserve = await fetch(`/fishery/reserve/${param}`, {
            method: "POST"
        });

        if (reqReserve.status !== 201) {
            return setModal("Erro ao reservar pescaria.", "Tente novamente mais tarde...", "error");
        }

        return loadPage();
    }
}

window.onload = () => loadPage();



const formatDateTime = (unformattedDate) => {
    const date = new Date(unformattedDate)
    const time = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const formattedDateTime = date.toLocaleDateString("pt-br", { dateStyle: "short" }) + ` - ${time}:${minutes}`;

    return formattedDateTime;
}



// {
//     "idFishery": 2,
//     "fkHarbor": 2,
//     "fkBoat": 2,
//     "fisheryPointName": "Fishing Point 2",
//     "fisheryPointLat": "-24.238377",
//     "fisheryPointLon": "-46.692341",
//     "dateTimeDeparture": "2023-10-02T10:00:00.000Z",
//     "dateTimeReturn": "2023-10-02T20:00:00.000Z",
//     "lunchIncludes": 0,
//     "price": "120.00",
//     "boatName": "Boat 2",
//     "idHarbor": 2,
//     "harborName": "Maita-Marina Itanhaém",
//     "harborLatitude": "-24.187067",
//     "harborLongitude": "-46.796185",
//     "maxCapacity": 8,
//     "availableCapacity": 8,
//     "isCreatedByUser": 0,
//     "isReservedByUser": 0
// }