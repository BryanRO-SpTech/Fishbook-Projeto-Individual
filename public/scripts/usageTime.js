setInterval(() => {
    fetch("/profile/usage-time", {
        method: "POST"
    });
}, 5000);