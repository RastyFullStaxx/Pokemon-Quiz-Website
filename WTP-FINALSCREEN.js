const score = parseInt(sessionStorage.getItem("wtpScore")) || 0;

const greeter = document.getElementById("greeter");
const dialogText = document.getElementById("dialog-text");
const options = document.querySelectorAll(".option");
const selectorArrow = document.getElementById("selector-arrow");

const dialogBox = document.querySelector(".dialog-box");

const trophyContainer = document.getElementById("trophy-unlock-container");
const trophyImage = document.getElementById("trophy-image");
const nextButton = document.getElementById("next-button");
const dialogWrapper = document.querySelector(".dialog-wrapper");


let currentIndex = 0;

// Setup based on score
if (score === 7) {
  // PERFECT SCORE BIRCH
  greeter.src = "assets/WtpPage/BirchPerfectScore.png";
  greeter.style.top = "430px"; 
  greeter.style.width = "420px"; 

  dialogBox.style.top = "750px"; // keep dialog box default

  dialogText.textContent = "Congratulations, Pokémon Master! You got all the answers right and proved you know your Pokémon by their shadows. Claim your trophy now!";
  options[0].textContent = "Claim Trophy";
  options[0].onclick = () => {
    // Hide Birch and dialog instantly
    greeter.style.display = "none";
    dialogWrapper.style.display = "none";
  
    // Show Trophy instantly
    trophyContainer.classList.remove("hidden");
  
    // Animate only the trophy (not NEXT button)
    setTimeout(() => {
        // Trophy floats upward and becomes visible
        trophyContainer.style.opacity = "1";
        trophyContainer.style.transform = "translate(-50%, -50%) scale(1) translateY(0)";
        
        // === Fade in the NEXT button AFTER 0.6s ===
        setTimeout(() => {
          nextButton.style.opacity = "1"; // Smooth fade in
        }, 600); // <<< Delay matches Trophy animation time
      }, 50);
      
    // NEXT button click
    nextButton.onclick = () => {
      sessionStorage.setItem("wtpTrophy", "unlocked");
      window.location.href = "trophy-page.html";
    };
  };
  

} else if (score === 6) {
  // FEW ERRORS BIRCH (1 error)
  greeter.src = "assets/WtpPage/Birch1Error.png";
  greeter.style.top = "410px";
  greeter.style.width = "600px";

  dialogBox.style.top = "750px"; // keep dialog box default

  dialogText.textContent = `You got ${score} answers correct! You’re one step closer to becoming a Pokémon Master!`;
  options[0].textContent = "Try Again";
  options[0].onclick = () => {
    window.location.href = "WTP-page.html";
  };

} else {
  // MULTIPLE ERRORS BIRCH
  greeter.src = "assets/WtpPage/BirchThreeErrors.png";
  greeter.style.top = "380px"; 
  greeter.style.width = "420px"; 

  dialogBox.style.top = "750px"; // MULTIPLE errors case confirmed

  dialogText.textContent = `You got ${score} answers correct. That’s okay, you just need to train more and become stronger!`;
  options[0].textContent = "Try Again";
  options[0].onclick = () => {
    window.location.href = "WTP-page.html";
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
  option.addEventListener("mouseenter", () => {
    currentIndex = index;
    updateArrowPosition();
    selectorArrow.style.animation = "none";
    selectorArrow.style.opacity = "1";
  });

  option.addEventListener("mouseleave", () => {
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
