'use client';

import React from 'react';
import { templates } from '@/modules/templates/config';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, ShoppingCart, Tv, TrendingUp, Laptop, Eye, Download } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const getIcon = (id) => {
  switch (id) {
    case 'e-commerce': return <ShoppingCart className="w-6 h-6" />;
    case 'netflix-clone': return <Tv className="w-6 h-6" />;
    case 'trading-dashboard': return <TrendingUp className="w-6 h-6" />;
    case 'saas-landing-page': return <Laptop className="w-6 h-6" />;
    default: return <Laptop className="w-6 h-6" />;
  }
};

const TemplatePage = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full px-4 py-16 mt-16 max-w-7xl mx-auto'>
      <div className='text-center space-y-4 mb-16'>
        <h1 className='text-3xl md:text-6xl font-extrabold tracking-tight'>
          Premium Website <span className="text-primary italic">Templates</span>
        </h1>
        <p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto'>
          Start your next big project with our production-ready, beautifully designed templates. 
          Ready with full source code and live previews.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 w-full'>
        {templates.map((template) => (
          <Card key={template.id} className="group overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 bg-card/50 backdrop-blur-sm">
            <div className="relative aspect-video overflow-hidden">
               <img 
                src={template.previewImg} 
                alt={template.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                <Button size="lg" className="rounded-full shadow-lg" asChild>
                  <Link href={`/templates/${template.id}`} >
                    <Eye className="mr-2 h-4 w-4" /> Preview
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" className="rounded-full shadow-lg" asChild>
                  <a href={template.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" /> Download
                  </a>
                </Button>
              </div>
              <Badge className="absolute top-4 right-4 shadow-md bg-background/80 text-foreground backdrop-blur-md border-none">
                {template.tags[0]}
              </Badge>
            </div>
            
            <CardHeader>
               <div className="flex items-center gap-3 mb-2 text-primary">
                  {getIcon(template.id)}
                  <div className="flex gap-1">
                    {template.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 uppercase font-bold tracking-wider">{tag}</Badge>
                    ))}
                  </div>
               </div>
               <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">{template.title}</CardTitle>
               <CardDescription className="text-sm leading-relaxed">{template.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Key Features</span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {template.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-xs text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-primary/60 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-0 border-t border-border/50 mt-4 flex justify-between items-center py-4 bg-muted/30">
                <p className="text-xs font-medium text-muted-foreground">Free Source Code</p>
                <div className="flex gap-3">
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors duration-200" asChild>
                    <a href={template.liveUrl} target="_blank" rel="noopener noreferrer" title="Live Preview">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors duration-200" asChild>
                    <a href={template.githubUrl} target="_blank" rel="noopener noreferrer" title="Download Code">
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-20 w-full mb-10 p-12 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <h2 className="text-2xl md:text-4xl font-bold">Have a custom idea?</h2>
          <p className="text-muted-foreground">Don&apos;t limit yourself to templates. Use our autonomous AI engineer to build exactly what you need from scratch in minutes.</p>
        </div>
        <Button size="xl" className="h-14 px-10 text-lg rounded-full shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all font-bold" asChild>
          <Link href="/">Try AI Builder 🚀</Link>
        </Button>
      </div>
    </div>
  );
};

export default TemplatePage;
