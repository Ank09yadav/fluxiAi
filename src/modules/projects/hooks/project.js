import { useQuery , useMutation , useQueryClient } from "@tanstack/react-query"
import { createProject , getProjectById , getProjects, deleteProject } from "../actions";

export const useCreateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:createProject,
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["projects"]})
        }
    })
}

export const useGetProjectById = (id) => {
    return useQuery({
        queryKey: ["project", id],
        queryFn: () => getProjectById(id),
        refetchInterval: (query) => {
            const project = query.state.data;
            const hasFragment = project?.messages?.some(m => m.fragments);
            return hasFragment ? false : 2000;
        }
    })
}

export const useGetProjects = () => {
    return useQuery({
        queryKey:["projects"],
        queryFn:getProjects
    })
}

export const useDeleteProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:["projects"]})
        }
    })
}