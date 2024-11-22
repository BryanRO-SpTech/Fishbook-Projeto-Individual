// Documentação para marcadores: https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker#getelement
// Documentação para turfJS (Lib para colocar formas geométricas no mapa): https://turfjs.org/docs/api/circle

class MapBox {
    #map;
    defaultMarkers = [];
    harborMarkers = [];

    constructor() {
        mapboxgl.accessToken = "pk.eyJ1IjoiYnJ5YW4tcm8iLCJhIjoiY2x3ZTl5ZHZ4MWhiazJpa2h0NXFucTZ2diJ9.KygeJsIPYhDkEUZiow7P5Q";
        this.#map = new mapboxgl.Map({
            container: "map",
            center: [-46.564532, -24.342311],
            zoom: 10,
            pitch: 60,
            bearing: -30,
            style: "mapbox://styles/mapbox/outdoors-v12",
            antialias: true
        });


        this.#map.addControl(new mapboxgl.NavigationControl(), 'top-left');

        this.onload(() => {
            this.setProhibitedArea([-46.806655, -24.375334], 1.5, 'queimadinha');

            this.setGoodArea([-46.792585, -24.194505], .3, 'ilha-das-cabras');
            this.setGoodArea([-46.675694, -24.485472], 3, 'queimada-grande');
            this.setGoodArea([-46.690620, -24.237077], 1, 'lage-conceicao');
            this.setGoodArea([-46.690819, -24.136990], 0.3, 'pier-mongagua');
        })
    }

    setHarborMarker(cordinates, harborId) {
        const personalizedMarker = document.createElement("div");
        personalizedMarker.id = harborId;

        personalizedMarker.style.backgroundImage = "url(/assets/icons/ancor.svg)";
        personalizedMarker.style.width = "35px";
        personalizedMarker.style.height = "35px";
        personalizedMarker.style.backgroundSize = "100% 100%";
        personalizedMarker.style.backgroundPosition = "center";
        personalizedMarker.style.cursor = "pointer";


        const marker = new mapboxgl.Marker(personalizedMarker)
            .setLngLat(cordinates)
            .addTo(this.#map);

        this.harborMarkers.push(marker);

        return marker;
    }

    setDefaultMarker(cordinates) {
        const marker = new mapboxgl.Marker()
            .setLngLat(cordinates)
            .addTo(this.#map);

        this.defaultMarkers.push(marker);
        marker.getElement().style.cursor = "pointer";

        return marker;
    }

    removeDefaultMarkers() {
        this.defaultMarkers.forEach(marker => {
            marker.getElement().remove();
        });
    }

    removeLastDefaultMarker() {
        this.defaultMarkers.pop().getElement().remove();
    }

    removeHarborMarkers() {
        this.harborMarkers.forEach(marker => {
            marker.getElement().remove();
        });
    }

    removeLastHarborMarker() {
        this.harborMarkers.pop().getElement().remove();
    }

    setProhibitedArea(centerCoordinates, radius, id) {
        const circleGeoJSON = turf.circle(centerCoordinates, radius, {
            steps: 64,
            units: "kilometers",
        });

        this.#map.addSource(id, {
            type: "geojson",
            data: circleGeoJSON,
        });

        this.#map.addLayer({
            id,
            type: "fill",
            source: id,
            paint: {
                "fill-color": "red",
                "fill-opacity": 0.5,
            },
        });
    }

    setGoodArea(centerCoordinates, radius, id) {
        const circleGeoJSON = turf.circle(centerCoordinates, radius, {
            steps: 64,
            units: "kilometers",
        });

        this.#map.addSource(id, {
            type: "geojson",
            data: circleGeoJSON,
        });

        this.#map.addLayer({
            id,
            type: "fill",
            source: id,
            paint: {
                "fill-color": "green",
                "fill-opacity": 0.5,
            },
        });
    }

    onload(loadFuncion) {
        this.#map.on("load", loadFuncion);
    }

    onclick(clickFunction) {
        this.#map.on("click", clickFunction);
    }
}