const loadPage = async () => {
    const reqFriendRequests = await fetch("/friends/list-requests");

    if (!reqFriendRequests.ok) {
        setModal("Erro ao listar requisições de amizade.", "Tente novamente mais tarde", "error");
    }

    const resFriendRequests = await reqFriendRequests.json();

    document.querySelector(".friend-requests").innerHTML = resFriendRequests.map((request) => {
        return `
            <div class="request">
                <div class="profile-div">
                    <div class="profile" style="background-image: url(/${!request.photo ? "assets/icons/person.svg" : request.photo})" onclick="window.location.href = '/profile/${request.username}'"></div>
                    <span class="name" onclick="window.location.href = '/profile/${request.username}'">${request.name}</span>
                </div>

                <div class="request-response">
                    <div class="accept response-button" onclick="acceptFriendRequest('${request.username}')"></div>
                    <div class="refuse response-button" onclick="refuseFriendRequest('${request.username}')"></div>
                </div>
            </div>
        `
    }).join();
}


async function acceptFriendRequest(username) {
    const req = await fetch(`/friends/accept-friend-request/${username}`, {
        method: "POST"
    });

    if (!req.ok) {
        return setModal("Erro ao aceitar solicitação de amizade.", "Tente novamente mais tarde.", "error");
    }


    loadPage();
    return setModal("Solicitação de amizade aceita", "", "success");
}

async function refuseFriendRequest(username) {
    const req = await fetch(`/friends/refuse-friend-request/${username}`, {
        method: "POST"
    });

    if (!req.ok) {
        return setModal("Erro ao recusar solicitação de amizade.", "Tente novamente mais tarde.", "error");
    }


    loadPage();
    return setModal("Solicitação de amizade recusada", "", "message");
}

document.addEventListener("DOMContentLoaded", loadPage);