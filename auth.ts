import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { api } from "./lib/api";
import { ActionRespone } from "./types/global";
import { IAccount } from "./database/account.model";
import { SignInSchema } from "./lib/validation";
import { IUserDoc } from "./database/user.model";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials);
        if (!validatedFields.success) {
          throw new Error("Invalid input");
        } else {
          const { email, password } = validatedFields.data;

          const { data: exsistingAccount } = (await api.account.getByProvider(
            email
          )) as ActionRespone<IAccount>;
          if (!exsistingAccount) {
            return null;
          }
          const { data: exsistingUser } = (await api.users.getById(
            exsistingAccount.userId.toString()!
          )) as ActionRespone<IUserDoc>;
          if (!exsistingUser) return null;
          const isValidPassword = await bcrypt.compare(
            password,
            exsistingAccount.password!
          );
          if (isValidPassword) {
            return {
              id: exsistingUser._id.toString(),
              name: exsistingUser.name,
              email: exsistingUser.email,
              image: exsistingUser.image,
            };
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },

    async jwt({ token, account }) {
      if (account) {
        const { data: existingAccount, success } =
          (await api.account.getByProvider(
            account.type === "credentials"
              ? token.email!
              : account.providerAccountId
          )) as ActionRespone<IAccount>;
        if (!success || !existingAccount) return token;
        const userId = existingAccount.userId;
        if (userId) token.sub = userId.toString();
      }
      return token;
    },

    async signIn({ user, account, profile }) {
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;

      const googleUsername =
        user.name?.toLowerCase().replace(/[^a-z0-9_]/g, "") || "";
      const emailPrefix = user.email?.split("@")[0]?.toLowerCase() || "";

      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username:
          account.provider === "github"
            ? (profile?.login as string)
            : googleUsername.length >= 3
            ? googleUsername
            : emailPrefix,
      };
      const { success } = (await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as "github" | "google",
        providerAccountId: account.providerAccountId,
      })) as ActionRespone;
      if (!success) return false;
      return true;
    },
  },
});
