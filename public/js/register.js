const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");
const message = document.querySelector(".welcome h2");
const previewPhotoDiv = document.getElementById("profile-photo");
const uploadPhoto = document.getElementById("upload");

function nextPage() {
    page1.style.display = "none";
    page2.style.display = "flex";

    message.innerHTML = `Vamos finalizar seu perfil...`;
}

function prevPage() {
    page2.style.display = "none";
    page1.style.display = "flex";

    message.innerHTML = `Realize seu cadastro`;
}


function previewPhoto() {
    const file = uploadPhoto.files[0];

    if (file.type.includes("image")) {
        previewPhotoDiv.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
    } else {
        previewPhotoDiv.style.border = `2px solid red`;
    }
}

uploadPhoto.addEventListener("change", previewPhoto);

