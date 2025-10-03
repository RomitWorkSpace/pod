"use client"
import { useEffect, useState } from "react";
import ExportModal from "../export/ExportModal"
import { Download, Info, Redo2, Undo2 } from "lucide-react";
import NavToolbar from "./header/NavToolbar";
import { useTshirtStore } from "@/app/store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";



function Header() {

    const {canvas, showProperties, undo, redo, canRedo, canUndo} = useTshirtStore();
    const [showExportModal, setShowExportModal] = useState(false);

    const router = useRouter();

    const handleExport = () => {
        setShowExportModal(true);
    };

    function ToolbarRender(){
        return(<NavToolbar />)
    }

    useEffect(()=>{
        ToolbarRender()
    },[canvas]);

    const handlePreviewModal = () => {
      router.push('/preview');
    };
    

    return (
        <>
        <div className="shadow-md py-3 sticky top-0 left-0 z-10 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between">
                    <div className="flex">
                        <Button className={`border border-white rounded-sm bg-transparent hover:border-gray-300 `}
                            variant="outline"
                            onClick={undo}
                            disabled={!canUndo()}
                            ><Undo2 className="text-xl" />
                        </Button> 
                        <Button className={`border border-white rounded-sm bg-transparent hover:border-gray-300 `}
                            variant="outline"
                            onClick={redo}
                            disabled={!canRedo()}
                            ><Redo2 className="text-xl" />
                        </Button> 
                         <Info />
                    </div>


                    { showProperties && <ToolbarRender /> }


                    <div className="flex items-center">
                        <div className="flex border border-gray-700 rounded-sm">
                            <div className="inline-block px-4 py-1.5 bg-gray-700 font-semibold w-[100px] text-center text-white">Edit</div>
                            <div
                             onClick={()=>handlePreviewModal()}
                             className="inline-block px-4 py-1.5 w-[100px] font-semibold text-center">Preview</div>
                        </div>
                        <button
                            onClick={handleExport}
                            className="header-button ml-3 relative"
                            title="Export"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                    <ExportModal isOpen={showExportModal} onClose={setShowExportModal} />
                </div>
            </div>
        </div>
        </>
    )
}

export default Header
