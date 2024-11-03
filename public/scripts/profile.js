(async () => {
    setLoader();

    const [empty, path, username] = window.location.pathname.split("/");

    const profile = await (await fetch(`/profile/get/${username}`)).json();

    removeLoader();

    if (profile.statusCode === 404) {
        setModal("Usuário inexistente", "Você será redirecionado ao seu perfil.", "error");

        setTimeout(() => window.location.replace(`/profile/${sessionStorage.username}`), 5000);

        setLoader();
    }


    document.getElementById("profile-photo").style.backgroundImage = `url(/${!profile.profilePhoto ? "assets/icons/person.svg" : profile.profilePhoto})`;
    document.getElementById("name").innerHTML = profile.name;
    document.getElementById("username").innerHTML = `@${profile.username}`;
    document.getElementById("bio").innerHTML = profile.bio;

    document.querySelectorAll
    const btn = document.getElementById("add-friend");

    if (profile.isMyProfile) {
        btn.style.backgroundColor = "#666673";
        btn.innerHTML = "Editar Perfil"

        btn.onclick = () => window.location.href = "/profile-config";

    } else if (profile.isMyFriend) {
        btn.style.backgroundColor = "#666673";
        btn.innerHTML = "Remover Amigo";
    }
})();



