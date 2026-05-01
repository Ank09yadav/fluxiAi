import db from "@/lib/db";

export const fetchProjectById = async (projectId, userId) => {
    // 1. Fetch project
    const project = await db.project.findUnique({
        where: { id: projectId }
    });

    if (!project || project.userId !== userId) {
        return null;
    }

    // 2. Fetch messages
    const messages = await db.message.findMany({
        where: { projectId: projectId },
        orderBy: { createdAt: "asc" },
        include: {
            fragments: true
        }
    });

    return {
        ...project,
        messages
    };
};

export const fetchAllProjects = async (userId) => {
    return await db.project.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
    });
};

export const removeProject = async (projectId, userId) => {
    const project = await db.project.findUnique({
        where: { id: projectId }
    });
    
    if (!project || project.userId !== userId) {
        throw new Error("Project not found or unauthorized");
    }

    return await db.project.delete({
        where: { id: projectId }
    });
};

export const fetchLatestMessageWithFragment = async (projectId) => {
    return await db.message.findFirst({
        where: {
            projectId: projectId,
            fragments: { isNot: null }
        },
        orderBy: { createdAt: "desc" },
        include: { fragments: true }
    });
};
