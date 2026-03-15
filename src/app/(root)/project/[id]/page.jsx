import React from 'react'
import ProjectView from '@/modules/projects/components/project-view'

const Page = async ({ params }) => {
  const { id } = await params;
  return (
    <div className='flex flex-col h-[calc(100vh-80px)] w-full overflow-hidden'>
      <ProjectView id={id} />
    </div>
  )
}

export default Page
