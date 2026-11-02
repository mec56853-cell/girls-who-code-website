
const buttons = document.querySelectorAll("[data-track]");
const status = document.getElementById("status");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    status.textContent =
      "This learning track is coming soon!";
  });
});
