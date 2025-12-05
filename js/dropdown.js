/**
 * Dropdown Component
 * Provides interactive dropdown menu functionality with keyboard navigation
 */

class Dropdown {
  constructor(element) {
    this.dropdown = element;
    this.trigger = element.querySelector('.dropdown__trigger');
    this.menu = element.querySelector('.dropdown__menu');
    this.items = Array.from(element.querySelectorAll('.dropdown__link'));
    this.isOpen = false;
    this.currentIndex = -1;
    
    this.init();
  }
  
  init() {
    // Click trigger to toggle
    this.trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });
    
    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!this.dropdown.contains(e.target) && this.isOpen) {
        this.close();
      }
    });
    
    // Keyboard navigation
    this.trigger.addEventListener('keydown', (e) => this.handleTriggerKeydown(e));
    this.items.forEach((item, index) => {
      item.addEventListener('keydown', (e) => this.handleItemKeydown(e, index));
      item.addEventListener('click', () => this.selectItem(index));
    });
    
    // Set ARIA attributes
    this.trigger.setAttribute('aria-haspopup', 'true');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.menu.setAttribute('role', 'menu');
    this.items.forEach(item => item.setAttribute('role', 'menuitem'));
  }
  
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  
  open() {
    this.isOpen = true;
    this.dropdown.classList.add('dropdown--open');
    this.trigger.setAttribute('aria-expanded', 'true');
    this.currentIndex = -1;
  }
  
  close() {
    this.isOpen = false;
    this.dropdown.classList.remove('dropdown--open');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.currentIndex = -1;
    this.trigger.focus();
  }
  
  handleTriggerKeydown(e) {
    switch(e.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        e.preventDefault();
        this.open();
        this.focusItem(0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.open();
        this.focusItem(this.items.length - 1);
        break;
      case 'Escape':
        this.close();
        break;
    }
  }
  
  handleItemKeydown(e, index) {
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.focusItem((index + 1) % this.items.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.focusItem((index - 1 + this.items.length) % this.items.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.selectItem(index);
        break;
      case 'Escape':
        e.preventDefault();
        this.close();
        break;
      case 'Home':
        e.preventDefault();
        this.focusItem(0);
        break;
      case 'End':
        e.preventDefault();
        this.focusItem(this.items.length - 1);
        break;
    }
  }
  
  focusItem(index) {
    this.currentIndex = index;
    this.items[index].focus();
  }
  
  selectItem(index) {
    // Remove previous selection
    this.items.forEach(item => item.classList.remove('dropdown__link--selected'));
    
    // Add selection to clicked item
    this.items[index].classList.add('dropdown__link--selected');
    
    // Update trigger text
    const selectedText = this.items[index].textContent;
    const triggerText = this.trigger.querySelector('.dropdown__trigger-text');
    if (triggerText) {
      triggerText.textContent = selectedText;
    }
    
    this.close();
  }
}

// Initialize all dropdowns on page load
document.addEventListener('DOMContentLoaded', () => {
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => new Dropdown(dropdown));
});
