import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../src/utils/mongodb";
import dbConnect from "../../../src/utils/dbConnect";
import User from "../../../src/model/User";

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        telegramId: {
          label: "Id",
          type: "text",
        },
        password: {
          label: "Password",
          type: "text",
        },
      },
      
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({
          telegramId: credentials?.telegramId,
        });

        if (!user) {
          throw new Error("Telegram ID is not registered");
        }

        if (credentials!.password !== user.password) {
          throw new Error("Password is incorrect");
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  debug: process.env.NODE_ENV === "development",
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
    
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.telegramId = user.telegramId;
        token.email = user.email;
        token.phone = user.phone;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.name = token.name;
        session.user.telegramId = token.telegramId;
        session.user.email = token.email;
        session.user.phone = token.phone;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});
