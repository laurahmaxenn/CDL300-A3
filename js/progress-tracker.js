/**
 * Progress Tracker Component
 * Provides step-by-step progress tracking with visual feedback
 */

class ProgressTracker {
  constructor(element, options = {}) {
    this.tracker = element;
    this.steps = Array.from(element.querySelectorAll('.progress-tracker__step'));
    this.progressBar = element.querySelector('.progress-tracker__progress');
    this.currentStep = options.currentStep || 1;
    this.allowNavigation = options.allowNavigation !== false;
    this.onStepChange = options.onStepChange || (() => {});
    
    this.init();
  }
  
  init() {
    // Set ARIA attributes
    this.tracker.setAttribute('role', 'progressbar');
    this.tracker.setAttribute('aria-valuemin', '1');
    this.tracker.setAttribute('aria-valuemax', this.steps.length.toString());
    
    // Make steps clickable if navigation is allowed
    if (this.allowNavigation) {
      this.steps.forEach((step, index) => {
        step.classList.add('progress-tracker__step--clickable');
        step.setAttribute('tabindex', '0');
        step.setAttribute('role', 'button');
        step.setAttribute('aria-label', `Go to step ${index + 1}`);
        
        step.addEventListener('click', () => this.goToStep(index + 1));
        step.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.goToStep(index + 1);
          }
        });
      });
    }
    
    // Set initial state
    this.updateProgress();
  }
  
  updateProgress() {
    // Update step states
    this.steps.forEach((step, index) => {
      const stepNumber = index + 1;
      
      // Remove all state classes
      step.classList.remove('progress-tracker__step--completed', 'progress-tracker__step--current', 'progress-tracker__step--error');
      
      if (stepNumber < this.currentStep) {
        step.classList.add('progress-tracker__step--completed');
        
        // Add check icon to completed steps
        const circle = step.querySelector('.progress-tracker__circle');
        if (circle && !circle.querySelector('.progress-tracker__check')) {
          circle.innerHTML = `
            <svg class="progress-tracker__check" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          `;
        }
      } else if (stepNumber === this.currentStep) {
        step.classList.add('progress-tracker__step--current');
        
        // Show step number for current step
        const circle = step.querySelector('.progress-tracker__circle');
        if (circle) {
          circle.textContent = stepNumber;
        }
      } else {
        // Show step number for upcoming steps
        const circle = step.querySelector('.progress-tracker__circle');
        if (circle) {
          circle.textContent = stepNumber;
        }
      }
    });
    
    // Update progress bar
    if (this.progressBar) {
      const progress = ((this.currentStep - 1) / (this.steps.length - 1)) * 100;
      this.progressBar.style.width = `${progress}%`;
    }
    
    // Update ARIA
    this.tracker.setAttribute('aria-valuenow', this.currentStep.toString());
    this.tracker.setAttribute('aria-valuetext', `Step ${this.currentStep} of ${this.steps.length}`);
  }
  
  goToStep(step) {
    if (step < 1 || step > this.steps.length || step === this.currentStep) {
      return;
    }
    
    this.currentStep = step;
    this.updateProgress();
    this.onStepChange(step);
    
    // Dispatch custom event
    const event = new CustomEvent('stepChange', {
      detail: { step: this.currentStep }
    });
    this.tracker.dispatchEvent(event);
  }
  
  next() {
    if (this.currentStep < this.steps.length) {
      this.goToStep(this.currentStep + 1);
    }
  }
  
  previous() {
    if (this.currentStep > 1) {
      this.goToStep(this.currentStep - 1);
    }
  }
  
  setError(step) {
    if (step >= 1 && step <= this.steps.length) {
      this.steps[step - 1].classList.add('progress-tracker__step--error');
    }
  }
  
  clearError(step) {
    if (step >= 1 && step <= this.steps.length) {
      this.steps[step - 1].classList.remove('progress-tracker__step--error');
    }
  }
  
  getCurrentStep() {
    return this.currentStep;
  }
}

// Initialize progress trackers on page load
document.addEventListener('DOMContentLoaded', () => {
  // Demo tracker 1 - Step 1
  const tracker1 = document.getElementById('demo-tracker-1');
  if (tracker1) {
    new ProgressTracker(tracker1, {
      currentStep: 1,
      allowNavigation: true,
      onStepChange: (step) => {
        console.log('Tracker 1 - Step changed to:', step);
      }
    });
  }
  
  // Demo tracker 2 - Step 3
  const tracker2 = document.getElementById('demo-tracker-2');
  if (tracker2) {
    new ProgressTracker(tracker2, {
      currentStep: 3,
      allowNavigation: true,
      onStepChange: (step) => {
        console.log('Tracker 2 - Step changed to:', step);
      }
    });
  }
  
  // Demo tracker 3 - Completed
  const tracker3 = document.getElementById('demo-tracker-3');
  if (tracker3) {
    new ProgressTracker(tracker3, {
      currentStep: 4,
      allowNavigation: false,
      onStepChange: (step) => {
        console.log('Tracker 3 - Step changed to:', step);
      }
    });
  }
});
