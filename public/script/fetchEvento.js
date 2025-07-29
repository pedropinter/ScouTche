document.addEventListener("DOMContentLoaded", () => {
    const telasContainer = document.querySelector(".telas");
    const urlBase = "/peneira";

    async function carregarEventos() {
        try {
            const res = await fetch(urlBase);
            if (!res.ok) throw new Error("Erro ao carregar eventos");
            const eventos = await res.json();
            telasContainer.innerHTML = "";
            eventos.forEach(evento => {
                const card = document.createElement("section");
                card.classList.add("tela");
                card.dataset.id = evento.id;
                card.innerHTML = `
          <h6>${evento.nome}</h6>
          <p>Tipo: ${evento.tipo}</p>
          <p>Modalidade: ${evento.modalidade}</p>
          <button class="btn-editar">Editar</button>
          <button class="btn-excluir">Excluir</button>
        `;
                telasContainer.appendChild(card);
            });
        } catch (error) {
            alert(error.message);
        }
    }

    async function criarEvento(form) {
        const dados = {
            tipo: form.tipo.value,
            nome: form.nome.value,
            desc: form.desc.value,
            cep: Number(form.cep.value),
            modalidade: form.modalidade.value,
        };
        try {
            const res = await fetch(urlBase, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Erro ao criar evento");
            }
            alert("Evento criado: " + dados.nome);
            carregarEventos();
        } catch (error) {
            alert(error.message);
        }
    }

    async function atualizarEvento(id, dados) {
        try {
            const res = await fetch(`${urlBase}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Erro ao atualizar evento");
            }
            alert("Evento atualizado: " + dados.nome);
            carregarEventos();
        } catch (error) {
            alert(error.message);
        }
    }

    async function deletarEvento(id) {
        if (!confirm("Tem certeza que deseja excluir este evento?")) return;
        try {
            const res = await fetch(`${urlBase}/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Erro ao excluir evento");
            }
            alert("Evento excluído");
            carregarEventos();
        } catch (error) {
            alert(error.message);
        }
    }


    const modalSeletivaForm = document.querySelector("#modalSeletiva form");
    if (modalSeletivaForm) {
        modalSeletivaForm.addEventListener("submit", e => {
            e.preventDefault();
            criarEvento(modalSeletivaForm);
            const modal = bootstrap.Modal.getInstance(document.getElementById("modalSeletiva"));
            modal.hide();
            modalSeletivaForm.reset();
        });
    }

    telasContainer.addEventListener("click", async e => {
        const btn = e.target;
        const card = btn.closest(".tela");
        if (!card) return;
        const id = card.dataset.id;


        if (btn.classList.contains("btn-editar")) {

            const nome = card.querySelector("h6").textContent;
            const tipo = card.querySelector("p:nth-child(2)").textContent.replace("Tipo: ", "");
            const modalidade = card.querySelector("p:nth-child(3)").textContent.replace("Modalidade: ", "");



            const novoNome = prompt("Editar nome do evento:", nome);
            if (!novoNome) return;

            const dadosAtualizados = {
                tipo: tipo,
                nome: novoNome,
                desc: "",
                cep: 0,
                modalidade: modalidade
            };
            await atualizarEvento(id, dadosAtualizados);
        }


        if (btn.classList.contains("btn-excluir")) {
            await deletarEvento(id);
        }
    });


    carregarEventos();
});
