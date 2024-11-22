const map = new MapBox();

map.onload(async () => {
    const reqHarbors = await fetch("/harbor");

    if (!reqHarbors.ok) {
        return setModal("Erro ao carregar portos", "Tente novamente mais tarde...", "error");
    }

    const resHarbors = await reqHarbors.json();

    const harborsMarkers = resHarbors.map((harbor) => {
        const marker = map.setHarborMarker([harbor.longitude, harbor.latitude], harbor.idHarbor);

        return marker.getElement();
    });

    const fishInfosDiv = document.getElementById("fisheries-infos");



    harborsMarkers.forEach(marker => {
        marker.onclick = async () => {
            fishInfosDiv.classList.add("open");
            harborsMarkers.forEach(marker => marker.style.opacity = 1);

            marker.style.opacity = 0.5;

            const harborId = marker.id;

            const reqFisheries = await fetch(`/fishery/by-harbor/${harborId}`);

            if (!reqFisheries.ok) {
                return setModal("Erro ao carregar pescarias", "Tente novamente mais tarde...", "error");
            }

            const resFisheries = await reqFisheries.json();

            map.removeDefaultMarkers();

            let cards;

            fishInfosDiv.innerHTML = resFisheries.map((fishery, index) => {

                const marker = map.setDefaultMarker([fishery.fisheryPointLon, fishery.fisheryPointLat]);

                marker.getElement().onmouseover = () => {
                    cards[index].style.backgroundColor = "#121F2B";
                }

                marker.getElement().onmouseout = () => {
                    cards[index].style.backgroundColor = "#202C36";
                }


                const formatDepartureDate = new Date(fishery.dateTimeDeparture).toLocaleDateString();

                return `
                    <div class="card">
                        <div class="infos">
                            <span class="info"><span class="title">Destino: </span>${fishery.fisheryPointName}</span>
                            <span class="info"><span class="title">Embarcação: </span>${fishery.boatName}</span>
                            <span class="info"><span class="title">Data: </span>${formatDepartureDate}</span>
                        </div>

                        <a href="/fishery/${fishery.idFishery}" class="see-more">Ver mais</a>
                    </div>
                `;

            }).join("");


            cards = document.querySelectorAll(".card");
        };
    });
});