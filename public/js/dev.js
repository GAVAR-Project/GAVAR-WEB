document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const posts = document.querySelectorAll('.post-entry');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const term = searchInput.value.toLowerCase();
      posts.forEach((post) => {
        const text = post.textContent.toLowerCase();
        post.style.display = text.includes(term) ? '' : 'none';
      });
    });
  }

  window.filterByTag = function (tag) {
    posts.forEach((post) => {
      const tags = post.getAttribute('data-tags').split(',');
      post.style.display = (tag === 'all' || tags.includes(tag)) ? '' : 'none';
    });
  };
});
