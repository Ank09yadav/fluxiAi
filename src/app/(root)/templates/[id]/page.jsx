'use client';

import React, { use } from 'react';
import { templates } from '@/modules/templates/config';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Download, ExternalLink, Github, Monitor, Smartphone, Tablet } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const TemplateDetailPage = ({ params }) => {
  const { id } = use(params);
  const template = templates.find(t => t.id === id);

  if (!template) {
    return notFound();
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Top Bar */}
      <div className='border-b bg-card/50 backdrop-blur-md sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/templates"><ChevronLeft className="h-5 w-5" /></Link>
            </Button>
            <div className='flex flex-col'>
              <h1 className='font-bold text-sm md:text-base leading-none'>{template.title}</h1>
              <span className='text-[10px] text-muted-foreground uppercase tracking-widest font-semibold'>{template.tags.join(' • ')}</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='hidden md:flex items-center bg-muted rounded-full p-1 mr-4 border border-border/50'>
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-background shadow-sm"><Monitor className="h-4 w-4" /></Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><Tablet className="h-4 w-4" /></Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><Smartphone className="h-4 w-4" /></Button>
            </div>
            <Button size="sm" className="rounded-full px-6 font-bold" asChild>
              <a href={template.githubUrl} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" /> Download Code
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8'>
        {/* Main Preview */}
        <div className='lg:col-span-3 space-y-6'>
          <div className='aspect-video rounded-3xl overflow-hidden border-8 border-muted shadow-2xl bg-card relative group'>
             <img src={template.previewImg} alt={template.title} className='w-full h-full object-cover' />
             <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                <Button size="xl" className="rounded-full h-16 px-8 shadow-2xl" asChild>
                   <a href={template.liveUrl} target="_blank" rel="noopener noreferrer">
                     Launch Live Project <ExternalLink className="ml-2 h-5 w-5" />
                   </a>
                </Button>
             </div>
          </div>
          
          <div className='p-8 rounded-3xl border bg-card/30 backdrop-blur-sm space-y-6'>
            <h2 className='text-2xl font-bold'>Project Overview</h2>
            <p className='text-muted-foreground leading-relaxed text-lg'>{template.description}</p>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 pt-4'>
               <div className='space-y-4'>
                  <h3 className='font-bold flex items-center gap-2'><div className='w-1.5 h-6 bg-primary rounded-full' /> Tech Stack</h3>
                  <div className='flex flex-wrap gap-2'>
                    {['Next.js', 'Tailwind CSS', 'Lucide Icons', 'Shadcn UI', ...template.tags].map(tech => (
                      <Badge key={tech} variant="outline" className="px-3 py-1 bg-background">{tech}</Badge>
                    ))}
                  </div>
               </div>
               <div className='space-y-4'>
                  <h3 className='font-bold flex items-center gap-2'><div className='w-1.5 h-6 bg-primary rounded-full' /> Key Features</h3>
                  <ul className='space-y-2'>
                    {template.features.map((f, i) => (
                      <li key={i} className='text-sm text-muted-foreground flex items-center gap-2'>
                        <div className='w-1 h-1 bg-primary rounded-full' /> {f}
                      </li>
                    ))}
                  </ul>
               </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className='space-y-6'>
          <div className='p-6 rounded-3xl border bg-card space-y-6 sticky top-24'>
             <div className='space-y-2'>
                <p className='text-xs font-bold text-muted-foreground uppercase'>Author</p>
                <div className='flex items-center gap-2'>
                   <div className='w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500' />
                   <span className='font-medium'>FluxiAi Team</span>
                </div>
             </div>
             
             <div className='space-y-2 pt-4 border-t'>
                <p className='text-xs font-bold text-muted-foreground uppercase'>License</p>
                <p className='text-sm font-medium'>MIT (Free for personal & commercial use)</p>
             </div>

             <div className='space-y-4 pt-4 border-t'>
                <Button className="w-full rounded-2xl h-12 font-bold" asChild>
                    <a href={template.githubUrl} target="_blank" rel="noopener noreferrer">
                       <Github className="mr-2 h-4 w-4" /> View Source on GitHub
                    </a>
                </Button>
                <Button variant="outline" className="w-full rounded-2xl h-12" asChild>
                    <a href={template.liveUrl} target="_blank" rel="noopener noreferrer">
                       <ExternalLink className="mr-2 h-4 w-4" /> Open in New Tab
                    </a>
                </Button>
             </div>

             <div className='bg-primary/5 p-4 rounded-2xl border border-primary/10'>
                <p className='text-xs font-medium text-center text-primary'>Need a customized version? Ask the AI to build it!</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetailPage;
