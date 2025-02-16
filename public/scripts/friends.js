const [empty, path, username] = window.location.pathname.split("/");

const loadPage = async () => {
    setLoader();
    const reqFriends = await fetch("/friends/list-friends/" + username);

    if (!reqFriends.ok) {
        return setModal("Erro ao carregar amigos.", "Tente novamente mais tarde.", "error");
    }

    const resFriends = await reqFriends.json();

    console.log(resFriends);


    if (resFriends.isMyFriends) {
        document.getElementById("title").innerHTML = `Seus amigos`;
    } else {
        document.getElementById("title").innerHTML = `Amigos de ${username}`;
        document.getElementById("view-requests-button").remove();
    }


    document.querySelector(".friends").innerHTML = resFriends.friends.map((friend) => {
        return `
        <div class="friend">
                <div class="profile-div">
                    <div class="profile" style="background-image: url(/${!friend.photo ? "assets/icons/person.svg" : friend.photo})" onclick="window.location.href = '/profile/${friend.username}'"></div>
                    <span class="name" onclick="window.location.href = '/profile/${friend.username}'">${friend.name}</span>
                </div>
                ${resFriends.isMyFriends ? `<button onclick="removeFriend('${friend.username}')">Remover</button>` : ""}
        </div>
        `
    }).join("");





    const reqSuggestions = await fetch("/friends/friends-suggestions");

    if (!reqSuggestions.ok) {
        setModal("Falha ao carregar sugestões de amizade.", "", "error");
    }

    const resSuggestions = await reqSuggestions.json();

    document.querySelector(".slide-content").innerHTML = resSuggestions.map((suggestion) => {
        return `
            <div class="slide-element">
                 <div class="element-container">
                    <div onclick="window.location.href = '/profile/${suggestion.username}'" class="profile" style="background-image: url(/${suggestion.photo ? suggestion.photo : "assets/icons/person.svg"})"></div>
                    <h3 onclick="window.location.href = '/profile/${suggestion.username}'">${suggestion.name}</h3>
                    <button onclick="sendFriendRequest('${suggestion.username}', this)">Adicionar</button>
                </div>
            </div>
        `;
    }).join("");


    removeLoader();
}

async function removeFriend(username) {
    const req = await fetch(`/friends/remove-friend/${username}`, {
        method: "DELETE"
    });

    if (!req.ok) {
        return setModal("Erro ao remover amigo.", "Tente novamente mais tarde.", "error");
    }


    loadPage();
    return setModal("Amigo removido", "", "message");
}


async function sendFriendRequest(username, element) {
    const req = await fetch(`/friends/friend-request/${username}`, {
        method: "POST"
    });

    if (!req.ok) {
        return setModal("Erro ao enviar solicitação de amizade.", "Tente novamente mais tarde.", "error");
    }

    element.parentNode.parentNode.remove();

    return setModal("Solicitação de amizade enviada", "", "success");
}


document.addEventListener("DOMContentLoaded", loadPage);

const slideBar = document.querySelector(".slide-content");

const scrollSlideBarToRigth = () => slideBar.scrollLeft += 700;
const scrollSlideBarToLeft = () => slideBar.scrollLeft -= 700;



document.getElementById("rigth-arrow").addEventListener("click", scrollSlideBarToRigth);
document.getElementById("left-arrow").addEventListener("click", scrollSlideBarToLeft);