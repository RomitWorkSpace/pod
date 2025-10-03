
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Baseline, Bold, ChevronDown, Copy, EllipsisVertical, Frame, Info, Italic, SplinePointer, Trash2, Underline } from "lucide-react"


function ShapeToolbar({
  changeBorderStyle, 
  shapeBorderStyle, 
  changeFillColor, 
  bgColor, changeBorderColor, 
  shapeBorderColor,
  duplicateObject,
  deleteObject}) {
    return (
      <>
        <div className="tool-strip-wrapper">
          <div className="flex gap-3 items-center">
            
            <div className="inline-block px-4 py-1.5 rounded-sm border font-semibold">
              Position
            </div>

            <div className="">
              <Select
                value={shapeBorderStyle}
                onValueChange={changeBorderStyle}
              >
                <SelectTrigger id="border-style" className={"h-10"}>
                  <SelectValue placeholder="Select Border Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                </SelectContent>
              </Select>
            </div>
           

        <div className="p-1 border cursor-pointer border-white rounded-sm hover:border-gray-300">
          <div className="relative w-7 h-7 overflow-hidden rounded-md border">
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: bgColor }}
                  />
                  <Input
                    id="text-color"
                    type="color"
                    value={bgColor}
                    onChange={changeFillColor}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
            </div>
        </div>


        <div className="relative p-1 border cursor-pointer border-white rounded-sm hover:border-gray-300">
                  
                  <div
                    className="absolute inset-0"
                  />
                  <Frame className="" style={{ color: shapeBorderColor }} />
                  <Input
                    id="text-color"
                    type="color"
                    value={shapeBorderColor}
                    onChange={changeBorderColor}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
            </div>

        <div className="p-1 border cursor-pointer border-white rounded-sm hover:border-gray-300" onClick={()=>duplicateObject()}><Copy/></div>
        <div className="p-1 border cursor-pointer border-white rounded-sm hover:border-gray-300" onClick={()=>deleteObject()}><Trash2 /></div>
        <div className=""><EllipsisVertical /></div>

          </div>
        </div>

        
      </>
    );
}

export default ShapeToolbar
