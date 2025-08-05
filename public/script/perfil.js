

document.addEventListener("DOMContentLoaded", () => {
    const fotoPerfil = document.getElementById("fotoPerfil");
  const usuario = JSON.parse(localStorage.getItem('usuarioDados'));

  const fotoPerfilHeader = document.querySelector('#profile-container img');
  const modal = document.getElementById('modalPerfil');

  fotoPerfilHeader.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.toggle('d-none');
  });

  document.addEventListener('click', (event) => {
    const isClickInsideModal = modal.contains(event.target);
    const isClickOnProfileImg = fotoPerfilHeader.contains(event.target);

    if (!isClickInsideModal && !isClickOnProfileImg && !modal.classList.contains('d-none')) {
      modal.classList.add('d-none');
    }
  });

  document.getElementById('linkAlterarEmail').addEventListener('click', (e) => {
    e.preventDefault();
    fecharMiniOverlay();
    mostrarOverlayEmail();
  });

  document.getElementById('linkAlterarSenha').addEventListener('click', (e) => {
    e.preventDefault();
    fecharMiniOverlay();
    mostrarOverlaySenha();
  });

  document.getElementById('btnSair').addEventListener('click', (e) => {
    e.preventDefault();
    const confirmar = confirm('Tem certeza que quer sair da conta?');
    if (confirmar) {
      localStorage.removeItem('usuarioDados');
      alert('Logout realizado! Redirecionando...');
      window.location.href = 'index.html';
    }
  });
});

function fecharMiniOverlay() {
  const modal = document.getElementById('modalPerfil');
  if (modal) modal.classList.add('d-none');
}

function mostrarOverlayEmail() {
  const overlay = document.createElement('div');
  overlay.id = 'overlay-email-senha';
  overlay.innerHTML = `
    <div class="overlay-box">
      <button class="close-btn" onclick="fecharOverlay()">&times;</button>
      <h2>Alterar E-mail</h2>
      <input type="email" id="novoEmail" placeholder="Novo e-mail" />
      <input type="email" id="confirmarEmail" placeholder="Confirmar novo e-mail" />
      <button class="btn" onclick="confirmarAlteracaoEmail()">Confirmar novo e-mail</button>
      <button class="btn btn-cancel" onclick="fecharOverlay()">Cancelar</button>
    </div>
  `;
  document.body.appendChild(overlay);


  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) fecharOverlay();
  });
}

function mostrarOverlaySenha() {
  const overlay = document.createElement('div');
  overlay.id = 'overlay-email-senha';
  overlay.innerHTML = `
    <div class="overlay-box">
      <button class="close-btn" onclick="fecharOverlay()">&times;</button>
      <h2>Alterar Senha</h2>
      <input type="password" id="novaSenha" placeholder="Nova senha" />
      <input type="password" id="confirmarSenha" placeholder="Confirmar nova senha" />
      <button class="btn" onclick="confirmarAlteracaoSenha()">Confirmar nova senha</button>
      <button class="btn btn-cancel" onclick="fecharOverlay()">Cancelar</button>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) fecharOverlay();
  });
}

function fecharOverlay() {
  const overlay = document.getElementById('overlay-email-senha');
  if (overlay) overlay.remove();
}

function confirmarAlteracaoEmail() {
  const novoEmail = document.getElementById('novoEmail').value.trim();
  const confirmarEmail = document.getElementById('confirmarEmail').value.trim();

  if (!novoEmail || !novoEmail.includes('@')) {
    alert('Digite um e-mail válido.');
    return;
  }

  if (novoEmail !== confirmarEmail) {
    alert('Os e-mails não coincidem.');
    return;
  }

  const usuario = JSON.parse(localStorage.getItem('usuarioDados'));
  usuario.email = novoEmail;
  localStorage.setItem('usuarioDados', JSON.stringify(usuario));

  alert('E-mail atualizado com sucesso. Verifique seu novo endereço.');
  fecharOverlay();
}

function confirmarAlteracaoSenha() {
  const novaSenha = document.getElementById('novaSenha').value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;

  if (novaSenha.length < 6) {
    alert('A senha deve ter pelo menos 6 caracteres.');
    return;
  }

  if (novaSenha !== confirmarSenha) {
    alert('As senhas não coincidem.');
    return;
  }

  alert('Senha alterada com sucesso! Verifique seu e-mail para confirmação.');
  fecharOverlay();
}

document.addEventListener("DOMContentLoaded", () => {
  const btnEscolherAvatar = document.getElementById("btnEscolherAvatar");
  const modalAvatar = document.getElementById("modalAvatar");
  const closeAvatar = document.querySelector(".close-avatar");
  const avatarOptions = document.querySelectorAll(".avatar-option");
  const fotoPerfil = document.getElementById("fotoPerfil");

  const token = localStorage.getItem("token");

  btnEscolherAvatar.addEventListener("click", () => {
    modalAvatar.style.display = "flex";
  });

  closeAvatar.addEventListener("click", () => {
    modalAvatar.style.display = "none";
  });

  modalAvatar.addEventListener("click", (event) => {
    if (event.target === modalAvatar) {
      modalAvatar.style.display = "none";
    }
  });

  avatarOptions.forEach((img) => {
    img.addEventListener("click", async () => {
      const avatarSelecionado = img.src;

      // Atualiza no localStorage
      const usuario = JSON.parse(localStorage.getItem("usuarioDados")) || {};
      usuario.avatar = avatarSelecionado;
      localStorage.setItem("usuarioDados", JSON.stringify(usuario));

      // Atualiza imagem no perfil
      fotoPerfil.src = avatarSelecionado;
      modalAvatar.style.display = "none";

      // Envia pro backend
      try {
            const userId = document.getElementById(id);
        const resposta = await fetch(`http://localhost:3000/api/perfil/${userId}/avatar`, {
          method: "PUT", 
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ avatar: obterIndiceDaFoto(fotoPerfil.src) })
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
          console.log("Avatar atualizado com sucesso no servidor!");
        } else {
          console.warn("Erro ao atualizar avatar no backend:", resultado.mensagem);
        }
      } catch (erro) {
        console.error("Erro na requisição de avatar:", erro);
      }
    });
  });
});


async function carregarFoto(id) {
    const foto = document.getElementById(id);
const usuario = JSON.parse(localStorage.getItem('usuarioDados'));
  const pers = Number(usuario.avatar); 
 
      switch (pers) {
        case 0:
          foto.src = 'img/foto0.jpeg';
          break;
        case 1:
          foto.src = 'img/foto1.jpeg';
          break;
        case 2:
          foto.src = 'img/foto2.jpeg';
          break;
        case 3:
          foto.src = 'img/foto3.jpeg';
          break;
        case 4:
          foto.src = 'img/foto4.jpeg';
          break;
        case 5:
          foto.src = 'img/foto5.jpeg';
          break;
        case 6:
          foto.src = 'img/foto6.jpeg';
          break;
        case 7:
          foto.src = 'img/foto7.jpeg';
          break;
      }
      

}

function obterIndiceDaFoto(src) {
  const fotos = [
    'img/foto0.jpeg',
    'img/foto1.jpeg',
    'img/foto2.jpeg',
    'img/foto3.jpeg',
    'img/foto4.jpeg',
    'img/foto5.jpeg',
    'img/foto6.jpeg',
    'img/foto7.jpeg',
  ];

  // Procura o índice correspondente
  const indice = fotos.indexOf(src);
  return indice !== -1 ? indice : null; // retorna null se não encontrar
}


carregarFoto("fotoPerfil")
