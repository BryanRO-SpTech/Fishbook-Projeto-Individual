(function navBar() {
    const scriptParent = document.currentScript.parentElement;
    const redirectPath = document.currentScript.getAttribute("data-path")

    scriptParent.insertAdjacentHTML("beforeend", `
        <div class="return-button" onclick="window.location.href = '${redirectPath}'">
            <img src="/assets/icons/return.svg" alt="Voltar">
            <span>Voltar</span>
        </div>
    `)
})();
