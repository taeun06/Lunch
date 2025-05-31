document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('menuSearch');
    const input = document.getElementById('menuInput');
    const select = document.getElementById('methodSelect');

    form.addEventListener('submit', function (e) {
        e.preventDefault(); // 기본 제출 동작 방지

        const query = input.value.trim();
        const method = select.value;

        if (query === "") {
            alert("검색어를 입력해주세요.");
            return;
        }

        if (method === "맛집 찾기") {
            window.location.href = `map/index.html?query=${encodeURIComponent(query)}`;
        } else {
            window.location.href = `recipe/index.html?query=${encodeURIComponent(query)}`;
        }
    });
});