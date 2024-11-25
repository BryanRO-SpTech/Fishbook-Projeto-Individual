const loadPage = async () => {
    loadKpis();
    visitInProfileGraphic();
    likesGraphic();
    timeUsageGraphic();
    fisheryGraphic();
}

const loadKpis = async () => {
    const reqKpi = await fetch("/dashboard/get/kpis");

    if (!reqKpi.ok) {
        setModal("Erro ao carregar informações do seu perfil", "", "error");
    }

    const resKpi = await reqKpi.json();

    document.getElementById("friends-kpi").innerHTML = resKpi.quantFriends;
    document.getElementById("posts-kpi").innerHTML = resKpi.quantPosts;
    document.getElementById("likes-kpi").innerHTML = resKpi.quantLikes;
    document.getElementById("visits-kpi").innerHTML = resKpi.quantVisits;
    document.getElementById("fish-kpi").innerHTML = resKpi.quantFisheries;
}


const visitInProfileGraphic = async () => {
    const reqVisits = await fetch("/dashboard/get/visits-group-month");

    if (!reqVisits.ok) {
        return setModal("Erro ao carregar informações do seu perfil", "", "error");
    }

    const resVisits = await reqVisits.json();


    const labels = resVisits.map(visit => `${visit.Month} / ${visit.Year}`);
    const data = resVisits.map(visit => visit.quantVisits);

    const maxData = Math.max(...data);
    const stepSize = Math.ceil(maxData / 10);


    const ctx = document.getElementById("visits-chart").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Quantidade de visitas",
                data,
                borderColor: "rgb(54, 162, 235)",
                backgroundColor: "#5EBEF2",
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            responsive: true,
            aspectRatio: 16 / 9,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize,
                        color: "#fff"
                    }
                },
                x: {
                    color: "#fff"
                }
            }
        }
    });
}

const likesGraphic = async () => {
    const reqLikes = await fetch("/dashboard/get/likes-group-month");

    if (!reqLikes.ok) {
        return setModal("Erro ao carregar informações do seu perfil", "", "error");
    }

    const resLikes = await reqLikes.json();

    const labels = resLikes.map(like => `${like.month} / ${like.year}`);
    const data = resLikes.map(like => like.quantLikes);

    const maxLikes = Math.max(...data);

    const stepSize = Math.ceil(maxLikes / 10);

    const ctx = document.getElementById("likes-chart").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Quantidade de Likes",
                data,
                borderColor: "rgb(54, 162, 235)",
                backgroundColor: "#5EBEF2",
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            responsive: true,
            aspectRatio: 16 / 9,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize,
                        color: "#FFF",

                    }
                },
                x: {
                    ticks: {
                        color: "#FFF",
                    }
                }
            }
        }
    });
}

const timeUsageGraphic = async () => {
    const reqUsage = await fetch("/dashboard/get/usage-group-week");

    if (!reqUsage.ok) {
        return setModal("Erro ao carregar informações do seu perfil", "", "error");
    }

    const resUsage = await reqUsage.json();

    const labels = resUsage.map(usage => usage.weekDay);
    const data = resUsage.map(usage => `${usage.usageTimeInMinutes}`);

    const maxData = Math.max(...data);

    const stepSize = Math.ceil(maxData / 10);

    const ctx = document.getElementById("usage-chart").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Tempo de uso semanal",
                data,
                borderColor: "rgb(54, 162, 235)",
                backgroundColor: "#5EBEF2",
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            responsive: true,
            aspectRatio: 16 / 9,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize,
                        color: "#FFF",

                    }
                },
                x: {
                    ticks: {
                        color: "#FFF",
                    }
                }
            }
        }
    });
}

const fisheryGraphic = async () => {
    const reqFishery = await fetch("/dashboard/get/fishery-group-month");

    if (!reqFishery.ok) {
        return setModal("Erro ao carregar informações do seu perfil", "", "error");
    }

    const resFishery = await reqFishery.json();

    const labels = resFishery.map(fisheries => fisheries.month);
    const data = resFishery.map(fisheries => fisheries.quantFisheries);

    const maxData = Math.max(...data);

    const stepSize = Math.ceil(maxData / 10);

    const ctx = document.getElementById("fishery-chart").getContext("2d");

    new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Tempo de uso semanal",
                data,
                borderColor: "rgb(54, 162, 235)",
                backgroundColor: "#5EBEF2",
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            responsive: true,
            aspectRatio: 16 / 9,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize,
                        color: "#FFF",

                    }
                },
                x: {
                    ticks: {
                        color: "#FFF",
                    }
                }
            }
        }
    });
}

window.onload = () => loadPage();