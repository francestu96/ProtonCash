import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      telegramId: string;
      name: string;
      email?: string;
      phone?: string;
    };
  }
  
  interface User {
    telegramId: string;
    name: string;
    password: string;
    email?: string;
    phone?: string;
    address?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    telegramId: string;
    name: string;
    email?: string;
    phone?: string;
  }
}