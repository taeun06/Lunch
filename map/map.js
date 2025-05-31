document.addEventListener("DOMContentLoaded", async function() {
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
    new kakao.maps.Map(container, options);
});

function getLatLng() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
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