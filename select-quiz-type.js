document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.quiz-button');
  
    buttons.forEach(button => {
      const arrow = button.querySelector('.arrow');
      
      button.addEventListener('mouseenter', () => {
        if (!button.classList.contains('locked')) {
          arrow.style.visibility = 'visible';
        }
      });
  
      button.addEventListener('mouseleave', () => {
        arrow.style.visibility = 'hidden';
      });
    });
  });
  