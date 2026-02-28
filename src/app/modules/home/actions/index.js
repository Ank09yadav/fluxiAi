"use server"
import { inngest } from "@/inngest/client";

export const sendHelloEvent = async () => {
    await inngest.send({
        name:"agent/hello"
    });
}