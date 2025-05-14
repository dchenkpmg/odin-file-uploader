const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      console.log("Authenticating user:", username);
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      if (!user) {
        console.log("User not found:", username);
        return done(null, false, { message: "Incorrect username or password" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        console.log('"Password mismatch for user:", username);');
        return done(null, false, { message: "Incorrect username or password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  console.log("Deserializing user:", userId);
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});
