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