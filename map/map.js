let map
let places = [];
let markers = [];
let keyword = "";

document.addEventListener("DOMContentLoaded", async function() {
    //쿼리 문자열 받아오기
    if(window.location.search){
        const params = new URLSearchParams(window.location.search);
        const searchBar = document.getElementById("searchBar");
        if(params.get("query")){
            searchBar.value = params.get("query");
            keyword = params.get("query");
        }else{
            window.location.href = "index.html";
        }
    }

    //화면에 현위치 지도 표시
    let lat, lng;
    try {
        ({ lat, lng } = await getLatLng());
    } catch (err) {
        console.error("위치 정보를 가져오지 못했습니다:", err);
        lat = 35.233944;
        lng = 129.079306;
    }

    const container = document.getElementById("map");
    const options = {
        center: new kakao.maps.LatLng(lat, lng),
        level: 4
    };
    map = new kakao.maps.Map(container, options);

    //시작했을 때 쿼리를 읽어서 검색하기
    const kakaoPlaces = new kakao.maps.services.Places(map);

    kakaoPlaces.keywordSearch(
        keyword,
        showResult,
        { useMapBounds: true }
    );
});

function getLatLng() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("위치 정보를 사용할 수 없습니다"));
        }
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude: lat, longitude: lng } = position.coords;
                resolve({ lat, lng });
            },
            error => {
                reject(error);
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    });
}

//콜백 함수 : 검색한 장소들을 지도에 표시하고 장소 객체들을 저장
function showResult(data, status){
    if (status === kakao.maps.services.Status.OK) {
        places = data;

        markers.forEach(m => m.setMap(null));
        markers = [];

        data.forEach(place => {
            const position = new kakao.maps.LatLng(place.y, place.x);

            const marker = new kakao.maps.Marker({
                map:map,
                position:position,
                title: place.place_name
            });
            markers.push(marker);
        });
    }else if(status === kakao.maps.services.Status.ZERO_RESULT){
        alert(`"${keyword}"에 대한 검색 결과가 없습니다.`);
    }else if(status === kakao.maps.services.Status.ERROR){
        alert("검색 중 오류가 발생했습니다.");
    }
}