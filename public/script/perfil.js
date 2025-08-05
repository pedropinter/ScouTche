document.addEventListener("DOMContentLoaded", () => {
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
    img.addEventListener("click", () => {
      const usuario = JSON.parse(localStorage.getItem("usuarioDados")) || {};
      usuario.avatar = img.src;
      localStorage.setItem("usuarioDados", JSON.stringify(usuario));
      fotoPerfil.src = img.src;
      modalAvatar.style.display = "none";
    });
  });


  const usuarioSalvo = JSON.parse(localStorage.getItem("usuarioDados"));
  if (usuarioSalvo?.avatar) {
    fotoPerfil.src = usuarioSalvo.avatar;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const btnEditarPerfil = document.getElementById("btn-editar-perfil");
  const modalEditarPerfil = document.getElementById("modal-editar-perfil");
  const btnCancelarEdicao = document.getElementById("cancelarEdicaoPerfil");

  btnEditarPerfil.addEventListener("click", () => {
    modalEditarPerfil.classList.remove("d-none");
  });

  btnCancelarEdicao.addEventListener("click", () => {
    modalEditarPerfil.classList.add("d-none");
  });
});

