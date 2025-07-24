    document.addEventListener("DOMContentLoaded", function () {
    let menuToggle = document.getElementById("menu-toggle");
    var nav = document.getElementById("nav");

    menuToggle.addEventListener("click", function () {
      nav.classList.toggle("active");
    });
  });

const toggleBtn = document.querySelector(".menu-toggle");
const mobileMenu = document.getElementById("mobileMenu");

toggleBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("d-none");
});