'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import TextareaAutosize from 'react-textarea-autosize';
import { ArrowUpIcon, Loader2Icon } from 'next/navigation'
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

const formSchema = z.object({
    content: z.string()
        .min(1, "Project descrition is required.")
        .max(1000, "Project descrition cannot be more than 1000 characters.")
})

const PROJECT_TEMPLATES = [
    {
        emoji: "🎬",
        title: "Build a Netflix clone",
        Prompt: "Build a Netflix_style homepage with a hero banner (use a nice, dark-mode compatible gradient here), movie sections responsive cards, and a modal for viewing details using mock data and local state. Use dark mode.",
    },
    {
        emoji: "🧩",
        title: "Build an admin dashboard",
        Prompt: "Build a Netflix_style homepage with a hero banner (use a nice, dark-mode compatible gradient here), movie sections responsive cards, and a modal for viewing details using mock data and local state. Use dark mode.",
    },
    {
        emoji: "🎬",
        title: "Build a Netflix clone",
        Prompt: "Build a Netflix_style homepage with a hero banner (use a nice, dark-mode compatible gradient here), movie sections responsive cards, and a modal for viewing details using mock data and local state. Use dark mode.",
    },
    {
        emoji: "🎬",
        title: "Build a Netflix clone",
        Prompt: "Build a Netflix_style homepage with a hero banner (use a nice, dark-mode compatible gradient here), movie sections responsive cards, and a modal for viewing details using mock data and local state. Use dark mode.",
    },
    {
        emoji: "🎬",
        title: "Build a Netflix clone",
        Prompt: "Build a Netflix_style homepage with a hero banner (use a nice, dark-mode compatible gradient here), movie sections responsive cards, and a modal for viewing details using mock data and local state. Use dark mode.",
    },
    {
        emoji: "🎬",
        title: "Build a Netflix clone",
        Prompt: "Build a Netflix_style homepage with a hero banner (use a nice, dark-mode compatible gradient here), movie sections responsive cards, and a modal for viewing details using mock data and local state. Use dark mode.",
    },


]

const ProjectForm = () => {
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter()
    const [isPending, setIsPending] = useState(false);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: ""
        }
    })
    const handleTemplete = (prompt) => {
        form.setValue("content", prompt)
    }
    const onSubmit = async (values) => {
        try {
            console.log(values);
        } catch (error) {

        }
    }
    return (
        <div className='space-y-8'>
            {/* Templete Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {PROJECT_TEMPLATES.map((template, index) => (
                    <button
                        key={index}
                        onClick={() => handleTemplete(template.Prompt)}
                        // disabled={isPending}
                        className='group relative p-4 rounded-xl border bg-card hover:bg-accent/50 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md hover:border-primary/30'>
                        <div className='flex flex-col gap-2'>
                            <span className='text-3xl' role='img' aria-label={template.title}>{template.emoji}</span>
                            <h3 className='text-sm font-medium group-hover:text-primary transition-colors'>{template.title}</h3>

                        </div>
                        <div className='absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none' />

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
                <form onSubmit={form.handleSubmit(onSubmit)} className={cn("realtive border p-4 pt-1 rounded-xl bg-sidebar dar:bg-sidebar transition-all",
                    isFocused && "shadow-lg ring-2 ring-primary/20"
                )}>
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <TextareaAutosize
                                {...field}
                                // disabled={isPending}

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
                        <div className='text-[10px] text-muted-foreground font-mono'>
                            <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground'>
                                <span>&#8984;</span>
                                <span>Enter</span>
                            </kbd>
                            &nbsp; to submit
                        </div>
                        {/* <Button className={cn("size-8 rounded-full")}
                    type='submit'
                    >
                        <ArrowUpIcon className='size-4'/>

                    </Button> */}
                    </div>
                </form>
            </Form>
        </div>
    )
}
export default ProjectForm