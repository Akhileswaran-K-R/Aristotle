import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../prisma/client.js";

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await prisma.user.upsert({
            where: { googleId: profile.id },
            update: {
              name: profile.displayName,
            },
            create: {
              googleId: profile.id,
              email: profile.emails[0].value,
              name: profile.displayName,
            },
          });
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
