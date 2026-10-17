import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { prisma } from "@/services/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL || "https://www.kynexs.com", // Set your production URL
	trustedOrigins: [
		"https://www.kynexs.com", // Your production domain
		"http://localhost:3000", // Local development (remove in production if desired)
	],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
