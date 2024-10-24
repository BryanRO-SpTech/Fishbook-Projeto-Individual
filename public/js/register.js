const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");
const message = document.querySelector(".welcome h2");
const previewPhotoDiv = document.getElementById("profile-photo");
const uploadPhoto = document.getElementById("upload");

let profilePhoto;

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


// function previewPhoto() {
//     const file = uploadPhoto.files[0];


//     if (file.type.includes("image")) {
//         previewPhotoDiv.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
//     } else {
//         previewPhotoDiv.style.border = `2px solid red`;
//     }
// }


function previewImage() {
    const file = uploadPhoto.files[0];

    console.log(file)

    if (!file.type.includes("image")) {
        previewImage.style.border = "2px solid red";

        return;
    }

    const cropContainer = document.querySelector(".crop-container");

    cropContainer.style.display = "flex";

    const image = document.getElementById('crop-profile');

    const fileUrl = URL.createObjectURL(file);

    image.src = fileUrl;

    const cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 0,
        dragMode: 'move',
        movable: true,
        zoomable: true,
        scalable: false,
        rotatable: false,
        cropBoxResizable: true,
        background: false

    });


    function crop() {
        const croppedImage = cropper.getCroppedCanvas({
            with: 300,
            heigth: 300
        });

        const croppedImageUrl = croppedImage.toDataURL('image/png');

        previewPhotoDiv.style.backgroundImage = `url(${croppedImageUrl})`;

        cropContainer.style.display = "none";
    }

    document.getElementById("save-profile").addEventListener("click", crop)
}

uploadPhoto.addEventListener("click", () => {
    uploadPhoto.value = "";
})
uploadPhoto.addEventListener("change", previewImage);