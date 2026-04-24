'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import TextareaAutosize from 'react-textarea-autosize';
import { ArrowUpIcon, Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { useRouter } from 'next/navigation'
import { useCreateProject, useGetProjects } from '@/modules/projects/hooks/project'
import { useUser, useClerk } from '@clerk/nextjs'

const formSchema = z.object({
    content: z.string()
        .min(1, "Project description is required.")
        .max(1000, "Project description cannot be more than 1000 characters.")
})

const PROJECT_TEMPLATES = [
    {
        emoji: "🎬",
        title: "Netflix Clone",
        Prompt: "Build a Netflix-style homepage with a hero banner, responsive movie rows, and a detail modal using local state. Apply a sleek dark-mode aesthetic with Lucide icons.",
    },
    {
        emoji: "📊",
        title: "SaaS Analytics Dashboard",
        Prompt: "Create a modern admin dashboard with a sidebar navigation, metric cards (Revenue, Users, Churn), and a line chart using Recharts. Use a clean 'Inter' font style.",
    },
    {
        emoji: "🛒",
        title: "E-commerce Storefront",
        Prompt: "Design a product listing page with category filters, a search bar, and a functional shopping cart drawer. Use high-quality mock product data.",
    },
    {
        emoji: "📝",
        title: "Kanban Task Manager",
        Prompt: "Build a Trello-like board with columns for 'To Do', 'In Progress', and 'Done'. Implement drag-and-drop functionality or simple move-to-column buttons.",
    },
    {
        emoji: "💬",
        title: "Real-time Chat App",
        Prompt: "Create a chat interface with a contact list on the left and a message window on the right. Include message bubbles, timestamps, and an emoji picker mockup.",
    },
    {
        emoji: "💰",
        title: "Crypto Portfolio Tracker",
        Prompt: "Build a financial tracker showing coin prices, a portfolio balance summary, and a transaction history table. Use green and red indicators for price changes.",
    },
]

const ProjectForm = () => {
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter()
    const { user } = useUser();
    const { openSignIn } = useClerk();
    const { mutateAsync, isPending } = useCreateProject();
    const { data: projects } = useGetProjects();

    const isPro = user?.publicMetadata?.isPro;
    const projectCount = projects?.length || 0;
    const projectsLeft = isPro ? "Unlimited" : Math.max(0, 4 - projectCount);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: ""
        },
        mode: "onChange"
    })
    const handleTemplate = (prompt) => {
        form.setValue("content", prompt)
    }
    const onSubmit = async (values) => {
        if (!user) {
            toast.error("Please sign in or sign up first to build your project.");
            openSignIn();
            return;
        }
        try {
            const res = await mutateAsync(values.content);
            router.push(`/project/${res.id}`)
            toast.success("Project created successfully");
            form.reset();
        } catch (error) {
            if (error.message === "LIMIT_REACHED") {
                toast.error("Free limit reached (4 projects). Upgrade to Pro to build more!", {
                    action: {
                        label: "Upgrade",
                        onClick: () => router.push("/pricing")
                    }
                });
            } else {
                toast.error("Failed to start project");
            }
        } finally {
            // No need to manually setIsPending(false) as it's managed by useMutation
        }
    }

    return (
        <div className='space-y-8'>
            {/* Template Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {PROJECT_TEMPLATES.map((template, index) => (
                    <button
                        key={index}
                        onClick={() => handleTemplate(template.Prompt)}
                        disabled={isPending}
                        className='relative p-4 rounded-xl border bg-card transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed'>
                        <div className='flex flex-col gap-2'>
                            <span className='text-3xl' role='img' aria-label={template.title}>{template.emoji}</span>
                            <h3 className='text-sm font-medium transition-colors'>{template.title}</h3>

                        </div>

                    </button>
                ))

                }

            </div>
            <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                    <span className='w-full border-t' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-background px-2 text-muted-foreground'>Or describe your own idea </span>
                </div>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={cn("relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
                    isFocused && "shadow-lg ring-2 ring-primary/20"
                )}>
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <TextareaAutosize
                                {...field}
                                disabled={isPending}

                                minRows={3}
                                maxRows={8}
                                className='pt-4 resize-none border-none w-full outline-none bg-transparent'
                                // isPending && "opacity-50"
                                placeholder='Describe what you want to create..'
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                                        e.preventDefault();
                                        form.handleSubmit(onSubmit)();
                                    }
                                }}
                            />

                        )}
                    />
                    <div className='flex gap-x-2 items-end justify-between pt-2'>
                        <div className='flex items-center gap-4 text-[10px] text-muted-foreground font-mono'>
                            <div>
                                <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground'>
                                    <span>&#8984;</span>
                                    <span>Enter</span>
                                </kbd>
                                &nbsp; to submit
                            </div>
                            {user && (
                                <div className="flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                                    {isPro ? "Unlimited projects" : `${projectsLeft} project${projectsLeft !== 1 ? 's' : ''} left`}
                                </div>
                            )}
                        </div>
                        <Button className={cn("size-8 rounded-full")}
                            type='submit'
                            disabled={isPending}
                        >
                            <ArrowUpIcon className='size-4' />

                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
export default ProjectForm