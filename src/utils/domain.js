/**
 * Extracts the hotel slug from the current hostname.
 * Supports:
 * - hotel.localhost:5173 -> hotel
 * - hotel.hoteltec.app -> hotel
 * - www.hoteltec.app -> null (main site)
 * - hoteltec.app -> null (main site)
 * - localhost:5173 -> null (main site)
 */
export const getSubdomain = () => {
    const hostname = window.location.hostname;

    // Check if we are on localhost
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

    // Split the hostname into parts
    const parts = hostname.split('.');

    // Case 1: sub.localhost -> ["sub", "localhost"]
    if (hostname.endsWith('.localhost')) {
        return parts.length > 1 ? parts[0] : null;
    }

    // Case 2: Production domain hotel.hoteltec.app -> ["hotel", "hoteltec", "app"]
    // We expect at least 3 parts for a subdomain in a standard .app TLD
    if (parts.length >= 3) {
        // Ignore 'www'
        if (parts[0] === 'www') return null;
        // Ignore 'app' if it's app.hoteltec.app (reserved for dashboard)
        if (parts[0] === 'app') return null;

        return parts[0];
    }

    return null;
};

/**
 * Generates a URL for a specific hotel based on the current environment.
 * @param {string} slug - The hotel slug
 * @param {string} path - The internal path (e.g., /store)
 */
export const getHotelUrl = (slug, path = '/store') => {
    const { protocol, port, hostname } = window.location;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // Handle Localhost Development
    if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
        const portStr = port ? `:${port}` : '';
        return `${protocol}//${slug}.localhost${portStr}${cleanPath}`;
    }

    // Handle Production
    const baseDomain = hostname.includes('hoteltec.app') ? 'hoteltec.app' : hostname;
    return `${protocol}//${slug}.${baseDomain}${cleanPath}`;
};
