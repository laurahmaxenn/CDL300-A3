/**
 * Ratings Component
 * Provides interactive star rating functionality with hover preview and animation
 */

class Ratings {
  constructor(element) {
    this.ratings = element;
    this.stars = Array.from(element.querySelectorAll('.ratings__star'));
    this.countElement = element.querySelector('.ratings__count');
    this.valueElement = element.querySelector('.ratings__value');
    this.currentRating = 0;
    this.hoverRating = 0;
    this.isDisabled = element.classList.contains('ratings--disabled');
    
    if (!this.isDisabled) {
      this.init();
    }
  }
  
  init() {
    this.stars.forEach((star, index) => {
      const rating = index + 1;
      
      // Mouse events
      star.addEventListener('mouseenter', () => this.handleHover(rating));
      star.addEventListener('mouseleave', () => this.handleHoverEnd());
      star.addEventListener('click', () => this.handleClick(rating));
      
      // Keyboard events
      star.addEventListener('keydown', (e) => this.handleKeydown(e, rating));
      
      // Set ARIA attributes
      star.setAttribute('role', 'button');
      star.setAttribute('aria-label', `Rate ${rating} out of ${this.stars.length} stars`);
      star.setAttribute('tabindex', '0');
    });
    
    // Set container ARIA attributes
    this.ratings.setAttribute('role', 'group');
    this.ratings.setAttribute('aria-label', 'Star rating');
  }
  
  handleHover(rating) {
    this.hoverRating = rating;
    this.updateStars();
  }
  
  handleHoverEnd() {
    this.hoverRating = 0;
    this.updateStars();
  }
  
  handleClick(rating) {
    this.currentRating = rating;
    this.hoverRating = 0;
    this.updateStars();
    this.updateCount();
    this.animateSelection(rating);
    
    // Dispatch custom event
    const event = new CustomEvent('ratingChange', {
      detail: { rating: this.currentRating }
    });
    this.ratings.dispatchEvent(event);
  }
  
  handleKeydown(e, rating) {
    switch(e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.handleClick(rating);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        if (rating < this.stars.length) {
          this.stars[rating].focus();
        }
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        if (rating > 1) {
          this.stars[rating - 2].focus();
        }
        break;
      case 'Home':
        e.preventDefault();
        this.stars[0].focus();
        break;
      case 'End':
        e.preventDefault();
        this.stars[this.stars.length - 1].focus();
        break;
    }
  }
  
  updateStars() {
    const displayRating = this.hoverRating || this.currentRating;
    
    this.stars.forEach((star, index) => {
      const rating = index + 1;
      
      // Remove all state classes
      star.classList.remove('ratings__star--filled', 'ratings__star--preview');
      
      if (rating <= displayRating) {
        if (this.hoverRating > 0) {
          star.classList.add('ratings__star--preview');
        } else {
          star.classList.add('ratings__star--filled');
        }
      }
    });
  }
  
  updateCount() {
    if (this.valueElement) {
      this.valueElement.textContent = this.currentRating;
    }
  }
  
  animateSelection(rating) {
    // Add a subtle scale animation to the selected star
    const star = this.stars[rating - 1];
    star.style.transform = 'scale(1.3)';
    
    setTimeout(() => {
      star.style.transform = '';
    }, 200);
  }
  
  setRating(rating) {
    if (!this.isDisabled && rating >= 0 && rating <= this.stars.length) {
      this.currentRating = rating;
      this.updateStars();
      this.updateCount();
    }
  }
  
  getRating() {
    return this.currentRating;
  }
  
  disable() {
    this.isDisabled = true;
    this.ratings.classList.add('ratings--disabled');
    this.stars.forEach(star => {
      star.setAttribute('tabindex', '-1');
      star.setAttribute('aria-disabled', 'true');
    });
  }
  
  enable() {
    this.isDisabled = false;
    this.ratings.classList.remove('ratings--disabled');
    this.stars.forEach(star => {
      star.setAttribute('tabindex', '0');
      star.removeAttribute('aria-disabled');
    });
  }
}

// Initialize all ratings on page load
document.addEventListener('DOMContentLoaded', () => {
  const ratingsElements = document.querySelectorAll('.ratings');
  ratingsElements.forEach(element => new Ratings(element));
});
