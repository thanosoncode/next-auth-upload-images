import prisma from "@/prisma/prismaClient";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcrypt";

export const authOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        if (!email || !password) {
          throw new Error("Fields are missing");
        }

        const user = await prisma.user.findFirst({
          where: {
            email: email,
          },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
          throw new Error("User does not exist or wrong credentials");
        }
        console.log("authorize", { id: user.id, email: user.email });

        return { id: user.id, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
