"use client"

import React, { useEffect, useState } from 'react';
import DraggableRow from './DraggableRow';
import { useTshirtStore } from '@/app/store';
import { ArrowDownToLine, ArrowLeftToLine, ArrowRightToLine, ArrowUpToLine, FoldHorizontal, FoldVertical, GripVertical, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Textarea } from "@/components/ui/textarea";

const DraggableList = ({ handleCurvedText, updateCurvedText, curvedStatus, selectedObject, curvePercent, curveRadius, updateCurveRadius, updateCurvePercent, text, handleTextChange, width, height }) => {

  const { 
    canvas, 
    alignLeft, 
    alignCenter, 
    alignRight,
    alignTop, alignMiddle, alignBottom } = useTshirtStore()

  const [items, setItems] = useState([]);

  useEffect(()=>{
    const canvasObject = canvas.getObjects();
    setItems(canvasObject.reverse())
  },[canvas])

  const handleDragStart = (index) => {
    // console.log('Drag started:', index);
  };

  const handleDragOver = (index) => {
    // console.log('Drag over:', index);
  };

  const handleDrop = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    fromIndex = items.length - fromIndex -1;
    toIndex = items.length - toIndex -1;
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    
    setItems(newItems);
    canvas.moveObjectTo(selectedObject, toIndex)
    canvas.renderAll();
    console.log(`Moved item from ${fromIndex} to ${toIndex}`);
  };

  const handleDragEnd = (index) => {
    // console.log('Drag ended:', index);
  };

  const handleSelectedRow = (selectedItem)=>{
    canvas.setActiveObject(selectedItem)
    canvas.renderAll()
  }

  const removeCanvasObject = (obj)=>{
    if(!canvas){ return }
    const activeObj = canvas.getActiveObject();
    if(activeObj.id === obj.id){
      canvas.discardActiveObject();
      canvas.renderAll();
    }
    canvas.remove(obj);
    canvas.renderAll();
  }


  useEffect(()=>{
    if(!canvas) return
    try {
          canvas.getObjects().forEach((obj, index) => {
            if (!obj.id || typeof obj.id !== "string") {
              try {
                if (Object.isExtensible(obj)) {
                  obj.id = Date.now()+index
                }
              } catch (e) {
                console.warn("[v0] Could not assign ID to restored object:", e)
              }
            }
          })

          canvas.renderAll()

        } catch (e) {
          console.warn("[v0] Error during undo object processing:", e)
        }

  },[canvas])


  

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-md text-gray-800 font-semibold py-4">
        Layer Position
      </div>
      <div className="space-y-2">
        {items &&
          items.map((item, index) => (
            <DraggableRow
              key={index}
              index={index}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              className={`p-3 border rounded-sm shadow-sm hover:shadow-md transition-shadow ${
                selectedObject.id === item.id
                  ? "border-gray-500 bg-purple-50"
                  : "border-gray-200"
              }`}
            >
              <div
                className="flex items-center justify-between"
                onClick={() => handleSelectedRow(item)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Element {item.type}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div
                    className="p-1 border border-white cursor-pointer hover:border-gray-300 rounded-sm"
                    onClick={() => removeCanvasObject(item)}
                  >
                    <Trash2 className="text-gray-600" />
                  </div>
                  <GripVertical className="text-gray-600 cursor-grab active:cursor-grabbing" />
                </div>
              </div>
              <div
                className={`alignment-section mt-5 ${
                  selectedObject.id === item.id ? "block" : "hidden"
                }`}
              >
                {item.type == "i-text" ? (
                  <div className="">
                    <div className="space-y-2">
                      <Label className={"text-xs"} htmlFor="text-content">
                        Text Content
                      </Label>
                      <Textarea
                        id="text-content"
                        value={text}
                        onChange={handleTextChange}
                        className={"h-20 resize-none bg-white"}
                      />
                    </div>

                    <div className="pb-5">
                      <div className="flex justify-between items-center">
                        <p className="">Curved Text</p>
                        <Switch
                          
                          onClick={() => handleCurvedText()}
                        />
                      </div>
                    </div>
                    {curvedStatus ? (
                      <div className="text-curve-panel pb-3">
                        <div className="flex flex-col gap-2 pb-4">
                          <Label htmlFor="curve-radius">Radius</Label>
                          <Slider
                            className="outline"
                            id="curve-radius"
                            value={[curveRadius]}
                            min={30}
                            max={500}
                            step={1}
                            onValueChange={(v) => {
                              const r = v[0];
                              updateCurveRadius(r);
                              if (curvedStatus) {
                                updateCurvedText({ radius: r });
                              }
                            }}
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label htmlFor="curve-percent">
                            Curve: {curvePercent}%
                          </Label>
                          <Slider
                            className="outline"
                            id="curve-percent"
                            value={[curvePercent]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(v) => {
                              const p = v[0];
                              updateCurvePercent(p);
                              if (curvedStatus) {
                                updateCurvedText({ percent: p });
                              }
                            }}
                          />
                          <p className="text-xs text-muted-foreground">
                            0% is almost straight; 100% forms a full circle
                            around the radius.
                          </p>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}

                {/* Width & Height */}
                <div className="pb-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Width</Label>
                      <div className="h-9 px-3 py-2 border bg-white hover:bg-gray-100 rounded-md flex items-center">
                        {width}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label>height</Label>
                      <div className="h-9 px-3 py-2 border bg-white hover:bg-gray-100 rounded-md flex items-center">
                        {height}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="flex horizontal border border-gray-300 rounded-xs text-gray-700">
                    <div
                      className="p-2 bg-white hover:bg-gray-100"
                      onClick={alignLeft}
                    >
                      <ArrowLeftToLine />
                    </div>
                    <div
                      className="p-2 bg-white border-x hover:bg-gray-100"
                      onClick={alignCenter}
                    >
                      <FoldHorizontal />
                    </div>
                    <div
                      className="p-2 bg-white hover:bg-gray-100"
                      onClick={alignRight}
                    >
                      <ArrowRightToLine />
                    </div>
                  </div>
                  <div className="flex horizontal border border-gray-300 rounded-xs text-gray-700">
                    <div
                      className="p-2 bg-white hover:bg-gray-100"
                      onClick={alignTop}
                    >
                      <ArrowUpToLine />
                    </div>
                    <div
                      className="p-2 border-x bg-white hover:bg-gray-100"
                      onClick={alignMiddle}
                    >
                      <FoldVertical />
                    </div>
                    <div
                      className="p-2 bg-white hover:bg-gray-100"
                      onClick={alignBottom}
                    >
                      <ArrowDownToLine />
                    </div>
                  </div>
                </div>
              </div>
            </DraggableRow>
          ))}
      </div>
    </div>
  );
};

export default DraggableList;


// Assuming 'canvas' is your Fabric.js canvas instance and 'myObject' is a Fabric.js object

// Bring 'myObject' to the very front
// canvas.bringToFront(myObject);

// Send 'myObject' to the very back
// canvas.sendToBack(myObject);

// Bring 'myObject' one step forward
// canvas.bringForward(myObject);

// Send 'myObject' one step backward
// canvas.sendBackwards(myObject);

// Move 'myObject' to a specific index (e.g., index 2)
// canvas.moveTo(myObject, 2);