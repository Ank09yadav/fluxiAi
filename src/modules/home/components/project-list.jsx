"use client";
import { useGetProjects } from '@/modules/projects/hooks/project';
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";
import { FolderKanban, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const ProjectList = ({ sidebar }) => {
  const { data: projects, isPending } = useGetProjects();
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  if (isPending) {
    return (
      <div className={`w-full ${sidebar ? 'mt-0' : 'mt-16'}`}>
        {!sidebar && <h2 className='text-2xl md:text-3xl font-bold text-center mb-8'>Your Projects</h2>}
        <div className={`grid ${sidebar ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-4 ${!sidebar && 'max-w-6xl mx-auto'}`}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className={`h-24 ${sidebar ? 'rounded-2xl' : 'rounded-3xl'}`} />
          ))}
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-[2rem] bg-muted/20 border-border/50">
         <FolderKanban className="w-10 h-10 text-muted-foreground opacity-30 mb-4" />
         <p className="text-xs font-semibold text-muted-foreground text-center">No projects yet</p>
         <p className="text-[10px] text-muted-foreground/60 text-center">Your masterpieces will appear here</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${sidebar ? 'mt-0' : 'mt-16'}`}>
      {!sidebar && <h2 className='text-2xl md:text-3xl font-bold text-center mb-8'>Your Projects</h2>}
      <div className={`grid ${sidebar ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-4 ${!sidebar && 'max-w-6xl mx-auto'}`}>
        {projects.map((project) => (
          <Link href={`/project/${project.id}`} key={project.id}>
            <Card className={`group relative border-border/40 hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden bg-card/50 backdrop-blur-sm ${sidebar ? 'rounded-2xl p-4' : 'rounded-[2.5rem] p-6'}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
              <div className='flex items-center gap-4 relative'>
                  <div className={`p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent group-hover:from-primary/20 text-primary transition-all duration-300 ${sidebar ? 'p-2.5 rounded-xl' : 'p-4'}`}>
                    <FolderKanban className={`${sidebar ? 'size-5' : 'size-7'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className={`font-bold mb-1 truncate group-hover:text-primary transition-colors ${sidebar ? 'text-sm' : 'text-xl'}`}>
                      {project.title}
                    </CardTitle>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground font-medium'>
                      <Calendar className='size-3' />
                      <span>{formatDate(project.createdAt)}</span>
                    </div>
                  </div>
                  {!sidebar && <ArrowRight className='size-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all' />}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProjectList;
