/**
 * Simple in-memory rate limiter for API routes
 * For production use, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up expired entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}, 60 * 60 * 1000); // 1 hour

export interface RateLimitOptions {
  /**
   * Maximum number of requests allowed in the time window
   * @default 100
   */
  maxRequests?: number;

  /**
   * Time window in milliseconds
   * @default 60000 (1 minute)
   */
  windowMs?: number;

  /**
   * Custom identifier function (defaults to IP address)
   */
  identifier?: (request: Request) => string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt?: number;
}

/**
 * Rate limit a request
 * @param request - The incoming request
 * @param options - Rate limiting options
 * @returns Result indicating if request is allowed
 *
 * @example
 * ```ts
 * export async function GET(request: Request) {
 *   const rateLimitResult = rateLimit(request, { maxRequests: 10, windowMs: 60000 });
 *
 *   if (!rateLimitResult.success) {
 *     return new Response('Too many requests', {
 *       status: 429,
 *       headers: {
 *         'Retry-After': String(Math.ceil((rateLimitResult.resetAt! - Date.now()) / 1000))
 *       }
 *     });
 *   }
 *
 *   // Handle request...
 * }
 * ```
 */
export function rateLimit(
  request: Request,
  options: RateLimitOptions = {}
): RateLimitResult {
  const {
    maxRequests = 100,
    windowMs = 60000,
    identifier = getIpAddress,
  } = options;

  const key = identifier(request);
  const now = Date.now();

  const record = rateLimitMap.get(key);

  // No existing record or window has expired
  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs;
    rateLimitMap.set(key, { count: 1, resetAt });

    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetAt,
    };
  }

  // Check if limit exceeded
  if (record.count >= maxRequests) {
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetAt: record.resetAt,
    };
  }

  // Increment count
  record.count++;

  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - record.count,
    resetAt: record.resetAt,
  };
}

/**
 * Get IP address from request
 * Supports various headers used by proxies and load balancers
 */
function getIpAddress(request: Request): string {
  // Try various headers that might contain the real IP
  const headers = request.headers;

  // X-Forwarded-For (standard proxy header)
  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  // X-Real-IP (nginx)
  const xRealIp = headers.get('x-real-ip');
  if (xRealIp) {
    return xRealIp;
  }

  // CF-Connecting-IP (Cloudflare)
  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // True-Client-IP (Akamai, Cloudflare)
  const trueClientIp = headers.get('true-client-ip');
  if (trueClientIp) {
    return trueClientIp;
  }

  // Fallback to 'unknown' if no IP found
  return 'unknown';
}

/**
 * Helper to create rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
  };

  if (result.resetAt) {
    headers['X-RateLimit-Reset'] = String(Math.ceil(result.resetAt / 1000));
  }

  if (!result.success && result.resetAt) {
    headers['Retry-After'] = String(Math.ceil((result.resetAt - Date.now()) / 1000));
  }

  return headers;
}
