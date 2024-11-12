const loginForm = document.getElementById("login");

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    setLoader();

    const req = await fetch("/profile/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const res = await req.json();


    if (req.status === 400) {
        setModal("Usuário ou Senha incorretos", "Tente novamente", "error");
    } else if (req.ok) {
        localStorage.userId = res.user.userId;
        localStorage.email = res.user.email;
        localStorage.name = res.user.name;
        localStorage.username = res.user.username;
        localStorage.bio = res.user.bio;
        localStorage.profilePhoto = res.user.profilePhoto;


        return window.location.replace("/feed");
    } else {
        setModal("Erro interno do servidor", "Tente novamente mais tarde", "error")
    }

    removeLoader();
}


loginForm.addEventListener("submit", login);

