document.addEventListener("DOMContentLoaded", () => {
  const telasContainer = document.querySelector(".telas");
  const urlBase = "/peneira";

  function mostrarAlertaBootstrap(mensagem, tipo = "danger", duracao = 4000) {
    const container = document.getElementById("alert-container");
    const alert = document.createElement("div");
    alert.className = `alert alert-${tipo} alert-dismissible fade show`;
    alert.role = "alert";
    alert.innerHTML = `
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
    container.appendChild(alert);
    setTimeout(() => {
      const alerta = bootstrap.Alert.getOrCreateInstance(alert);
      alerta.close();
    }, duracao);
  }

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
      mostrarAlertaBootstrap(error.message, "danger");
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
      mostrarAlertaBootstrap("Evento criado com sucesso!", "success");
      carregarEventos();
    } catch (error) {
      mostrarAlertaBootstrap(error.message, "danger");
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
      mostrarAlertaBootstrap("Evento atualizado: " + dados.nome, "success");
      carregarEventos();
    } catch (error) {
      mostrarAlertaBootstrap(error.message, "danger");
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
      mostrarAlertaBootstrap("Evento excluído", "success");
      carregarEventos();
    } catch (error) {
      mostrarAlertaBootstrap(error.message, "danger");
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

async function carregarFoto() {
  const foto = document.getElementById('fotoP');
  const usuario = JSON.parse(localStorage.getItem('usuarioDados'));


  let pers = Number(usuario.id);

  try {
    const res = await fetch(`http://localhost:3000/api/get/perfil/${pers}`); // Troque 123 pelo ID real
    if (res.ok) {
      const data = await res.json(); // Extrai o JSON da resposta
      const pers = Number(data.avatar); // Garante que seja um número

      switch (pers) {
        case 1:
          foto.src = 'img/foto0.jpeg';
          fotoPerfil.src = 'img/foto0.jpeg';
          break;
        case 2:
          foto.src = 'img/foto1.jpeg';
          fotoPerfil.src = 'img/foto2.jpeg';
          break;
        case 3:
          foto.src = 'img/foto2.jpeg';
          fotoPerfil.src = 'img/foto2.jpeg';
          break;
        case 4:
          foto.src = 'img/foto3.jpeg';
          fotoPerfil.src = 'img/foto3.jpeg';
          break;
        case 5:
          foto.src = 'img/foto4.jpeg';
          fotoPerfil.src = 'img/foto4.jpeg';
          break;
        case 6:
          foto.src = 'img/foto5.jpeg';
          fotoPerfil.src = 'img/foto5.jpeg';
          break;
        case 7:
          foto.src = 'img/foto6.jpeg';
          fotoPerfil.src = 'img/foto6.jpeg';
          break;
        case 8:
          foto.src = 'img/foto7.jpeg';
          fotoPerfil.src = 'img/foto7.jpeg';

          break;
        default:
          foto.src = 'https://i.postimg.cc/gJg6vRMH/image.png';
          break;
      }
    } else {
      document.getElementById('mensagem').innerText = 'Erro ao carregar perfil.';
    }
  } catch (error) {
    document.getElementById('mensagem').innerText = 'Erro na API: ' + error.message;
  }
}