import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const OWNER_ADMIN_EMAILS = new Set([
  "mdnajmussakib2003@gmail.com",
  "md.najmus.sakib.rahatul.2005@gmail.com",
  "rakibtoha47@gmail.com",
]);
const ADMIN_EMAILS = [...OWNER_ADMIN_EMAILS];

function isOwnerAdminEmail(email: string | null | undefined) {
  return Boolean(email && OWNER_ADMIN_EMAILS.has(email.trim().toLowerCase()));
}

export function getAuthorizedRole(email: string | null | undefined, currentRole: "CUSTOMER" | "ADMIN" = "CUSTOMER") {
  return isOwnerAdminEmail(email) ? "ADMIN" : currentRole;
}

async function enforceOwnerAdmin(email: string | null | undefined) {
  if (!email || !isOwnerAdminEmail(email)) return false;
  await prisma.user.updateMany({
    where: { email: email.trim().toLowerCase() },
    data: { role: "ADMIN" },
  });
  return true;
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Keep the conventional names canonical; AUTH_GOOGLE_* remain supported for compatibility.
const googleClientId = process.env.GOOGLE_CLIENT_ID ?? process.env.AUTH_GOOGLE_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET ?? process.env.AUTH_GOOGLE_SECRET;
const hasGoogleCredentials =
  Boolean(googleClientId && googleClientSecret) &&
  !/replace|your[-_ ]|placeholder/i.test(`${googleClientId} ${googleClientSecret}`);

const providers: Provider[] = [
  ...(hasGoogleCredentials
    ? [Google({ clientId: googleClientId!, clientSecret: googleClientSecret! })]
    : []),
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(rawCredentials) {
      const parsed = credentialsSchema.safeParse(rawCredentials);
      if (!parsed.success) return null;

      const email = parsed.data.email.toLowerCase();
      const password = parsed.data.password;

      // Master admin bypass
      if (ADMIN_EMAILS.includes(email) && password === (process.env.ADMIN_SECRET || "aloron2026admin")) {
        return { id: "admin-owner", name: "Aloron Owner", email, role: "ADMIN" as const };
      }

      let user;
      try {
        user = await prisma.user.findUnique({ where: { email } });
      } catch (error) {
        console.error("Auth DB fallback error:", error);
        return null;
      }
      if (!user?.passwordHash) return null;

      const passwordMatches = await bcrypt.compare(parsed.data.password, user.passwordHash);
      if (!passwordMatches) return null;

      const role = getAuthorizedRole(email, user.role);
      if (role !== user.role) {
        try {
          await prisma.user.update({ where: { id: user.id }, data: { role } });
        } catch (error) {
          console.error("Auth DB fallback error:", error);
        }
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role,
      };
    },
  }),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const email = user.email.toLowerCase();
        const role = getAuthorizedRole(email) === "ADMIN" ? "ADMIN" : undefined;
        try {
          const savedUser = await prisma.user.upsert({
            where: { email },
            update: { name: user.name ?? "Aloron customer", ...(role ? { role } : {}) },
            create: {
              email,
              name: user.name ?? "Aloron customer",
              ...(role ? { role } : {}),
            },
          });
          user.id = savedUser.id;
          user.role = savedUser.role;
        } catch (error) {
          console.error("Auth DB fallback error:", error);
          user.role = role ?? "CUSTOMER";
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }
      const ownerEmail = token.email ?? user?.email;
      if (ownerEmail && ADMIN_EMAILS.includes(ownerEmail.toLowerCase())) {
        token.role = "ADMIN";
        try {
          await enforceOwnerAdmin(ownerEmail);
        } catch (error) {
          console.error("Auth DB fallback error:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        const ownerEmail = token.email ?? session.user.email;
        if (ownerEmail && ADMIN_EMAILS.includes(ownerEmail.toLowerCase())) {
          session.user.role = "ADMIN";
          try {
            await enforceOwnerAdmin(ownerEmail);
          } catch (error) {
            console.error("Auth DB fallback error:", error);
          }
        } else {
          session.user.role = token.role as "CUSTOMER" | "ADMIN";
        }
      }
      return session;
    },
  },
});
