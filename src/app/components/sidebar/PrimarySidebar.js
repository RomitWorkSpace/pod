import { MoveLeft } from "lucide-react"
import { sidebarTools } from "@/app/config/EditorConfig";

function PrimarySidebar({sidebarName, activeSidebar, closeSidebar}) {

    const activeItem = sidebarTools.find((item) => item.id === activeSidebar);

    return (
        <>
        <div className="absolute top-0 bottom-0 left-[96px] border z-8 bg-white">
            <div className="w-[300px] cursor-pointer" onClick={()=>closeSidebar(activeSidebar)}>
                <div className="p-4 flex gap-3 border-b border-gray-300"><MoveLeft />{sidebarName}</div>
            </div>
            <div className="">{activeItem?.panel()}</div>
        </div>
        </>
    )
}

export default PrimarySidebar
