
import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * Table to store user information for the VLESS proxy.
 * Each user is identified by a UUID.
 */
export const users = sqliteTable('users', {
  uuid: text('uuid').primaryKey(),
  createdAt: text('created_at').default(sql`(strftime('%Y-%m-%d %H:%M:%S', 'now'))`).notNull(),
  expirationDate: text('expiration_date').notNull(),
  expirationTime: text('expiration_time').notNull(),
  notes: text('notes'),
  trafficLimit: integer('traffic_limit'), // Stored in bytes
  trafficUsed: integer('traffic_used').default(0), // Stored in bytes
  ipLimit: integer('ip_limit').default(-1), // -1 for unlimited
});

/**
 * Tracks the unique IP addresses used by each user to enforce the ipLimit.
 */
export const userIps = sqliteTable('user_ips', {
  uuid: text('uuid').notNull().references(() => users.uuid, { onDelete: 'cascade' }),
  ip: text('ip').notNull(),
  lastSeen: text('last_seen').default(sql`(strftime('%Y-%m-%d %H:%M:%S', 'now'))`).notNull(),
}, (table) => ({
  // Composite primary key to ensure one entry per user and IP
  pk: primaryKey({ columns: [table.uuid, table.ip] }),
}));

/**
 * Stores the health status and latency of configured proxy IPs.
 * This is used for auto-switching to the best available proxy.
 */
export const proxyHealth = sqliteTable('proxy_health', {
  ipPort: text('ip_port').primaryKey(),
  isHealthy: integer('is_healthy', { mode: 'boolean' }).notNull(),
  latencyMs: integer('latency_ms'),
  lastCheck: integer('last_check', { mode: 'timestamp' }).notNull(),
});

/**
 * Manages admin login sessions, replacing the previous KV-based implementation.
 */
export const adminSessions = sqliteTable('admin_sessions', {
  tokenHash: text('token_hash').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});

/**
 * Table for Cloudflare Analytics Engine to log connection events.
 */
export const connectionEvents = sqliteTable('connection_events', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    timestamp: integer('timestamp', { mode: 'timestamp' }).default(sql`(strftime('%Y-%m-%d %H:%M:%S', 'now'))`).notNull(),
    uuid: text('uuid'),
    ip: text('ip'),
    country: text('country'),
    status: text('status'), // e.g., 'success', 'fail:auth', 'fail:limit', 'fail:expired'
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
