/**
 * Pagination Component
 * Provides pagination functionality with page navigation
 */

class Pagination {
  constructor(element, options = {}) {
    this.pagination = element;
    this.currentPage = options.currentPage || 1;
    this.totalPages = options.totalPages || 10;
    this.maxVisible = options.maxVisible || 5;
    this.onPageChange = options.onPageChange || (() => {});
    
    this.render();
    this.attachEvents();
  }
  
  render() {
    this.pagination.innerHTML = '';
    this.pagination.setAttribute('role', 'navigation');
    this.pagination.setAttribute('aria-label', 'Pagination');
    
    const ul = document.createElement('ul');
    ul.className = 'pagination';
    
    // Previous button
    const prevItem = this.createPageItem('prev', this.currentPage - 1, '‹', this.currentPage === 1);
    ul.appendChild(prevItem);
    
    // Page numbers
    const pages = this.getPageNumbers();
    pages.forEach(page => {
      if (page === '...') {
        const ellipsis = document.createElement('li');
        ellipsis.className = 'pagination__item';
        ellipsis.innerHTML = '<span class="pagination__ellipsis">...</span>';
        ul.appendChild(ellipsis);
      } else {
        const pageItem = this.createPageItem('page', page, page, false, page === this.currentPage);
        ul.appendChild(pageItem);
      }
    });
    
    // Next button
    const nextItem = this.createPageItem('next', this.currentPage + 1, '›', this.currentPage === this.totalPages);
    ul.appendChild(nextItem);
    
    this.pagination.appendChild(ul);
  }
  
  createPageItem(type, page, text, disabled, active = false) {
    const li = document.createElement('li');
    li.className = 'pagination__item';
    
    const link = document.createElement('button');
    link.className = 'pagination__link';
    link.textContent = text;
    link.setAttribute('type', 'button');
    
    if (type === 'prev') {
      link.setAttribute('aria-label', 'Previous page');
    } else if (type === 'next') {
      link.setAttribute('aria-label', 'Next page');
    } else {
      link.setAttribute('aria-label', `Page ${page}`);
    }
    
    if (disabled) {
      link.classList.add('pagination__link--disabled');
      link.setAttribute('aria-disabled', 'true');
      link.setAttribute('tabindex', '-1');
    } else if (active) {
      link.classList.add('pagination__link--active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.addEventListener('click', () => this.goToPage(page));
    }
    
    li.appendChild(link);
    return li;
  }
  
  getPageNumbers() {
    const pages = [];
    const halfVisible = Math.floor(this.maxVisible / 2);
    
    let startPage = Math.max(1, this.currentPage - halfVisible);
    let endPage = Math.min(this.totalPages, this.currentPage + halfVisible);
    
    // Adjust if we're near the start or end
    if (this.currentPage <= halfVisible) {
      endPage = Math.min(this.totalPages, this.maxVisible);
    }
    if (this.currentPage > this.totalPages - halfVisible) {
      startPage = Math.max(1, this.totalPages - this.maxVisible + 1);
    }
    
    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis and last page if needed
    if (endPage < this.totalPages) {
      if (endPage < this.totalPages - 1) {
        pages.push('...');
      }
      pages.push(this.totalPages);
    }
    
    return pages;
  }
  
  goToPage(page) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    
    this.currentPage = page;
    this.render();
    this.attachEvents();
    this.onPageChange(page);
    
    // Dispatch custom event
    const event = new CustomEvent('pageChange', {
      detail: { page: this.currentPage }
    });
    this.pagination.dispatchEvent(event);
  }
  
  attachEvents() {
    // Keyboard navigation
    const links = this.pagination.querySelectorAll('.pagination__link:not(.pagination__link--disabled):not(.pagination__link--active)');
    links.forEach((link, index) => {
      link.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && index > 0) {
          e.preventDefault();
          links[index - 1].focus();
        } else if (e.key === 'ArrowRight' && index < links.length - 1) {
          e.preventDefault();
          links[index + 1].focus();
        }
      });
    });
  }
  
  setPage(page) {
    this.goToPage(page);
  }
  
  getCurrentPage() {
    return this.currentPage;
  }
}

// Initialize pagination on page load
document.addEventListener('DOMContentLoaded', () => {
  // Demo pagination 1
  const pagination1 = document.getElementById('demo-pagination-1');
  if (pagination1) {
    new Pagination(pagination1, {
      currentPage: 1,
      totalPages: 10,
      maxVisible: 5,
      onPageChange: (page) => {
        console.log('Page changed to:', page);
      }
    });
  }
  
  // Demo pagination 2
  const pagination2 = document.getElementById('demo-pagination-2');
  if (pagination2) {
    new Pagination(pagination2, {
      currentPage: 5,
      totalPages: 20,
      maxVisible: 7,
      onPageChange: (page) => {
        console.log('Page changed to:', page);
      }
    });
  }
  
  // Demo pagination 3
  const pagination3 = document.getElementById('demo-pagination-3');
  if (pagination3) {
    new Pagination(pagination3, {
      currentPage: 1,
      totalPages: 1,
      maxVisible: 5,
      onPageChange: (page) => {
        console.log('Page changed to:', page);
      }
    });
  }
});
