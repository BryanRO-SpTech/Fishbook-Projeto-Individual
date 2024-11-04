function containsUpperCase(text) {
    return text.toLowerCase() != text;
}


function containsLowerCase(text) {
    return text.toUpperCase() != text;
}


function containsNumber(text) {
    for (let i = 0; i < text.length; i++) {
        if ("1234567890".includes(text[i])) {
            return true;
        }
    }

    return false;
}

function containsJustNumbers(text) {
    return !isNaN(Number(text));
}


function validatePass() {
    const pass = document.getElementById("new-password").value;
    const error = document.getElementById("error-newPassword");

    error.innerHTML = "";

    let valid = true;

    if (!containsLowerCase(pass)) {
        error.innerHTML = "A senha deve conter ao menos uma letra minúscula";
        valid = false;
    }

    else if (!containsUpperCase(pass)) {
        error.innerHTML = "A senha deve conter ao menos uma letra maiúscula";
        valid = false;
    }

    else if (!containsNumber(pass)) {
        error.innerHTML = "A senha deve conter ao menos um número";
        valid = false;
    }

    else if (containsJustNumbers(pass)) {
        error.innerHTML = "A senha precisa conter letras";
        valid = false;
    }

    else if (pass.length < 6) {
        error.innerHTML = "A senha precisa conter ao menos 6 dígitos";
        valid = false;
    }

    return valid;
}

function validateConfirm() {
    const pass = document.getElementById("new-password").value;
    const confirm = document.getElementById("confirm-password").value;
    const error = document.getElementById("error-confirm");

    error.innerHTML = "";

    if (confirm !== pass) {
        error.innerHTML = "As senhas não coincidem";

        return false;
    }

    return true;
}


async function updatePassword() {
    if (!validatePass() || !validateConfirm()) {
        return setModal("Erro", "Verifique os campos e tente novamente", "error");
    }

    const oldPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;

    setLoader();

    const reqUpdate = await fetch("/profile/update-password", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ oldPassword, newPassword })
    });

    const res = await reqUpdate.json();

    if (reqUpdate.ok) {
        setModal("Senha atualizada com sucesso", res.message, "success");
    } else if (res.message === "Incorrect password") {
        setModal("Erro", "Sua senha atual está incorreta.", "error");
    }


    removeLoader();
}

document.getElementById("save").addEventListener("click", updatePassword);