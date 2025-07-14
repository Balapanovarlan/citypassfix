function initBurgerMenu() {
    const burger   = document.querySelector('.burger-menu');
    const sidebar  = document.querySelector('.sidebar');
    const overlay  = document.querySelector('.sidebar__overlay');
    const closeBtn = document.querySelector('.sidebar__btn-close');
    if (!burger || !sidebar) return;
    burger.addEventListener('click', () => {
      sidebar.classList.add('sidebar--active');
      sidebar.classList.remove('sidebar--hidden');
    });
    function hide() {
      sidebar.classList.remove('sidebar--active');
      sidebar.classList.add('sidebar--hidden');
    }
    closeBtn?.addEventListener('click', hide);
    overlay?.addEventListener('click', hide);
  }

/* FAQ Section */
function initAccordion () {
  const faqItems = document.querySelectorAll(".faq-item, .fiq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.setAttribute("tabindex", "0");

    const toggleItem = () => {
      item.classList.toggle("active");
    };

    question.addEventListener("click", toggleItem);
    question.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleItem();
      }
    });
  });
}


function debounce(fn, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}
// Класс слайдеров
class Slider {
  constructor(root, {
    trackSelector,
    slideSelector,
    prevSelector,
    nextSelector,
    gap = 0,
    infinite = false,
    transition = 0.4,
  }) {
    this.root       = typeof root === 'string' ? document.querySelector(root) : root;
    this.track      = this.root.querySelector(trackSelector);
    this.prevBtn    = this.root.querySelector(prevSelector);
    this.nextBtn    = this.root.querySelector(nextSelector);
    this.slideSel   = slideSelector;
    this.gap        = gap;
    this.infinite   = infinite;
    this.transition = transition;
    
    this._bindMethods();
    this._setupSlides();
    this._attachEvents();
    this.update();
  }
  
  _bindMethods() {
    this.update = this.update.bind(this);
    this.move   = this.move.bind(this);
    this._onTransitionEnd = this._onTransitionEnd.bind(this);
  }

  _setupSlides() {
    this.slides = Array.from(this.track.querySelectorAll(this.slideSel));
    
    if (this.infinite) {
      const firstClone = this.slides[0].cloneNode(true);
      const lastClone  = this.slides[this.slides.length - 1].cloneNode(true);
      firstClone.id = 'first-clone';
      lastClone.id  = 'last-clone';
      this.track.appendChild(firstClone);
      this.track.insertBefore(lastClone, this.slides[0]);
      this.allSlides = Array.from(this.track.querySelectorAll(this.slideSel));
      this.currentIndex = 1; // старт на оригинальном первом
      this.track.addEventListener('transitionend', this._onTransitionEnd);
    } else {
      this.allSlides = this.slides;
      this.currentIndex = 0;
    }
  }
  
  _attachEvents() {
    this.prevBtn.addEventListener('click', () => this.move(-1));
    this.nextBtn.addEventListener('click', () => this.move(+1));
    window.addEventListener('resize', debounce(this.update, 100));
  }
  
  update() {
    // заново пересчитываем размеры слайда
    this.slideWidth     = this.allSlides[0].offsetWidth + this.gap;
    const containerW    = this.track.parentElement.clientWidth;
    this.visibleCount   = Math.floor(containerW / this.slideWidth) || 1;
    this.maxIndex       = this.allSlides.length - this.visibleCount - (this.infinite ? 1 : 0);
    // установка трансформации и стилей
    this.track.style.transition = `transform ${this.transition}s ease`;
    this.track.style.transform  = `translateX(${-this.currentIndex * this.slideWidth}px)`;
    // управление доступностью кнопок только для не-зацикленного
    if (!this.infinite) {
      this.prevBtn.classList.toggle('disabled', this.currentIndex === 0);
      this.nextBtn.classList.toggle('disabled', this.currentIndex === this.maxIndex);
    }
  }
  
  move(direction) {
    const next = this.currentIndex + direction;
    if (next < 0 || next > this.maxIndex + (this.infinite ? 1 : 0)) return;
    this.currentIndex = next;
    this.update();
  }
  
  _onTransitionEnd() {
    // для бесконечного зацикливания «перескакиваем» с клона на реальный
    if (this.allSlides[this.currentIndex].id === 'first-clone') {
      this.track.style.transition = 'none';
      this.currentIndex = 1;
      this.track.style.transform = `translateX(${-this.currentIndex * this.slideWidth}px)`;
    }
    if (this.allSlides[this.currentIndex].id === 'last-clone') {
      this.track.style.transition = 'none';
      this.currentIndex = this.allSlides.length - 2;
      this.track.style.transform = `translateX(${-this.currentIndex * this.slideWidth}px)`;
    }
  }
}


// Журнал — обычный слайдер без зацикливания:
new Slider('.journal-slider-wrapper', {
  trackSelector: '.journal-cards',
  slideSelector: '.journal-card',
  prevSelector: '.slider__nav--prev',
  nextSelector: '.slider__nav--next',
  gap: 10,
  infinite: false,
});

// Карусель с бесконечным циклом:
new Slider('.slider', {
  trackSelector: '.slider__track',
  slideSelector: '.slider__item',
  prevSelector: '.slider__nav--prev',
  nextSelector: '.slider__nav--next',
  gap: 20,
  infinite: true,
  transition: 0.5,
});

document.addEventListener("DOMContentLoaded", () => {
  initAccordion();
  initBurgerMenu();
});