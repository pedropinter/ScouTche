// Ativa o link do menu
const links = document.querySelectorAll('.nav-link');

links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    links.forEach(l => l.classList.remove('ativo'));
    link.classList.add('ativo');
  });
});

// Dropdowns
document.querySelectorAll('.filtro').forEach(button => {
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdownName = button.dataset.dropdown;
    const dropdownDiv = document.getElementById('dropdown-' + dropdownName);
    const filtroDropdown = button.parentElement;

    document.querySelectorAll('.filtro-dropdown').forEach(fd => {
      if (fd !== filtroDropdown) {
        fd.classList.remove('open');
        fd.querySelector('.dropdown-content').classList.remove('show');
      }
    });

    const isOpen = filtroDropdown.classList.toggle('open');
    if (isOpen) {
      dropdownDiv.classList.add('show');
    } else {
      dropdownDiv.classList.remove('show');
    }
  });
});

// Fecha dropdown ao clicar fora
document.addEventListener('click', (e) => {
  if (!e.target.closest('.filtro-dropdown')) {
    document.querySelectorAll('.filtro-dropdown').forEach(fd => {
      fd.classList.remove('open');
      fd.querySelector('.dropdown-content').classList.remove('show');
    });
  }
});

// Atualiza a descrição conforme o slide do carrossel
const carousel = document.querySelector('#myCarousel');

if (carousel) {
  carousel.addEventListener('slid.bs.carousel', function () {
    const activeSlide = carousel.querySelector('.carousel-item.active');
    const index = Array.from(carousel.querySelectorAll('.carousel-item')).indexOf(activeSlide);

    // Esconde tudo primeiro
    document.querySelector('#info-futsal').classList.add('d-none');
    document.querySelector('#info-volei').classList.add('d-none');
    document.querySelector('#info-basquete').classList.add('d-none');

    if (index === 0) {
      document.querySelector('#info-futsal').classList.remove('d-none');
    } else if (index === 1) {
      document.querySelector('#info-volei').classList.remove('d-none');
    } else if (index === 2) {
      document.querySelector('#info-basquete').classList.remove('d-none');
    }
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const btnEscolherAvatar = document.getElementById('btnEscolherAvatar');
  const modalAvatar = document.getElementById('modalAvatar');
  const closeAvatar = document.querySelector('.close-avatar');
  const avatarOptions = document.querySelectorAll('.avatar-option');
  const fotoPerfil = document.getElementById('fotoPerfil');

  // Abrir modal avatar
  btnEscolherAvatar.addEventListener('click', () => {
    modalAvatar.classList.remove('d-none');
  });

  // Fechar modal avatar ao clicar no botão X
  closeAvatar.addEventListener('click', () => {
    modalAvatar.classList.add('d-none');
  });

  // Fechar modal avatar ao clicar fora da caixa de conteúdo
  modalAvatar.addEventListener('click', (e) => {
    if (e.target === modalAvatar) {
      modalAvatar.classList.add('d-none');
    }
  });

  // Selecionar avatar, salvar no localStorage e atualizar imagem
  avatarOptions.forEach((img) => {
    img.addEventListener('click', () => {
      const usuario = JSON.parse(localStorage.getItem('usuarioDados')) || {};
      usuario.avatar = img.src;
      localStorage.setItem('usuarioDados', JSON.stringify(usuario));
      fotoPerfil.src = img.src;
      modalAvatar.classList.add('d-none');
    });
  });

  // Carregar avatar salvo ao abrir página
  const usuarioSalvo = JSON.parse(localStorage.getItem('usuarioDados'));
  if (usuarioSalvo?.avatar) {
    fotoPerfil.src = usuarioSalvo.avatar;
  }
});
