const map = new MapBox();

map






// const loadMap = () => {
//     mapboxgl.accessToken = 'pk.eyJ1IjoiYnJ5YW4tcm8iLCJhIjoiY2x3ZTl5ZHZ4MWhiazJpa2h0NXFucTZ2diJ9.KygeJsIPYhDkEUZiow7P5Q';
//     const map = new mapboxgl.Map({
//         container: 'map', // container ID
//         center: [-46.564532, -24.342311], // starting position [lng, lat]
//         zoom: 10, // starting zoom,
//         pitch: 60,
//         bearing: -30,
//         style: "mapbox://styles/mapbox/outdoors-v12",
//         antialias: true
//     });
// }

// map.addControl(new mapboxgl.NavigationControl(), 'top-left');


// const personalizedMarker = document.createElement('div');
// // personalizedMarker.style.backgroundImage = 'url(https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png)';
// personalizedMarker.style.backgroundImage = 'url(/assets/icons/ancor.svg)';
// personalizedMarker.style.width = '50px'; // Largura do marcador
// personalizedMarker.style.height = '50px'; // Altura do marcador
// personalizedMarker.style.backgroundSize = '100% 100%'; // Ajustar a imagem ao tamanho do elemento
// personalizedMarker.style.backgroundPosition = 'center';
// personalizedMarker.style.cursor = 'pointer';

// const marker = new mapboxgl.Marker(personalizedMarker)
//     .setLngLat([-46.814123, -24.173242])
//     .addTo(map);


// personalizedMarker.onclick = () => console.log('teste');


// // https://turfjs.org/docs/api/circle
// const circleGeoJSON = turf.circle([-46.806655, -24.375334], 1.5, {
//     steps: 64, // Número de pontos (quanto mais, mais suave o círculo)
//     units: 'kilometers', // Unidade de medida
// });

// const circleGeoJSON2 = turf.circle([-46.792585, -24.194505], .3, {
//     steps: 64, // Número de pontos (quanto mais, mais suave o círculo)
//     units: 'kilometers', // Unidade de medida
// });

// // Adicionar o círculo ao mapa
// map.on('load', () => {
//     map.addSource('circle', {
//         type: 'geojson',
//         data: circleGeoJSON,
//     });

//     map.addLayer({
//         id: 'circle-layer',
//         type: 'fill',
//         source: 'circle',
//         paint: {
//             'fill-color': 'red',
//             'fill-opacity': 0.3,
//         },
//     });

//     map.addSource('circle2', {
//         type: 'geojson',
//         data: circleGeoJSON2,
//     });

//     map.addLayer({
//         id: 'circle-layer2',
//         type: 'fill',
//         source: 'circle2',
//         paint: {
//             'fill-color': 'red',
//             'fill-opacity': 0.3,
//         },
//     });


//     console.log(circleGeoJSON)
// });