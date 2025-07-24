let slideIndex = 0;
const slide = document.getElementById("carousel-slide");
const totalSlides = slide.children.length;

function moveSlide(direction) {
    slideIndex = (slideIndex + direction + totalSlides) % totalSlides;
    slide.style.transform = `translateX(-${slideIndex * 800}px)`;
}
