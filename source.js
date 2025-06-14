document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('menuSearch');
    const input = document.getElementById('menuInput');
    const select = document.getElementById('methodSelect');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const query = input.value.trim();
        const method = select.value;

        if (query === "") {
            alert("검색어를 입력해주세요.");
            input.focus();
            return;
        }

        if (method === "맛집 찾기") {
            window.location.href = `map/index.html?query=${encodeURIComponent(query)}`;
        }else if(method === "직접 요리"){
            window.location.href = `recipe/index.html?query=${encodeURIComponent(query)}`;
        }
    });
});