document.addEventListener("DOMContentLoaded", () => {
  const telasContainer = document.querySelector(".telas");

  // ---------- Mostrar alerta ----------
  function mostrarAlerta(msg, tipo = "danger") {
    const alerta = document.getElementById("alertContainer");
    alerta.textContent = msg;
    alerta.className = `alert alert-${tipo} mt-3 text-center`;
    alerta.classList.remove("d-none");
    setTimeout(() => alerta.classList.add("d-none"), 4000);
  }

  // ---------- Carregar foto ----------
  async function carregarFoto() {
    const foto = document.getElementById("fotoP");
    const fotoMobile = document.getElementById("fotoPMobile");
    const usuario = JSON.parse(localStorage.getItem("usuarioDados"));
    if (!usuario) return;

    try {
      const res = await fetch(`http://localhost:3000/api/get/perfil/${Number(usuario.id)}`);
      if (!res.ok) return;
      const data = await res.json();
      const avatar = Number(data.avatar);

      switch(avatar) {
        case 1: foto.src = fotoMobile.src = 'img/foto0.jpeg'; break;
        case 2: foto.src = fotoMobile.src = 'img/foto1.jpeg'; break;
        case 3: foto.src = fotoMobile.src = 'img/foto2.jpeg'; break;
        case 4: foto.src = fotoMobile.src = 'img/foto3.jpeg'; break;
        case 5: foto.src = fotoMobile.src = 'img/foto4.jpeg'; break;
        case 6: foto.src = fotoMobile.src = 'img/foto5.jpeg'; break;
        case 7: foto.src = fotoMobile.src = 'img/foto6.jpeg'; break;
        case 8: foto.src = fotoMobile.src = 'img/foto7.jpeg'; break;
        default: foto.src = fotoMobile.src = 'https://i.postimg.cc/gJg6vRMH/image.png';
      }
    } catch(err) {
      mostrarAlerta("Erro ao carregar foto: " + err.message);
    }
  }

  // ---------- Carregar eventos ----------
  async function carregarEventos() {
    try {
      const res = await fetch("http://localhost:3000/api/peneira");
      if (!res.ok) throw new Error("Erro ao carregar eventos");
      const eventos = await res.json();

      telasContainer.innerHTML = "";
      eventos.forEach(evento => {
        const card = document.createElement("section");
        card.classList.add("tela");
        card.dataset.id = evento.id;
        card.innerHTML = `
          <h6>${evento.nome}</h6>
          <p><strong>Tipo:</strong> ${evento.tipo}</p>
          <p><strong>Modalidade:</strong> ${evento.modalidade}</p>
          <p><strong>Descrição:</strong> ${evento.desc}</p>
          <p><strong>CEP:</strong> ${evento.cep}</p>
          <div class="botoes">
            <button class="btn-editar">Editar</button>
            <button class="btn-excluir">Excluir</button>
          </div>
        `;
        telasContainer.appendChild(card);
      });
    } catch (err) {
      mostrarAlerta(err.message);
    }
  }

  // ---------- Função criar evento ----------
  async function criarEvento(form, tipo) {
  const user = JSON.parse(localStorage.getItem("usuarioDados"));
    const dados = {
      tipo,
      nome: form.nome.value,
      desc: form.desc.value,
      cep: form.cep.value,
      modalidade: form.modalidade.value,
      user:user.id
    };

    try {
      const res = await fetch("http://localhost:3000/api/peneira", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dados)
      });
      if (!res.ok) throw new Error("Erro ao criar evento");
      mostrarAlerta("Evento criado com sucesso!", "success");
      carregarEventos();
    } catch(err) {
      mostrarAlerta(err.message);
    }
  }

  // ---------- Função editar evento ----------
  async function editarEvento(id, dados) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/peneira/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dados)
      });
      if (!res.ok) throw new Error("Erro ao atualizar evento");
      mostrarAlerta("Evento atualizado com sucesso!", "success");
      carregarEventos();
    } catch(err) {
      mostrarAlerta(err.message);
    }
  }

  // ---------- Função deletar evento ----------
  async function deletarEvento(id) {
    if(!confirm("Tem certeza que deseja excluir?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/peneira/${id}`, { method: "DELETE" });
      if(!res.ok) throw new Error("Erro ao deletar evento");
      mostrarAlerta("Evento excluído com sucesso!", "success");
      carregarEventos();
    } catch(err) {
      mostrarAlerta(err.message);
    }
  }

  // ---------- Submit de forms ----------
  document.querySelectorAll("form").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const id = form.id;

      if(id === "formSeletiva") criarEvento(form, "Seletiva");
      else if(id === "formTorneio") criarEvento(form, "Torneio");
      else if(id === "formJogo") criarEvento(form, "Jogo");
      else if(id === "formEditar") {
        const idEvento = document.getElementById("editId").value;
        const dados = {
          nome: document.getElementById("editNome").value,
          desc: document.getElementById("editDesc").value,
          cep: document.getElementById("editCep").value,
          modalidade: document.getElementById("editModalidade").value
        };
        editarEvento(idEvento, dados);
      }

      const modal = bootstrap.Modal.getInstance(form.closest(".modal"));
      if(modal) modal.hide();
      form.reset();
    });
  });

  // ---------- Clique nos cards ----------
  telasContainer.addEventListener("click", e => {
    const btn = e.target;
    const card = btn.closest(".tela");
    if(!card) return;

    const id = card.dataset.id;
    if(btn.classList.contains("btn-editar")) {
      document.getElementById("editId").value = id;
      document.getElementById("editNome").value = card.querySelector("h6").textContent;
      document.getElementById("editDesc").value = card.querySelector("p:nth-child(4)").textContent.replace("Descrição: ", "");
      document.getElementById("editCep").value = card.querySelector("p:nth-child(5)").textContent.replace("CEP: ", "");
      document.getElementById("editModalidade").value = card.querySelector("p:nth-child(3)").textContent.replace("Modalidade: ", "");

      new bootstrap.Modal(document.getElementById("modalEditar")).show();
    }

    if(btn.classList.contains("btn-excluir")) deletarEvento(id);
  });

  carregarEventos();
  carregarFoto();
});
