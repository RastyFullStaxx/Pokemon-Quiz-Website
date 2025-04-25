// trophy-page.js

import { isTrophyUnlocked } from './trophyManager.js';

document.addEventListener("DOMContentLoaded", () => {
  if (isTrophyUnlocked("wtp")) {
    document.getElementById("wtp-trophy").src = "assets/TrophyPage/wtp-trophy-unlocked.png";
  }

  if (isTrophyUnlocked("kypl")) {
    document.getElementById("kypl-trophy").src = "assets/TrophyPage/kypl-trophy-unlocked.png";
  }

  if (isTrophyUnlocked("ntc")) {
    document.getElementById("ntc-trophy").src = "assets/TrophyPage/ntc-trophy-unlocked.png";
  }
});
