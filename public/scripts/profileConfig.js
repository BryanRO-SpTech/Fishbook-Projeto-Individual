(() => {
    document.getElementById("profile-photo").style.backgroundImage = `url(${sessionStorage.profilePhoto == "undefined" || sessionStorage.profilePhoto == "null" ? "/assets/icons/person.svg" : sessionStorage.profilePhoto})`;
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


    async function crop() {
        const croppedImage = cropper.getCroppedCanvas({
            with: 300,
            heigth: 300
        });

        const croppedImageUrl = await croppedImage.toDataURL('image/png');
        fetch(croppedImageUrl)
            .then(res => res.blob())
            .then(blob => {
                profilePhoto = new File([blob], "profile.png", { type: "image/png" });
            });
        previewPhotoDiv.style.backgroundImage = `url(${croppedImageUrl})`;

        cropContainer.style.display = "none";

        document.removeEventListener("click", crop);
        cropper.destroy();

        uploadPhoto.value = "";
    }

    document.getElementById("save-profile").addEventListener("click", crop);
}

uploadPhoto.addEventListener("change", previewImage);




function containsNumber(text) {
    for (let i = 0; i < text.length; i++) {
        if ("1234567890".includes(text[i])) {
            return true;
        }
    }

    return false;
}

function containsSpecialCharacter(text) {
    for (let i = 0; i < text.length; i++) {
        if (`!@#$%^&*()_+-={}[]|\\:"';<>,./?`.includes(text[i])) {
            return true;
        }
    }

    return false;
}

function removeInvalidCharacters(input, validCharacters, trim = false) {
    let text = "";
    for (let i = 0; i < input.value.length; i++) {
        if (validCharacters.includes(input.value[i])) {
            text += input.value[i];
        }
    }

    if (trim) {
        text.trim();
    }

    input.value = text;
}

function validateName() {
    const name = document.getElementById("ipt_name");
    const error = document.getElementById("error-name");

    error.innerHTML = "";

    if (containsNumber(name.value) || containsSpecialCharacter(name.value)) {
        error.innerHTML = "Nome não pode conter números ou caracteres especiais.";
    }


    removeInvalidCharacters(name, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ");

    if (name.value.length < 5) {
        error.innerHTML = "Nome deve conter pelo menos 5 caracteres."

        return false;
    }

    return true;
}

function validateEmail() {
    const email = document.getElementById("ipt_email");
    const error = document.getElementById("error-email");

    error.innerHTML = "";

    email.value = (email.value).toLowerCase();

    if (
        (!email.value.includes("@") || !email.value.includes(".")) ||
        (email.value.indexOf("@") > email.value.lastIndexOf(".")) ||
        (!email.value[email.value.lastIndexOf(".") + 1])
    ) {
        error.innerHTML = "O formato do email é inválido.";
        return false;
    }

    return true;
}






async function updateProfile() {
    if (!validateName() || !validateEmail()) {
        return setModal("Campos inválidos.", "Verifique se digitou corretamente seu nome e e-mail.", "error")
    }

    const name = document.getElementById("ipt_name").value;
    const email = document.getElementById("ipt_email").value;
    const bio = document.getElementById("ipt_bio").value;

    if (name === sessionStorage.name && email === sessionStorage.email && bio === sessionStorage.bio && !profilePhoto) {
        return setModal("Nenhuma alteração para salvar.", "Realize alterações nos dados do seu perfil para salvar.", "message")
    }

    setLoader();

    const reqUpdate = await fetch("/profile/update", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name === sessionStorage.name ? null : name,
            email: email === sessionStorage.email ? null : email,
            bio: bio === sessionStorage.bio ? null : bio
        })
    });

    const resUpdate = await reqUpdate.json();

    if (!reqUpdate.ok) {
        if (resUpdate.message === "Email already in use") {
            removeLoader();

            return setModal("Erro ao atualizar perfil", "Este e-mail está em uso por outro usuário", "error");
        }
    } else {
        sessionStorage.name = name;
        sessionStorage.email = email;
        sessionStorage.bio = bio;

        const formData = new FormData();
        formData.append("profilePhoto", profilePhoto);

        if (profilePhoto) {
            const reqPhoto = await fetch("/profile/update-profile-photo", {
                method: "PATCH",
                body: formData
            });

            const resPhoto = await reqPhoto.json();

            if (!reqPhoto.ok) {
                removeLoader();
                console.log(resPhoto);

                if (resPhoto.message === "File size limit exceeded. Maximum allowed size is 5MB.") {
                    return setModal("Erro ao atualizar perfil", "O tamanho máximo permitido para a foto é de 5MB.", "error");
                }

                return setModal("Perfil parcialmente atualizado, a foto de perfil não foi substituida.", "", "error");
            }

            console.log(resPhoto);

            sessionStorage.profilePhoto = resPhoto.imagePath;
        }

        removeLoader();
        return setModal("Sucesso ao atualizar o perfil", "", "success");
    }
}

document.getElementById("save").addEventListener("click", updateProfile);



async function logout() {


    const logout = await fetch("/profile/logout", {
        method: "POST"
    });

    if (logout.ok) {
        sessionStorage.clear();
        return window.location.replace("/login");
    }
}


document.getElementById("logout").addEventListener("click", logout);