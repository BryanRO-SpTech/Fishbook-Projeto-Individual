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

    previewDiv.innerHTML = "";

    const videoUrl = URL.createObjectURL(file);

    const video = document.createElement("video");
    video.src = videoUrl;
    video.controls = true;

    const trimDiv = document.getElementById("video-trim");

    let framesLoaded = false;

    video.onloadedmetadata = () => {
        previewDiv.appendChild(video);
        video.currentTime = 1;

        video.onseeked = () => {
            if (!framesLoaded) {
                let canvas = document.createElement("canvas");

                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                let ctx = canvas.getContext("2d");
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                let img = new Image();
                img.src = canvas.toDataURL();

                trimDiv.appendChild(img);

                if (video.currentTime < video.duration) {
                    video.currentTime++;
                } else {
                    framesLoaded = true;
                }

                // console.log(trimDiv.childElementCount)

                Array.from(trimDiv.children).forEach(element => {
                    if (element.tagName == "IMG") {
                        element.style.width = `${trimDiv.offsetWidth / trimDiv.childElementCount}px`;
                    }
                });
            }
        }
    }

    const videoTrimDiv = document.getElementById("video-trim");
    const videoSelector = document.getElementById("selector");
    const play = document.getElementById("play");

    let mouseDown = false;

    videoTrimDiv.onpointermove = (e) => {

        const rect = videoTrimDiv.getBoundingClientRect();

        const mouseX = e.clientX - rect.left;

        const percentX = (mouseX / rect.width) * 100;

        if (mouseDown && percentX < 100) {
            videoSelector.style.left = `${percentX}%`;

            video.currentTime = ((percentX / 100) * video.duration);
        }

        videoSelector.onpointerdown = () => {
            mouseDown = true;
        }

        videoSelector.onpointerup = () => {
            mouseDown = false;
        }
    }

    videoTrimDiv.onmouseleave = () => mouseDown = false;

    video.ontimeupdate = () => {
        console.log("teste")
        videoSelector.style.left = `${(video.currentTime / video.duration) * 100}%`;
    };


}

inputFile.addEventListener("change", () => {
    if (inputFile.files[0].type.includes("image")) {
        previewImage();
    } else if (inputFile.files[0].type.includes("video")) {
        previewVideo();
    }
});