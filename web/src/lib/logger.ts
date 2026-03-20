type LogLevel = 'debug' | 'info' | 'warn' | 'error'

type LogMeta = Record<string, unknown>

const REDACT_KEYS = ['password', 'token', 'authorization', 'apikey', 'apiKey', 'secret', 'service_role']

function sanitize(meta: LogMeta = {}): LogMeta {
  const entries = Object.entries(meta).map(([key, value]) => {
    if (REDACT_KEYS.some((blocked) => key.toLowerCase().includes(blocked.toLowerCase()))) {
      return [key, '[REDACTED]']
    }
    if (value instanceof Error) {
      return [key, { name: value.name, message: value.message, stack: value.stack }]
    }
    return [key, value]
  })
  return Object.fromEntries(entries)
}

function emit(level: LogLevel, message: string, meta?: LogMeta) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    message,
    ...sanitize(meta),
  }

  const sink = level === 'error'
    ? console.error
    : level === 'warn'
      ? console.warn
      : console.log

  sink(payload)
}

export const logger = {
  debug: (message: string, meta?: LogMeta) => emit('debug', message, meta),
  info: (message: string, meta?: LogMeta) => emit('info', message, meta),
  warn: (message: string, meta?: LogMeta) => emit('warn', message, meta),
  error: (message: string, meta?: LogMeta) => emit('error', message, meta),
}
