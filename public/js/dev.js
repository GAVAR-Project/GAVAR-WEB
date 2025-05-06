const searchInput = document.getElementById('searchInput');
const posts = document.querySelectorAll('.post-entry');

searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase();
  posts.forEach((post) => {
    const text = post.textContent.toLowerCase();
    post.style.display = text.includes(term) ? '' : 'none';
  });
});

window.filterByTag = function (tag) {
  posts.forEach((post) => {
    const tags = post.getAttribute('data-tags').split(',');
    if (tag === 'all' || tags.includes(tag)) {
      post.style.display = '';
    } else {
      post.style.display = 'none';
    }
  });
};
