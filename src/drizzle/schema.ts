import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  profileImage: text("profile_image").notNull(),
  alertNotification: boolean("alert_notification").default(true).notNull(),
  role: roleEnum("role").default("user").notNull(),
  oauthId: text("oauth_id").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date())
    .notNull(),
});

export const token = pgTable("token", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  type: text("type").notNull(),
  token: text("token").notNull(),
  profileImage: text("profile_image").notNull(),
  alertNotification: boolean("alert_notification").default(true).notNull(),
  role: roleEnum("role").default("user").notNull(),
  expiredAt: timestamp("expires_at"),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date())
    .notNull(),
});
