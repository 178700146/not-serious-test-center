import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const testSuggestions = sqliteTable('test_suggestions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  idea: text('idea').notNull(),
  target: text('target').notNull(),
  note: text('note').notNull().default(''),
  createdAt: text('created_at').notNull(),
});

export const privateFeedback = sqliteTable('private_feedback', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  message: text('message').notNull(),
  createdAt: text('created_at').notNull(),
});
