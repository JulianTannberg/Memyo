document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const dropdowns = document.querySelectorAll(".dropdown");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      mainNav.classList.toggle("open");
    });
  }

  dropdowns.forEach(function (dropdown) {
    const button = dropdown.querySelector(".dropbtn");

    if (!button) return;

    button.addEventListener("click", function (event) {
      if (window.innerWidth <= 900) {
        event.preventDefault();
        dropdown.classList.toggle("open");
      }
    });
  });

  document.addEventListener("click", function (event) {
    if (!mainNav || !menuToggle) return;

    const clickedInsideNav = mainNav.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideNav && !clickedToggle) {
      mainNav.classList.remove("open");
      dropdowns.forEach(function (dropdown) {
        dropdown.classList.remove("open");
      });
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) {
      mainNav.classList.remove("open");
      dropdowns.forEach(function (dropdown) {
        dropdown.classList.remove("open");
      });
    }
  });
});
