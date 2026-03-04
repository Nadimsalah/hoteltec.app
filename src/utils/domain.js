/**
 * Detects if we are in a local development environment.
 */
const isLocalDev = () => {
    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.localhost');
};

/**
 * Extracts the hotel slug from the current URL.
 * Supports:
 *   - ibis.localhost:5173 -> "ibis"  (local dev)
 *   - ibis.hoteltec.app   -> "ibis"  (production)
 *   - hoteltec.app        -> null    (main dashboard)
 *   - www.hoteltec.app    -> null    (main site)
 */
export const getSubdomain = () => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');

    // Case 1: LOCAL DEV subdomain -> ibis.localhost
    if (hostname.endsWith('.localhost')) {
        return parts.length > 1 ? parts[0] : null;
    }

    // Case 2: Production subdomain -> ibis.hoteltec.app (3+ parts)
    if (parts.length >= 3) {
        if (parts[0] === 'www') return null;
        if (parts[0] === 'app') return null;
        return parts[0];
    }

    return null;
};

/**
 * Generates a subdomain URL for a specific hotel.
 * Always uses subdomain format in both local and production.
 *
 * LOCAL DEV:   ibis.localhost:5173/store
 * PRODUCTION:  ibis.hoteltec.app/store
 *
 * @param {string} slug - The hotel slug
 * @param {string} path - The internal path (e.g., /store)
 */
export const getHotelUrl = (slug, path = '/store') => {
    const { protocol, port, hostname } = window.location;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // LOCAL DEV: ibis.localhost:5173
    if (isLocalDev()) {
        const portStr = port ? `:${port}` : '';
        return `${protocol}//${slug}.localhost${portStr}${cleanPath}`;
    }

    // PRODUCTION: ibis.hoteltec.app
    const baseDomain = hostname.includes('hoteltec.app') ? 'hoteltec.app' : hostname;
    return `${protocol}//${slug}.${baseDomain}${cleanPath}`;
};
