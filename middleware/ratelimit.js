const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 30 * 1000, 
  max: 1, 
  message: {
    message: "Only 1 request allowed every 30 seconds. Please wait.",
  },
  standardHeaders: true, 
  legacyHeaders: false,
});

module.exports = {
    limiter
}