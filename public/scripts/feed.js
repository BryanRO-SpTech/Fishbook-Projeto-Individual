const loadPage = async () => {
    // Carregar sugestões de amizade

    const reqSuggestions = await fetch("/friends/friends-suggestions");

    if (!reqSuggestions.ok) {
        setModal("Falha ao carregar sugestões de amizade.", "", "error");
    }

    const resSuggestions = await reqSuggestions.json();


    document.querySelector(".suggestions-content").innerHTML = resSuggestions.map((suggestion) => {
        return `
           <a href="/profile/${suggestion.username}">
                <div class="friend">
                    <div class="profile" style="background-image: url('${suggestion.photo ? suggestion.photo : "/assets/icons/person.svg"}');">
                    </div>
                    <span>${suggestion.name}</span>
                </div>
           </a>
        `;
    }).join("");




    // Carregar feed

}

loadPage();



const loadFeed = () => {

}






const comments = document.getElementById("comments");
const closeComments = document.getElementById("close-comments");
const openComments = document.querySelectorAll(".post-bar .comments")

function toggleComments() {
    return comments.classList.toggle("open")
}

closeComments.addEventListener("click", toggleComments);
openComments.forEach((open) => {
    open.addEventListener("click", toggleComments);
});