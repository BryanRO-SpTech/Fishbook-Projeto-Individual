const [empty, path, username] = window.location.pathname.split("/");

const loadPage = async () => {
    setLoader();
    const reqFriends = await fetch("/friends/list-friends/" + username);

    if (!reqFriends.ok) {
        return setModal("Erro ao carregar amigos.", "Tente novamente mais tarde.", "error");
    }

    const resFriends = await reqFriends.json();


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
                <button onclick="removeFriend('${friend.username}')">Remover</button>
        </div>
        `
    }).join("");





    const reqSuggestions = await fetch("/friends/friends-suggestions");

    if (!reqSuggestions.ok) {
        setModal("Falha ao carregar sugestões de amizade.", "", "error");
    }

    const resSuggestions = await reqSuggestions.json();


    console.log(resSuggestions)

    // document.getElementById("slide-content").innerHTML







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


document.addEventListener("DOMContentLoaded", loadPage);