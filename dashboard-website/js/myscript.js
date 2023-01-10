
var map = L.map('map').setView([37.726408, 15.184183], 10);

var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

var dangerIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
var greenIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var marker1 = L.marker([37.726408, 15.184183], {icon: greenIcon}).addTo(map);
var marker2 = L.marker([37.67, 15.17], {icon: greenIcon}).addTo(map);
var marker3 = L.marker([37.689, 15.1728], {icon: greenIcon}).addTo(map);
var marker4 = L.marker([37.6894, 15.17281], {icon: greenIcon}).addTo(map);
marker1.bindPopup("<b>Hi!</b><br>I am worker 1");
marker2.bindPopup("<b>Hi!</b><br>I am worker 2");
marker3.bindPopup("<b>Hi!</b><br>I am worker 3");
marker4.bindPopup("<b>Hi!</b><br>I am worker 4");

function onJson(json) {
    console.log('json ricevuto');
    console.log(json);
}
function onResponse(response) {
    return response.json();
}

document.getElementById('worker1').onclick = function changeContent() {
    if(document.getElementById('worker1').classList.contains("danger")){
        var element = document.getElementById('danger1');
        element.classList.remove("bg-danger");
        element.classList.add("bg-success");
        element.innerHTML = " <div class='card bg-success text-white shadow'> <div class='card-body'> Worker 1 <a href='#' id='worker1' class='btn btn-info btn-icon-split ok'><span class='icon text-white-50'><i class='fas fa-map-marked-alt'></i></span> <span class='text'>Check Position</span></a>  </div></div>";
        map.setView(new L.LatLng(37.726408, 15.184183), 15);
        fetch('index.php?reason=report').then(onResponse).then(onJson);
    }else{
         map.setView(new L.LatLng(37.726408, 15.184183), 15);
    }
}


document.getElementById('worker2').onclick = function changeContent() {

    map.setView(new L.LatLng(37.67, 15.17), 15);

}
document.getElementById('worker3').onclick = function changeContent() {

    map.setView(new L.LatLng(37.689, 15.1728), 15);


}
document.getElementById('worker4').onclick = function changeContent() {
    map.setView(new L.LatLng(37.6894, 15.17281), 15);

} 

// function onText(text) {
    
//     if(text == 1){
//         if(document.getElementById('worker1').classList.contains("ok")){
//             console.log('change');
//         }
//     }
// }
// function onResponse1(response) {
//     return response.text();
// }
// function refresh() {
//     fetch('index.php?reason=change').then(onResponse1).then(onText);
//     setTimeout(refresh, 2000);
// }
// refresh();