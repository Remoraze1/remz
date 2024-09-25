const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (like CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Homepage route with the search bar
app.get('/', (req, res) => {
  res.render('index'); // renders the main page with the search bar
});

// Proxy route to handle user requests
app.use(
  '/proxy',
  createProxyMiddleware({
    target: '', // Dynamically set based on user input
    changeOrigin: true,
    router: (req) => req.query.url || 'https://default-website.com', // Use the query param `url`
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader('User-Agent', 'Mozilla/5.0');
    }
  })
);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Remz Proxy is running on port ${PORT}`);
});
