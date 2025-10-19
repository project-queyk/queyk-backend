import {
  boolean,
  doublePrecision,
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
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  profileImage: text("profile_image").notNull(),
  alertNotification: boolean("alert_notification").default(true).notNull(),
  pushNotification: boolean("push_notification").default(false).notNull(),
  expoPushToken: text("expo_push_token"),
  webPushSubscription: jsonb("web_push_subscription"),
  role: roleEnum("role").default("user").notNull(),
  oauthId: text("oauth_id").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
});

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
