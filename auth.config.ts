import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas";
import { getUserByEmail } from "./data/user";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/Google";

import bcrypt from "bcryptjs";
export default {
  providers: [
    Github({
  
    }),
    Google,
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passowrdMatch = await bcrypt.compare(password, user.password);
          if (passowrdMatch) return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
