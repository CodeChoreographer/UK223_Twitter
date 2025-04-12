import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Zu viele Login-Versuche. Bitte warte kurz und versuche es erneut.',
  },
});
export const registerRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Zu viele Registrierungsversuche. Bitte warte kurz und versuche es erneut.',
  },
});
