import rateLimit from 'express-rate-limit'

export const defaultRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    error: 'Muitas requisições. Tente novamente em 1 minuto.',
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    retryAfter: 900,
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const createRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: {
    error: 'Muitas criações. Tente novamente em 1 minuto.',
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
})
