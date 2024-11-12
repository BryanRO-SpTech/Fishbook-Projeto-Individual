const [empty, path, username] = window.location.pathname.split("/");


const loadPage = async () => {
    setLoader();

    const profile = await (await fetch(`/profile/get/${username}`)).json();
    const quantFriends = await ((await fetch("/friends/count/" + username)).json());

    removeLoader();

    if (profile.statusCode === 404) {
        setModal("Usuário inexistente", "Você será redirecionado ao seu perfil.", "error");

        setTimeout(() => window.location.replace(`/profile/${localStorage.username}`), 5000);

        setLoader();
    }

    document.getElementById("profile-photo").style.backgroundImage = `url(/${!profile.profilePhoto ? "assets/icons/person.svg" : profile.profilePhoto})`;
    document.getElementById("name").innerHTML = profile.name;
    document.getElementById("username").innerHTML = `@${profile.username}`;
    document.getElementById("bio").innerHTML = profile.bio;


    document.getElementById("friends-kpi").onclick = () => window.location.href = `/profile/${profile.username}/friends`;
    document.getElementById("quant-friends").innerHTML = quantFriends.friendsCount;



    const btn = document.getElementById("add-friend");
    const btnRefuse = document.getElementById("refuse");

    if (btnRefuse) {
        btnRefuse.remove();
    }

    if (profile.isMyProfile) {
        btn.style.backgroundColor = "#666673";
        btn.innerHTML = "Editar Perfil"

        btn.onclick = () => window.location.href = "/profile-config";

    }

    else if (profile.isMyFriend) {
        btn.style.backgroundColor = "#666673";
        btn.innerHTML = "Remover Amigo";

        btn.onclick = removeFriend;
    }

    else if (profile.isFriendRequestReceived) {
        btn.innerHTML = "Aceitar Solicitação";

        btn.onclick = acceptFriendRequest;

        btn.insertAdjacentHTML("afterend", `
            <button id="refuse">Recusar Solicitação</button>
        `);

        const btnRefuse = document.getElementById("refuse");
        btnRefuse.onclick = refuseFriendRequest;
    }

    else if (profile.isFriendRequestSended) {
        btn.style.backgroundColor = "#666673";
        btn.innerHTML = "Cancelar Solicitação";

        btn.onclick = cancelFriendRequest;
    }

    else {
        btn.style.backgroundColor = "#5EBEF2";
        btn.innerHTML = "Adicionar";
        btn.onclick = sendFriendRequest;
    }


    async function sendFriendRequest() {
        const req = await fetch(`/friends/friend-request/${profile.username}`, {
            method: "POST"
        });

        if (!req.ok) {
            return setModal("Erro ao enviar solicitação de amizade.", "Tente novamente mais tarde.", "error");
        }


        loadPage();
        return setModal("Solicitação de amizade enviada", "", "success");
    }

    async function cancelFriendRequest() {
        const req = await fetch(`/friends/cancel-friend-request/${profile.username}`, {
            method: "DELETE"
        });

        if (!req.ok) {
            return setModal("Erro ao cancelar solicitação de amizade.", "Tente novamente mais tarde.", "error");
        }


        loadPage();
        return setModal("Solicitação de amizade cancelada", "", "message");
    }

    async function acceptFriendRequest() {
        const req = await fetch(`/friends/accept-friend-request/${profile.username}`, {
            method: "POST"
        });

        if (!req.ok) {
            return setModal("Erro ao aceitar solicitação de amizade.", "Tente novamente mais tarde.", "error");
        }


        loadPage();
        return setModal("Solicitação de amizade aceita", "", "success");
    }

    async function refuseFriendRequest() {
        const req = await fetch(`/friends/refuse-friend-request/${profile.username}`, {
            method: "POST"
        });

        if (!req.ok) {
            return setModal("Erro ao recusar solicitação de amizade.", "Tente novamente mais tarde.", "error");
        }


        loadPage();
        return setModal("Solicitação de amizade recusada", "", "message");
    }

    async function removeFriend() {
        const req = await fetch(`/friends/remove-friend/${profile.username}`, {
            method: "DELETE"
        });

        if (!req.ok) {
            return setModal("Erro ao remover amigo.", "Tente novamente mais tarde.", "error");
        }


        loadPage();
        return setModal("Amigo removido", "", "message");
    }
};


window.addEventListener("DOMContentLoaded", loadPage);






