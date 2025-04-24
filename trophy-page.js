// Sample data structure representing trophy unlock status (this could be dynamically fetched from the backend)
const trophiesStatus = {
  wtp: true, // "Who's That Pokémon?" unlocked
  kypl: false, // "Know Your Pokémon Lore" locked
  ntc: true, // "Name That Cry" unlocked
};

// Function to update the trophy images based on the status
function updateTrophyImages() {
  // Check and update the images based on the unlock status
  if (trophiesStatus.wtp) {
    document.getElementById('wtp-trophy').src = 'wtp-trophy-unlocked.png'; // Show unlocked trophy image
  }
  if (trophiesStatus.kypl) {
    document.getElementById('kypl-trophy').src = 'kypl-trophy-unlocked.png'; // Show unlocked trophy image
  }
  if (trophiesStatus.ntc) {
    document.getElementById('ntc-trophy').src = 'ntc-trophy-unlocked.png'; // Show unlocked trophy image
  }
}

// Call the function to update the images on page load
updateTrophyImages();
