function setLoader() {
    const body = document.querySelector("body");

    body.insertAdjacentHTML("beforeend", `
        <div id="loader">
            <div></div>
        </div>
    `);
}

function removeLoader() {
    const loader = document.getElementById("loader");
    loader.remove();
}