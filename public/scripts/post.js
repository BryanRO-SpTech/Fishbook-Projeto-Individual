const previewDiv = document.querySelector(".upload-content");
const inputFile = document.getElementById("upload");
const inputLabel = document.querySelector(".upload-content label");
const trimDiv = document.getElementById("video-trim");

let fileUrl;


function previewImage() {
    // Resetar divs, caso um novo upload seja realizado:
    const previewChild = previewDiv.querySelector("video");
    if (previewChild) {
        previewDiv.removeChild(previewChild);
    }
    document.querySelector(".trim-container").style.display = "none";
    fileUrl = null;

    const trimChild = trimDiv.querySelector("img");
    if (trimChild) {
        trimDiv.removeChild(trimChild);
    }

    // ================================================================ //

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


let timeStart = 0;
let timeEnd;

function previewVideo() {
    // Resetar divs, caso um novo upload seja realizado:
    previewDiv.style.background = "";

    const previewChild = previewDiv.querySelector("video");
    if (previewChild) {
        previewDiv.removeChild(previewChild);
    }
    document.querySelector(".trim-container").style.display = "none";

    const trimChild = trimDiv.querySelector("img");
    if (trimChild) {
        trimDiv.removeChild(trimChild);
    }

    // ================================================================ //


    const file = inputFile.files[0];

    document.querySelector(".trim-container").style.display = "block";

    fileUrl = URL.createObjectURL(file);

    const video = document.createElement("video");
    video.src = fileUrl;

    let framesLoaded = false;

    video.onloadedmetadata = () => {
        previewDiv.appendChild(video);
        video.currentTime = 1;

        modifyReuploadButton();


        setLoader();
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
                    if (video.duration > 60) {
                        video.currentTime += 10;
                    } else {
                        video.currentTime++;
                    }

                } else {
                    framesLoaded = true;
                    video.currentTime = 0;
                    timeStart = 0;
                    timeEnd = video.duration;
                    removeLoader();
                }

                Array.from(trimDiv.children).forEach(element => {
                    if (element.tagName == "IMG") {
                        console.log(trimDiv.childElementCount)

                        element.style.width = `${trimDiv.offsetWidth / (trimDiv.childElementCount - 3)}px`;
                    }
                });
            }
        }
        inputFile.value = "";
    }

    const videoTrimDiv = document.getElementById("video-trim");
    const videoCurrentSelector = document.getElementById("current-selector");
    const videoStartSelector = document.getElementById("start-selector");
    const videoEndSelector = document.getElementById("end-selector");

    let mouseDownInCurrentSelector = false;
    let mouseDownInStartSelector = false;
    let mouseDownInEndSelector = false;

    videoTrimDiv.onpointermove = (e) => {
        const percentX = getMousePositionPercentage(e, videoTrimDiv)

        // Mover seletor de inicio;


        if (mouseDownInStartSelector && (percentX < 100 && percentX > 0)) {
            videoStartSelector.style.width = `${percentX}%`;

            timeStart = (percentX / 100) * video.duration;
        }

        videoStartSelector.onpointerdown = () => {
            mouseDownInStartSelector = true;
        }

        videoStartSelector.onpointerup = () => {
            mouseDownInStartSelector = false;
        }

        // Mover seletor de encerramento


        if (mouseDownInEndSelector && percentX < 100) {
            videoEndSelector.style.width = `${100 - percentX}%`;

            timeEnd = ((percentX / 100) * video.duration);
        }

        videoEndSelector.onpointerdown = () => {
            mouseDownInEndSelector = true;
        }

        videoEndSelector.onpointerup = () => {
            mouseDownInEndSelector = false;
        }


        // Mover o seletor do tempo do video atual


        if (mouseDownInCurrentSelector && percentX < 100) {
            videoCurrentSelector.style.left = `${percentX}%`;
            video.currentTime = ((percentX / 100) * video.duration);
        }

        videoCurrentSelector.onpointerdown = () => {
            mouseDownInCurrentSelector = true;
        }

        videoCurrentSelector.onpointerup = () => {
            mouseDownInCurrentSelector = false;
        }
    }

    videoTrimDiv.onmouseleave = () => {
        mouseDownInCurrentSelector = false;
        mouseDownInStartSelector = false;
        mouseDownInEndSelector = false;
    };

    video.ontimeupdate = () => {
        videoCurrentSelector.style.left = `${(video.currentTime / video.duration) * 100}%`;

        if (video.currentTime >= timeEnd - 0.2 || video.currentTime < timeStart) {
            video.currentTime = timeStart + 0.01;
        }
    };

    const play = document.getElementById("play");
    const pause = document.getElementById("pause");

    play.onclick = () => {
        video.play();
        play.style.display = "none";
        pause.style.display = "block"
    }
    pause.onclick = () => {
        video.pause();
        play.style.display = "block";
        pause.style.display = "none"
    }
}

inputFile.addEventListener("change", () => {
    if (inputFile.files[0].type.includes("image")) {
        previewImage();
    } else if (inputFile.files[0].type.includes("video")) {
        previewVideo();
    } else {
        previewDiv.style.border = "2px solid red";

        return;
    }
});


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


function getMousePositionPercentage(e, element) {
    const rect = element.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;

    return (mouseX / rect.width) * 100;
}




async function createPost() {
    setLoader();

    if (fileUrl) {
        const formData = new FormData();

        const file = await fetch(fileUrl);
        const fileBlob = await file.blob();

        formData.append("postFile", fileBlob);
        formData.append("caption", document.getElementById("caption").value);

        if (fileBlob) {
            const cutInterval = timeEnd - timeStart;

            formData.append("start", timeStart);
            formData.append("duration", cutInterval);
        }

        const reqCreate = await fetch("/post/create", {
            method: "POST",
            body: formData
        });

        if (reqCreate.status != 201) {
            if (reqCreate.status === 413) {
                removeLoader();
                return setModal("O servidor não pode cortar seu vídeo pois é grande demais", "Tente novamente com um arquivo menor.", "error");
            }

            setModal("Erro ao criar publicação", "A página será recarregada...", "error");

            return setTimeout(() => {
                window.location.reload();
            }, 5000);
        }


        removeLoader();

        return setModal("Publicação criada com sucesso.", "", "success");
    } else {
        setModal("Adicione um arquivo para criar uma publicação.", "", "message");
    }
}

document.getElementById("publish").addEventListener("click", createPost);