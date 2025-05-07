const express = require('express');
const path = require('path');
const fs = require('fs');
const marked = require('marked');
const expressLayouts = require('express-ejs-layouts');
const matter = require('gray-matter');
const app = express();
const port = process.env.PORT || 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout'); // This uses views/layout.ejs
// Serve static files (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => res.render('index', { title: 'Home' }));
app.get('/about', (req, res) => res.render('about', { title: 'About' }));
app.get('/docs', (req, res) => res.render('docs', { title: 'Documentation'}));

app.get('/docs/forum', (req, res) => res.render('subdocs/forumfiller', { title: 'Forum (Placeholder)'}));
app.get('/docs/notes', (req, res) => res.render('subdocs/notes', { title: 'Notes (Placeholder)'}));

app.get('/docs/official', (req, res) => {
  const docsDir = path.join(__dirname, 'public', 'docs', 'official');
  const files = fs.readdirSync(docsDir).filter(file => file.endsWith('.pdf'));
  res.render('subdocs/official', { title: 'Official Docs', files}); // ✅ Add 'files' here
});

// dev route - dynamically loads dev posts from /devlogs folder
app.get('/dev', (req, res) => {
  const logs = fs.readdirSync('./devlogs').filter((f) => f.endsWith('.md'));
  const groupedPosts = {};
  const allTags = new Set();

  logs.forEach((filename) => {
    const raw = fs.readFileSync(`./devlogs/${filename}`, 'utf-8');
    const parsed = matter(raw);
    const html = marked.parse(parsed.content);

    const [year, month, day, author, ...rest] = filename
      .replace('.md', '')
      .split('-');
    const title = rest.join(' ').replace(/_/g, ' ');
    const key = `${year}-${month}`;

    const tags = parsed.data.tags || [];
    tags.forEach((tag) => allTags.add(tag));

    if (!groupedPosts[key]) groupedPosts[key] = [];
    groupedPosts[key].push({
      date: `${year}-${month}-${day}`,
      title,
      author,
      content: html,
      tags,
    });
  });

  res.render('dev', {
    title: 'Development',
    groupedPosts,
    allTags: Array.from(allTags).sort(),
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// 404 handler (MUST be after all routes)
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});


module.exports = app;
