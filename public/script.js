document.addEventListener('DOMContentLoaded', () => {
  const placeholders = document.querySelectorAll('[data-placeholder]');
  placeholders.forEach((node) => {
    node.addEventListener('click', () => {
      node.textContent = 'Coming soon';
    });
  });
});
