let currentCardIndex = 0;

export function InicializarAOS() {
  AOS.init({
    duration: 1000,
    easing: "ease-in-out",
    once: false,
    mirror: true,
  });
}

export function applyBackgroundEffect(cards) {
  if (Array.from(cards).some(card => card.matches(':hover'))) {
    return;
  }

  if (document.querySelector('.cards.background-effect')) {
    return;
  }

  const card = cards[currentCardIndex];
  currentCardIndex = (currentCardIndex + 1) % cards.length;

  card.classList.add("background-effect");
  void card.offsetWidth;

  setTimeout(() => {
    card.classList.remove("background-effect");
    void card.offsetWidth;
  }, 1500);
}

export function observeThirdSection() {
  const cards = document.querySelectorAll(".cards");
  const thirdSection = document.getElementById("third-section");
  let intervalId = null;

  if (!thirdSection || cards.length === 0) return;

  const observerOptions = {
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!intervalId) {
          applyBackgroundEffect(cards);
          intervalId = setInterval(() => applyBackgroundEffect(cards), 2500);
        }
      } else {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    });
  }, observerOptions);

  observer.observe(thirdSection);

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    });
    card.addEventListener('mouseleave', () => {
      const rect = thirdSection.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0 && !intervalId) {
        applyBackgroundEffect(cards);
        intervalId = setInterval(() => applyBackgroundEffect(cards), 2500);
      }
    });
  });
}

// Cuando el DOM esté completamente cargado, se inicializan las funciones.
document.addEventListener("DOMContentLoaded", () => {
  observeThirdSection();
  InicializarAOS();
});