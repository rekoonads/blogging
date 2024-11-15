import { PrismaAdapter } from "@auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./connect";
import { getServerSession } from "next-auth";

// Array of user IDs allowed to access the Write page
const ALLOWED_USER_IDS = [
  "cm3ee1byy00009dzcs948ne4v",
  "cm3ft1f250000l103qlu60atd",
];

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id;
        session.user.isAllowedToWrite = ALLOWED_USER_IDS.includes(user.id);
      }
      return session;
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
