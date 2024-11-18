let [empty, path, username] = window.location.pathname.split("/");


const loadProfile = async () => {
    setLoader();

    const profile = await (await fetch(`/profile/get/${username}`)).json();

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


        loadProfile();
        return setModal("Solicitação de amizade enviada", "", "success");
    }

    async function cancelFriendRequest() {
        const req = await fetch(`/friends/cancel-friend-request/${profile.username}`, {
            method: "DELETE"
        });

        if (!req.ok) {
            return setModal("Erro ao cancelar solicitação de amizade.", "Tente novamente mais tarde.", "error");
        }


        loadProfile();
        return setModal("Solicitação de amizade cancelada", "", "message");
    }

    async function acceptFriendRequest() {
        const req = await fetch(`/friends/accept-friend-request/${profile.username}`, {
            method: "POST"
        });

        if (!req.ok) {
            return setModal("Erro ao aceitar solicitação de amizade.", "Tente novamente mais tarde.", "error");
        }


        loadProfile();
        return setModal("Solicitação de amizade aceita", "", "success");
    }

    async function refuseFriendRequest() {
        const req = await fetch(`/friends/refuse-friend-request/${profile.username}`, {
            method: "POST"
        });

        if (!req.ok) {
            return setModal("Erro ao recusar solicitação de amizade.", "Tente novamente mais tarde.", "error");
        }


        loadProfile();
        return setModal("Solicitação de amizade recusada", "", "message");
    }

    async function removeFriend() {
        const req = await fetch(`/friends/remove-friend/${profile.username}`, {
            method: "DELETE"
        });

        if (!req.ok) {
            return setModal("Erro ao remover amigo.", "Tente novamente mais tarde.", "error");
        }


        loadProfile();
        return setModal("Amigo removido", "", "message");
    }
};


const loadPosts = async () => {
    const postsDiv = document.querySelector(".posts-content");

    const reqPosts = await fetch(`/post/${username}`);

    if (!reqPosts.ok) {
        return setModal("Erro ao carregar publicações do usuário", "", "error");
    }

    const resPosts = await reqPosts.json();

    let likes = 0;

    postsDiv.innerHTML = resPosts.posts.map((post) => {
        likes += post.likes;
        return `
            <div class="post" onclick="expandPost(this, ${post.idPost}, '${post.caption}')">
                ${post.type === "IMAGE" ? `<img src="/${post.filePath}">` : `<video autoplay muted loop src="/${post.filePath}"></video>`}

                <div class="post-details">
                <svg class="like-icon ${post.isLiked ? "liked" : ""}" width="30" fill="none" height="30" viewBox="0 0 42 41" xmlns="http://www.w3.org/2000/svg">
                    <path stroke="white" d="M36.1016 7.87542C35.2291 7.00247 34.1931 6.30998 33.0529 5.83752C31.9126 5.36506 30.6905 5.12189 29.4562 5.12189C28.222 5.12189 26.9998 5.36506 25.8596 5.83752C24.7193 6.30998 23.6834 7.00247 22.8108 7.87542L21 9.68626L19.1891 7.87542C17.4267 6.11295 15.0362 5.1228 12.5437 5.1228C10.0512 5.1228 7.66079 6.11295 5.89831 7.87542C4.13584 9.6379 3.14569 12.0283 3.14569 14.5208C3.14569 17.0134 4.13584 19.4038 5.89831 21.1663L21 36.2679L36.1016 21.1663C36.9746 20.2937 37.6671 19.2577 38.1395 18.1175C38.612 16.9772 38.8552 15.7551 38.8552 14.5208C38.8552 13.2866 38.612 12.0644 38.1395 10.9242C37.6671 9.78395 36.9746 8.74796 36.1016 7.87542Z" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <span class="likes">${post.likes}</span>
            </div>
        </div>
        `;
    }).join("");


    return {
        quantPosts: resPosts.posts.length,
        quantLikes: likes
    };
}

const loadKpis = async (quantPosts, quantLikes) => {
    // Amizade
    document.getElementById("friends-kpi").onclick = () => window.location.href = `/profile/${username}/friends`;

    const quantFriends = await ((await fetch("/friends/count/" + username)).json());
    document.getElementById("quant-friends").innerHTML = quantFriends.friendsCount;

    // Publicações
    document.getElementById("quant-posts").innerHTML = quantPosts;

    // Likes
    document.getElementById("quant-likes").innerHTML = quantLikes;
}

window.onload = async () => {
    loadProfile();
    const { quantPosts, quantLikes } = await loadPosts();

    loadKpis(quantPosts, quantLikes);
}





let postId;
let postHTMLelement;
let postCaption;

const expandPost = (post, idPost, caption) => {
    const postExtendedDiv = document.getElementById("post-extended-div");

    post.classList.add("extended");
    postExtendedDiv.style.display = "flex";

    postId = idPost;
    postHTMLelement = post;
    postCaption = caption;

    const liked = post.querySelector(".like-icon").classList.contains("liked");

    const likeButton = document.getElementById("like")

    if (liked) {
        return likeButton.classList.add("liked");
    }

    return likeButton.classList.remove("liked");
}

const closePost = () => {
    const postExtendedDiv = document.getElementById("post-extended-div");

    postExtendedDiv.style.display = "none";

    const postExtended = document.querySelector(".post.extended");

    if (postExtended) {
        postExtended.classList.remove("extended");
    }

}

const closePostOnEsc = (e) => {
    if (e.key === "Escape") {
        closePost();
    }
}



async function toggleLike() {
    const reqToggleLike = await fetch(`/post/like/${postId}`, {
        method: "POST"
    });

    if (!reqToggleLike.ok) {
        return setMessage("Erro ao curtir publicação", "Tente novamente mais tarde", "error");
    }

    const resToggleLike = await reqToggleLike.json();

    console.log(postHTMLelement.querySelector(".like-icon"))
    const likeButton = document.getElementById("like");

    likeButton.classList.toggle("liked");
    postHTMLelement.querySelector(".like-icon").classList.toggle("liked");

    if (resToggleLike.message === "Post liked") {
        return postHTMLelement.querySelector(".likes").innerHTML++;
    }

    return postHTMLelement.querySelector(".likes").innerHTML--;

}


document.getElementById("like").onclick = toggleLike;


document.onkeydown = closePostOnEsc;
document.getElementById("close-post").onclick = closePost;








// Comentários 

const comments = document.getElementById("comments");
const openComments = document.getElementById("comment-button");
const closeComments = document.getElementById("close-comments");
const captionSpan = document.getElementById("caption");

const sendCommentButton = document.getElementById("send");

async function toggleComments(caption, postId) {
    if (!postId) {
        return comments.classList.remove("open");
    }

    captionSpan.innerHTML = caption;

    const reqComments = await fetch(`/post/comments/${postId}`);

    if (!reqComments.ok) {
        return setModal("Erro ao carregar comentários...", "Tente novamente mais tarde.", "error");
    }

    const resComments = await reqComments.json();

    const commentsHTML = resComments.map((comment) => {
        const formatDateTime = new Date(comment.dateTime).toLocaleDateString("pt-br", { hour: "numeric", minute: "numeric" });

        return `
            <div class="comment">
                <div class="container">
                    <a href="/profile/${comment.username}" class="comment-profile">
                        <div class="profile" style="background-image: url(${comment.profilePhotoPath ? comment.profilePhotoPath : "/assets/icons/person.svg"});">
                        </div><span class="comment-owner">${comment.name} <span style="color: gray; font-size: 13px; text-indent: 10px">${formatDateTime}</span> </span>
                    </a>
                </div>

                <span id="comment">${comment.comment}</span>
            </div>
        `;
    }).join("");

    document.getElementById("comment-content").innerHTML = commentsHTML;


    // Fazer comentário:

    sendCommentButton.onclick = () => createComment(postId);


    return comments.classList.toggle("open");
}


async function createComment(postId) {
    const commentInput = document.getElementById("commentInput").value;

    if (commentInput.length > 0) {
        const reqComment = await fetch(`/post/comment/${postId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                comment: commentInput
            })
        });

        if (reqComment.status !== 201) {
            return setModal("Erro ao enviar comentário", "Tente novamente mais tarde.", "error");
        }

        const formatDateTime = new Date().toLocaleDateString("pt-br", { hour: "numeric", minute: "numeric" });

        document.getElementById("comment-content").insertAdjacentHTML("afterbegin", `
            <div class="comment">
                <div class="container">
                    <a href="/profile/${localStorage.username}" class="comment-profile">
                        <div class="profile" style="background-image: url(${localStorage.profilePhoto == "null" ? "/assets/icons/person.svg" : localStorage.profilePhoto});">
                        </div><span class="comment-owner">${localStorage.name} <span style="color: gray; font-size: 13px; text-indent: 10px">${formatDateTime}</span></span>
                    </a>
                </div>

                <span id="comment">${commentInput}</span>
            </div>
        `);
    }
}

openComments.addEventListener("click", () => {
    toggleComments(postCaption, postId);
});

closeComments.addEventListener("click", toggleComments);
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        toggleComments();
    }
})
