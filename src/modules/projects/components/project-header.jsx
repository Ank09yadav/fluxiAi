import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import {
    ChevronDown,
    LayoutDashboard,
    SunMoon,
    Trash,
    ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSubContent,
    DropdownMenuSub,
    DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu';
import { useGetProjectById } from '../hooks/project';

const ProjectHeader = ({ projectId }) => {
    const { data: project, isPending } = useGetProjectById(projectId);
    const { theme, setTheme } = useTheme();

    return (
        <header className='p-2 flex justify-between items-center border-b bg-background'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                        variant='ghost'
                        size='sm'
                        className='focus-visible:ring-0 hover:bg-transparent hover:opacity-75 transition-opacity px-2 gap-2'
                    >
                        <Image
                            src="/favicon.ico"
                            width={22}
                            height={22}
                            alt="Logo"
                            className='shrink-0 rounded-sm'
                        />
                        <span className='text-sm font-semibold truncate max-w-[150px]'>
                            {isPending ? "Loading..." : project?.title}
                        </span>
                        <ChevronDown className='w-4 h-4 text-muted-foreground' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side='bottom' align='start' className="w-56">
                    <DropdownMenuItem asChild>
                        <Link href="/" className="flex items-center gap-2 w-full cursor-pointer">
                            <LayoutDashboard className='size-4 text-muted-foreground'/>
                            <span>Go to Dashboard</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="gap-2">
                            <SunMoon className="size-4 text-muted-foreground" />
                            <span>Appearance</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent sideOffset={5}>
                                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                                    <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="text-destructive focus:text-destructive gap-2 cursor-pointer">
                        <Trash className='size-4' />
                        <span>Delete Project</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}

export default ProjectHeader