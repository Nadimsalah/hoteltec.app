/**
 * Detects if we are in a local development environment.
 */
const isLocalDev = () => {
    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.localhost');
};

/**
 * Extracts the hotel slug from the current URL.
 * Strategy:
 *   - LOCAL DEV:  subdomain  -> ibis.localhost:5173 -> "ibis"
 *   - PRODUCTION: path-based -> hoteltec.app/store/ibis -> "ibis"  (via useParams)
 *                 subdomain  -> ibis.hoteltec.app -> "ibis" (if wildcard DNS is configured)
 */
export const getSubdomain = () => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');

    // Case 1: LOCAL DEV subdomain -> ibis.localhost
    if (hostname.endsWith('.localhost')) {
        return parts.length > 1 ? parts[0] : null;
    }

    // Case 2: Production subdomain -> ibis.hoteltec.app
    // Only treat as subdomain if NOT the root domain (hoteltec.app = 2 parts, www.hoteltec.app = 3 parts with www)
    if (parts.length >= 3) {
        if (parts[0] === 'www') return null;
        if (parts[0] === 'app') return null;
        // It's a real hotel subdomain!
        return parts[0];
    }

    // Case 3: Production path-based -> the slug comes from useParams() in the component
    return null;
};

/**
 * Generates a URL for a specific hotel based on the current environment.
 *
 * LOCAL DEV:   uses subdomain  -> ibis.localhost:5173/store
 * PRODUCTION:  uses path-based -> hoteltec.app/store/ibis
 *              (safer - works without wildcard DNS configuration)
 *
 * @param {string} slug - The hotel slug
 * @param {string} path - The internal path (e.g., /store)
 */
export const getHotelUrl = (slug, path = '/store') => {
    const { protocol, port, hostname } = window.location;

    // LOCAL DEV: use subdomain routing
    if (isLocalDev()) {
        const portStr = port ? `:${port}` : '';
        return `${protocol}//${slug}.localhost${portStr}${path}`;
    }

    // PRODUCTION: use path-based routing (always works, no wildcard DNS needed)
    // Format: https://hoteltec.app/store/ibis
    const baseDomain = hostname.includes('hoteltec.app')
        ? 'hoteltec.app'
        : hostname;

    // Build path-based URL: /store/slug  OR  /store/slug/subpath
    const cleanPath = path === '/store' ? `/store/${slug}` : `/store/${slug}${path}`;
    return `${protocol}//${baseDomain}${cleanPath}`;
};
