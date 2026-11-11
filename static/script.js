
const buttons = document.querySelectorAll("[data-track]");
const status = document.getElementById("status");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.href) {
      window.location.href = button.dataset.href;
      return;
    }

    status.textContent =
      "This learning track is coming soon!";
  });
});
