import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "../../drizzle";
import * as schema from "../../drizzle/schema";

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
    },
  },
  trustedOrigins: [
    process.env.FRONTEND_APP_URL || "http://localhost:3000",
    process.env.LOCALHOST_APP_URL || "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:8080",
  ],
  plugins: [bearer()],
});
