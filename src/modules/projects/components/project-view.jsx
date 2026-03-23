'use client'
import React, { useState, useEffect } from 'react'
import { useGetProjectById } from '../hooks/project'
import { checkSandboxStatus, installModule } from '../actions'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Package } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { cn } from '@/lib/utils'
import { ExternalLink, Terminal, FileCode, Globe } from 'lucide-react'
import Link from 'next/link'
import ProjectHeader from './project-header'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import CodeView from './code-view'

const ProjectView = ({ id }) => {
    const { data: project, isPending, error } = useGetProjectById(id);
    const [selectedFragment, setSelectedFragment] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(true);
    const [previewError, setPreviewError] = useState(false);
    const [isInstalling, setIsInstalling] = useState(false);
    const [packageName, setPackageName] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        // Reset fragment when project ID changes
        setSelectedFragment(null);
    }, [id]);

    useEffect(() => {
        // Only set default fragment if not manually selected or if current project doesn't match selected fragment
        if (project?.messages) {
            const fragments = [...project.messages].reverse().find(m => m.fragments)?.fragments;
            if (fragments && (!selectedFragment || !project.messages.some(m => m.fragments?.id === selectedFragment.id))) {
                setSelectedFragment(fragments);
            }
        }
    }, [project, selectedFragment]);

    useEffect(() => {
        if (selectedFragment) {
            setPreviewLoading(true);
            setPreviewError(false);
            const timeout = setTimeout(() => {
                setPreviewLoading(false);
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [selectedFragment]);

    const handleInstallPackage = async () => {
        if (!packageName || !packageName.trim()) return;
        setIsInstalling(true);
        try {
            const res = await installModule(id, packageName);
            if (res.exitCode === 0) {
                toast.success(`Successfully installed ${packageName}. Refreshing preview...`);
                setRefreshKey(prev => prev + 1);
                setPreviewLoading(true);
                setTimeout(() => setPreviewLoading(false), 2000);
            } else {
                toast.error(`Failed to install: ${res.stderr || "Unknown error"}`);
            }
        } catch (err) {
            toast.error(err.message || "Something went wrong during installation.");
        } finally {
            setIsInstalling(false);
            setPackageName("");
        }
    };

    if (isPending) {
        return (
            <div className="flex h-full w-full gap-4 p-4">
                <div className="flex-1 space-y-4">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-[400px] w-full" />
                </div>
                <div className="w-1/3 space-y-4">
                    <Skeleton className="h-full w-full" />
                </div>
            </div>
        )
    }

    if (error || !project) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <p className="text-destructive">Failed to load project. Please try again.</p>
            </div>
        )
    }

    return (
        <div className="h-[calc(100vh-64px)] w-full overflow-hidden">
            <ResizablePanelGroup direction='horizontal' className="h-full">
                <ResizablePanel
                    defaultSize={35}
                    minSize={20}
                    className='flex flex-col min-h-0 bg-background'>
                    <ProjectHeader projectId={id} />
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-6">
                            {project.messages?.map((message) => (
                                <div key={message.id} className={cn(
                                    "flex flex-col gap-2 max-w-[92%]",
                                    message.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                                )}>
                                    <div className={cn(
                                        "p-3 rounded-2xl text-sm leading-relaxed",
                                        message.role === 'user'
                                            ? "bg-primary text-primary-foreground rounded-tr-none"
                                            : "bg-muted text-muted-foreground rounded-tl-none border shadow-sm"
                                    )}>
                                        {message.content}
                                    </div>
                                    {message.fragments && (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className={cn(
                                                "mt-1 gap-2 text-xs h-7 px-3",
                                                selectedFragment?.id === message.fragments.id && "ring-2 ring-primary/20 bg-primary/10"
                                            )}
                                            onClick={() => setSelectedFragment(message.fragments)}
                                        >
                                            <FileCode className="size-3" />
                                            View Solution
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={65} minSize={40} className="bg-muted/10">
                    <Tabs defaultValue="preview" className="h-full flex flex-col">
                        <div className="flex items-center justify-between px-4 py-2 border-b bg-background">
                            <TabsList className="h-8">
                                <TabsTrigger value="preview" className="text-xs gap-2">
                                    <Globe className="size-3" />
                                    Preview
                                </TabsTrigger>
                                <TabsTrigger value="code" className="text-xs gap-2">
                                    <FileCode className="size-3" />
                                    Code
                                </TabsTrigger>
                            </TabsList>

                            {selectedFragment && (
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center bg-muted/50 rounded-md border p-1 translate-y-0.5">
                                        <input 
                                            type="text" 
                                            placeholder="module-name"
                                            className="bg-transparent border-none text-[10px] outline-none px-2 w-24 h-5 focus:ring-0"
                                            value={packageName}
                                            onKeyDown={(e) => {
                                                if(e.key === 'Enter') handleInstallPackage()
                                            }}
                                            onChange={(e) => setPackageName(e.target.value)}
                                        />
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-5 px-2 text-[10px] gap-1 opacity-60 hover:opacity-100"
                                            onClick={handleInstallPackage}
                                            disabled={isInstalling || !packageName}
                                        >
                                            {isInstalling ? (
                                                <div className="size-2.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Package className="size-2.5" />
                                            )}
                                            Install
                                        </Button>
                                    </div>
                                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                                        v1.0.0
                                    </span>
                                    <Button variant="ghost" size="icon" className="size-8" asChild>
                                        <a href={selectedFragment.sandboxUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="size-4" />
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </div>

                        <TabsContent value="preview" className="flex-1 m-0 relative overflow-hidden bg-white dark:bg-black">
                            {!selectedFragment ? (
                                <div className="flex flex-col h-full items-center justify-center text-muted-foreground gap-3">
                                    <Terminal className="size-10 opacity-20" />
                                    <p className="text-sm">Wait for the agent to generate a result...</p>
                                </div>
                            ) : (
                                <>
                                    {previewLoading && (
                                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm gap-4">
                                            <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                            <p className="text-sm font-medium animate-pulse text-muted-foreground">Booting sandbox server...</p>
                                        </div>
                                    )}
                                    {previewError ? (
                                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background p-6 text-center">
                                            <div className="p-4 rounded-full bg-destructive/10 text-destructive mb-4">
                                                <Terminal className="size-8" />
                                            </div>
                                            <h3 className="text-lg font-semibold mb-2">Connection Failed</h3>
                                            <p className="text-sm text-muted-foreground max-w-xs mb-6">
                                                The preview server timed out. This often happens if the build failed or took too long.
                                            </p>
                                            <Button
                                                onClick={() => {
                                                    setPreviewLoading(true);
                                                    setPreviewError(false);
                                                }}
                                                variant="outline"
                                                size="sm"
                                            >
                                                Try Connecting Again
                                            </Button>
                                        </div>
                                    ) : (
                                        <iframe
                                            key={refreshKey}
                                            src={selectedFragment.sandboxUrl}
                                            className="absolute inset-0 w-full h-full border-none"
                                            title="Sandbox Preview"
                                        />
                                    )}
                                </>
                            )}
                        </TabsContent>

                        <TabsContent value="code" className="flex-1 m-0 overflow-hidden">
                            {selectedFragment ? (
                                <CodeView files={selectedFragment.files} />
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-500 bg-[#1e1e1e]">
                                    No code generated yet.
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}

export default ProjectView
