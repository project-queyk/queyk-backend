var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/lib/utils.ts
function formatZodError(error) {
  return error.issues.map((err) => {
    const field = err.path.join(".");
    return `${field}: ${err.message}`;
  }).join(", ");
}
function getSeismicRiskLevel(si) {
  if (si < 0.5) return "normal";
  if (si <= 1) return "elevated";
  return "concerning";
}
function isSeismicSafe(si) {
  return si < 1;
}
function getSeismicRiskLevelForReading(reading3) {
  return getSeismicRiskLevel(reading3.siMaximum);
}
function isReadingSeismicSafe(reading3) {
  return isSeismicSafe(reading3.siMaximum);
}
function getEarthquakeRiskLevel(magnitude) {
  if (magnitude < 4) return "minor";
  if (magnitude < 6) return "moderate";
  if (magnitude < 8) return "major";
  return "severe";
}
var init_utils = __esm({
  "src/lib/utils.ts"() {
    "use strict";
  }
});

// src/lib/pdf-generator.ts
var pdf_generator_exports = {};
__export(pdf_generator_exports, {
  generateSeismicReportBuffer: () => generateSeismicReportBuffer
});
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
function generateSeismicReportBuffer(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;
      const queykLogo = "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";
      const iccLogo = "";
      const colors = {
        primary: [25, 56, 103],
        primaryForeground: [255, 255, 255],
        accent: [53, 80, 122],
        text: [33, 37, 41],
        mutedText: [108, 117, 125],
        yellow: [255, 212, 59]
      };
      const pageWidth = doc.internal.pageSize.width;
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.rect(0, 0, pageWidth, 30, "F");
      doc.addImage(queykLogo, "PNG", 10, 5, 25, 8);
      if (iccLogo) {
        doc.addImage(iccLogo, "PNG", pageWidth - 35, 5, 25, 8);
      }
      doc.setTextColor(
        colors.primaryForeground[0],
        colors.primaryForeground[1],
        colors.primaryForeground[2]
      );
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("QUEYK", pageWidth / 2, 16, { align: "center" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Seismic Intensity Monitoring System", pageWidth / 2, 23, {
        align: "center"
      });
      doc.setDrawColor(colors.yellow[0], colors.yellow[1], colors.yellow[2]);
      doc.setLineWidth(1);
      doc.line(0, 30, pageWidth, 30);
      yPosition = 45;
      const [start, end] = data.dateRange.split(" - ");
      const startPHT = start ? new Date(start) : null;
      let reportPeriodText = data.dateRange;
      if (startPHT && !isNaN(startPHT.getTime())) {
        const endPHT = end ? new Date(end) : null;
        if (endPHT && !isNaN(endPHT.getTime()) && startPHT.toDateString() === endPHT.toDateString()) {
          reportPeriodText = startPHT.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            timeZone: "Asia/Manila"
          });
        }
      }
      doc.setFontSize(10);
      doc.setTextColor(
        colors.mutedText[0],
        colors.mutedText[1],
        colors.mutedText[2]
      );
      doc.text(`Report Period: ${reportPeriodText}`, 20, yPosition);
      doc.text(
        `Generated: ${(/* @__PURE__ */ new Date()).toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Manila"
        })}`,
        pageWidth - 20,
        yPosition,
        { align: "right" }
      );
      yPosition += 15;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("AI Seismic Analysis", 20, yPosition);
      yPosition += 8;
      const splitSummary = doc.splitTextToSize(data.aiSummary, pageWidth - 40);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.text(splitSummary, 20, yPosition);
      const summaryHeight = splitSummary.length * 5;
      yPosition += summaryHeight + 10;
      const summaryData = [
        ["Total Readings Analyzed", data.readings.length.toString()],
        ["Mean Seismic Intensity", data.avgMagnitude],
        [
          "Peak Ground Acceleration",
          `${data.peakMagnitude.value.toFixed(3)} SI (${data.peakMagnitude.time !== "-" ? new Date(data.peakMagnitude.time).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Manila"
          }) : "-"})`
        ],
        [
          "Readings Exceeding Threshold (>0.5 SI)",
          data.significantReadings.toString()
        ],
        [
          "Period of Maximum Activity",
          `${data.peakActivity.value !== "-" ? new Date(data.peakActivity.value).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Manila"
          }) : "-"}`
        ]
      ];
      autoTable(doc, {
        startY: yPosition,
        head: [["Metric", "Value"]],
        body: summaryData,
        theme: "striped",
        styles: {
          fontSize: 10,
          cellPadding: 4
        },
        headStyles: {
          fillColor: colors.primary,
          textColor: colors.primaryForeground,
          fontStyle: "bold"
        },
        margin: { left: 20, right: 20 }
      });
      const finalY = doc.lastAutoTable.finalY + 25;
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Detailed Readings", 20, finalY);
      const tableData = data.readings.slice().reverse().map((reading3) => [
        new Date(reading3.createdAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Manila"
        }),
        reading3.siAverage.toFixed(3),
        reading3.siMaximum.toFixed(3),
        reading3.siMinimum.toFixed(3),
        getSeismicRiskLevel(reading3.siMaximum).charAt(0).toUpperCase() + getSeismicRiskLevel(reading3.siMaximum).slice(1),
        `${reading3.battery}%`,
        reading3.signalStrength
      ]);
      autoTable(doc, {
        startY: finalY + 5,
        head: [
          [
            "Time",
            "SI Avg",
            "SI Max",
            "SI Min",
            "Risk Level",
            "Battery",
            "Signal"
          ]
        ],
        body: tableData,
        theme: "striped",
        styles: {
          fontSize: 8,
          cellPadding: 3,
          lineColor: [240, 240, 240],
          lineWidth: 0.1
        },
        headStyles: {
          fillColor: colors.accent,
          textColor: colors.primaryForeground,
          fontStyle: "bold"
        },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { halign: "center", cellWidth: 20 },
          2: { halign: "center", cellWidth: 20 },
          3: { halign: "center", cellWidth: 20 },
          4: { halign: "center", cellWidth: 20 },
          5: { halign: "center", cellWidth: 18 },
          6: { halign: "center", cellWidth: 18 }
        },
        margin: { left: 20, right: 20 },
        tableLineColor: [240, 240, 240],
        tableLineWidth: 0.1,
        showFoot: false
      });
      const pageCount = doc.internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageHeight2 = doc.internal.pageSize.height;
        const pageWidth2 = doc.internal.pageSize.width;
        doc.setFontSize(8);
        doc.setTextColor(
          colors.mutedText[0],
          colors.mutedText[1],
          colors.mutedText[2]
        );
        doc.text(`Page ${i} of ${pageCount}`, pageWidth2 - 20, pageHeight2 - 12, {
          align: "right"
        });
      }
      doc.setPage(pageCount);
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(
        colors.mutedText[0],
        colors.mutedText[1],
        colors.mutedText[2]
      );
      doc.text("Generated by Queyk for ICC", 20, pageHeight - 12);
      const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
      resolve(pdfBuffer);
    } catch (error) {
      reject(error);
    }
  });
}
var init_pdf_generator = __esm({
  "src/lib/pdf-generator.ts"() {
    "use strict";
    init_utils();
  }
});

// src/app.ts
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express2 from "express";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import { toNodeHandler } from "better-auth/node";

// src/routes/iot.ts
import express from "express";
var resetFlag = false;
var router = express.Router();
router.post("/reset", (req, res) => {
  resetFlag = true;
  res.json({ message: "Reset command sent" });
});
router.get("/reset-status", (req, res) => {
  res.json({ reset: resetFlag });
  resetFlag = false;
});
router.post("/reset-clear", (req, res) => {
  resetFlag = false;
  res.json({ message: "Reset flag cleared" });
});
var iot_default = router;

// src/lib/auth/auth.ts
import { config as config2 } from "dotenv";
import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { createAuthMiddleware } from "better-auth/api";
import { parseSetCookieHeader } from "better-auth/cookies";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

// src/drizzle/index.ts
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
config({ path: ".env.local" });
var connectionString = process.env.DATABASE_URL;
var client = postgres(connectionString, { prepare: false });
var db = drizzle(client);

// src/drizzle/schema.ts
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
  uuid
} from "drizzle-orm/pg-core";
var roleEnum = pgEnum("role", ["user", "admin"]);
var tokenTypeEnum = pgEnum("type", ["auth", "admin", "user", "iot"]);
var user = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
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
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
});
var session = pgTable(
  "session",
  {
    id: text("id").primaryKey().$defaultFn(() => nanoid()),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => /* @__PURE__ */ new Date()).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" })
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);
var account = pgTable(
  "account",
  {
    id: text("id").primaryKey().$defaultFn(() => nanoid()),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);
var verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey().$defaultFn(() => nanoid()),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);
var userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account)
}));
var sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id]
  })
}));
var accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id]
  })
}));
var token = pgTable("token", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  type: tokenTypeEnum("type").notNull(),
  token: text("token").notNull(),
  expiredAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().$defaultFn(() => /* @__PURE__ */ new Date())
});
var reading = pgTable("reading", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  siAverage: doublePrecision("si_average").notNull(),
  siMinimum: doublePrecision("si_minimum").notNull(),
  siMaximum: doublePrecision("si_maximum").notNull(),
  battery: doublePrecision("battery").notNull(),
  signalStrength: text("signal_strength").notNull(),
  createdAt: timestamp("created_at").notNull().$defaultFn(() => /* @__PURE__ */ new Date())
});
var earthquake = pgTable("earthquake", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  magnitude: doublePrecision("magnitude").notNull(),
  duration: integer("duration").notNull(),
  createdAt: timestamp("created_at").notNull().$defaultFn(() => /* @__PURE__ */ new Date())
});
var floorPlan = pgTable("floor_plan", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  buildingName: text("building_name").notNull(),
  floorNumber: integer("floor_number").notNull(),
  createdAt: timestamp("created_at").notNull().$defaultFn(() => /* @__PURE__ */ new Date())
});
var location = pgTable("location", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  floorPlanId: uuid("floor_plan_id").references(() => floorPlan.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  radiusMeters: doublePrecision("radius_meters").notNull(),
  displayX: integer("display_x").notNull(),
  displayY: integer("display_y").notNull(),
  createdAt: timestamp("created_at").notNull().$defaultFn(() => /* @__PURE__ */ new Date())
});

// src/lib/auth/auth.ts
config2({ path: ".env.local" });
config2();
var schoolDomain = process.env.SCHOOL_EMAIL_ADDRESS;
var googleHd = schoolDomain ? schoolDomain.replace(/^@/, "") : void 0;
var auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification
    }
  }),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"]
    }
  },
  user: {
    validateUserInfo: async ({ user: user2 }) => {
      const allowedDomain = process.env.SCHOOL_EMAIL_ADDRESS;
      if (allowedDomain && (!user2.email || !user2.email.endsWith(allowedDomain))) {
        return {
          error: "AccessDenied",
          errorDescription: `Email must belong to ${allowedDomain}`
        };
      }
    },
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false
      },
      alertNotification: {
        type: "boolean",
        required: false,
        defaultValue: true
      },
      pushNotification: {
        type: "boolean",
        required: false,
        defaultValue: false
      },
      expoPushToken: {
        type: "string",
        required: false
      },
      smsNotification: {
        type: "boolean",
        required: false,
        defaultValue: false
      },
      phoneNumber: {
        type: "string",
        required: false
      },
      isInSchool: {
        type: "boolean",
        required: false,
        defaultValue: false
      },
      profileImage: {
        type: "string",
        required: false
      }
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      prompt: "select_account",
      ...googleHd ? { hd: googleHd } : {}
    }
  },
  trustedOrigins: [
    process.env.FRONTEND_APP_URL || "http://localhost:3000",
    process.env.LOCALHOST_APP_URL || "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:9245",
    "http://127.0.0.1:9245",
    "http://localhost:9246",
    "http://127.0.0.1:9246",
    "wails://localhost",
    "wails://localhost:9245",
    "wails://wails",
    "http://wails.localhost"
  ],
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/callback")) {
        const location2 = ctx.context.responseHeaders?.get("location") || ctx.context.responseHeaders?.get("Location");
        const setCookie = ctx.context.responseHeaders?.get("set-cookie");
        if (location2 && setCookie) {
          const parsed = parseSetCookieHeader(setCookie);
          const cookieName = ctx.context.authCookies.sessionToken.name;
          const token2 = parsed.get(cookieName)?.value;
          if (token2) {
            const redirectUrl = new URL(location2, ctx.context.baseURL || "http://localhost:8080");
            redirectUrl.searchParams.set("token", token2);
            ctx.setHeader("Location", redirectUrl.toString());
          }
        }
      }
    })
  },
  plugins: [bearer()]
});

// src/routes/users.ts
import { Router } from "express";

// src/controllers/userController.ts
import { config as config5 } from "dotenv";
import { eq as eq3, ilike, count, desc, and as and3, isNotNull } from "drizzle-orm";

// src/lib/auth/index.ts
import { and, eq } from "drizzle-orm";
import { fromNodeHeaders } from "better-auth/node";
init_utils();

// src/lib/schema/index.ts
import { config as config3 } from "dotenv";
import { z } from "zod/v4";
config3({ path: ".env.local" });
var schoolDomain2 = process.env.SCHOOL_EMAIL_ADDRESS ?? "@school.edu";
var schoolEmailSchema = z.email().refine((email) => email.endsWith(schoolDomain2), {
  message: `Email must belong to the school's domain (${schoolDomain2}). Example: "alice${schoolDomain2}"`
});
var roleUnion = [z.literal("user"), z.literal("admin")];
var tokenTypeUnion = [
  z.literal("auth"),
  z.literal("admin"),
  z.literal("user"),
  z.literal("iot")
];
var tokenTypeUnionSchema = z.union(tokenTypeUnion);
var userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  image: z.string().nullish(),
  profileImage: z.string().nullish(),
  alertNotification: z.boolean().nullish(),
  createdAt: z.date(),
  role: z.string().default("user"),
  oauthId: z.string().nullish(),
  isInSchool: z.boolean().nullish()
});
var createUserSchema = userSchema.omit({
  id: true,
  role: true,
  createdAt: true,
  alertNotification: true
});
var tokenSchema = z.object({
  id: z.uuid(),
  type: z.union(tokenTypeUnion),
  token: z.string(),
  createdAt: z.date(),
  expiresAt: z.nullish(z.date())
});
var readingSchema = z.object({
  id: z.uuid(),
  siAverage: z.number(),
  siMinimum: z.number(),
  siMaximum: z.number(),
  battery: z.number(),
  signalStrength: z.string(),
  createdAt: z.date()
});
var createReadingSchema = readingSchema.omit({
  id: true,
  createdAt: true
});
var earthquakeSchema = z.object({
  id: z.uuid(),
  magnitude: z.number(),
  duration: z.number(),
  createdAt: z.date()
});
var createEarthquakeSchema = earthquakeSchema.omit({
  id: true,
  createdAt: true
});

// src/lib/auth/index.ts
async function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return {
      isValidToken: false,
      message: "No authorization header found",
      error: "Unauthorized",
      statusCode: 401
    };
  }
  if (!authHeader.startsWith("Bearer ")) {
    return {
      isValidToken: false,
      message: "Invalid authorization header format",
      error: "Unauthorized",
      statusCode: 401
    };
  }
  try {
    const sessionData = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });
    if (sessionData?.user && sessionData?.session) {
      req.user = sessionData.user;
      req.session = sessionData.session;
      return {
        isValidToken: true,
        message: "User session validated successfully",
        error: null,
        statusCode: 200,
        user: sessionData.user,
        session: sessionData.session
      };
    }
  } catch {
  }
  const tokenType = req.headers["token-type"];
  if (!tokenType) {
    return {
      isValidToken: false,
      message: "No token type found in the headers",
      error: "Unauthorized",
      statusCode: 401
    };
  }
  const isValidTokenType = tokenTypeUnionSchema.safeParse(tokenType);
  if (isValidTokenType.error) {
    return {
      isValidToken: false,
      message: formatZodError(isValidTokenType.error),
      error: "Unauthorized",
      statusCode: 401
    };
  }
  const bearerToken = authHeader.substring(7);
  try {
    const [isAuthorized] = await db.select().from(token).where(
      and(
        eq(token.token, bearerToken),
        eq(token.type, isValidTokenType.data)
      )
    );
    if (!isAuthorized) {
      return {
        isValidToken: false,
        message: "Invalid or expired token",
        error: "Unauthorized",
        statusCode: 401
      };
    }
    return {
      isValidToken: true,
      message: "Token validated successfully",
      error: null,
      statusCode: 200
    };
  } catch (error) {
    return {
      isValidToken: false,
      message: error instanceof Error ? error.message : "Invalid or expired token",
      error: "Unauthorized",
      statusCode: 401
    };
  }
}

// src/controllers/userController.ts
init_utils();

// src/lib/auth/jwt.ts
import jwt from "jsonwebtoken";
import { config as config4 } from "dotenv";
config4({ path: ".env.local" });
var JWT_SECRET = process.env.JWT_SECRET;
var JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
function signUserJWT({
  id,
  email,
  role,
  name
}) {
  if (!JWT_SECRET) return null;
  const payload = {
    userId: id,
    email,
    role,
    name
  };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
}

// src/types/users.ts
import z2 from "zod";
import validator from "validator";
var mobilePhoneNumberSchema = z2.string().refine((val) => validator.isMobilePhone(val, "en-PH"), {
  message: "Invalid mobile phone number for en-PH locale"
});

// src/lib/service/user-service.ts
import { and as and2, eq as eq2 } from "drizzle-orm";
async function getUserByEmailAndOauthId(email, oauthId) {
  const [foundUser] = await db.select().from(user).where(and2(eq2(user.oauthId, oauthId), eq2(user.email, email)));
  if (!foundUser) return null;
  return {
    ...foundUser,
    isInSchool: foundUser.isInSchool ?? false
  };
}

// src/controllers/userController.ts
config5({ path: ".env.local" });
async function createUser(req, res) {
  const { name, email, profileImage, oauthId } = req.body;
  const missingFields = [];
  if (!name) missingFields.push("name");
  if (!email) missingFields.push("email");
  if (!profileImage) missingFields.push("profileImage");
  if (!oauthId) missingFields.push("oauthId");
  if (missingFields.length > 0) {
    return res.status(400).send({
      message: `Missing required fields: ${missingFields.join(", ")}`,
      error: "Bad Request",
      statusCode: 400
    });
  }
  const isValidEmail = schoolEmailSchema.safeParse(email);
  if (isValidEmail.error) {
    return res.status(400).send({
      message: formatZodError(isValidEmail.error),
      error: "Bad Request",
      statusCode: 400
    });
  }
  try {
    const isValidToken = await verifyToken(req);
    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401
      });
    }
    const userExist = await getUserByEmailAndOauthId(email, oauthId);
    if (userExist) {
      const token3 = signUserJWT(userExist);
      return res.status(200).send({
        message: "User already exists",
        statusCode: 200,
        data: { ...userExist, token: token3 }
      });
    }
    const newUserValues = {
      name,
      email,
      oauthId,
      profileImage
    };
    const [newUser] = await db.insert(user).values(newUserValues).returning();
    const token2 = signUserJWT(newUser);
    return res.status(201).send({
      message: "User created successfully",
      statusCode: 201,
      data: { ...newUser, token: token2 }
    });
  } catch (error) {
    return res.status(500).send({
      message: "An unexpected error occurred while creating the account. Please try again later. If the problem persists, contact support.",
      error: "Internal Server Error",
      statusCode: 500
    });
  }
}
async function getAllUsers(req, res) {
  try {
    const isValidToken = await verifyToken(req);
    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401
      });
    }
    const { name, page = "1", pageSize = "10" } = req.query;
    const pageNumber = parseInt(page);
    const size = parseInt(pageSize);
    const offset = (pageNumber - 1) * size;
    if (name) {
      const [data2, totalResult2] = await Promise.all([
        db.select().from(user).where(ilike(user.name, `%${name}%`)).orderBy(desc(user.createdAt)).limit(size).offset(offset),
        db.select({ count: count() }).from(user).where(ilike(user.name, `%${name}%`))
      ]);
      const total2 = totalResult2[0]?.count || 0;
      const totalPages2 = Math.ceil(total2 / size);
      return res.status(200).send({
        message: data2.length ? "Users retrieved successfully" : "No users found in the database",
        statusCode: 200,
        data: data2,
        pagination: {
          page: pageNumber,
          pageSize: size,
          total: total2,
          totalPages: totalPages2,
          hasNextPage: pageNumber < totalPages2,
          hasPreviousPage: pageNumber > 1
        }
      });
    }
    const [data, totalResult] = await Promise.all([
      db.select().from(user).orderBy(desc(user.createdAt)).limit(size).offset(offset),
      db.select({ count: count() }).from(user)
    ]);
    const total = totalResult[0]?.count || 0;
    const totalPages = Math.ceil(total / size);
    return res.status(200).send({
      message: data.length ? "Users retrieved successfully" : "No users found in the database",
      statusCode: 200,
      data,
      pagination: {
        page: pageNumber,
        pageSize: size,
        total,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1
      }
    });
  } catch (error) {
    return res.status(500).send({
      message: error instanceof Error ? error.message : "There was an error retrieving users data.",
      error: "Internal Server Error",
      statusCode: 500
    });
  }
}
async function getUserByUserId(req, res) {
  const { userId } = req.params;
  if (!userId || typeof userId !== "string") {
    return res.status(400).send({
      message: "User ID is required",
      error: "Bad Request",
      statusCode: 400
    });
  }
  try {
    const isValidToken = await verifyToken(req);
    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401
      });
    }
    const [data] = await db.select().from(user).where(eq3(user.id, userId));
    if (!data) {
      return res.status(404).send({
        message: "User not found",
        error: "Not Found",
        statusCode: 404
      });
    }
    return res.status(200).send({ message: "User found", statusCode: 200, data });
  } catch (error) {
    return res.status(500).send({
      message: error instanceof Error ? error.message : "There was an error retrieving the user data.",
      error: "Internal Server Error",
      statusCode: 500
    });
  }
}
async function toggleAlertNotification(req, res) {
  const { userId } = req.params;
  const { alertNotification } = req.body;
  if (!userId || typeof userId !== "string") {
    return res.status(400).send({
      message: "User ID is required",
      error: "Bad Request",
      statusCode: 400
    });
  }
  if (typeof alertNotification !== "boolean") {
    return res.status(400).send({
      message: "alertNotification must be a boolean value",
      error: "Bad Request",
      statusCode: 400
    });
  }
  try {
    const isValidToken = await verifyToken(req);
    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401
      });
    }
    const [userExists] = await db.select().from(user).where(eq3(user.id, userId));
    if (!userExists) {
      return res.status(404).send({
        message: "User not found",
        error: "Not Found",
        statusCode: 404
      });
    }
    const [updatedUser] = await db.update(user).set({ alertNotification }).where(eq3(user.id, userId)).returning();
    if (!updatedUser) {
      return res.status(404).send({
        message: "Failed to update notification preferences",
        error: "Update Failed",
        statusCode: 404
      });
    }
    return res.status(200).send({
      message: `Alert notifications ${alertNotification ? "enabled" : "disabled"} successfully`,
      statusCode: 200,
      data: { alertNotification: updatedUser.alertNotification }
    });
  } catch (error) {
    return res.status(500).send({
      message: error instanceof Error ? `Error updating notification preferences: ${error.message}` : "An unexpected error occurred while updating notification preferences",
      error: "Internal Server Error",
      statusCode: 500
    });
  }
}
async function toggleAlertPushNotification(req, res) {
  const { userId } = req.params;
  const { pushNotification } = req.body;
  if (!userId || typeof userId !== "string") {
    return res.status(400).send({
      message: "User ID is required",
      error: "Bad Request",
      statusCode: 400
    });
  }
  if (typeof pushNotification !== "boolean") {
    return res.status(400).send({
      message: "pushNotification must be a boolean value",
      error: "Bad Request",
      statusCode: 400
    });
  }
  try {
    const isValidToken = await verifyToken(req);
    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401
      });
    }
    const [userExists] = await db.select().from(user).where(eq3(user.id, userId));
    if (!userExists) {
      return res.status(404).send({
        message: "User not found",
        error: "Not Found",
        statusCode: 404
      });
    }
    const [updatedUser] = await db.update(user).set({ pushNotification }).where(eq3(user.id, userId)).returning();
    if (!updatedUser) {
      return res.status(404).send({
        message: "Failed to update push notification preferences",
        error: "Update Failed",
        statusCode: 404
      });
    }
    return res.status(200).send({
      message: `Push notifications ${pushNotification ? "enabled" : "disabled"} successfully`,
      statusCode: 200,
      data: { pushNotification: updatedUser.pushNotification }
    });
  } catch (error) {
    return res.status(500).send({
      message: error instanceof Error ? `Error updating push notification preferences: ${error.message}` : "An unexpected error occurred while updating notification preferences",
      error: "Internal Server Error",
      statusCode: 500
    });
  }
}
async function deleteUserByUserId(req, res) {
  const { userId } = req.params;
  if (!userId || typeof userId !== "string") {
    return res.status(400).send({
      message: "User ID is required",
      error: "Bad Request",
      statusCode: 400
    });
  }
  try {
    const isValidToken = await verifyToken(req);
    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401
      });
    }
    const [userExists] = await db.select().from(user).where(eq3(user.id, userId));
    if (!userExists) {
      return res.status(404).send({
        message: "User not found",
        error: "Not Found",
        statusCode: 404
      });
    }
    const [deletedUser] = await db.delete(user).where(eq3(user.id, userId)).returning();
    if (!deletedUser) {
      return res.status(404).send({
        message: "Failed to delete the user",
        error: "Delete Failed",
        statusCode: 404
      });
    }
    return res.status(200).send({
      message: `User deleted successfully`,
      statusCode: 200,
      data: deletedUser
    });
  } catch (error) {
    return res.status(500).send({
      message: error instanceof Error ? `Error deleting user: ${error.message}` : "An unexpected error occurred while deleting user",
      error: "Internal Server Error",
      statusCode: 500
    });
  }
}
async function switchUserRole(req, res) {
  const { userId } = req.params;
  const { role } = req.body;
  if (!userId || typeof userId !== "string") {
    return res.status(400).send({
      message: "User ID is required",
      error: "Bad Request",
      statusCode: 400
    });
  }
  const isValidRole = tokenTypeUnionSchema.safeParse(role);
  if (isValidRole.error) {
    return res.status(400).send({
      message: "Invalid role value",
      error: "Bad Request",
      statusCode: 400
    });
  }
  try {
    const isValidToken = await verifyToken(req);
    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401
      });
    }
    const [userExists] = await db.select().from(user).where(eq3(user.id, userId));
    if (!userExists) {
      return res.status(404).send({
        message: "User not found",
        error: "Not Found",
        statusCode: 404
      });
    }
    const [updatedUser] = await db.update(user).set({ role }).where(eq3(user.id, userId)).returning();
    if (!updatedUser) {
      return res.status(404).send({
        message: "Failed to update user role",
        error: "Update Failed",
        statusCode: 404
      });
    }
    return res.status(200).send({
      message: `User role updated to ${role} successfully`,
      statusCode: 200,
      data: { role: updatedUser.role }
    });
  } catch (error) {
    return res.status(500).send({
      message: error instanceof Error ? `Error updating user role: ${error.message}` : "An unexpected error occurred while updating user role",
      error: "Internal Server Error",
      statusCode: 500
    });
  }
}
async function updateExpoPushToken(req, res) {
  const { userId } = req.params;
  const { expoPushToken } = req.body;
  if (!userId || typeof userId !== "string") {
    return res.status(400).send({
      message: "User ID is required",
      error: "Bad Request",
      statusCode: 400
    });
  }
  if (!expoPushToken) {
    return res.status(400).send({
      message: "Expo push token is required",
      error: "Bad Request",
      statusCode: 400
    });
  }
  try {
    const isValidToken = await verifyToken(req);
    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401
      });
    }
    const [userExists] = await db.select().from(user).where(eq3(user.id, userId));
    if (!userExists) {
      return res.status(404).send({
        message: "User not found",
        error: "Not Found",
        statusCode: 404
      });
    }
    const [updatedUser] = await db.update(user).set({ expoPushToken }).where(eq3(user.id, userId)).returning();
    if (!updatedUser) {
      return res.status(404).send({
        message: "Failed to update push token",
        error: "Update Failed",
        statusCode: 404
      });
    }
    return res.status(200).send({
      message: "Push token updated successfully",
      statusCode: 200,
      data: { expoPushToken: updatedUser.expoPushToken }
    });
  } catch (error) {
    return res.status(500).send({
      message: error instanceof Error ? `Error updating push token: ${error.message}` : "An unexpected error occurred while updating push token",
      error: "Internal Server Error",
      statusCode: 500
    });
  }
}
async function getAllUserPhoneNumbers(req, res) {
  try {
    const isValidToken = await verifyToken(req);
    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401
      });
    }
    const data = await db.selectDistinct({ phoneNumber: user.phoneNumber }).from(user).where(and3(eq3(user.smsNotification, true), isNotNull(user.phoneNumber)));
    if (!data?.length) {
      return res.status(404).send({
        message: "No users with phone numbers found in the database",
        error: "Not Found",
        statusCode: 404
      });
    }
    return res.status(200).send({
      message: "Users phone numbers retrieved successfully",
      statusCode: 200,
      data: data.map((phoneNumbers) => phoneNumbers.phoneNumber)
    });
  } catch (error) {
    return res.status(500).send({
      message: error instanceof Error ? error.message : "There was an error retrieving users phone numbers.",
      error: "Internal Server Error",
      statusCode: 500
    });
  }
}
async function updateUserSMSPhoneNumber(req, res) {
  const { userId } = req.params;
  const { phoneNumber } = req.body;
  if (!userId || typeof userId !== "string") {
    return res.status(400).send({
      message: "User ID is required",
      error: "Bad Request",
      statusCode: 400
    });
  }
  if (!phoneNumber) {
    return res.status(400).send({
      message: "Phone number is required",
      error: "Bad Request",
      statusCode: 400
    });
  }
  const isValidPhoneNumber = mobilePhoneNumberSchema.safeParse(phoneNumber);
  if (isValidPhoneNumber.error) {
    return res.status(400).send({
      message: formatZodError(isValidPhoneNumber.error),
      error: "Invalid Phone Number",
      statusCode: 400
    });
  }
  try {
    const isValidToken = await verifyToken(req);
    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401
      });
    }
    const [userExists] = await db.select().from(user).where(eq3(user.id, userId));
    if (!userExists) {
      return res.status(404).send({
        message: "User not found",
        error: "Not Found",
        statusCode: 404
      });
    }
    const [updatedUser] = await db.update(user).set({ phoneNumber: isValidPhoneNumber.data }).where(eq3(user.id, userId)).returning();
    if (!updatedUser) {
      return res.status(404).send({
        message: "Failed to update phone number",
        error: "Update Failed",
        statusCode: 404
      });
    }
    return res.status(200).send({
      message: "Phone number updated successfully",
      statusCode: 200,
      data: { phoneNumber: updatedUser.phoneNumber }
    });
  } catch (error) {
    return res.status(500).send({
      message: error instanceof Error ? `Error updating push token: ${error.message}` : "An unexpected error occurred while updating phone number",
      error: "Internal Server Error",
      statusCode: 500
    });
  }
}
async function deleteUserSMSPhoneNumber(req, res) {
  const { userId } = req.params;
  if (!userId || typeof userId !== "string") {
    return res.status(400).send({
      message: "User ID is required",
      error: "Bad Request",
      statusCode: 400
    });
  }
  try {
    const isValidToken = await verifyToken(req);
    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401
      });
    }
    const [userExists] = await db.select().from(user).where(eq3(user.id, userId));
    if (!userExists) {
      return res.status(404).send({
        message: "User not found",
        error: "Not Found",
        statusCode: 404
      });
    }
    const [updatedUser] = await db.update(user).set({ phoneNumber: null, smsNotification: false }).where(eq3(user.id, userId)).returning();
    if (!updatedUser) {
      return res.status(404).send({
        message: "Failed to delete phone number",
        error: "Delete Failed",
        statusCode: 404
      });
    }
    return res.status(200).send({
      message: "Phone number deleted successfully",
      statusCode: 200,
      data: {
        phoneNumber: updatedUser.phoneNumber,
        smsNotification: updatedUser.smsNotification
      }
    });
  } catch (error) {
    return res.status(500).send({
      message: error instanceof Error ? `Error updating push token: ${error.message}` : "An unexpected error occurred while deleting phone number",
      error: "Internal Server Error",
      statusCode: 500
    });
  }
}
async function toggleAlertSMSNotification(req, res) {
  const { userId } = req.params;
  const { smsNotification } = req.body;
  if (!userId || typeof userId !== "string") {
    return res.status(400).send({
      message: "User ID is required",
      error: "Bad Request",
      statusCode: 400
    });
  }
  if (typeof smsNotification !== "boolean") {
    return res.status(400).send({
      message: "smsNotification must be a boolean value",
      error: "Bad Request",
      statusCode: 400
    });
  }
  try {
    const isValidToken = await verifyToken(req);
    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401
      });
    }
    const [userExists] = await db.select().from(user).where(eq3(user.id, userId));
    if (!userExists) {
      return res.status(404).send({
        message: "User not found",
        error: "Not Found",
        statusCode: 404
      });
    }
    const [updatedUser] = await db.update(user).set({ smsNotification }).where(eq3(user.id, userId)).returning();
    if (!updatedUser) {
      return res.status(404).send({
        message: "Failed to update sms notification preferences",
        error: "Update Failed",
        statusCode: 404
      });
    }
    return res.status(200).send({
      message: `Push notifications ${smsNotification ? "enabled" : "disabled"} successfully`,
      statusCode: 200,
      data: { smsNotification: updatedUser.smsNotification }
    });
  } catch (error) {
    return res.status(500).send({
      message: error instanceof Error ? `Error updating sms notification preferences: ${error.message}` : "An unexpected error occurred while updating notification preferences",
      error: "Internal Server Error",
      statusCode: 500
    });
  }
}
async function updateIsInSchool(req, res) {
  const { userId } = req.params;
  const { isInSchool } = req.body;
  if (!userId || typeof userId !== "string") {
    return res.status(400).send({
      message: "User ID is required",
      error: "Bad Request",
      statusCode: 400
    });
  }
  if (typeof isInSchool !== "boolean") {
    return res.status(400).send({
      message: "isInSchool must be a boolean value",
      error: "Bad Request",
      statusCode: 400
    });
  }
  try {
    const isValidToken = await verifyToken(req);
    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401
      });
    }
    const [userExists] = await db.select().from(user).where(eq3(user.id, userId));
    if (!userExists) {
      return res.status(404).send({
        message: "User not found",
        error: "Not Found",
        statusCode: 404
      });
    }
    const [updatedUser] = await db.update(user).set({ isInSchool }).where(eq3(user.id, userId)).returning();
    if (!updatedUser) {
      return res.status(404).send({
        message: "Failed to update school status",
        error: "Update Failed",
        statusCode: 404
      });
    }
    return res.status(200).send({
      message: `School status updated to ${isInSchool ? "in school" : "out of school"} successfully`,
      statusCode: 200,
      data: { isInSchool: updatedUser.isInSchool }
    });
  } catch (error) {
    return res.status(500).send({
      message: error instanceof Error ? `Error updating school status: ${error.message}` : "An unexpected error occurred while updating school status",
      error: "Internal Server Error",
      statusCode: 500
    });
  }
}

// src/routes/users.ts
var isSMSNotificationPreferencesUpdated = false;
var router2 = Router();
router2.post("/", async (req, res, next) => {
  try {
    await createUser(req, res);
  } catch (error) {
    next(error);
  }
});
router2.get("/", async (req, res, next) => {
  try {
    await getAllUsers(req, res);
  } catch (error) {
    next(error);
  }
});
router2.get(
  "/phone-numbers",
  async (req, res, next) => {
    try {
      await getAllUserPhoneNumbers(req, res);
    } catch (error) {
      next(error);
    }
  }
);
router2.get("/phone-numbers-status", (req, res) => {
  res.json({ isSMSNotificationPreferencesUpdated });
  isSMSNotificationPreferencesUpdated = false;
});
router2.post("/phone-numbers-reset", (req, res) => {
  isSMSNotificationPreferencesUpdated = false;
  res.json({ message: "SMS notification preferences reset" });
});
router2.get(
  "/:userId",
  async (req, res, next) => {
    try {
      await getUserByUserId(req, res);
    } catch (error) {
      next(error);
    }
  }
);
router2.delete(
  "/:userId",
  async (req, res, next) => {
    try {
      await deleteUserByUserId(req, res);
    } catch (error) {
      next(error);
    }
  }
);
router2.patch(
  "/:userId/notifications",
  async (req, res, next) => {
    try {
      await toggleAlertNotification(req, res);
    } catch (error) {
      next(error);
    }
  }
);
router2.patch(
  "/:userId/push-notifications",
  async (req, res, next) => {
    try {
      await toggleAlertPushNotification(req, res);
    } catch (error) {
      next(error);
    }
  }
);
router2.patch(
  "/:userId/role",
  async (req, res, next) => {
    try {
      await switchUserRole(req, res);
    } catch (error) {
      next(error);
    }
  }
);
router2.patch(
  "/:userId/push-token",
  async (req, res, next) => {
    try {
      await updateExpoPushToken(req, res);
    } catch (error) {
      next(error);
    }
  }
);
router2.patch(
  "/:userId/phone-number",
  async (req, res, next) => {
    try {
      isSMSNotificationPreferencesUpdated = true;
      await updateUserSMSPhoneNumber(req, res);
    } catch (error) {
      next(error);
    }
  }
);
router2.delete(
  "/:userId/phone-number",
  async (req, res, next) => {
    try {
      isSMSNotificationPreferencesUpdated = true;
      await deleteUserSMSPhoneNumber(req, res);
    } catch (error) {
      next(error);
    }
  }
);
router2.patch(
  "/:userId/sms-notifications",
  async (req, res, next) => {
    try {
      isSMSNotificationPreferencesUpdated = true;
      await toggleAlertSMSNotification(req, res);
    } catch (error) {
      next(error);
    }
  }
);
router2.patch(
  "/:userId/location-status",
  async (req, res, next) => {
    try {
      isSMSNotificationPreferencesUpdated = true;
      await updateIsInSchool(req, res);
    } catch (error) {
      next(error);
    }
  }
);
var users_default = router2;

// src/routes/email.ts
import { Router as Router2 } from "express";

// src/controllers/emailController.ts
import { config as config8 } from "dotenv";

// src/lib/service/email-service.ts
import { config as config6 } from "dotenv";
import { eq as eq4 } from "drizzle-orm";
import nodemailer from "nodemailer";
config6({ path: ".env.local" });
var transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.APP_GMAIL_EMAIL,
    pass: process.env.APP_GMAIL_PASSWORD
  },
  secure: true,
  port: 465
});
async function getAllNotificationEnabledEmails() {
  const emails = await db.select({ email: user.email, name: user.name }).from(user).where(eq4(user.alertNotification, true));
  if (!emails.length) return null;
  return emails;
}

// src/lib/service/push-notification-service.ts
import { config as config7 } from "dotenv";
import { and as and4, eq as eq5, isNotNull as isNotNull2 } from "drizzle-orm";
import { Expo } from "expo-server-sdk";
config7({ path: ".env.local" });
var expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN
});
async function getAllNotificationEnabledPushTokens() {
  const users = await db.select({ token: user.expoPushToken, name: user.name }).from(user).where(eq5(user.pushNotification, true));
  if (!users.length) return null;
  const validTokens = users.filter(
    (u) => u.token && Expo.isExpoPushToken(u.token)
  );
  if (!validTokens.length) return null;
  return validTokens;
}
async function sendPushNotifications(magnitude, message) {
  try {
    const tokens = await getAllNotificationEnabledPushTokens();
    if (tokens && tokens.length) {
      const messages = [];
      for (const { token: token2 } of tokens) {
        if (!Expo.isExpoPushToken(token2)) {
          continue;
        }
        messages.push({
          to: token2,
          sound: "default",
          title: `\u{1F6A8} Earthquake Alert: Magnitude ${magnitude}`,
          body: message,
          data: { magnitude, type: "earthquake" },
          priority: "high",
          channelId: "earthquake-alerts"
        });
      }
      const chunks = expo.chunkPushNotifications(messages);
      const tickets = [];
      for (const chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error("Error sending push notification chunk:", error);
        }
      }
      return {
        success: true,
        tickets
      };
    }
    return {
      success: false,
      error: "No notification-enabled users with valid push tokens found"
    };
  } catch (error) {
    console.error("Error in sendPushNotifications:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

// src/controllers/emailController.ts
config8({ path: ".env.local" });
async function sendEmail(req, res) {
  const { magnitude } = req.body;
  if (!magnitude) {
    return res.status(400).send({
      message: "Earthquake magnitude is required for the alert email",
      error: "BadRequest",
      statusCode: 400
    });
  }
  try {
    const isValidToken = await verifyToken(req);
    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401
      });
    }
    const emails = await getAllNotificationEnabledEmails();
    const notificationMessage = magnitude < 3 ? `Estimated magnitude ${magnitude} earthquake detected. Seek shelter immediately. Drop, cover, and hold.` : magnitude < 6 ? `Estimated magnitude ${magnitude} earthquake detected. Drop, cover, and hold on. Stay away from windows and exterior walls.` : `Estimated magnitude ${magnitude} earthquake detected. Drop, cover, and hold on. Evacuate to designated safe zones after shaking stops.`;
    let emailSuccess = false;
    let emailError = null;
    let emailsSent = 0;
    if (emails && emails.length > 0) {
      try {
        const emailResult = await transporter.sendMail({
          from: `"Queyk Alert System" <${process.env.APP_GMAIL_EMAIL}>`,
          to: process.env.APP_GMAIL_EMAIL,
          bcc: emails.map((user2) => user2.email),
          subject: `Earthquake Alert: Magnitude ${magnitude} Detected`,
          text: `Dear Immaculadians,

Our seismic monitoring system has detected earthquake activity with magnitude ${magnitude} that may affect our campus.

${notificationMessage}

Please follow these safety protocols:
- Follow the school's earthquake safety procedures
- Proceed to designated evacuation areas if instructed  
- Listen for announcements from school personnel
- Stay calm and assist others as needed
- Wait for all-clear signals before resuming activities

Emergency Contacts:
- School Clinic: 09755721421
- School Security: 09569114566  
- Facilities Management: 09460548474

Stay safe,
Queyk Alert System`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #212529; background-color: #f1f3f5; margin: 0; padding: 20px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; border: 1px solid #e9ecef; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #193867 0%, #35507a 100%); background-color: #193867; padding: 30px 20px; border-radius: 12px 12px 0 0;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 15px;">
                      <tr>
                        <td align="left" valign="middle">
                          <div></div>
                        </td>
                        <td align="right" valign="middle">
                          <div></div>
                        </td>
                      </tr>
                    </table>
                    <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #ffd43b; text-align: center; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">Seismic Activity Alert</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 30px;">
                    <p style="margin: 0 0 16px 0; color: #212529; font-size: 16px;">Dear Immaculadians,</p>
                    <p style="margin: 0 0 16px 0; color: #212529; font-size: 16px;">Our seismic monitoring system has detected earthquake activity that may affect our campus. This automated notification is being sent to ensure the safety of all students, faculty, and staff.</p>
                    
                    <!-- Alert Section -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-radius: 12px; margin: 20px 0; border: 1px solid #e9ecef">
                      <tr>
                        <td style="padding: 20px;">
                          <p style="margin: 0; color: ${magnitude < 3 ? "#28a745" : magnitude < 5 ? "#ffc107" : magnitude < 7 ? "#fd7e14" : "#dc3545"}; font-size: 18px; font-weight: bold">${notificationMessage}</p>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 0 0 16px 0; color: #212529; font-size: 16px;"><strong style="color: #193867; font-weight: bold;">Immediate Action Required:</strong></p>
                    <p style="margin: 0 0 8px 0; color: #212529; font-size: 16px;">\u2022 Follow the school's earthquake safety protocols</p>
                    <p style="margin: 0 0 8px 0; color: #212529; font-size: 16px;">\u2022 Proceed to designated evacuation areas if instructed</p>
                    <p style="margin: 0 0 8px 0; color: #212529; font-size: 16px;">\u2022 Listen for announcements from school personnel</p>
                    <p style="margin: 0 0 8px 0; color: #212529; font-size: 16px;">\u2022 Stay calm and assist others as needed</p>
                    <p style="margin: 0 0 16px 0; color: #212529; font-size: 16px;">\u2022 Wait for all-clear signals before resuming normal activities</p>
                    
                    <p style="margin: 0 0 16px 0; color: #212529; font-size: 16px;"><strong style="color: #193867; font-weight: bold;">Emergency Contacts:</strong></p>
                    <p style="margin: 0 0 8px 0; color: #212529; font-size: 16px;">\u2022 School Clinic: 09755721421</p>
                    <p style="margin: 0 0 8px 0; color: #212529; font-size: 16px;">\u2022 School Security: 09569114566</p>
                    <p style="margin: 0 0 16px 0; color: #212529; font-size: 16px;">\u2022 Facilities Management: 09460548474</p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f1f3f5; text-align: center; padding: 20px; font-size: 12px; color: #556575; border-top: 1px solid #e9ecef; border-radius: 0 0 12px 12px;">
                    <p style="margin: 0;">&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Queyk. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `
        });
        emailsSent = emails.length;
        emailSuccess = true;
      } catch (error) {
        emailError = error;
      }
    }
    let pushResult = { success: false, ticketCount: 0 };
    try {
      const result = await sendPushNotifications(
        magnitude,
        notificationMessage
      );
      pushResult = {
        success: result.success,
        ticketCount: result.tickets?.length || 0
      };
    } catch (pushError) {
      console.error("Failed to send push notifications:", pushError);
    }
    res.status(200).json({
      message: "Notifications sent successfully",
      statusCode: 200,
      data: {
        email: {
          success: emailSuccess,
          emailsSent,
          error: emailError ? {
            message: emailError?.message,
            code: emailError?.code,
            response: emailError?.response
          } : null
        },
        pushNotification: pushResult
      }
    });
  } catch (error) {
    return res.status(500).send({
      message: error instanceof Error ? error.message : "There was an error sending the email.",
      error: "Internal Server Error",
      statusCode: 500
    });
  }
}

// src/routes/email.ts
var router3 = Router2();
router3.post("/", async (req, res, next) => {
  try {
    await sendEmail(req, res);
  } catch (error) {
    next(error);
  }
});
var email_default = router3;

// src/routes/readings.ts
import { Router as Router3 } from "express";

// src/controllers/readingController.ts
import { eq as eq6 } from "drizzle-orm";

// src/lib/socket.ts
import { Server as SocketIOServer } from "socket.io";
var io;
var getIO = () => {
  return io || null;
};

// src/lib/service/claude.ts
import { config as config9 } from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
config9({ path: ".env.local" });
var anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});
async function generateResponse(contents, systemInstruction5) {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    system: systemInstruction5,
    messages: [
      {
        role: "user",
        content: contents
      }
    ]
  });
  const textContent = response.content.find((block) => block.type === "text");
  return textContent && textContent.type === "text" ? textContent.text : "";
}

// src/controllers/readingController.ts
init_utils();

// src/lib/service/reading-service.ts
import { and as and5, gte, lte, desc as desc2, asc } from "drizzle-orm";
async function getAllReadings() {
  const readings = await db.select().from(reading);
  if (!readings.length) return null;
  return readings;
}
async function getAllStartEndReadings(startDate, endDate) {
  const readings = await db.select().from(reading).where(
    and5(gte(reading.createdAt, startDate), lte(reading.createdAt, endDate))
  );
  if (!readings.length) return null;
  return readings;
}
async function getFirstDataDate() {
  const [readings] = await db.select({ firstDate: reading.createdAt }).from(reading).orderBy(asc(reading.createdAt)).limit(1);
  if (!readings) return null;
  return readings;
}
async function getBatteryLevel() {
  const [readings] = await db.select({ battery: reading.battery, createdAt: reading.createdAt }).from(reading).orderBy(desc2(reading.createdAt)).limit(1);
  if (!readings) return null;
  const now = /* @__PURE__ */ new Date();
  const lastReadingDate = readings.createdAt instanceof Date ? readings.createdAt : new Date(readings.createdAt);
  const diffMs = now.getTime() - lastReadingDate.getTime();
  const diffMinutes = Math.abs(diffMs) / (1e3 * 60);
  if (diffMinutes > 6) {
    return null;
  }
  return readings;
}

// src/controllers/readingController.ts
function getBucketMs(rangeDays) {
  if (rangeDays <= 1) return 30 * 60 * 1e3;
  if (rangeDays <= 3) return 60 * 60 * 1e3;
  if (rangeDays <= 7) return 2 * 60 * 60 * 1e3;
  if (rangeDays <= 30) return 6 * 60 * 60 * 1e3;
  return 24 * 60 * 60 * 1e3;
}
function downsampleReadings(readings, start, end) {
  const rangeDays = (end.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24);
  const bucketMs = getBucketMs(rangeDays);
  const buckets = /* @__PURE__ */ new Map();
  for (const r of readings) {
    const t = new Date(r.createdAt).getTime();
    const bucketKey = Math.floor(t / bucketMs) * bucketMs;
    const list = buckets.get(bucketKey);
    if (list) list.push(r);
    else buckets.set(bucketKey, [r]);
  }
  return Array.from(buckets.entries()).sort(([a], [b]) => a - b).map(([, group]) => {
    const base = group[0];
    return {
      ...base,
      createdAt: new Date(base.createdAt).toISOString(),
      siAverage: group.reduce((sum, r) => sum + r.siAverage, 0) / group.length,
      siMinimum: Math.min(...group.map((r) => r.siMinimum)),
      siMaximum: Math.max(...group.map((r) => r.siMaximum)),
      battery: group[group.length - 1].battery,
      signalStrength: group[group.length - 1].signalStrength
    };
  });
}
var systemInstruction = `You are a seismic analyst AI for the Queyk Earthquake Early Warning System. Your task is to analyze historical seismic readings and provide a clear, concise, and professional summary of the seismic activity over the given date range.
Analyze the provided seismic data (which includes dates, SI values, peak ground acceleration, and sensor status) and generate a short summary that includes:
- An overview of seismic activity (e.g., whether readings were within normal background levels or showed significant peaks).
- Peak activity identified (highest SI value, when it occurred, and its risk level).
- Trends or patterns observed during the period.
- General safety assessment based on the data.
Keep the tone informative, objective, and reassuring. Avoid unnecessary alarmism. The summary should be suitable for displaying on a dashboard for school safety administrators. Keep it concise (around 3-5 sentences).`;
async function createReading(req, res) {
  const { siAverage, siMinimum, siMaximum, battery, signalStrength } = req.body;
  const missingFields = [];
  if (siAverage === void 0) missingFields.push("siAverage");
  if (siMinimum === void 0) missingFields.push("siMinimum");
  if (siMaximum === void 0) missingFields.push("siMaximum");
  if (battery === void 0) missingFields.push("battery");
  if (signalStrength === void 0) missingFields.push("signalStrength");
  if (missingFields.length > 0) {
    return res.status(400).send({
      message: `Missing required fields: ${missingFields.join(", ")}`,
      error: "Bad Request",
      statusCode: 400
    });
  }
  const readingValues = {
    siAverage: Number(siAverage),
    siMinimum: Number(siMinimum),
    siMaximum: Number(siMaximum),
    battery: Number(battery),
    signalStrength: String(signalStrength)
  };
  const isValidReadingValues = createReadingSchema.safeParse(readingValues);
  if (isValidReadingValues.error) {
    return res.status(400).send({
      message: formatZodError(isValidReadingValues.error),
      error: "Bad Request",
      statusCode: 400
    });
  }
  try {
    const isValidToken = await verifyToken(req);
    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401
      });
    }
    const [newReading] = await db.insert(reading).values(isValidReadingValues.data).returning();
    if (!newReading) {
      return res.status(500).send({
        message: "Error creating reading",
        error: "Internal server error",
        statusCode: 500
      });
    }
    try {
      const io2 = getIO();
      io2.emit("reading", newReading);
    } catch {
    }
    return res.status(201).send({
      message: "Reading created successfully",
      statusCode: 201,
      data: newReading
    });
  } catch (error) {
    return res.status(500).send({
      message: error instanceof Error ? error.message : "Error creating reading",
      error: "Internal server error",
      statusCode: 500
    });
  }
}
async function getReadings(req, res) {
  const { startDate, endDate, platform } = req.query;
  try {
    const isValidToken = await verifyToken(req);
    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401
      });
    }
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(-8, 0, 0, 0);
      end.setHours(15, 59, 59, 999);
      const firstDate = await getFirstDataDate();
      const batteryLevel = await getBatteryLevel();
      const readingsRaw = await getAllStartEndReadings(start, end);
      const readingsMapped = Array.isArray(readingsRaw) ? readingsRaw.map((r) => ({
        ...r,
        createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : new Date(r.createdAt).toISOString(),
        riskLevel: getSeismicRiskLevelForReading(r),
        isSafe: isReadingSeismicSafe(r)
      })) : [];
      const readings2 = platform === "web" ? readingsMapped : downsampleReadings(readingsMapped, start, end);
      let actualFormattedStart = start.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      let actualFormattedEnd = end.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      let prompt;
      if (readings2.length > 0) {
        const dates = readings2.map((r) => new Date(r.createdAt));
        const actualStartDate = new Date(
          Math.min(...dates.map((d) => d.getTime()))
        );
        const actualEndDate = new Date(
          Math.max(...dates.map((d) => d.getTime()))
        );
        actualFormattedStart = actualStartDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "Asia/Manila"
        });
        actualFormattedEnd = actualEndDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "Asia/Manila"
        });
        const sampleSize = Math.min(20, Math.ceil(readings2.length / 10));
        const step = Math.ceil(readings2.length / sampleSize);
        const sampledReadings = readings2.filter((_, i) => i % step === 0);
        const stats = {
          totalReadings: readings2.length,
          avgSI: (readings2.reduce((sum, r) => sum + r.siAverage, 0) / readings2.length).toFixed(3),
          maxSI: Math.max(...readings2.map((r) => r.siMaximum)).toFixed(3),
          minSI: Math.min(...readings2.map((r) => r.siMinimum)).toFixed(3),
          sampleCount: sampledReadings.length
        };
        prompt = `Analyze seismic readings from ${actualFormattedStart} to ${actualFormattedEnd}:
Stats - Total readings: ${stats.totalReadings}, Avg SI: ${stats.avgSI}, Max SI: ${stats.maxSI}, Min SI: ${stats.minSI}
Sample readings (${stats.sampleCount} of ${stats.totalReadings}):
${JSON.stringify(sampledReadings)}
Battery level: ${batteryLevel?.battery || "Unknown"}%`;
      } else {
        prompt = `No seismic readings found for the requested period.
Battery level: ${batteryLevel?.battery || "Unknown"}%`;
      }
      let aiSummary;
      if (readings2.length) {
        try {
          aiSummary = await generateResponse(prompt, systemInstruction);
        } catch (error) {
          if (error.status === 429) {
            aiSummary = "AI analysis is temporarily unavailable due to high demand. Please try again later.";
          } else {
            aiSummary = "AI analysis is currently unavailable.";
          }
        }
      } else {
        aiSummary = "No AI summary available because there are no seismic readings for the selected period.";
      }
      let peakMagnitude = { value: 0, time: "-" };
      let avgMagnitude = "-";
      let significantReadings = 0;
      let peakActivity = { value: "-" };
      if (readings2 && readings2.length > 0) {
        const peak = readings2.reduce(
          (max, r) => r.siMaximum > max.siMaximum ? r : max,
          readings2[0]
        );
        peakMagnitude = {
          value: peak.siMaximum,
          time: new Date(peak.createdAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })
        };
        const avg = readings2.reduce((sum, r) => sum + r.siAverage, 0) / readings2.length;
        avgMagnitude = avg.toFixed(3);
        significantReadings = readings2.filter((r) => r.siAverage > 0.5).length;
        const peakAct = readings2.reduce(
          (max, r) => r.siAverage > max.siAverage ? r : max,
          readings2[0]
        );
        peakActivity = {
          value: new Date(peakAct.createdAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          }),
          siAverage: peakAct.siAverage
        };
      }
      let pdfBase64 = null;
      try {
        const { generateSeismicReportBuffer: generateSeismicReportBuffer2 } = await Promise.resolve().then(() => (init_pdf_generator(), pdf_generator_exports));
        const pdfBuffer = await generateSeismicReportBuffer2({
          readings: readings2,
          dateRange: `${actualFormattedStart} - ${actualFormattedEnd}`,
          peakMagnitude,
          avgMagnitude,
          significantReadings,
          peakActivity,
          batteryLevel: batteryLevel?.battery || 0,
          aiSummary
        });
        pdfBase64 = pdfBuffer.toString("base64");
      } catch (pdfError) {
        console.error("Failed to generate PDF report buffer:", pdfError);
      }
      return res.status(200).send({
        message: "Readings retrieved successfully",
        statusCode: 200,
        data: readings2,
        firstDate: firstDate?.firstDate,
        batteryLevel: batteryLevel?.battery,
        aiSummary,
        pdfBase64
      });
    }
    const readings = await getAllReadings();
    const readingsWithRisk = Array.isArray(readings) ? readings.map((r) => ({
      ...r,
      riskLevel: getSeismicRiskLevelForReading(r),
      isSafe: isReadingSeismicSafe(r)
    })) : [];
    return res.status(200).send({
      message: "Readings retrieved successfully",
      statusCode: 200,
      data: readingsWithRisk
    });
  } catch (error) {
    console.error("Error in getReadings:", error);
    return res.status(500).send({
      message: error instanceof Error ? error.message : "An unexpected error occurred while getting all the readings.",
      error: "Internal Server Error",
      statusCode: 500
    });
  }
}
async function getReading(req, res) {
  const { readingId } = req.params;
  if (!readingId) {
    return res.status(400).send({
      message: "Reading ID is required",
      error: "Bad Request",
      statusCode: 400
    });
  }
  try {
    const isValidToken = await verifyToken(req);
    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401
      });
    }
    const [data] = await db.select().from(reading).where(eq6(reading.id, readingId));
    if (!data) {
      return res.status(404).send({
        message: "Reading not found",
        error: "Not Found",
        statusCode: 404
      });
    }
    return res.status(200).send({
      message: "Reading retrieved successfully",
      statusCode: 200,
      data
    });
  } catch (error) {
    return res.status(500).send({
      message: error instanceof Error ? error.message : "Error getting reading",
      error: "Internal server error",
      statusCode: 500
    });
  }
}

// src/routes/readings.ts
var router4 = Router3();
router4.post("/", async (req, res, next) => {
  try {
    await createReading(req, res);
  } catch (error) {
    next(error);
  }
});
router4.get("/", async (req, res, next) => {
  try {
    await getReadings(req, res);
  } catch (error) {
    next(error);
  }
});
router4.get(
  "/:readingId",
  async (req, res, next) => {
    try {
      await getReading(req, res);
    } catch (error) {
      next(error);
    }
  }
);
var readings_default = router4;

// src/routes/earthquakes.ts
import { Router as Router4 } from "express";

// src/controllers/earthquakeController.ts
import { eq as eq7 } from "drizzle-orm";
init_utils();

// src/lib/service/earthquake-service.ts
import { and as and6, gte as gte2, lte as lte2 } from "drizzle-orm";
async function getAllEarthquakes() {
  const earthquakes = await db.select().from(earthquake);
  if (!earthquakes.length) return null;
  return earthquakes;
}
async function getAllStartEndEarthquakes(startDate, endDate) {
  const earthquakes = await db.select().from(earthquake).where(
    and6(
      gte2(earthquake.createdAt, startDate),
      lte2(earthquake.createdAt, endDate)
    )
  );
  if (!earthquakes.length) return null;
  return earthquakes;
}

// src/lib/service/gemini.ts
import { config as config10 } from "dotenv";
import { GoogleGenAI } from "@google/genai";
config10({ path: ".env.local" });
var GEMINI_API_KEY = process.env.GEMINI_API_KEY;
var ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
async function generateResponse2(contents, systemInstruction5) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents,
    config: {
      systemInstruction: systemInstruction5
    }
  });
  return response;
}

// src/controllers/earthquakeController.ts
var systemInstruction2 = `You are an earthquake monitoring AI assistant for seismic analysis and historical data interpretation. Generate a concise professional summary that includes:
- Historical earthquake activity assessment
- Analysis of magnitude patterns and frequency
- Notable trends or clusters in earthquake occurrences
- Risk evaluation and safety insights based on historical data
Keep response under 150 words and maintain a calm, informative tone.
IMPORTANT: Convert all UTC times to Philippine Time (UTC+8) when displaying dates and times in your response. Display times in 12-hour format (e.g., "04:00 AM" or "04:00 PM") without mentioning "Philippine Time" or timezone. Be careful with AM/PM conversion - double-check that morning hours show AM and afternoon/evening hours show PM.
Write naturally as if you are directly reporting on seismic activity without referencing datasets or data sources. Present findings as direct observations.`;
async function createEarthquake(req, res) {
  const { magnitude, duration } = req.body;
  const missingFields = [];
  if (magnitude == null) missingFields.push("magnitude");
  if (duration == null) missingFields.push("duration");
  if (missingFields.length > 0) {
    return res.status(400).send({
      message: `Missing required fields: ${missingFields.join(", ")}`,
      error: "Bad Request",
      statusCode: 400
    });
  }
  const earthquakeValues = {
    magnitude,
    duration
  };
  const isValidEarthquakeValues = createEarthquakeSchema.safeParse(earthquakeValues);
  if (isValidEarthquakeValues.error) {
    return res.status(400).send({
      message: formatZodError(isValidEarthquakeValues.error),
      error: "Bad Request",
      statusCode: 400
    });
  }
  try {
    const isValidToken = await verifyToken(req);
    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401
      });
    }
    const [newEarthquake] = await db.insert(earthquake).values(isValidEarthquakeValues.data).returning();
    if (!newEarthquake) {
      return res.status(500).send({
        message: "The earthquake record could not be created in the database. Please try again.",
        error: "Database Operation Failed",
        statusCode: 500
      });
    }
    const io2 = getIO();
    io2.emit("newEarthquake", newEarthquake);
    return res.status(201).send({
      message: "Earthquake record successfully created and stored in the database",
      statusCode: 201,
      data: newEarthquake
    });
  } catch (error) {
    return res.status(500).send({
      message: "An unexpected error occurred while creating the earthquake record. Please try again later. If the problem persists, contact support.",
      error: "Internal Server Error",
      statusCode: 500
    });
  }
}
async function getEarthquakes(req, res) {
  const { startDate, endDate } = req.query;
  try {
    const isValidToken = await verifyToken(req);
    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401
      });
    }
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(-8, 0, 0, 0);
      end.setHours(15, 59, 59, 999);
      const earthquakesRaw2 = await getAllStartEndEarthquakes(start, end);
      const earthquakes2 = Array.isArray(earthquakesRaw2) ? earthquakesRaw2.map((e) => ({
        ...e,
        riskLevel: getEarthquakeRiskLevel(e.magnitude)
      })) : [];
      let prompt2;
      if (earthquakes2 && earthquakes2.length > 0) {
        const dates = earthquakes2.map((e) => new Date(e.createdAt));
        const actualStartDate = new Date(
          Math.min(...dates.map((d) => d.getTime()))
        );
        const actualEndDate = new Date(
          Math.max(...dates.map((d) => d.getTime()))
        );
        const actualFormattedStart = actualStartDate.toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric"
          }
        );
        const actualFormattedEnd = actualEndDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
        prompt2 = `Analyze these earthquake records from ${actualFormattedStart} to ${actualFormattedEnd}:
${JSON.stringify(earthquakes2, null, 2)}`;
      } else {
        prompt2 = `No earthquake records found for the requested period.`;
      }
      let aiSummary2;
      try {
        aiSummary2 = await generateResponse2(prompt2, systemInstruction2);
      } catch (error) {
        if (error.status === 429) {
          aiSummary2 = "AI analysis is temporarily unavailable due to high demand. Please try again later.";
        } else {
          aiSummary2 = "AI analysis is currently unavailable.";
        }
      }
      return res.status(200).send({
        message: "Earthquake record retrieved successfully",
        statusCode: 200,
        data: earthquakes2,
        aiSummary: typeof aiSummary2 === "string" ? aiSummary2 : aiSummary2.text
      });
    }
    const earthquakesRaw = await getAllEarthquakes();
    const earthquakes = Array.isArray(earthquakesRaw) ? earthquakesRaw.map((e) => ({
      ...e,
      riskLevel: getEarthquakeRiskLevel(e.magnitude)
    })) : [];
    let prompt;
    if (earthquakes && earthquakes.length > 0) {
      const dates = earthquakes.map((e) => new Date(e.createdAt));
      const actualStartDate = new Date(
        Math.min(...dates.map((d) => d.getTime()))
      );
      const actualEndDate = new Date(
        Math.max(...dates.map((d) => d.getTime()))
      );
      const actualFormattedStart = actualStartDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      const actualFormattedEnd = actualEndDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      prompt = `Analyze these historical earthquake records from ${actualFormattedStart} to ${actualFormattedEnd}:
${JSON.stringify(earthquakes, null, 2)}`;
    } else {
      prompt = `No earthquake records found in the database.`;
    }
    let aiSummary;
    try {
      aiSummary = await generateResponse2(prompt, systemInstruction2);
    } catch (error) {
      if (error.status === 429) {
        aiSummary = "AI analysis is temporarily unavailable due to high demand. Please try again later.";
      } else {
        aiSummary = "AI analysis is currently unavailable.";
      }
    }
    return res.status(200).send({
      message: "Earthquake record retrieved successfully",
      statusCode: 200,
      data: earthquakes,
      aiSummary: typeof aiSummary === "string" ? aiSummary : aiSummary.text
    });
  } catch (error) {
    return res.status(500).send({
      message: "An unexpected error occurred while getting all the earthquake records. Please try again later. If the problem persists, contact support.",
      error: "Internal Server Error",
      statusCode: 500
    });
  }
}
async function getEarthquake(req, res) {
  const { earthquakeId } = req.params;
  if (!earthquakeId) {
    return res.status(400).send({
      message: "Earthquake ID is required",
      error: "Bad Request",
      statusCode: 400
    });
  }
  try {
    const isValidToken = await verifyToken(req);
    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401
      });
    }
    const [data] = await db.select().from(earthquake).where(eq7(earthquake.id, earthquakeId));
    if (!data) {
      return res.status(404).send({
        message: "Earthquake record with the specified ID could not be found",
        error: "Not Found",
        statusCode: 404
      });
    }
    return res.status(200).send({
      message: "Earthquake record retrieved successfully",
      statusCode: 200,
      data: {
        ...data,
        riskLevel: getEarthquakeRiskLevel(data.magnitude)
      }
    });
  } catch (error) {
    return res.status(500).send({
      message: "An unexpected error occurred while getting the earthquake record. Please try again later. If the problem persists, contact support.",
      error: "Internal Server Error",
      statusCode: 500
    });
  }
}

// src/routes/earthquakes.ts
var router5 = Router4();
router5.post("/", async (req, res, next) => {
  try {
    await createEarthquake(req, res);
  } catch (error) {
    next(error);
  }
});
router5.get("/", async (req, res, next) => {
  try {
    await getEarthquakes(req, res);
  } catch (error) {
    next(error);
  }
});
router5.get(
  "/:earthquakeId",
  async (req, res, next) => {
    try {
      await getEarthquake(req, res);
    } catch (error) {
      next(error);
    }
  }
);
var earthquakes_default = router5;

// src/routes/notifications.ts
import { Router as Router5 } from "express";

// src/controllers/notificationController.ts
import { config as config11 } from "dotenv";
config11({ path: ".env.local" });
var systemInstruction3 = "You are an emergency alert system for a school. Generate concise, clear, and urgent notification text similar to mobile earthquake alerts. Always start with 'Estimated magnitude [X] earthquake detected.' Do not include 'EARTHQUAKE ALERT' prefix. Keep the tone professional but urgent, and focus only on essential safety information. Response should be 1-2 sentences maximum, like a real emergency push notification.";
async function sendAllNotifications(req, res) {
  const { magnitude } = req.body;
  if (!magnitude) {
    return res.status(400).send({
      message: "Earthquake magnitude is required for the alert",
      error: "BadRequest",
      statusCode: 400
    });
  }
  try {
    const isValidToken = await verifyToken(req);
    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401
      });
    }
    const contents = `An earthquake with magnitude ${magnitude} has been detected near Immaculada Conception College. Generate an appropriate emergency notification message for the school community.`;
    let aiResponse;
    try {
      aiResponse = await generateResponse2(contents, systemInstruction3);
    } catch (error) {
      aiResponse = { text: null };
    }
    const notificationMessage = aiResponse.text || (magnitude < 3 ? `Estimated magnitude ${magnitude} earthquake detected. Seek shelter immediately. Drop, cover, and hold.` : magnitude < 6 ? `Estimated magnitude ${magnitude} earthquake detected. Drop, cover, and hold on. Stay away from windows and exterior walls.` : `Estimated magnitude ${magnitude} earthquake detected. Drop, cover, and hold on. Evacuate to designated safe zones after shaking stops.`);
    const results = {
      email: { success: false, error: null },
      pushNotification: {
        success: false,
        error: null,
        ticketCount: 0
      }
    };
    try {
      const emails = await getAllNotificationEnabledEmails();
      if (emails && emails.length) {
        await transporter.sendMail({
          from: `"Queyk" <${process.env.APP_GMAIL_EMAIL}>`,
          to: emails.map((user2) => user2.email),
          subject: `Earthquake Alert: Magnitude ${magnitude} Detected`,
          text: `Dear Immaculadians,

Our seismic monitoring system has detected earthquake activity with magnitude ${magnitude} that may affect our campus.

${notificationMessage}

Please follow these safety protocols:
- Follow the school's earthquake safety procedures
- Proceed to designated evacuation areas if instructed  
- Listen for announcements from school personnel
- Stay calm and assist others as needed
- Wait for all-clear signals before resuming activities

Emergency Contacts:
- School Clinic: 09755721421
- School Security: 09569114566  
- Facilities Management: 09460548474

Stay safe,
Queyk Alert System`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #212529; background-color: #f1f3f5; margin: 0; padding: 20px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; border: 1px solid #e9ecef; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #193867 0%, #35507a 100%); background-color: #193867; padding: 30px 20px; border-radius: 12px 12px 0 0;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 15px;">
                      <tr>
                        <td align="left" valign="middle">
                          <div></div>
                        </td>
                        <td align="right" valign="middle">
                          <div></div>
                        </td>
                      </tr>
                    </table>
                    <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #ffd43b; text-align: center; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">Seismic Activity Alert</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 30px;">
                    <p style="margin: 0 0 16px 0; color: #212529; font-size: 16px;">Dear Immaculadians,</p>
                    <p style="margin: 0 0 16px 0; color: #212529; font-size: 16px;">Our seismic monitoring system has detected earthquake activity that may affect our campus. This automated notification is being sent to ensure the safety of all students, faculty, and staff.</p>
                    
                    <!-- Alert Section -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-radius: 12px; margin: 20px 0; border: 1px solid #e9ecef">
                      <tr>
                        <td style="padding: 20px;">
                          <p style="margin: 0; color: ${magnitude < 3 ? "#28a745" : magnitude < 5 ? "#ffc107" : magnitude < 7 ? "#fd7e14" : "#dc3545"}; font-size: 18px; font-weight: bold">${notificationMessage}</p>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 0 0 16px 0; color: #212529; font-size: 16px;"><strong style="color: #193867; font-weight: bold;">Immediate Action Required:</strong></p>
                    <p style="margin: 0 0 8px 0; color: #212529; font-size: 16px;">\u2022 Follow the school's earthquake safety protocols</p>
                    <p style="margin: 0 0 8px 0; color: #212529; font-size: 16px;">\u2022 Proceed to designated evacuation areas if instructed</p>
                    <p style="margin: 0 0 8px 0; color: #212529; font-size: 16px;">\u2022 Listen for announcements from school personnel</p>
                    <p style="margin: 0 0 8px 0; color: #212529; font-size: 16px;">\u2022 Stay calm and assist others as needed</p>
                    <p style="margin: 0 0 16px 0; color: #212529; font-size: 16px;">\u2022 Wait for all-clear signals before resuming normal activities</p>
                    
                    <p style="margin: 0 0 16px 0; color: #212529; font-size: 16px;"><strong style="color: #193867; font-weight: bold;">Emergency Contacts:</strong></p>
                    <p style="margin: 0 0 8px 0; color: #212529; font-size: 16px;">\u2022 School Clinic: 09755721421</p>
                    <p style="margin: 0 0 8px 0; color: #212529; font-size: 16px;">\u2022 School Security: 09569114566</p>
                    <p style="margin: 0 0 16px 0; color: #212529; font-size: 16px;">\u2022 Facilities Management: 09460548474</p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f1f3f5; text-align: center; padding: 20px; font-size: 12px; color: #556575; border-top: 1px solid #e9ecef; border-radius: 0 0 12px 12px;">
                    <p style="margin: 0;">&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Queyk. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `
        });
        results.email.success = true;
      } else {
        results.email.error = "No notification-enabled email recipients found";
      }
    } catch (error) {
      results.email.error = error instanceof Error ? error.message : "Failed to send emails";
    }
    try {
      const pushResult = await sendPushNotifications(
        magnitude,
        notificationMessage
      );
      results.pushNotification.success = pushResult.success;
      results.pushNotification.ticketCount = pushResult.tickets?.length || 0;
      if (!pushResult.success) {
        results.pushNotification.error = pushResult.error || "Failed to send push notifications";
      }
    } catch (error) {
      results.pushNotification.error = error instanceof Error ? error.message : "Failed to send push notifications";
    }
    if (results.email.success || results.pushNotification.success) {
      return res.status(200).json({
        message: "Notifications sent",
        statusCode: 200,
        data: {
          email: results.email,
          pushNotification: results.pushNotification
        }
      });
    } else {
      return res.status(404).send({
        message: "No recipients found for email or push notifications",
        error: "NotFound",
        statusCode: 404,
        data: {
          email: results.email,
          pushNotification: results.pushNotification
        }
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: error instanceof Error ? error.message : "There was an error sending notifications.",
      error: "Internal Server Error",
      statusCode: 500
    });
  }
}

// src/routes/notifications.ts
var router6 = Router5();
router6.post("/", async (req, res, next) => {
  try {
    await sendAllNotifications(req, res);
  } catch (error) {
    next(error);
  }
});
var notifications_default = router6;

// src/routes/push-notifications.ts
import { Router as Router6 } from "express";

// src/controllers/pushNotificationController.ts
import { config as config12 } from "dotenv";
config12({ path: ".env.local" });
var systemInstruction4 = "You are an emergency alert system for a school. Generate concise, clear, and urgent notification text similar to mobile earthquake alerts. Always start with 'Estimated magnitude [X] earthquake detected.' Do not include 'EARTHQUAKE ALERT' prefix. Keep the tone professional but urgent, and focus only on essential safety information. Response should be 1-2 sentences maximum, like a real emergency push notification.";
async function sendPushNotification(req, res) {
  const { magnitude } = req.body;
  if (!magnitude) {
    return res.status(400).send({
      message: "Earthquake magnitude is required for the alert notification",
      error: "BadRequest",
      statusCode: 400
    });
  }
  try {
    const isValidToken = await verifyToken(req);
    if (!isValidToken?.isValidToken) {
      return res.status(401).send({
        message: "Invalid or expired authentication token",
        error: "Unauthorized",
        statusCode: 401
      });
    }
    const contents = `An earthquake with magnitude ${magnitude} has been detected near Immaculada Conception College. Generate an appropriate emergency notification message for the school community.`;
    let aiResponse;
    try {
      aiResponse = await generateResponse2(contents, systemInstruction4);
    } catch (error) {
      aiResponse = { text: null };
    }
    const notificationMessage = aiResponse.text || (magnitude < 3 ? `Estimated magnitude ${magnitude} earthquake detected. Seek shelter immediately. Drop, cover, and hold.` : magnitude < 6 ? `Estimated magnitude ${magnitude} earthquake detected. Drop, cover, and hold on. Stay away from windows and exterior walls.` : `Estimated magnitude ${magnitude} earthquake detected. Drop, cover, and hold on. Evacuate to designated safe zones after shaking stops.`);
    const result = await sendPushNotifications(magnitude, notificationMessage);
    if (!result.success) {
      return res.status(404).send({
        message: result.error || "No notification-enabled users with valid push tokens found",
        error: "NotFound",
        statusCode: 404
      });
    }
    res.status(200).json({
      message: "Push notifications sent successfully",
      statusCode: 200,
      data: {
        ticketCount: result.tickets?.length || 0
      }
    });
  } catch (error) {
    return res.status(500).send({
      message: error instanceof Error ? error.message : "There was an error sending the push notification.",
      error: "Internal Server Error",
      statusCode: 500
    });
  }
}

// src/routes/push-notifications.ts
var router7 = Router6();
router7.post("/", async (req, res, next) => {
  try {
    await sendPushNotification(req, res);
  } catch (error) {
    next(error);
  }
});
var push_notifications_default = router7;

// src/app.ts
var app = express2();
app.set("trust proxy", 1);
var limiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  headers: true
});
var allowedOrigins = [
  process.env.FRONTEND_APP_URL,
  process.env.LOCALHOST_APP_URL,
  "http://localhost:3000",
  "http://localhost:9245",
  "http://127.0.0.1:9245",
  "http://localhost:9246",
  "http://127.0.0.1:9246",
  "wails://localhost",
  "wails://localhost:9245",
  "wails://wails",
  "http://wails.localhost"
].filter(Boolean);
app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin === "null") {
        return callback(null, true);
      }
      if (process.env.NODE_ENV !== "production" && (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) || origin.startsWith("wails://"))) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Token-Type"]
  })
);
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use(express2.json());
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.json({
    message: "Queyk Backend API",
    version: "1.0.0",
    status: "running",
    environment: process.env.NODE_ENV || "development"
  });
});
app.use("/v1/api/users", users_default);
app.use("/v1/api/iot/readings", readings_default);
app.use("/v1/api/readings", limiter, readings_default);
app.use("/v1/api/email", email_default);
app.use("/v1/api/push-notifications", push_notifications_default);
app.use("/v1/api/notifications", notifications_default);
app.use("/v1/api/iot/earthquakes", earthquakes_default);
app.use("/v1/api/earthquakes", limiter, earthquakes_default);
app.use("/v1/api/iot/device", iot_default);
var app_default = app;

// src/serverless.ts
var serverless_default = app_default;
export {
  serverless_default as default
};
