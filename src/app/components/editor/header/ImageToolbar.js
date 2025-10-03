
import { Button } from "@/components/ui/button"

import { 
  Baseline, 
  Bold, 
  ChevronDown, 
  Copy, 
  Crop, 
  EllipsisVertical, 
  Expand, 
  FlipHorizontal, 
  FlipVertical, 
  ImagePlus, 
  Info, Italic, 
  Maximize2, 
  SplinePointer, 
  Trash2, 
  Underline } from "lucide-react"


function ImageToolbar({ flipImageHorizontally, flipImageVertically, fitImage, cropCanvasImage }) {
    return (
      <>
        <div className="tool-strip-wrapper">
          <div className="flex gap-3 items-center">
            
            <div className="inline-block px-4 py-1.5 rounded-sm border font-semibold">
              Position
            </div>

            

        <div className="p-1 border border-white hover:border-gray-300 rounded-sm" onClick={()=>flipImageVertically()}><FlipVertical /></div>

        <div className={`p-1 border border-white hover:border-gray-300 rounded-sm`} onClick={()=>flipImageHorizontally()}><FlipHorizontal /></div>
        <div className="p-1 border border-white hover:border-gray-300 rounded-sm" onClick={()=>fitImage()}><Expand /></div>

        <div className="flex gap-2 border-l border-r px-4">
            <div className=""><ImagePlus /></div>
            <div className="p-1 border border-white hover:border-gray-300 rounded-sm" onClick={()=>cropCanvasImage()}><Crop /></div>
        </div>

        <div className=""><Copy/></div>
        <div className=""><Trash2 /></div>
        <div className=""><EllipsisVertical /></div>

          </div>
        </div>

        
      </>
    );
}

export default ImageToolbar
