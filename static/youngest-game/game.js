(function () {
  // CONTENT REVIEW: placeholder story steps for educators to rewrite.
  const STEPS = {
    wake: { id: "wake", emoji: "⏰", label: "Wake" },
    dress: { id: "dress", emoji: "👕", label: "Dress" },
    eat: { id: "eat", emoji: "🍎", label: "Eat" },
    school: { id: "school", emoji: "🏫", label: "School" },
  };

  // CONTENT REVIEW: same get-to-school story, two difficulty levels.
  const LEVELS = [
    {
      id: 1,
      order: ["wake", "dress", "school"],
      prompt: "Help Mia get to school! Put the steps in order.",
    },
    {
      id: 2,
      order: ["wake", "dress", "eat", "school"],
      prompt: "Help Mia get to school! Put the steps in order.",
    },
  ];

  const promptEl = document.getElementById("prompt");
  const levelLabel = document.getElementById("level-label");
  const character = document.getElementById("character");
  const slotsEl = document.getElementById("slots");
  const cardsEl = document.getElementById("cards");
  const resetBtn = document.getElementById("reset");
  const goBtn = document.getElementById("go");
  const nextBtn = document.getElementById("next");
  const feedback = document.getElementById("feedback");

  let levelIndex = 0;
  let placed = [];

  function currentLevel() {
    return LEVELS[levelIndex];
  }

  function shuffle(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  function setFeedback(message, kind) {
    feedback.textContent = message;
    feedback.classList.remove("ok", "try");
    if (kind) {
      feedback.classList.add(kind);
    }
  }

  function clearCharacterState() {
    character.classList.remove("celebrate", "oops");
  }

  function firstEmptyIndex() {
    return placed.findIndex((id) => id === null);
  }

  function allFilled() {
    return placed.every((id) => id !== null);
  }

  function updateGoButton() {
    goBtn.disabled = !allFilled();
  }

  function renderSlots() {
    const level = currentLevel();
    slotsEl.replaceChildren();

    level.order.forEach((stepId, index) => {
      const slot = document.createElement("li");
      const placedId = placed[index];
      slot.className = "slot" + (placedId ? " filled" : "");
      slot.dataset.index = String(index);

      if (placedId) {
        const step = STEPS[placedId];
        slot.innerHTML =
          '<span class="slot-emoji">' +
          step.emoji +
          "</span><span>" +
          step.label +
          "</span>";
        slot.setAttribute("role", "button");
        slot.tabIndex = 0;
        slot.setAttribute(
          "aria-label",
          "Step " + (index + 1) + ", " + step.label + ". Tap to remove."
        );
      } else {
        slot.textContent = String(index + 1);
        slot.removeAttribute("role");
        slot.tabIndex = -1;
        slot.setAttribute("aria-label", "Empty step " + (index + 1));
      }

      slotsEl.appendChild(slot);
    });
  }

  function renderCards() {
    const level = currentLevel();
    cardsEl.replaceChildren();

    shuffle(level.order).forEach((stepId) => {
      const step = STEPS[stepId];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "step-card";
      button.dataset.stepId = step.id;
      button.innerHTML =
        '<span class="step-emoji">' +
        step.emoji +
        "</span><span>" +
        step.label +
        "</span>";
      button.setAttribute("aria-label", step.label);
      if (placed.includes(step.id)) {
        button.hidden = true;
      }
      cardsEl.appendChild(button);
    });
  }

  function placeStep(stepId) {
    const empty = firstEmptyIndex();
    if (empty === -1) {
      return;
    }

    placed[empty] = stepId;
    const card = cardsEl.querySelector('[data-step-id="' + stepId + '"]');
    if (card) {
      card.hidden = true;
    }
    clearCharacterState();
    setFeedback("");
    nextBtn.hidden = true;
    renderSlots();
    updateGoButton();
  }

  function removeStep(index) {
    const stepId = placed[index];
    if (!stepId) {
      return;
    }

    placed[index] = null;
    const card = cardsEl.querySelector('[data-step-id="' + stepId + '"]');
    if (card) {
      card.hidden = false;
    }
    clearCharacterState();
    setFeedback("");
    nextBtn.hidden = true;
    renderSlots();
    updateGoButton();
  }

  function loadLevel() {
    const level = currentLevel();
    placed = level.order.map(() => null);
    promptEl.textContent = level.prompt;
    levelLabel.textContent = "Level " + level.id + " of " + LEVELS.length;
    nextBtn.hidden = true;
    goBtn.hidden = false;
    clearCharacterState();
    setFeedback("");
    renderSlots();
    renderCards();
    updateGoButton();
  }

  function checkOrder() {
    const expected = currentLevel().order;
    const correct = expected.every((id, index) => placed[index] === id);

    clearCharacterState();

    if (correct) {
      character.classList.add("celebrate");
      setFeedback("You did it! Great sequencing!", "ok");
      goBtn.hidden = true;
      if (levelIndex < LEVELS.length - 1) {
        nextBtn.hidden = false;
        nextBtn.focus();
      } else {
        nextBtn.hidden = true;
        setFeedback("You did it! Mia made it to school!", "ok");
      }
    } else {
      character.classList.add("oops");
      setFeedback("Almost! Try a different order.", "try");
    }
  }

  cardsEl.addEventListener("click", (event) => {
    const button = event.target.closest(".step-card");
    if (!button || button.hidden) {
      return;
    }
    placeStep(button.dataset.stepId);
  });

  slotsEl.addEventListener("click", (event) => {
    const slot = event.target.closest(".slot");
    if (!slot || !slot.classList.contains("filled")) {
      return;
    }
    removeStep(Number(slot.dataset.index));
  });

  slotsEl.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    const slot = event.target.closest(".slot");
    if (!slot || !slot.classList.contains("filled")) {
      return;
    }
    event.preventDefault();
    removeStep(Number(slot.dataset.index));
  });

  resetBtn.addEventListener("click", () => {
    loadLevel();
  });

  goBtn.addEventListener("click", () => {
    if (!allFilled()) {
      return;
    }
    checkOrder();
  });

  nextBtn.addEventListener("click", () => {
    if (levelIndex < LEVELS.length - 1) {
      levelIndex += 1;
      loadLevel();
    }
  });

  loadLevel();
})();
