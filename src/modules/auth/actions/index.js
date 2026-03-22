"use server";

import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export const onBoardUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        error: "no authenticated user found"
      }
    }

    const { id, firstName, lastName, imageUrl, emailAddresses } = user;
    const email = emailAddresses[0]?.emailAddress || "";
    const name = firstName && lastName ? `${firstName} ${lastName}` : firstName || "User";

    // 1. Try finding by clerkId
    let dbUser = await db.user.findUnique({
      where: { clerkId: id }
    });

    if (dbUser) {
      // Update existing user by clerkId
      dbUser = await db.user.update({
        where: { clerkId: id },
        data: {
          name,
          email,
          image: imageUrl || null,
        }
      });
    } else {
      // 2. Try finding by email if clerkId not found (potential re-onboarding/ID change)
      dbUser = await db.user.findUnique({
        where: { email }
      });

      if (dbUser) {
        // Update user's clerkId if email matched but clerkId was different
        dbUser = await db.user.update({
          where: { email },
          data: {
            clerkId: id,
            name,
            image: imageUrl || null,
          }
        });
      } else {
        // 3. Create brand new user
        try {
          dbUser = await db.user.create({
            data: {
              clerkId: id,
              email,
              name,
              image: imageUrl || null,
            }
          });
        } catch (error) {
          // Handle race condition: if another request created the user since we checked,
          // just fetch that user instead of failing.
          if (error.code === 'P2002') {
            dbUser = await db.user.findUnique({
              where: { clerkId: id }
            }) || await db.user.findUnique({
              where: { email }
            });
          } else {
            throw error;
          }
        }
      }
    }

    return {
      success: true,
      user: dbUser,
      message: "User onboarded successfully"
    }
  } catch (error) {
    console.log("❌ Error onboarding user :", error);
    return {
      success: false,
      error: "Failed to onboard user"
    }
  }
}
export const getCurrentUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return null;
    }
    const dbUser = await db.user.findUnique({
      where: {
        clerkId: user.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        clerkId: true,

      }
    })

    if (!dbUser) {
      const result = await onBoardUser();
      if (result.success) {
        return result.user;
      }
      return null;
    }

    return dbUser;

  } catch (error) {
    console.log("❌ Error getting current user :", error);
    return null;
  }
}