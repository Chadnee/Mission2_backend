import { Request, Response, NextFunction } from "express";
import { UserServices } from "../modules/user/user.service";
;

const visitorTracker = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.toString() ||
      req.socket.remoteAddress ||
      "unknown";

    const userAgent = req.headers["user-agent"] || "unknown";

    await UserServices.trackVisitorsIntoDB(ip, userAgent);
  } catch (error) {
    // never block user if analytics fails
    console.error("Visitor tracking failed:", error);
  }

  next(); // continue request normally
};

export default visitorTracker;
