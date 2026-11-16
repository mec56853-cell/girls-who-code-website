
const buttons = document.querySelectorAll("[data-href]");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    window.location.href = button.dataset.href;
  });
});
