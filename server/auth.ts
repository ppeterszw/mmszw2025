import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  if (!stored) {
    return false;
  }
  
  // Check if password is already hashed (contains a ".")
  if (stored.includes(".")) {
    const [hashed, salt] = stored.split(".");
    if (!hashed || !salt) {
      return false; // Missing hash or salt
    }
    
    try {
      const hashedBuf = Buffer.from(hashed, "hex");
      const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
      
      // Check if buffers have the same length before using timingSafeEqual
      if (hashedBuf.length !== suppliedBuf.length) {
        console.warn(`Hash length mismatch: stored=${hashedBuf.length}, calculated=${suppliedBuf.length}`);
        return false; // Invalid hash format
      }
      
      return timingSafeEqual(hashedBuf, suppliedBuf);
    } catch (error) {
      console.warn("Error comparing hashed passwords:", error);
      return false;
    }
  } else {
    // All passwords should now be hashed - reject any remaining plaintext
    console.warn("Attempted login with unhashed password format");
    return false;
  }
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    },
    rolling: true, // Reset expiration on every request
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      const user = await storage.getUserByEmail(email);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  app.post("/api/register", async (req, res, next) => {
    const existingUser = await storage.getUserByEmail(req.body.email);
    if (existingUser) {
      return res.status(400).send("Email already exists");
    }

    const user = await storage.createUser({
      ...req.body,
      password: await hashPassword(req.body.password),
    });

    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json(user);
    });
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  // Update user profile
  app.put("/api/user/profile", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { firstName, lastName, email, phone } = req.body;
      const userId = req.user!.id;
      
      // Update user profile
      const updatedUser = await storage.updateUser(userId, {
        firstName,
        lastName,
        email,
        phone
      });
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Send email notification
      try {
        const { sendEmail, generateProfileUpdateNotification } = await import('./services/emailService');
        const userName = `${firstName || updatedUser.firstName} ${lastName || updatedUser.lastName}`;
        const emailContent = generateProfileUpdateNotification(userName);
        
        await sendEmail({
          to: email || updatedUser.email,
          from: 'sysadmin@estateagentscouncil.org',
          ...emailContent
        });
      } catch (emailError) {
        console.error('Failed to send profile update notification:', emailError);
        // Don't fail the request if email fails
      }
      
      res.json({ success: true, user: updatedUser });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Change user password
  app.put("/api/user/password", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user!.id;
      
      // Verify current password
      const user = await storage.getUser(userId);
      if (!user || !(await comparePasswords(currentPassword, user.password))) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      
      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);
      
      // Update password
      const updatedUser = await storage.updateUserPassword(userId, hashedNewPassword);
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Send email notification
      try {
        const { sendEmail, generatePasswordChangeNotification } = await import('./services/emailService');
        const userName = `${user.firstName} ${user.lastName}` || user.email;
        const emailContent = generatePasswordChangeNotification(userName);
        
        await sendEmail({
          to: user.email,
          from: 'sysadmin@estateagentscouncil.org',
          ...emailContent
        });
      } catch (emailError) {
        console.error('Failed to send password change notification:', emailError);
        // Don't fail the request if email fails
      }
      
      res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      console.error('Password change error:', error);
      res.status(500).json({ error: "Failed to change password" });
    }
  });
}
