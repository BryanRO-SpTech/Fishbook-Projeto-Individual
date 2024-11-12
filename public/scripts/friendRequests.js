const loadPage = async () => {
    setLoader();
    const reqFriendRequests = await fetch("/friends/list-requests");

    if (!reqFriendRequests.ok) {
        setModal("Erro ao listar requisições de amizade.", "Tente novamente mais tarde", "error");
    }

    const resFriendRequests = await reqFriendRequests.json();

    const friendRequestsdiv = document.querySelector(".friend-requests");

    if (resFriendRequests.lenght > 1) {
        friendRequestsdiv.innerHTML = resFriendRequests.map((request) => {
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
    } else {
        friendRequestsdiv.innerHTML = "<h1 style='text-align: center'>Nenhuma solicitação de amizade pendente</h1>"
    }





    const reqSuggestions = await fetch("/friends/friends-suggestions");

    if (!reqSuggestions.ok) {
        setModal("Falha ao carregar sugestões de amizade.", "", "error");
    }

    const resSuggestions = await reqSuggestions.json();

    document.querySelector(".slide-content").innerHTML = resSuggestions.map((suggestion) => {
        return `
            <div class="slide-element">
                 <div class="element-container">
                    <div onclick="window.location.href = '/profile/${suggestion.username}'" class="profile" style="background-image: url(${suggestion.photo ? suggestion.photo : "/assets/icons/person.svg"})"></div>
                    <h3 onclick="window.location.href = '/profile/${suggestion.username}'">${suggestion.name}</h3>
                    <button onclick="sendFriendRequest('${suggestion.username}')">Adicionar</button>
                </div>
            </div>
        `;
    }).join("");

    removeLoader();
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

async function sendFriendRequest(username) {
    const req = await fetch(`/friends/friend-request/${username}`, {
        method: "POST"
    });

    if (!req.ok) {
        return setModal("Erro ao enviar solicitação de amizade.", "Tente novamente mais tarde.", "error");
    }


    loadPage();
    return setModal("Solicitação de amizade enviada", "", "success");
}

document.addEventListener("DOMContentLoaded", loadPage);


const slideBar = document.querySelector(".slide-content");

const scrollSlideBarToRigth = () => slideBar.scrollLeft += 700;
const scrollSlideBarToLeft = () => slideBar.scrollLeft -= 700;



document.getElementById("rigth-arrow").addEventListener("click", scrollSlideBarToRigth);
document.getElementById("left-arrow").addEventListener("click", scrollSlideBarToLeft);