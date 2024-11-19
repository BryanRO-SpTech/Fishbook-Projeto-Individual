// Documentação para marcadores: https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker#getelement
// Documentação para turfJS (Lib para colocar formas geométricas no mapa): https://turfjs.org/docs/api/circle


class MapBox {
    map;

    constructor() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYnJ5YW4tcm8iLCJhIjoiY2x3ZTl5ZHZ4MWhiazJpa2h0NXFucTZ2diJ9.KygeJsIPYhDkEUZiow7P5Q';
        this.map = new mapboxgl.Map({
            container: "map",
            center: [-46.564532, -24.342311],
            zoom: 10,
            pitch: 60,
            bearing: -30,
            style: "mapbox://styles/mapbox/outdoors-v12",
            antialias: true
        });
    }

    setHarborMarker(cordinates, harborId) {
        const personalizedMarker = document.createElement('div');
        personalizedMarker.id = harborId;

        personalizedMarker.style.backgroundImage = 'url(/assets/icons/ancor.svg)';
        personalizedMarker.style.width = '50px';
        personalizedMarker.style.height = '50px';
        personalizedMarker.style.backgroundSize = '100% 100%';
        personalizedMarker.style.backgroundPosition = 'center';
        personalizedMarker.style.cursor = 'pointer';


        const marker = new mapboxgl.Marker(personalizedMarker)
            .setLngLat(cordinates)
            .addTo(this.map);


        return marker;
    }



    setDefaultMarker(cordinates) {
        const marker = new mapboxgl.Marker()
            .setLngLat(cordinates)
            .addTo(this.map);

        return marker;
    }

    setProhibitedArea(centerCoordinates, map, radius, id) {
        const circleGeoJSON = turf.circle(centerCoordinates, radius, {
            steps: 64,
            units: 'kilometers',
        });

        map.addSource('circle', {
            type: 'geojson',
            data: circleGeoJSON,
        });

        map.addLayer({
            id,
            type: 'fill',
            source: 'circle',
            paint: {
                'fill-color': 'red',
                'fill-opacity': 0.5,
            },
        });
    }

    setGoodArea(centerCoordinates, map, radius, id) {
        const circleGeoJSON = turf.circle(centerCoordinates, radius, {
            steps: 64,
            units: 'kilometers',
        });

        map.addSource('circle', {
            type: 'geojson',
            data: circleGeoJSON,
        });

        map.addLayer({
            id,
            type: 'fill',
            source: 'circle',
            paint: {
                'fill-color': 'green',
                'fill-opacity': 0.5,
            },
        });
    }

    // onload(loadFuncion) {
    //     this.map.on('load', loadFuncion);
    // }
}