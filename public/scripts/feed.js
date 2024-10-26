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