// trophyManager.js

export function unlockTrophy(trophyKey) {
    const trophies = JSON.parse(sessionStorage.getItem("trophies") || "{}");
    trophies[trophyKey] = true;
    sessionStorage.setItem("trophies", JSON.stringify(trophies));
  }
  
  export function isTrophyUnlocked(trophyKey) {
    const trophies = JSON.parse(sessionStorage.getItem("trophies") || "{}");
    return trophies[trophyKey] === true;
  }
  