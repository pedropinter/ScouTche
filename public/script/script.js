// Navegação do header
const links = document.querySelectorAll('header .nav-link');
links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    links.forEach(l => l.classList.remove('ativo'));
    link.classList.add('ativo');
  });
});

// Dropdowns de filtros
document.querySelectorAll('.filtro').forEach(button => {
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdownName = button.dataset.dropdown;
    const dropdownDiv = document.getElementById('dropdown-' + dropdownName);
    const filtroDropdown = button.parentElement;

    document.querySelectorAll('.filtro-dropdown').forEach(fd => {
      if (fd !== filtroDropdown) {
        fd.classList.remove('open');
        const cnt = fd.querySelector('.dropdown-content');
        if (cnt) cnt.classList.remove('show');
      }
    });

    const isOpen = filtroDropdown.classList.toggle('open');
    if (isOpen) dropdownDiv.classList.add('show');
    else dropdownDiv.classList.remove('show');
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.filtro-dropdown')) {
    document.querySelectorAll('.filtro-dropdown').forEach(fd => {
      fd.classList.remove('open');
      const cnt = fd.querySelector('.dropdown-content');
      if (cnt) cnt.classList.remove('show');
    });
  }
});

// Controle do carousel
const carousel = document.querySelector('#myCarousel');
if (carousel) {
  carousel.addEventListener('slid.bs.carousel', function () {
    const activeSlide = carousel.querySelector('.carousel-item.active');
    const index = Array.from(carousel.querySelectorAll('.carousel-item')).indexOf(activeSlide);

    document.querySelector('#info-futsal')?.classList.add('d-none');
    document.querySelector('#info-volei')?.classList.add('d-none');
    document.querySelector('#info-basquete')?.classList.add('d-none');

    if (index === 0) document.querySelector('#info-futsal')?.classList.remove('d-none');
    else if (index === 1) document.querySelector('#info-volei')?.classList.remove('d-none');
    else if (index === 2) document.querySelector('#info-basquete')?.classList.remove('d-none');
  });
}

// Helpers
function normalizaTexto(t = "") {
  return String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
function getUsuario() {
  const usuario = JSON.parse(localStorage.getItem('usuarioDados') || 'null');
  return usuario && usuario.id ? usuario : null;
}

// Carregar avatar e abrir modal
document.addEventListener("DOMContentLoaded", () => {
  const btnEscolherAvatar = document.getElementById('btnEscolherAvatar');
  const modalAvatar = document.getElementById('modalAvatar');
  const closeAvatar = document.querySelector('.close-avatar');
  const avatarOptions = document.querySelectorAll('.avatar-option');
  const fotoPerfil = document.getElementById('fotoPerfil');

  if (btnEscolherAvatar) btnEscolherAvatar.addEventListener('click', () => modalAvatar.classList.remove('d-none'));
  if (closeAvatar) closeAvatar.addEventListener('click', () => modalAvatar.classList.add('d-none'));
  if (modalAvatar) {
    modalAvatar.addEventListener('click', (e) => { if (e.target === modalAvatar) modalAvatar.classList.add('d-none'); });
  }

  avatarOptions.forEach((img) => {
    img.addEventListener('click', () => {
      const usuario = JSON.parse(localStorage.getItem('usuarioDados')) || {};
      usuario.avatar = img.src;
      localStorage.setItem('usuarioDados', JSON.stringify(usuario));
      if (fotoPerfil) fotoPerfil.src = img.src;
      modalAvatar.classList.add('d-none');
    });
  });

  const usuarioSalvo = JSON.parse(localStorage.getItem('usuarioDados') || 'null');
  if (usuarioSalvo?.avatar && fotoPerfil) fotoPerfil.src = usuarioSalvo.avatar;

  carregarEventos();
});

// Função para carregar eventos
async function carregarEventos() {
  try {
    const res = await fetch(`http://localhost:3000/api/peneira`);
    if (!res.ok) throw new Error("Erro ao carregar eventos");
    const eventos = await res.json();

    const row = document.querySelector(".container .row");
    if (!row) return console.error("Elemento .container .row não encontrado");

    row.innerHTML = "";

    eventos.forEach(evento => {
      let imagem;
      switch (normalizaTexto(evento.modalidade || "")) {
        case "futebol": imagem = "https://i.postimg.cc/KjnJQfP1/image.png"; break;
        case "volei": imagem = "https://i.postimg.cc/VkPKSxcX/image.png"; break;
        case "basquete": imagem = "https://i.postimg.cc/rF0WNymh/image.png"; break;
        default: imagem = "https://i.postimg.cc/t43d06TM/image.png"; break;
      }

      const col = document.createElement("div");
      col.classList.add("col-md-3", "mb-3");
      col.innerHTML = `
        <div class="card h-100" style="font-size: 0.9rem;">
          <img class="card-img-top" src="${imagem}" alt="Imagem do evento" style="height: 150px; width: 100%; object-fit: cover;">
          <div class="card-body p-2">
            <h5 class="card-title fw-bold" style="font-size: 1rem;">${evento.nome}</h5>
            <p class="card-text mb-2" style="font-size: 0.85rem;">
              <strong>Tipo:</strong> ${evento.tipo}<br>
              <strong>Modalidade:</strong> ${evento.modalidade}<br>
            </p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="btn-group">
                <button type="button" class="btn btn-primary btn-mais btn-sm" data-id="${evento.id}">
                  Mais Informações
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      row.appendChild(col);
    });

    // Listeners dos botões "Mais Informações"
    document.querySelectorAll(".btn-mais").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        try {
          const res = await fetch(`http://localhost:3000/api/peneira/${id}`);
          if (!res.ok) throw new Error("Erro ao carregar evento");
          const evento = await res.json();

          document.getElementById("modalTitulo").innerText = evento.nome;
          document.getElementById("modalCorpo").innerHTML = `
            <p><strong>Tipo:</strong> ${evento.tipo}</p>
            <p><strong>Modalidade:</strong> ${evento.modalidade}</p>
            <p><strong>Local:</strong> ${evento.cep}</p>
              <p><strong>Numero de participantes:</strong> ${ await obterTotalParticipantes(evento.id)}</p>
            <p><strong>Descrição:</strong> ${evento.desc || "Sem descrição"}</p>
          `;

          const botao = document.getElementById("modalBotaoAcao");
          botao.classList.remove("btn-primary", "btn-success", "btn-danger");

          const usuario = getUsuario();
          if (!usuario) {
            botao.innerText = "Faça login para participar";
            botao.classList.add("btn-primary");
            botao.onclick = () => {
              alert("Você precisa estar logado para participar.");
            };
          } else {
            const estaParticipando = await window.VerParticiparEvento(evento.id, usuario.id);

            if (estaParticipando) {
              botao.innerText = "Sair do evento";
              botao.classList.add("btn-danger");
              botao.onclick = () => {
                sairEvento(evento.id, usuario.id);
                bootstrap.Modal.getInstance(document.getElementById("modalEvento")).hide();
              };
            } else {
              botao.innerText = "Participar";
              botao.classList.add("btn-success");
              botao.onclick = () => {
                entrarEvento(evento.id, usuario.id);
                bootstrap.Modal.getInstance(document.getElementById("modalEvento")).hide();
              };
            }
          }

          new bootstrap.Modal(document.getElementById("modalEvento")).show();
        } catch (err) {
          console.error(err);
          alert("Erro ao carregar informações do evento.");
        }
      });
    });

  } catch (err) {
    console.error("Erro ao carregar eventos:", err);
  }
}

// Buscar logradouro pelo CEP
async function buscarLogradouro(cep) {
  try {
    const cepLimpo = String(cep || "").replace(/\D/g, "");
    const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    if (!res.ok) throw new Error("Erro ao consultar CEP");
    const data = await res.json();
    return data.logradouro || "Logradouro não encontrado";
  } catch (err) {
    console.error("Erro ViaCEP:", err);
    return "Erro ao consultar CEP";
  }
}

// Carregar foto do perfil
async function carregarFoto() {
  const foto = document.getElementById('fotoP');
  const usuario = getUsuario();
  if (!foto || !usuario) return;

  const pers = Number(usuario.id);
  try {
    const res = await fetch(`http://localhost:3000/api/get/perfil/${pers}`);
    if (res.ok) {
      const data = await res.json();
      const avatar = Number(data.avatar);
      const fotoPerfil = document.getElementById('fotoPMobile');

      const mapa = {
        1: 'img/foto0.jpeg',
        2: 'img/foto1.jpeg',
        3: 'img/foto2.jpeg',
        4: 'img/foto3.jpeg',
        5: 'img/foto4.jpeg',
        6: 'img/foto5.jpeg',
        7: 'img/foto6.jpeg'
      };
      const src = mapa[avatar] || 'https://i.postimg.cc/gJg6vRMH/image.png';
      foto.src = src;
      if (fotoPerfil) fotoPerfil.src = src;
    }
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar perfil.");
  }
}

// === Participação em eventos ===

// Verificar se está participando
window.VerParticiparEvento = async function(eventoId, userId) {
  if (!userId || !eventoId) return false;

  try {
    const res = await fetch(`http://localhost:3000/api/participantes?userId=${userId}&eventoId=${eventoId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) throw new Error("Erro ao verificar participação");
    const data = await res.json();
    return data.participando;
  } catch (err) {
    console.error("Erro:", err);
    return false;
  }
}

// Entrar no evento
async function entrarEvento(eventoId, userId) {
  if (!userId || !eventoId) {
    alert("Usuário ou evento não informado.");
    return;
  }
  try {
    const response = await fetch("http://localhost:3000/api/participantes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, eventoId })
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Erro ao participar do evento");
    }
    await response.json();
    alert("Você entrou no evento com sucesso!");
  } catch (error) {
    console.error("Erro entrarEvento:", error);
    alert(error.message || "Erro ao entrar no evento. Tente novamente.");
  }
}

// Sair do evento específico
async function sairEvento(eventoId, userId) {
  if (!userId || !eventoId) {
    alert("Usuário ou evento não informado.");
    return;
  }
  try {
    const response = await fetch(`http://localhost:3000/api/participantes/${eventoId}/${userId}`, {
      method: "DELETE"
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Erro ao sair do evento");
    }
    alert("Você saiu do evento com sucesso!");
  } catch (error) {
    console.error("Erro sairEvento:", error);
    alert(error.message || "Erro ao sair do evento. Tente novamente.");
  }
}
async function obterTotalParticipantes(eventoId) {
  try {
    const res = await fetch(`http://localhost:3000/api/participantes/count/${eventoId}`);
    if (!res.ok) throw new Error("Erro ao buscar total de participantes");
    const data = await res.json();
    return data.total;
  } catch (err) {
    console.error(err);
    return 0;
  }
}
