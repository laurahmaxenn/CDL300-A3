/**
 * Tooltip Component
 * Provides tooltip functionality with hover and focus support
 */

class Tooltip {
  constructor(wrapper) {
    this.wrapper = wrapper;
    this.trigger = wrapper.querySelector('.tooltip-trigger');
    this.tooltip = wrapper.querySelector('.tooltip');
    this.showDelay = 300;
    this.hideDelay = 100;
    this.showTimeout = null;
    this.hideTimeout = null;
    
    this.init();
  }
  
  init() {
    // Mouse events
    this.trigger.addEventListener('mouseenter', () => this.scheduleShow());
    this.trigger.addEventListener('mouseleave', () => this.scheduleHide());
    
    // Focus events for keyboard users
    this.trigger.addEventListener('focus', () => this.scheduleShow());
    this.trigger.addEventListener('blur', () => this.scheduleHide());
    
    // Set ARIA attributes
    const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
    this.tooltip.setAttribute('id', tooltipId);
    this.tooltip.setAttribute('role', 'tooltip');
    this.trigger.setAttribute('aria-describedby', tooltipId);
  }
  
  scheduleShow() {
    // Clear any pending hide
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
    
    // Schedule show with delay
    this.showTimeout = setTimeout(() => {
      this.show();
    }, this.showDelay);
  }
  
  scheduleHide() {
    // Clear any pending show
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    
    // Schedule hide with delay
    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, this.hideDelay);
  }
  
  show() {
    this.tooltip.classList.add('tooltip--visible');
    this.positionTooltip();
  }
  
  hide() {
    this.tooltip.classList.remove('tooltip--visible');
  }
  
  positionTooltip() {
    // Get tooltip position class
    const position = Array.from(this.tooltip.classList)
      .find(cls => cls.startsWith('tooltip--') && cls !== 'tooltip--visible');
    
    if (!position) return;
    
    // Check if tooltip would go off screen and adjust if needed
    const tooltipRect = this.tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Simple viewport boundary check
    if (tooltipRect.left < 0 || tooltipRect.right > viewportWidth) {
      // Tooltip goes off screen horizontally
      // In a production app, you might switch to a different position
      // For this demo, we'll just ensure it stays visible
      if (tooltipRect.left < 0) {
        this.tooltip.style.left = '0';
        this.tooltip.style.transform = 'translateX(0)';
      }
      if (tooltipRect.right > viewportWidth) {
        this.tooltip.style.right = '0';
        this.tooltip.style.left = 'auto';
        this.tooltip.style.transform = 'translateX(0)';
      }
    }
    
    if (tooltipRect.top < 0 || tooltipRect.bottom > viewportHeight) {
      // Tooltip goes off screen vertically
      // Similar adjustments could be made here
    }
  }
}

// Initialize all tooltips on page load
document.addEventListener('DOMContentLoaded', () => {
  const tooltipWrappers = document.querySelectorAll('.tooltip-wrapper');
  tooltipWrappers.forEach(wrapper => new Tooltip(wrapper));
});
