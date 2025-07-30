document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuarioDados'));
  
    if (!usuario || !usuario.email) {
      alert('Você precisa estar logado para acessar esta página.');
      window.location.href = 'index.html';
    }
  });
  