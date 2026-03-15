"use client";
import { useGetProjects } from '@/modules/projects/hooks/project';
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";
import { FolderKanban, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const ProjectList = () => {
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
      <div className='w-full mt-16'>
        <h2 className='text-2xl md:text-3xl font-bold text-center mb-8'>Your Projects</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className='h-36 rounded-xl' />
          ))}
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div className='w-full mt-16'>
      <h2 className='text-2xl md:text-3xl font-bold text-center mb-8'>Your Projects</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto'>
        {projects.map((project) => (
          <Link href={`/project/${project.id}`} key={project.id}>
            <Card className='hover:bg-accent/50 transition-all duration-200 cursor-pointer overflow-hidden group'>
              <CardContent className='p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='p-2 rounded-lg bg-primary/10 text-primary'>
                    <FolderKanban className='size-5' />
                  </div>
                  <ArrowRight className='size-4 text-muted-foreground group-hover:text-primary transition-colors' />
                </div>
                <CardTitle className='text-xl mb-2 line-clamp-1'>{project.title}</CardTitle>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Calendar className='size-4' />
                  <span>{formatDate(project.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProjectList;
