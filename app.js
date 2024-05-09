const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const PORT = 3000;

// In-memory storage for long URLs and their corresponding short codes
const urlStore = {};

// Middleware to parse JSON bodies
app.use(bodyParser.json());
// Enable CORS
app.use(cors());

// Function to generate a unique short code for a long URL
function generateShortCode(url) {
  return crypto.createHash('md5').update(url).digest('hex').substr(0, 6);
}

// Shortening Function (encodeURL)
app.post('/shorten', (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: 'Missing longUrl parameter' });
  }

  const shortCode = generateShortCode(longUrl);
  urlStore[shortCode] = longUrl;

  // Assuming your shortened URL format is something like "/s/shortCode"
  const shortenedUrl = `/s/${shortCode}`; // Corrected string concatenation

  res.status(201).json({ shortUrl: shortenedUrl });
});

// Decoding and Redirect Function (decodeURL)
app.get('/s/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  const longUrl = urlStore[shortCode];

  if (!longUrl) {
    return res.status(404).json({ error: 'Short URL not found' });
  }

  // Redirect user to the original long URL
  res.redirect(longUrl);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // Corrected console.log() statement
});
