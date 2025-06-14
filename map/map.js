document.addEventListener("DOMContentLoaded", async function() {
    let places = [];
    let markers = [];
    let keyword = "";

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
    const map = new kakao.maps.Map(container, options);

    //시작했을 때 쿼리를 읽어서 검색하기
    const kakaoPlaces = new kakao.maps.services.Places(map);

    kakaoPlaces.keywordSearch(
        keyword,
        showResult,
        { useMapBounds: true }
    );

    const reloadBtn = document.getElementById("refreshSearchBtn");
    reloadBtn.addEventListener("click", function (){
        kakaoPlaces.keywordSearch(
        keyword,
        showResult,
        { useMapBounds: true }
    );
    })

    const hideBtn = document.getElementById("hideSidebarBtn");
    const showBtn = document.getElementById("showSidebarBtn");
    const sideBar = document.getElementById("sideBar");

    hideBtn.addEventListener("click", () => {
        sideBar.style.display = "none";
        showBtn.style.display = "block";
    });

    showBtn.addEventListener("click", () => {
        sideBar.style.display = "flex";
        showBtn.style.display = "none";
    });

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
            
            renderPlaces(places);

        }else if(status === kakao.maps.services.Status.ZERO_RESULT){
            alert(`"${keyword}"에 대한 검색 결과가 없습니다.`);
        }else if(status === kakao.maps.services.Status.ERROR){
            alert("검색 중 오류가 발생했습니다.");
        }
    }

    function renderPlaces(places) {
        const tpl = document.getElementById("result-tpl");
        const container = document.getElementById("resultDisplay");
        
        container.innerHTML = "";
        
        places.forEach(place => {
            const clone = tpl.content.cloneNode(true);
            const item = clone.querySelector(".place-item");
            
            item.querySelector(".place-name").innerText = place.place_name;
            item.querySelector(".place-address").innerText = place.address_name;
    
            item.addEventListener("click", e => {
                showPlaceDetails(place);
            });
    
            container.appendChild(item);
        });
    }
    
    function showPlaceDetails(place){
        const pos = new kakao.maps.LatLng(place.y, place.x);
        map.setLevel(1, { animate: false });
        map.setCenter(pos);

        const container = document.getElementById("resultDisplay");
        container.innerHTML = "";
    
        const iframe = document.createElement("iframe");
        iframe.classList.add("placeDetail");
        const allowedPrefix = "https://place.map.kakao.com/";
        const url = place.place_url.replace(/^http:\/\//, "https://");
        if (url && url.startsWith(allowedPrefix)) {
            iframe.src = url;
        } else {
            iframe.src = "about:blank";
            alert("허용되지 않은 URL입니다.");
        }
        iframe.sandbox = "allow-scripts allow-same-origin";
    
        const backBtn = document.createElement("button");
        backBtn.classList.add("backToResultBtn");
        backBtn.innerText = "목록으로";
        backBtn.onclick = e => { renderPlaces(places); };
        
        container.appendChild(backBtn);
        container.appendChild(iframe);
    }

    document.getElementById("searchBar").addEventListener("keydown", function(e){
        if(e.key === "Enter"){
            keyword = this.value.trim();
            kakaoPlaces.keywordSearch(
                keyword,
                showResult,
                { useMapBounds: true }
            );
        }
    });

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