import { nanoid } from "nanoid";
import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const tokenTypeEnum = pgEnum("type", ["auth", "admin", "user", "iot"]);

export const user = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  profileImage: text("profile_image"),
  role: text("role").default("user").notNull(),
  alertNotification: boolean("alert_notification").default(true),
  pushNotification: boolean("push_notification").default(false),
  expoPushToken: text("expo_push_token"),
  webPushSubscription: jsonb("web_push_subscription"),
  oauthId: text("oauth_id"),
  smsNotification: boolean("sms_notification").default(false),
  phoneNumber: text("phone_number"),
  isInSchool: boolean("is_in_school").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const token = pgTable("token", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  type: tokenTypeEnum("type").notNull(),
  token: text("token").notNull(),
  expiredAt: timestamp("expires_at"),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
});

export const reading = pgTable("reading", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  siAverage: doublePrecision("si_average").notNull(),
  siMinimum: doublePrecision("si_minimum").notNull(),
  siMaximum: doublePrecision("si_maximum").notNull(),
  battery: doublePrecision("battery").notNull(),
  signalStrength: text("signal_strength").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
});

export const earthquake = pgTable("earthquake", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  magnitude: doublePrecision("magnitude").notNull(),
  duration: integer("duration").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
});

export const floorPlan = pgTable("floor_plan", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  buildingName: text("building_name").notNull(),
  floorNumber: integer("floor_number").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
});

export const location = pgTable("location", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  floorPlanId: uuid("floor_plan_id")
    .references(() => floorPlan.id)
    .notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  radiusMeters: doublePrecision("radius_meters").notNull(),
  displayX: integer("display_x").notNull(),
  displayY: integer("display_y").notNull(),

  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
});
