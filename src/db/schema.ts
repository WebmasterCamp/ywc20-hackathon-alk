import {
  mysqlTable,
  int,
  varchar,
  text,
  datetime,
  boolean,
  unique,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

// Collection table
export const collection = mysqlTable('Collection', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  createdAt: datetime('createdAt').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: datetime('updatedAt').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
});

// User table
export const user = mysqlTable('user', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: text('name').notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  emailVerified: boolean('emailVerified').notNull(),
  image: text('image'),
  createdAt: datetime('createdAt').notNull(),
  updatedAt: datetime('updatedAt').notNull(),
}, (table) => ({
  emailUnique: unique('email_unique').on(table.email),
}));

// Session table
export const session = mysqlTable('session', {
  id: varchar('id', { length: 255 }).primaryKey(),
  expiresAt: datetime('expiresAt').notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  createdAt: datetime('createdAt').notNull(),
  updatedAt: datetime('updatedAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: varchar('userId', { length: 255 }).notNull(),
}, (table) => ({
  tokenUnique: unique('token_unique').on(table.token),
}));

// Account table
export const account = mysqlTable('account', {
  id: varchar('id', { length: 255 }).primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: varchar('userId', { length: 255 }).notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: datetime('accessTokenExpiresAt'),
  refreshTokenExpiresAt: datetime('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: datetime('createdAt').notNull(),
  updatedAt: datetime('updatedAt').notNull(),
});

// Verification table
export const verification = mysqlTable('verification', {
  id: varchar('id', { length: 255 }).primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: datetime('expiresAt').notNull(),
  createdAt: datetime('createdAt'),
  updatedAt: datetime('updatedAt'),
});
