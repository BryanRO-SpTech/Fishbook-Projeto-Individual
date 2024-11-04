async function deleteProfile() {
    const password = document.getElementById("current-password").value;
    const confirm = document.getElementById("confirm").checked;

    if (!confirm) {
        return setModal("Erro", "Para excluir seu perfil, confirme a checkbox", "error");
    }

    if (!password) {
        return setModal("Erro", "Digite sua senha para excluir seu perfil", "error");
    }

    setLoader();

    const req = await fetch("/profile/delete", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
    });

    const res = await req.json();
    removeLoader();

    console.log(res);

    if (!req.ok) {

        if (res.message === "Incorrect password") {
            return setModal("Erro", "Sua senha está incorreta.", "error");
        }

        return setModal("Erro", "Erro ao excluir seu perfil. Tente novamente mais tarde.", "error");
    }

    setModal("Adeus...", "Seu perfil foi excluído com sucesso", "success");

    return setTimeout(() => {
        window.location.replace("/register");
    }, 5000)
}


document.getElementById("delete").addEventListener("click", deleteProfile); 