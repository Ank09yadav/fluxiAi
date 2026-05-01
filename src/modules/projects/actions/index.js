"use server"
import { inngest } from "@/inngest/client";
import db from "@/lib/db";
import { MessageRole, MessageType } from "@prisma/client";
import { generateSlug } from "random-word-slugs";
import { getCurrentUser } from "@/modules/auth/actions";
import { LocalSandbox } from "@/lib/LocalSandbox";

export const createProject = async (value)=>{
    const user = await getCurrentUser();
    if(!user) throw new Error("Unauthorized");

    if (!user.isPro) {
        const projectCount = await db.project.count({
            where: { userId: user.id }
        });
        if (projectCount >= 4) {
            throw new Error("LIMIT_REACHED");
        }
    }

    const newProject = await db.project.create({
        data:{
            title:generateSlug(2, {format:"kebab"}),
            content: value,
            userId:user.id,
            messages:{
                create:{
                    role:MessageRole.USER,
                    content:value,
                    type:MessageType.RESULT
                }
            }
        }
    })
    await inngest.send({
        name:"code-agent/run",
        data:{
            value:value,
            projectId:newProject.id
        }
    })
    return newProject;

}

import { fetchProjectById, fetchAllProjects, removeProject, fetchLatestMessageWithFragment } from "../services/project-service";

export const getProjectById = async (projectId) => {
    try {
        const sessionUser = await getCurrentUser();
        if (!sessionUser || !sessionUser.id) throw new Error("Unauthorized");
        
        // Call the service layer (NOT a server action)
        return await fetchProjectById(projectId, sessionUser.id);
    } catch (error) {
        console.error("Error in getProjectById:", error);
        throw error;
    }
}

export const getProjects = async () => {
    try {
        const sessionUser = await getCurrentUser();
        if (!sessionUser || !sessionUser.id) throw new Error("Unauthorized");
        
        return await fetchAllProjects(sessionUser.id);
    } catch (error) {
        console.error("Error in getProjects:", error);
        throw error;
    }
}
export const checkSandboxStatus = async (url) => {
    try {
        if (!url || url.includes('undefined')) return false;
        
        // Use a controller to avoid long hangs
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch(url, { 
            method: 'GET', // Some dev servers prefer GET
            cache: 'no-store',
            signal: controller.signal,
            headers: {
                'Accept': 'text/html'
            }
        });
        clearTimeout(timeoutId);
        return response.ok || response.status === 200 || response.status === 304;
    } catch (error) {
        return false;
    }
}

export const restartSandbox = async (sandboxId) => {
    try {
        const sandbox = await LocalSandbox.connect(sandboxId);
        sandbox._startDevServer(sandbox.port);
        return true;
    } catch(err) {
        return false;
    }
}

export const deleteProject = async (projectId) => {
    try {
        const sessionUser = await getCurrentUser();
        if (!sessionUser || !sessionUser.id) throw new Error("Unauthorized");
        
        return await removeProject(projectId, sessionUser.id);
    } catch (error) {
        console.error("Error in deleteProject:", error);
        throw error;
    }
}

export const installModule = async (projectId, moduleName) => {
    try {
        const sessionUser = await getCurrentUser();
        if (!sessionUser || !sessionUser.id) throw new Error("Unauthorized");

        // Call service layer
        const latestMessage = await fetchLatestMessageWithFragment(projectId);

        if (!latestMessage || !latestMessage.fragments || !latestMessage.fragments.sandboxId) {
            throw new Error("No sandbox found for this project.");
        }

        const sandboxId = latestMessage.fragments.sandboxId;
        console.log(`Installing ${moduleName} in sandbox ${sandboxId}`);

        const sandbox = await LocalSandbox.connect(sandboxId);
        const result = await sandbox.commands.run(`npm install ${moduleName} --yes`);

        return result;
    } catch (error) {
        console.error("Error in installModule:", error);
        throw error;
    }
}
