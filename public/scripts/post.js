const previewDiv = document.querySelector(".upload-content");
const inputFile = document.getElementById("upload");
const inputLabel = document.querySelector(".upload-content label");
const postDiv = document.querySelector(".post");

function previewImage() {
    const file = inputFile.files[0];

    if (!file.type.includes("image") && !file.type.includes("video")) {
        previewDiv.style.border = "2px solid red";

        return;
    }

    const cropContainer = document.querySelector(".crop-container");

    cropContainer.style.display = "flex";

    const image = document.getElementById('crop-post');

    const fileUrl = URL.createObjectURL(file);

    image.src = fileUrl;

    const cropper = new Cropper(image, {
        aspectRatio: 13 / 9,
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

        previewDiv.style.backgroundImage = `url(${croppedImageUrl})`;

        cropContainer.style.display = "none";

        document.removeEventListener("click", crop);
        cropper.destroy();

        inputFile.value = "";

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

    document.getElementById("save-post").addEventListener("click", crop);
}


function previewVideo() {
    const file = inputFile.files[0];


    const videoUrl = URL.createObjectURL(file);
    const video = document.createElement("video");

    const cutButton = document.getElementById("play");

    video.src = videoUrl;
    video.controls = true;

    previewDiv.innerHTML = ""
    previewDiv.appendChild(video);

    const inputTimeStart = document.getElementById("time-start");
    const inputTimeEnd = document.getElementById("time-end");

    let trimStart = Number(inputTimeStart.value);
    let trimEnd = Number(inputTimeEnd);

    video.onloadedmetadata = () => {
        const videoDuration = video.duration;
        inputTimeEnd.value = videoDuration;
        trimEnd = videoDuration;
    };

    inputTimeStart.onchange = () => {
        const value = inputTimeStart.value;

        if (value < video.duration || value > trimEnd) {
            return inputTimeStart.value = trimStart;
        }

        trimStart = Number(inputTimeStart.value);
    };
    inputTimeEnd.onchange = () => trimEnd = Number(inputTimeEnd.value);

    video.addEventListener("play", () => {
        video.currentTime = trimStart;
    });


    const cutStartButton = document.getElementById("cut-start");
    const cutEndButton = document.getElementById("cut-end");

    cutStartButton.addEventListener("click", () => {
        const videoCurrentTime = video.currentTime;

        trimStart = videoCurrentTime;
        inputTimeStart.value = videoCurrentTime;
    });

    cutEndButton.addEventListener("click", () => {
        const videoCurrentTime = video.currentTime;

        trimEnd = videoCurrentTime;
        inputTimeEnd.value = videoCurrentTime;
    });

    video.addEventListener("timeupdate", () => {
        if (video.currentTime >= trimEnd) {

            video.currentTime = trimStart;
        }
    });

}

inputFile.addEventListener("change", () => {
    if (inputFile.files[0].type.includes("image")) {
        previewImage();
    } else if (inputFile.files[0].type.includes("video")) {
        previewVideo();
    }
});