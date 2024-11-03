function setModal(title, message, type) {
    const body = document.querySelector("body");

    body.insertAdjacentHTML("beforeend", `
        <div class="modal-container">
            <div id="message-modal" class="${type}">
            <h3>${title}</h3>

            <span>${message}</span>

            <span id="message-loader"></span>
        </div>
        </div>
    `);


    setTimeout(removeModal, 5000);
}

function removeModal() {
    const modal = document.getElementById("message-modal");
    modal.remove();
}