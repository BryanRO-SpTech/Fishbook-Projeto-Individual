(() => {
    document.getElementById("profile-photo").style.backgroundImage = `url(${!sessionStorage.profilePhoto ? "/assets/icons/person.svg" : sessionStorage.profilePhoto})`;
    document.getElementById("name").innerHTML = sessionStorage.name;
    document.getElementById("username").innerHTML = `@${sessionStorage.username}`;

    document.getElementById("ipt_name").value = sessionStorage.name;
    document.getElementById("ipt_email").value = sessionStorage.email;
    document.getElementById("ipt_bio").value = sessionStorage.bio;
})();


const previewPhotoDiv = document.getElementById("profile-photo");
const uploadPhoto = document.getElementById("upload");

let profilePhoto;

function previewImage() {
    const file = uploadPhoto.files[0];

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
        fetch(croppedImageUrl).then((file) => {
            file.blob()
        }).then((blob) => {
            profilePhoto = new File([blob], "profile.png", { type: "image/png" });
        })

        cropContainer.style.display = "none";

        document.removeEventListener("click", crop);
        cropper.destroy();

        uploadPhoto.value = "";
    }

    document.getElementById("save-profile").addEventListener("click", crop);
}


function updateProfile() {

}


uploadPhoto.addEventListener("change", previewImage);