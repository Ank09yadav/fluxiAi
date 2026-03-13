"use server"
import { inngest } from "@/inngest/client";

export const sendHelloEvent = async (prompt) => {
    await inngest.send({
        name: "code-agent/run",
        data: {
            value: prompt
        }
    });
}