
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fontFamilies } from "@/app/config/EditorConfig";

import { 
  Baseline, 
  Bold, 
  ChevronDown, 
  Copy, EllipsisVertical, 
  Highlighter, 
  Info, Italic, Menu, PaintBucket, SplinePointer, Trash2, Underline } from "lucide-react";
import { Input } from "@/components/ui/input";


function TextToolstrip({
  textFont,
  textcolor, 
  bgColor,
  textFontSize,
  changeFontFamily, 
  textFontWeight, 
  changeFontWeight, 
  textItalic, 
  handleTextItalic,
  textUnderline,
  handleTextUnderline,
  changeFontSize,
  changeTextColor,
  changeBackgroundColor}) {

    return (
      <>
        <div className="tool-strip-wrapper">
          <div className="flex gap-3 items-center">
            <div className="inline-block px-4 py-1.5 rounded-sm border font-semibold">
              Position
            </div>

            <div className="space-y-2">
              {console.log(textFont)}
              <Select value={textFont} onValueChange={changeFontFamily}>
                <SelectTrigger id="font-family" className={"h-10"}>
                  <SelectValue placeholder={textFont}/>
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((fontItem) => (
                    <SelectItem
                      key={fontItem}
                      value={fontItem}
                      style={{ fontFamily: fontItem }}
                    >
                      {fontItem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="">
              <Input
                id="font-size"
                value={textFontSize}
                onChange={(e) => changeFontSize(e)}
                className={"w-16 h-9 text-xs"}
                type={"number"}
              />
            </div>

            <div className={`px-3 py-1 rounded-sm cursor-pointer ${textFontWeight === "bold" ? 'bg-gray-200':'' }`}
            onClick={()=>changeFontWeight()}
            >
              <Bold />
            </div>

            <div className={`px-2 py-1 rounded-sm cursor-pointer ${textItalic === "italic" ? 'bg-gray-200':''}`}
            onClick={()=>handleTextItalic()}
            >
              <Italic />
            </div>

            <div className={`px-2 py-1 rounded-sm cursor-pointer ${textUnderline ? 'bg-gray-200':''}`}
            onClick={()=>handleTextUnderline()}
            >
              <Underline />
            </div>


              <div className="relative p-1 border-l pl-3">
                  
                  <div
                    className="absolute inset-0"
                  />
                  <Baseline className="" style={{ color: textcolor }} />
                  <Input
                    id="text-color"
                    type="color"
                    value={textcolor}
                    onChange={changeTextColor}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
            </div>

            <div className="relative p-1">
                  
                  <div
                    className="absolute inset-0"
                  />
                  <Highlighter className="" style={{ color: bgColor }} />
                  <Input
                    id="text-color"
                    type="color"
                    value={bgColor}
                    onChange={changeBackgroundColor}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
            </div>
              
            <div className="p-1 pr-3 border-r"><SplinePointer/></div>


            <div className="">
              <Copy />
            </div>
            <div className="">
              <Trash2 />
            </div>
            <div className="">
              <EllipsisVertical />
            </div>
          </div>
        </div>
      </>
    );
}

export default TextToolstrip
