import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { dbConnect } from "@/utils/connectDb";
import User from "../../../models/user";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try{
      const { email, name, image } = user;

      await dbConnect();

      // Check if user exists, create if not
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        await User.create({ email, name, image });
      }

      return true;
    }catch(err){
      console.log(err)
      return false
    }
    },
    async session({ session, token }) {
      
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        image: token.image as string,
      };
      return session;
    },
    async jwt({ token, user,account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.accessTokenExpires = Date.now() + (account.expires_in as number) * 1000; // Access token expiration
        token.refreshToken = account.refresh_token; // Store the refresh token
      }
      if (user) {
        token.id = user.id || token.id;
        token.email = user.email || token.email;
        token.name = user.name || token.name;
        token.image = user.image || token.image;
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
