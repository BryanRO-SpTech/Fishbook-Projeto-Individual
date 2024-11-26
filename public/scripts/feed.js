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
    loadFeed();

    const main = document.querySelector("main");

    main.onscroll = () => {
        if (main.scrollTop + main.clientHeight === main.scrollHeight) {
            console.log("TEantando carregar")
            loadFeed();
        }
    };
}

loadPage();

let lastFriendPost = "";
let lastFriendOfFriendPost = "";
let lastRandomPost = "";

const loadFeed = async () => {
    const reqPosts = await fetch(`/post/feed?lastFriendPost=${lastFriendPost}&lastFriendOfFriendPost=${lastFriendOfFriendPost}&lastRandomPost=${lastRandomPost}`);

    if (!reqPosts.ok) {
        setModal("Erro ao carregar feed", "Tente novamente mais tarde...", "error");
    }


    const resPosts = await reqPosts.json();

    if (resPosts.lastFriendPostDate) {
        lastFriendPost = resPosts.lastFriendPostDate;
    }

    if (resPosts.lastFriendsOfFriendsPostDate) {
        lastFriendOfFriendPost = resPosts.lastFriendsOfFriendsPostDate;
    }

    if (resPosts.lastRandomPost) {
        lastRandomPost = resPosts.lastRandomPost;
    }

    document.getElementById("feed").innerHTML += resPosts.posts.map((post) => {
        return `
            <div class="post">
                    <div class="post-content">
                        ${post.type === "IMAGE" ? `<img src="${post.filePath}" />` : `<video src="${post.filePath}" controls></video>`}
                    </div>
                    <div class="post-bar">
                        <div class="likes-comments">
                            <div class="likes">
                                <svg onclick="toggleLike(${post.idPost}, this)" class="heart ${post.isLiked ? "liked" : ""}" viewBox="0 0 42 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M36.1016 7.87542C35.2291 7.00247 34.1931 6.30998 33.0529 5.83752C31.9126 5.36506 30.6905 5.12189 29.4562 5.12189C28.222 5.12189 26.9998 5.36506 25.8596 5.83752C24.7193 6.30998 23.6834 7.00247 22.8108 7.87542L21 9.68626L19.1891 7.87542C17.4267 6.11295 15.0362 5.1228 12.5437 5.1228C10.0512 5.1228 7.66079 6.11295 5.89831 7.87542C4.13584 9.6379 3.14569 12.0283 3.14569 14.5208C3.14569 17.0134 4.13584 19.4038 5.89831 21.1663L21 36.2679L36.1016 21.1663C36.9746 20.2937 37.6671 19.2577 38.1395 18.1175C38.612 16.9772 38.8552 15.7551 38.8552 14.5208C38.8552 13.2866 38.612 12.0644 38.1395 10.9242C37.6671 9.78395 36.9746 8.74796 36.1016 7.87542Z"
                                        stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                                <span>${post.likes}</span>
                            </div>

                            <div class="comments" onclick="toggleComments('${post.caption}', ${post.idPost})">
                                <svg class="comment" onclick="this.classList.toggle('open')" viewBox="0 0 37 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M33.2139 25.7576C35.2808 22.2871 35.9754 18.2049 35.1679 14.2736C34.3605 10.3423 32.1062 6.83078 28.8262 4.39506C25.5462 1.95935 21.4648 0.766033 17.3446 1.03805C13.2243 1.31007 9.34702 3.02882 6.43698 5.87321C3.52695 8.71759 1.78324 12.4931 1.5316 16.4943C1.27997 20.4955 2.53762 24.4488 5.0696 27.6157C7.60159 30.7826 11.2347 32.9463 15.2903 33.7028C19.3459 34.4593 23.5464 33.7568 27.1073 31.7264L35.5 34L33.2139 25.7576Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
                                </svg>    
                            </div>
                        </div>

                        <a class="post-owner" href="/profile/${post.postOwner.username}">
                            <div class="profile"  style="background-image: url(${post.postOwner.profilePhoto ? post.postOwner.profilePhoto : "/assets/icons/person.svg"});"></div>
                            <span>${post.postOwner.name}</span>
                        </a>
                    </div>
                </div>
        `;
    }).join("");
}

async function toggleLike(postId, likeButton) {
    const reqToggleLike = await fetch(`/post/like/${postId}`, {
        method: "POST"
    });

    if (!reqToggleLike.ok) {
        return setMessage("Erro ao curtir publicação", "Tente novamente mais tarde", "error");
    }

    const resToggleLike = await reqToggleLike.json();

    likeButton.classList.toggle("liked");

    const likesCounter = likeButton.parentNode.querySelector("span");

    if (resToggleLike.message === "Post liked") {
        return likesCounter.innerHTML++;
    }

    return likesCounter.innerHTML--;
}

const comments = document.getElementById("comments");
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

closeComments.addEventListener("click", toggleComments);
