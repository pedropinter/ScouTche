document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuarioDados'));

  if (!usuario || !usuario.email) {
    window.location.href = 'index.html';
    return;
  }

  preencherPerfil(usuario);
  configurarEdicaoPerfil(usuario);

  const fotoPerfilHeader = document.querySelector('#profile-container img');
  const modal = criarMiniOverlay();
  fotoPerfilHeader.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.toggle('d-none');
  });
});

// MINI OVERLAY no canto direito
function criarMiniOverlay() {
  const modalHtml = `
    <div id="modalPerfil" class="mini-overlay d-none">
      <ul>
        <li><a href="perfil.html">Ver Perfil</a></li>
        <li><a href="#" id="linkAlterarEmail">Alterar E-mail</a></li>
        <li><a href="#" id="linkAlterarSenha">Alterar Senha</a></li>
        <li><a href="#" class="sair" id="btnSair">Sair da Conta</a></li>
      </ul>
    </div>
  `;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = modalHtml;
  document.body.appendChild(wrapper.firstElementChild);

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

  return document.getElementById('modalPerfil');
}

function fecharMiniOverlay() {
  const modal = document.getElementById('modalPerfil');
  if (modal) modal.classList.add('d-none');
}

// --------------------------------------------
// Funções auxiliares
function preencherPerfil(usuario) {
  const imgPerfilHeader = document.querySelector('#profile-container img');
  if (imgPerfilHeader) {
    if (usuario.foto) {
      imgPerfilHeader.src = usuario.foto;
    } else {
      // imagem padrão caso não tenha foto
      imgPerfilHeader.src = 'https://i.postimg.cc/gJg6vRMH/image.png';
    }
  }

  document.getElementById('nomeCompleto').textContent = `${usuario.nome || ''} ${usuario.sobrenome || ''}`.trim();
  document.getElementById('nascimento').textContent = usuario.nascimento || '--/--/----';
  document.getElementById('tipoConta').textContent = formatarTipoConta(usuario.tipoConta);
  document.getElementById('bio').textContent = usuario.bio || '--';
  document.getElementById('modalidade').textContent = usuario.modalidade || '--';
  document.getElementById('idade').textContent = calcularIdade(usuario.nascimento) + ' anos';
}

function configurarEdicaoPerfil(usuario) {
  const btnEditarPerfil = document.getElementById('btn-editar-perfil');
  if (!btnEditarPerfil) return;

  const nomeCompletoEl = document.getElementById('nomeCompleto');
  const nascimentoSpan = document.getElementById('nascimento');
  const tipoContaSpan = document.getElementById('tipoConta');
  const bioSpan = document.getElementById('bio');
  const idadeSpan = document.getElementById('idade');
  const modalidadeSpan = document.getElementById('modalidade');

  let editando = false;

  btnEditarPerfil.addEventListener('click', () => {
    if (!editando) {
      btnEditarPerfil.textContent = 'Salvar Alterações';

      const inputNome = document.createElement('input');
      inputNome.type = 'text';
      inputNome.className = 'form-control mb-2';
      inputNome.value = usuario.nome || '';

      const inputSobrenome = document.createElement('input');
      inputSobrenome.type = 'text';
      inputSobrenome.className = 'form-control mb-2';
      inputSobrenome.value = usuario.sobrenome || '';

      nomeCompletoEl.textContent = '';
      nomeCompletoEl.appendChild(inputNome);
      nomeCompletoEl.appendChild(inputSobrenome);

      const inputNascimento = document.createElement('input');
      inputNascimento.type = 'date';
      inputNascimento.className = 'form-control mb-2';
      inputNascimento.value = usuario.nascimento || '';
      nascimentoSpan.replaceWith(inputNascimento);

      // Mantemos o tipoConta como texto, não editável (removido o select)
      const tipoContaTexto = document.createElement('span');
      tipoContaTexto.className = 'mb-2';
      tipoContaTexto.textContent = formatarTipoConta(usuario.tipoConta);
      tipoContaSpan.replaceWith(tipoContaTexto);

      const textareaBio = document.createElement('textarea');
      textareaBio.className = 'form-control mb-2';
      textareaBio.value = usuario.bio || '';
      bioSpan.replaceWith(textareaBio);

      const inputModalidade = document.createElement('input');
      inputModalidade.type = 'text';
      inputModalidade.className = 'form-control mb-2';
      inputModalidade.value = usuario.modalidade || '';
      modalidadeSpan.replaceWith(inputModalidade);

      editando = true;
    } else {
      const nome = nomeCompletoEl.querySelector('input:nth-child(1)').value.trim();
      const sobrenome = nomeCompletoEl.querySelector('input:nth-child(2)').value.trim();
      const nascimento = document.querySelector('.form-control[type="date"]').value;
      const bio = document.querySelector('textarea').value.trim();
      const modalidade = document.querySelector('input[type="text"]:last-child').value.trim();

      usuario.nome = nome;
      usuario.sobrenome = sobrenome;
      usuario.nascimento = nascimento;
      // Não alteramos o tipoConta aqui, pois não pode ser editado
      usuario.bio = bio;
      usuario.modalidade = modalidade;

      localStorage.setItem('usuarioDados', JSON.stringify(usuario));
      location.reload();
    }
  });
}

function calcularIdade(dataNascimento) {
  if (!dataNascimento) return '--';
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
  return idade;
}

function formatarTipoConta(tipo) {
  switch (tipo) {
    case '1': return 'Equipe Esportiva';
    case '2': return 'Profissional da Área';
    case '3': return 'Usuário Atleta';
    default: return 'Não informado';
  }
}

// Overlays de alteração permanecem iguais

function mostrarOverlayEmail() {
  const overlay = document.createElement('div');
  overlay.id = 'overlay-email-senha';
  overlay.innerHTML = `
    <div class="overlay-box">
      <h2>Alterar E-mail</h2>
      <input type="email" id="novoEmail" placeholder="Novo e-mail" />
      <button class="btn" onclick="confirmarAlteracaoEmail()">Confirmar</button>
      <button class="btn btn-cancel" onclick="fecharOverlay()">Cancelar</button>
    </div>
  `;
  document.body.appendChild(overlay);
}

function mostrarOverlaySenha() {
  const overlay = document.createElement('div');
  overlay.id = 'overlay-email-senha';
  overlay.innerHTML = `
    <div class="overlay-box">
      <h2>Alterar Senha</h2>
      <input type="password" id="novaSenha" placeholder="Nova senha" />
      <input type="password" id="confirmarSenha" placeholder="Confirmar nova senha" />
      <button class="btn" onclick="confirmarAlteracaoSenha()">Confirmar</button>
      <button class="btn btn-cancel" onclick="fecharOverlay()">Cancelar</button>
    </div>
  `;
  document.body.appendChild(overlay);
}

function fecharOverlay() {
  const overlay = document.getElementById('overlay-email-senha');
  if (overlay) overlay.remove();
}

function confirmarAlteracaoEmail() {
  const novoEmail = document.getElementById('novoEmail').value.trim();
  if (!novoEmail || !novoEmail.includes('@')) {
    alert('Digite um e-mail válido.');
    return;
  }

  const usuario = JSON.parse(localStorage.getItem('usuarioDados'));
  usuario.email = novoEmail;
  localStorage.setItem('usuarioDados', JSON.stringify(usuario));

  alert('E-mail atualizado. Verifique seu novo endereço para confirmar.');
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

