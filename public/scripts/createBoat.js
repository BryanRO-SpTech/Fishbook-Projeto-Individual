const inputFile = document.getElementById("upload");
const previewDiv = document.querySelector(".upload-content");
const inputLabel = document.querySelector(".upload-content label");

let fileUrl;


function previewImage() {
    const file = inputFile.files[0];

    const cropContainer = document.querySelector(".crop-container");

    cropContainer.style.display = "flex";

    const image = document.getElementById('crop-post');

    fileUrl = URL.createObjectURL(file);

    image.src = fileUrl;

    const cropper = new Cropper(image, {
        aspectRatio: 16 / 10,
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
        fileUrl = croppedImageUrl;

        previewDiv.style.backgroundImage = `url(${croppedImageUrl})`;

        cropContainer.style.display = "none";

        modifyReuploadButton();

        document.removeEventListener("click", crop);
        cropper.destroy();

        inputFile.value = "";
    }

    document.getElementById("save-post").addEventListener("click", crop);
}

function modifyReuploadButton() {
    inputLabel.style.opacity = .2;

    previewDiv.addEventListener("mouseover", () => {
        inputLabel.style.transition = "opacity .5s"
        inputLabel.style.opacity = 1;
    });

    previewDiv.addEventListener("mouseout", () => {
        inputLabel.style.opacity = .4;
    });


    inputLabel.innerHTML = "Refazer Upload";
}





inputFile.addEventListener("change", previewImage);