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

export const getProjectById = async (id)=>{
    const user = await getCurrentUser();
    if(!user) throw new Error("Unauthorized");
    const project = await db.project.findUnique({
        where:{
            id:id,
            userId:user.id
        },
        include:{
            messages:{
                orderBy:{
                    createdAt:"asc"
                },
                include:{
                    fragments:true
                }
            }
        }
    })
    return project;
}

export const getProjects = async () => {
    const user = await getCurrentUser();
    if(!user) throw new Error("Unauthorized");
    const projects = await db.project.findMany({
        where:{
            userId:user.id
        },
        orderBy:{
            createdAt:"desc"
        },
    })
    return projects;
}
export const checkSandboxStatus = async (url) => {
    try {
        const response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
        return response.ok;
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

export const deleteProject = async (id)=>{
    const user = await getCurrentUser();
    if(!user) throw new Error("Unauthorized");
    return await db.project.delete({
        where:{
            id:id,
            userId:user.id
        }
    })
}

export const installModule = async (projectId, moduleName) => {
    const user = await getCurrentUser();
    if(!user) throw new Error("Unauthorized");

    // Get the latest message containing a fragment for this project
    const latestMessage = await db.message.findFirst({
        where: {
            projectId: projectId,
            fragments: { isNot: null }
        },
        orderBy: { createdAt: "desc" },
        include: { fragments: true }
    });

    if (!latestMessage || !latestMessage.fragments || !latestMessage.fragments.sandboxId) {
        throw new Error("No sandbox found for this project.");
    }

    const sandboxId = latestMessage.fragments.sandboxId;
    console.log(`Installing ${moduleName} in sandbox ${sandboxId}`);

    const sandbox = await LocalSandbox.connect(sandboxId);
    const result = await sandbox.commands.run(`npm install ${moduleName} --yes`);

    return result;
}
