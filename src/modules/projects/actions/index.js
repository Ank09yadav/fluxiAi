"use server"
import { inngest } from "@/inngest/client";
import db from "@/lib/db";
import { MessageRole, MessageType } from "@prisma/client";
import { generateSlug } from "random-word-slugs";
import { getCurrentUser } from "@/modules/auth/actions";

export const createProject = async (value)=>{
    const user = await getCurrentUser();
    if(!user) throw new Error("Unauthorized");

    const newProject = await db.project.create({
        data:{
            title:generateSlug(2, {format:"kebab"}),
            content: value,
            userId:user.id,
            messages:{
                create:{
                    role:MessageRole.user,
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
