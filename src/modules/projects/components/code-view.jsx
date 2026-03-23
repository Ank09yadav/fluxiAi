'use client'
import React, { useState } from 'react'
import { File } from 'lucide-react'
import { cn } from '@/lib/utils'

const CodeView = ({ files }) => {
  const filePaths = Object.keys(files || {});
  const [selectedFile, setSelectedFile] = useState(filePaths[0] || null);

  if (!filePaths.length) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">No code generated yet.</div>
  }

  return (
    <div className="flex h-full w-full bg-[#1e1e1e] text-white">
      {/* Sidebar for Files */}
      <div className="w-64 border-r border-white/10 flex flex-col">
        <div className="p-3 border-b border-white/10">
          <h3 className="text-[10px] font-semibold text-white/50 uppercase tracking-widest">Files</h3>
        </div>
        <div className="flex-1 overflow-auto py-2">
          {filePaths.map((path) => (
            <button
              key={path}
              onClick={() => setSelectedFile(path)}
              className={cn(
                "w-full text-left px-4 py-1.5 flex items-center gap-2 group transition-colors",
                selectedFile === path ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70 hover:bg-white/5"
              )}
            >
              <File className={cn("size-3.5", selectedFile === path ? "text-blue-400" : "text-white/20")} />
              <span className="text-xs font-mono truncate">{path}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Code Display */}
      <div className="flex-1 flex flex-col bg-[#0d0d0d]">
        <div className="px-6 py-2 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Editing:</span>
            <span className="text-xs font-mono text-white/80">{selectedFile}</span>
          </div>
          <button 
            onClick={() => navigator.clipboard.writeText(files[selectedFile])}
            className="text-[10px] text-white/40 hover:text-white hover:underline uppercase tracking-wide px-2 py-1"
          >
            Copy
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <pre className="font-mono text-sm inline-block min-w-full leading-relaxed">
            <code>{files[selectedFile]}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

export default CodeView
