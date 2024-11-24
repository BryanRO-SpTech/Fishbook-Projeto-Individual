const inputFile = document.getElementById("upload");
const previewDiv = document.querySelector(".upload-content");
const inputLabel = document.querySelector(".upload-content label");

let boatPhoto;


function previewImage() {
    const file = inputFile.files[0];

    const cropContainer = document.querySelector(".crop-container");

    cropContainer.style.display = "flex";

    const image = document.getElementById('crop-post');

    const fileUrl = URL.createObjectURL(file);

    image.src = fileUrl;

    const cropper = new Cropper(image, {
        aspectRatio: 22 / 9,
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
        fetch(croppedImageUrl).then(res => res.blob()).then(blob => {
            boatPhoto = new File([blob], "boat.png", { type: "image/png" });
        });

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




function isChecked(event, id) {
    const inputRadio = document.getElementById(event.target.htmlFor);

    document.querySelectorAll(`#${id} label`).forEach(label => {
        label.classList.remove("checked");
    })

    if (!inputRadio.checked) {
        event.target.classList.add("checked");
    }
}

function validateData() {
    const boatName = document.getElementById("name").value;
    const maxCapacity = document.getElementById("maxCapacity").value;

    if (!boatName || !maxCapacity) {
        setModal("Nome e capacidade máxima são campos obrigatórios.", "", "error");

        return false;
    }

    if (boatName.length > 50) {
        setModal("Nome não pode ser maior que 50 caracteres.", "", "error");

        return false;
    }

    if (!boatPhoto) {
        setModal("Imagem do barco é obrigatória.", "", "error");

        return false;
    }

    return true;
}


async function createBoat() {
    const boatName = document.getElementById("name").value;
    const maxCapacity = document.getElementById("maxCapacity").value;

    const dormitory = document.getElementsByName("dormitory");
    const restroom = document.getElementsByName("restroom");
    const dormitoryValue = Array.from(dormitory).filter(radio => radio.checked)[0].value;
    const restroomValue = Array.from(restroom).filter(radio => radio.checked)[0].value;


    const validadeData = validateData();

    if (!validadeData) return;

    const formData = new FormData();
    formData.append("name", boatName);
    formData.append("maxCapacity", maxCapacity);
    formData.append("dormitory", dormitoryValue === "yes" ? 1 : 0);
    formData.append("restroom", restroomValue === "yes" ? 1 : 0);
    formData.append("boatPhotoPath", boatPhoto);


    const createBoat = await fetch("/boat/create", {
        method: "POST",
        body: formData
    });

    if (createBoat.status !== 201) {
        return setModal("Erro ao cadastrar barco", "", "error");
    }

    setModal("Barco cadastrado com sucesso!", "", "success");
}

document.getElementById("save").addEventListener("click", createBoat);