import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.BETTER_AUTH_GITHUB_ID!,
      clientSecret: process.env.BETTER_AUTH_GITHUB_SECRET!,
    },
    google: {
      clientId: process.env.BETTER_AUTH_GOOGLE_ID!,
      clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET!,
    },
  },
  //   nextCookies should be the last plugin
  plugins: [nextCookies()],
});
