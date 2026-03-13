import { useQuery , useMutation , useQueryClient } from "@tanstack/react-query"
import { createProject , getProjectById , getProjects } from "../actions";

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
        queryKey:["project",id],
        queryFn:()=>getProjectById(id)
    })
}

export const useGetProjects = () => {
    return useQuery({
        queryKey:["projects"],
        queryFn:getProjects
    })
}