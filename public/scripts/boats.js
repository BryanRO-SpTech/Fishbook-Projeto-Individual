(async () => {
    const reqBoats = await fetch('/boat/get');

    if (!reqBoats.ok) {
        setModal("Erro ao carregar barcos", "Erro ao carregar barcos, tente novamente mais tarde", "error");
    }

    const resBoats = await reqBoats.json();

    const list = document.getElementById("boat-list");

    list.innerHTML = resBoats.map((boat) => {
        return `
            <div class="boat">
                <div class="boat-name">
                    <span>${boat.name}</span>
                </div>
                <button onclick="deleteBoat('${boat.idBoat}', event)">Excluir</button>
            </div>
        `;
    });
})();

const deleteBoat = async (id, event) => {
    setLoader();

    const deleteBoat = await fetch(`/boat/delete/${id}`, {
        method: "DELETE"
    });

    removeLoader();

    if (!deleteBoat.ok) {
        if (deleteBoat.status === 404) {
            return setModal("Barco não encontrado", "Atualize a página e tente novamente", "error");
        }

        if (deleteBoat.status === 400) {
            return setModal("Barco possui pescarias", "Exclua as pescarias do barco antes de excluí-lo", "error");
        }

        return setModal("Erro ao excluir barco", "Erro ao excluir barco, tente novamente mais tarde", "error");
    }




    event.target.parentNode.remove();
    return setModal("Barco excluído", "Barco excluído com sucesso", "success");
}