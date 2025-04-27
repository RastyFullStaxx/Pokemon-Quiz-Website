const score = parseInt(sessionStorage.getItem("kyplScore")) || 0;

const greeter = document.getElementById("greeter");
const dialogText = document.getElementById("dialog-text");
const options = document.querySelectorAll(".option");
const selectorArrow = document.getElementById("selector-arrow");

const trophyContainer = document.getElementById("trophy-unlock-container");
const trophyImage = document.getElementById("trophy-image");
const nextButton = document.getElementById("next-button");
const dialogWrapper = document.querySelector(".dialog-wrapper");

let currentIndex = 0;

// Setup based on score
if (score === 7) {
  greeter.src = "assets/KyplPage/OakPerfectScore.png";
  dialogText.textContent = "Congratulations, Pokémon Professor! You got all the lore questions right! Claim your trophy now!";
  options[0].textContent = "Claim Trophy";
  options[0].onclick = () => {
    // Hide Oak and dialog
    greeter.style.display = "none";
    dialogWrapper.style.display = "none";

    // Show trophy
    trophyContainer.classList.remove("hidden");

    setTimeout(() => {
      trophyContainer.style.opacity = "1";
      trophyContainer.style.transform = "translate(-50%, -50%) scale(1) translateY(0)";

      setTimeout(() => {
        nextButton.style.opacity = "1";
      }, 600);
    }, 50);

    nextButton.onclick = () => {
      sessionStorage.setItem("kyplTrophy", "unlocked");
      sessionStorage.setItem("ntcUnlocked", "true"); // <<< UNLOCK the next quiz!
      window.location.href = "trophy-page.html";
    };
  };

} else if (score === 6) {
  greeter.src = "assets/KyplPage/OakFewErrors.png";
  dialogText.textContent = `You got ${score} answers correct! You're almost a Pokémon lore master!`;
  options[0].textContent = "Try Again";
  options[0].onclick = () => {
    window.location.href = "KYPL-page.html";
  };

} else {
  greeter.src = "assets/KyplPage/OakMultipleErrors.png";
  dialogText.textContent = `You got ${score} answers correct. Keep studying to master the Pokémon world!`;
  options[0].textContent = "Try Again";
  options[0].onclick = () => {
    window.location.href = "KYPL-page.html";
  };
}

// Always include Menu
options[1].textContent = "Menu";
options[1].onclick = () => {
  window.location.href = "select-quiz-type.html";
};

// Arrow Movement
function updateArrowPosition() {
  const topBase = 30;
  const offset = 35;
  selectorArrow.style.top = `${topBase + offset * currentIndex}px`;
}
updateArrowPosition();

// Mouse hover on options
options.forEach((option, index) => {
  option.addEventListener('mouseenter', () => {
    currentIndex = index;
    updateArrowPosition();
    selectorArrow.style.animation = "none";
    selectorArrow.style.opacity = "1";
  });

  option.addEventListener('mouseleave', () => {
    selectorArrow.style.animation = "blink 1s step-start infinite";
  });
});

// Keyboard control
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    currentIndex = (currentIndex - 1 + options.length) % options.length;
    updateArrowPosition();
  } else if (e.key === "ArrowDown") {
    currentIndex = (currentIndex + 1) % options.length;
    updateArrowPosition();
  } else if (e.key === "Enter") {
    options[currentIndex].click();
  }
});
