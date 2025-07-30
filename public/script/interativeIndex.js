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
