import type { UserJSON } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { userRepository } from "@/lib/user-repository";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const { id } = evt.data;
    const eventType = evt.type;
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`,
    );
    switch (eventType) {
      case "user.created":
        console.log("Creating new user:", evt.data);
        try {
          await userRepository.upsert(evt.data as UserJSON, "guest");
          console.log("✅ User created successfully");
        } catch (error) {
          console.error("❌ Failed to create user:", error);
          return new Response("Failed to create user", { status: 500 });
        }
        break;

      case "user.updated":
        console.log("Updating user:", evt.data);
        try {
          const user = evt.data as UserJSON;
          const userId = user.id;
          var role = "guest";
          if (id) {
            const existing = await userRepository.findById(userId);
            if (existing) {
              role = existing.role;
            }
          }
          await userRepository.upsert(evt.data as UserJSON, role);
          console.log("✅ User updated successfully");
        } catch (error) {
          console.error("❌ Failed to update user:", error);
          return new Response("Failed to update user", { status: 500 });
        }
        break;

      case "user.deleted":
        console.log("Deleting user:", evt.data);
        try {
          const deleted = await userRepository.delete(evt.data.id!);
          if (deleted) {
            console.log("✅ User deleted successfully");
          } else {
            console.log("⚠️ User not found for deletion");
          }
        } catch (error) {
          console.error("❌ Failed to delete user:", error);
          return new Response("Failed to delete user", { status: 500 });
        }
        break;
      default:
        console.log(`🤔 Unhandled event type: ${eventType}`);
        // Можно добавить логирование для неизвестных типов событий
        break;
    }
    console.log("Webhook payload:", evt.data);

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
