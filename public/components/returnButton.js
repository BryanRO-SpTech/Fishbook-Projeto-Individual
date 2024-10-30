(function navBar() {
    const scriptParent = document.currentScript.parentElement;

    scriptParent.insertAdjacentHTML("beforeend", `
        <div class="return-button" onclick="window.history.back()">
            <img src="assets/icons/return.svg" alt="Voltar">
            <span>Voltar</span>
        </div>
    `)
})();
