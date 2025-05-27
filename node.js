const express = require('express');
const path = require('path');
const fs = require('fs');
const marked = require('marked');
const expressLayouts = require('express-ejs-layouts');
const matter = require('gray-matter');
const favicon = require('serve-favicon');
const app = express();
const port = process.env.PORT || 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout'); // This uses views/layout.ejs

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Serve static files (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => res.render('index', { title: 'Home' }));
app.get('/about', (req, res) => res.render('about', { title: 'About' }));
app.get('/docs', (req, res) => res.render('docs', { title: 'Documentation'}));

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

app.listen(3000, '0.0.0.0');

// 404 handler (MUST be after all routes)
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});


module.exports = app;
