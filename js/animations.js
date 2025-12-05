/**
 * Framer Motion-inspired Animations
 * Smooth entrance animations and scroll effects
 */

// Animation configurations (Framer Motion style)
const animations = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    duration: 600,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)' // Framer Motion's default spring
  },
  fadeInUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    duration: 700,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    duration: 500,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
  },
  slideInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    duration: 600,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
  },
  slideInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    duration: 600,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
  }
};

// Apply animation to element
function applyAnimation(element, animationType, delay = 0) {
  const config = animations[animationType] || animations.fadeIn;
  
  // Set initial state
  Object.assign(element.style, {
    opacity: config.initial.opacity,
    transform: getTransform(config.initial),
    transition: `all ${config.duration}ms ${config.easing}`
  });
  
  // Trigger animation after delay
  setTimeout(() => {
    Object.assign(element.style, {
      opacity: config.animate.opacity,
      transform: getTransform(config.animate)
    });
  }, delay);
}

// Convert animation values to transform string
function getTransform(values) {
  const transforms = [];
  
  if (values.x !== undefined) {
    transforms.push(`translateX(${values.x}px)`);
  }
  if (values.y !== undefined) {
    transforms.push(`translateY(${values.y}px)`);
  }
  if (values.scale !== undefined) {
    transforms.push(`scale(${values.scale})`);
  }
  
  return transforms.length > 0 ? transforms.join(' ') : 'none';
}

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const element = entry.target;
      const animationType = element.dataset.animation || 'fadeIn';
      const delay = parseInt(element.dataset.delay || '0');
      
      applyAnimation(element, animationType, delay);
      observer.unobserve(element);
    }
  });
}, observerOptions);

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
  // Animate header immediately
  const header = document.querySelector('.library-header');
  if (header) {
    applyAnimation(header, 'fadeIn', 0);
  }
  
  // Observe all component showcases
  const showcases = document.querySelectorAll('.component-showcase');
  showcases.forEach((showcase, index) => {
    showcase.dataset.animation = 'fadeInUp';
    showcase.dataset.delay = index * 100; // Stagger effect
    observer.observe(showcase);
  });
  
  // Observe variant groups for stagger
  const variantGroups = document.querySelectorAll('.variant-group');
  variantGroups.forEach((group, index) => {
    group.dataset.animation = 'fadeIn';
    group.dataset.delay = index * 50;
    observer.observe(group);
  });
  
  // Animate buttons on hover with spring effect
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.transition = 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
  
  // Animate cards on hover
  const cards = document.querySelectorAll('.card-header, .component-showcase');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px)';
      this.style.transition = 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
  
  // Animate inputs on focus
  const inputs = document.querySelectorAll('.input');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.style.transform = 'scale(1.01)';
      this.style.transition = 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)';
    });
    
    input.addEventListener('blur', function() {
      this.style.transform = 'scale(1)';
    });
  });
  
  // Page load animation sequence
  setTimeout(() => {
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
      section.dataset.animation = 'fadeIn';
      observer.observe(section);
    });
  }, 300);
});

// Export for use in other scripts
window.FramerAnimations = {
  applyAnimation,
  observer
};
