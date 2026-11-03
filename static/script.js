
const buttons = document.querySelectorAll("[data-track]");
const status = document.getElementById("status");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.track === "youngest") {
      window.location.href = "/youngest-game";
      return;
    }

    status.textContent =
      "This learning track is coming soon!";
  });
});
