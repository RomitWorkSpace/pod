import React, { useState } from 'react'
import { sidebarTools } from '@/app/config/EditorConfig';
import PrimarySidebar from '../sidebar/PrimarySidebar'

function EditorToolBar() {

    const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
    const [activeSidebar, setActiveSidebar] = useState(null);
    const [sidebarLabel, setSidebarLabel] = useState(null);

    const handleSidebar = (id, label)=>{
        if(activeSidebar === id && !isPanelCollapsed) return
        setActiveSidebar(id)
        setIsPanelCollapsed(true)
        setSidebarLabel(label)
    }

    const closeSidebar = (activeSidebar)=>{
        if(!activeSidebar && isPanelCollapsed) return
        setIsPanelCollapsed(false)
        setActiveSidebar(null)
        setSidebarLabel(null)
    }

    return (
        <>
        <div className='toolbar-wrapper p-2 flex flex-col gap-3 border border-gray-300 h-screen bg-white'>
            {
                sidebarTools.map((tool, index)=>(
                    <div key={index} className={`p-3 rounded-sm text-center ${activeSidebar === tool.id ? 'bg-purple-100' : 'hover:bg-gray-100'}`}
                    onClick={()=>handleSidebar(tool.id, tool.label)}
                    >
                        <div className='inline-block mx-auto'>{tool.icon}</div>
                        <p className='text-xs'>{tool.label}</p>
                    </div>
                ))
            }
        </div>
        {isPanelCollapsed && <PrimarySidebar 
            sidebarName={sidebarLabel} 
            activeSidebar={activeSidebar} 
            closeSidebar={closeSidebar} 
        />}
        </>
    )
}

export default EditorToolBar
