/**
 * Returns the base URL of the application.
 * In the browser, it uses `window.location.origin`.
 * In Node.js, it switches between Vercel production/preview and Localhost.
 */
export const getBaseUrl = () => {
    if (typeof window !== "undefined") return window.location.origin;
    
    if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
    if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
    
    // Vercel provided domain (scheme-less)
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    
    // Local development
    return `http://localhost:${process.env.PORT ?? 3000}`;
};
