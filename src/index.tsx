
import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import { jsx } from 'hono/jsx';
import { drizzle } from 'drizzle-orm/d1';
import { vlessRouter } from './routes/vless';
import { adminRouter } from './routes/admin';
import * as schema from './db/schema';
import { Analytics } from './utils/analytics';

// Define the environment bindings
export type Env = {
    DB: D1Database;
    ANALYTICS: AnalyticsEngine;
    VLESS_PARSER: WebAssembly.Module;
    // Add other secrets and bindings from wrangler.toml
    ADMIN_SECRET: string;
}

const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use('*', async (c, next) => {
    const db = drizzle(c.env.DB, { schema });
    const analytics = new Analytics(c.env.ANALYTICS);
    c.set('db', db);
    c.set('analytics', analytics);
    await next();
});

// Static assets
app.use('/static/*', serveStatic({ root: './' }));

// Routes
app.route('/vless', vlessRouter);
app.route('/admin', adminRouter);

// Root handler
app.get('/', (c) => {
    return c.text('Welcome to the Ultimate VLESS Proxy!');
});

export default app;
