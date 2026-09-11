import { config } from "dotenv";
import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { createAuthMiddleware } from "better-auth/api";
import { parseSetCookieHeader } from "better-auth/cookies";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "../../drizzle";
import * as schema from "../../drizzle/schema";

config({ path: ".env.local" });
config();

const schoolDomain = process.env.SCHOOL_EMAIL_ADDRESS;
const googleHd = schoolDomain ? schoolDomain.replace(/^@/, "") : undefined;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  user: {
    validateUserInfo: async ({ user }) => {
      const allowedDomain = process.env.SCHOOL_EMAIL_ADDRESS;
      if (
        allowedDomain &&
        (!user.email || !user.email.endsWith(allowedDomain))
      ) {
        return {
          error: "AccessDenied",
          errorDescription: `Email must belong to ${allowedDomain}`,
        };
      }
    },
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
      alertNotification: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
      pushNotification: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      expoPushToken: {
        type: "string",
        required: false,
      },
      smsNotification: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      phoneNumber: {
        type: "string",
        required: false,
      },
      isInSchool: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      profileImage: {
        type: "string",
        required: false,
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      prompt: "select_account",
      ...(googleHd ? { hd: googleHd } : {}),
    },
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
    "http://wails.localhost",
  ],
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/callback")) {
        const location =
          ctx.context.responseHeaders?.get("location") ||
          ctx.context.responseHeaders?.get("Location");
        const setCookie = ctx.context.responseHeaders?.get("set-cookie");
        if (location && setCookie) {
          const parsed = parseSetCookieHeader(setCookie);
          const cookieName = ctx.context.authCookies.sessionToken.name;
          const token = parsed.get(cookieName)?.value;
          if (token) {
            const redirectUrl = new URL(location, ctx.context.baseURL || "http://localhost:8080");
            redirectUrl.searchParams.set("token", token);
            ctx.setHeader("Location", redirectUrl.toString());
          }
        }
      }
    }),
  },
  plugins: [bearer()],
});
