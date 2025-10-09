"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fontFamilies } from "@/app/config/EditorConfig";
import {
  cloneSelectedObject,
  deletedSelectedObject,
  handleAddCurvedText,
  maybeLiveUpdateSelected,
} from "@/fabric/fabric-utils";
import { useTshirtStore } from "@/app/store";
import {
  Bold,
  Copy,
  FlipHorizontal,
  FlipVertical,
  Italic,
  MoveDown,
  MoveLeft,
  MoveUp,
  Trash,
  Underline,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import SelectedVarients from "./selected-varients";
import VariantSidebar from "./variant-sidebar";
import DraggableList from "./DraggableList";

//all states one by one -> reason for tutorial ->

function Properties() {
  const { canvasReference ,canvas, markAsModified, isImageCropActive } = useTshirtStore();

  // Variant Sidebar
  const [variantSidebar, setVariantSidebar] = useState(false);

  //active object
  const [selectedObject, setSelectedObject] = useState(null);
  const [objectType, setObjectType] = useState("");
  const [curveRadius, setCurveRadius] = useState(100)
  const [curvePercent, setCurvePercent] = useState(50)
  const [selectedIsCurved, setSelectedIsCurved] = useState(false)
  const [textValue, setTextValue] = useState("Curved Text")

  //common
  const [opacity, setOpacity] = useState(100);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  //text
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontStyle, setFontStyle] = useState("normal");
  const [underline, setUnderline] = useState(false);
  const [textColor, setTextColor] = useState("#000000");
  const [textBackgroundColor, setTextBackgroundColor] = useState("");
  const [letterSpacing, setLetterSpacing] = useState(0);

  const [fillColor, setFillColor] = useState("#ffffff");
  const [borderColor, setBorderColor] = useState("#000000");
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderStyle, setBorderStyle] = useState("solid");

  const [filter, setFilter] = useState("none");
  const [blur, setBlur] = useState(0);

  useEffect(() => {
    if (!canvas) return;
    
const syncSelectionFromCanvas = () => {
  const obj = canvas.getActiveObject();
  if (obj && obj.type === "group" && obj.data && obj.data.curvedText) {
    const data = obj.data.curvedText;
    setTextValue(data.text);
    setCurveRadius(data.radius);
    setCurvePercent(data.percent);
    setFontSize(data.fontSize);
    setSelectedIsCurved(true);
  } else {
    setSelectedIsCurved(false);
  }
};

    const handleSelectionCreated = () => {
      const activeObject = canvas.getActiveObject();

      syncSelectionFromCanvas();
      if (activeObject) {

        setSelectedObject(activeObject);
        //update common properties
        setOpacity(Math.round(activeObject.opacity * 100) || 100);
        setWidth(Math.round(activeObject.width * activeObject.scaleX));
        setHeight(Math.round(activeObject.height * activeObject.scaleY));
        setBorderColor(activeObject.stroke || "#000000");
        setBorderWidth(activeObject.strokeWidth || 0);

        //check based on type
        if (activeObject.type === "i-text") {
          setObjectType("text");

          setText(activeObject.text || "");
          setFontSize(activeObject.fontSize || 24);
          setFontFamily(activeObject.fontFamily || "Arial");
          setFontWeight(activeObject.fontWeight || "normal");
          setFontStyle(activeObject.fontStyle || "normal");
          setUnderline(activeObject.underline || false);
          setTextColor(activeObject.fill || "#000000");
          setTextBackgroundColor(activeObject.backgroundColor || "");
          setLetterSpacing(activeObject.charSpacing || 0);
        }
        else if(activeObject.type === "group"){
          setObjectType("group");
        }
        else if (activeObject.type === "image") {
          setObjectType("image");

          if (activeObject.filters && activeObject.filters.length > 0) {
            const filterObj = activeObject.filters[0];
            if (filterObj.type === "Grayscale") setFilter("grayscale");
            else if (filterObj.type === "Sepia") setFilter("sepia");
            else if (filterObj.type === "Invert") setFilter("invert");
            else if (filterObj.type === "Blur") {
              setFilter("blur");
              setBlur(filterObj.blur * 100 || 0);
            } else setFilter("none");
          }

          if (activeObject.strokeDashArray) {
            if (
              activeObject.strokeDashArray[0] === 5 &&
              activeObject.strokeDashArray[1] === 5
            ) {
              setBorderStyle("dashed");
            } else if (
              activeObject.strokeDashArray[0] === 2 &&
              activeObject.strokeDashArray[1] === 2
            ) {
              setBorderStyle("dotted");
            } else {
              setBorderStyle("solid");
            }
          }
        } else if (activeObject.type === "path") {
          setObjectType("path");

          if (activeObject.strokeDashArray) {
            if (
              activeObject.strokeDashArray[0] === 5 &&
              activeObject.strokeDashArray[1] === 5
            ) {
              setBorderStyle("dashed");
            } else if (
              activeObject.strokeDashArray[0] === 2 &&
              activeObject.strokeDashArray[1] === 2
            ) {
              setBorderStyle("dotted");
            } else {
              setBorderStyle("solid");
            }
          }
        } else {
          setObjectType("shape");

          if (activeObject.fill && typeof activeObject.fill === "string") {
            setFillColor(activeObject.fill);
          }

          if (activeObject.strokeDashArray) {
            if (
              activeObject.strokeDashArray[0] === 5 &&
              activeObject.strokeDashArray[1] === 5
            ) {
              setBorderStyle("dashed");
            } else if (
              activeObject.strokeDashArray[0] === 2 &&
              activeObject.strokeDashArray[1] === 2
            ) {
              setBorderStyle("dotted");
            } else {
              setBorderStyle("solid");
            }
          }
        }
      }
    };

    const handleSelectionCleared = () => {
      setSelectedIsCurved(false);
    };

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      handleSelectionCreated();
    }


    canvas.on("selection:created", handleSelectionCreated);
    canvas.on("selection:updated", handleSelectionCreated);
    canvas.on("object:modified", handleSelectionCreated);
    canvas.on("selection:cleared", handleSelectionCleared);

    return () => {
      canvas.off("selection:created", handleSelectionCreated);
      canvas.off("selection:updated", handleSelectionCreated);
      canvas.off("object:modified", handleSelectionCreated);
      canvas.off("selection:cleared", handleSelectionCleared);
    };
  }, [canvas]);


  const updateObjectProperty = (property, value) => {
    if (!canvas || !selectedObject) return;

    selectedObject.set(property, value);
    canvas.renderAll();
    markAsModified();
  };

  //opacity
  const handleOpacityChange = (value) => {
    const newValue = Number(value[0]);
    setOpacity(newValue);
    updateObjectProperty("opacity", newValue / 100);
  };

  //duplicate
  const handleDuplicate = async () => {
    if (!canvas || !selectedObject) return;
    await cloneSelectedObject(canvas);
    markAsModified();
  };

  //delete
  const handleDelete = () => {
    if (!canvas || !selectedObject) return;
    deletedSelectedObject(canvas);
    markAsModified();
  };

  //arrangements
  const handleBringToFront = () => {
    if (!canvas || !selectedObject) return;
    canvas.bringObjectToFront(selectedObject);
    canvas.renderAll();
    markAsModified();
  };

  const handleSendToBack = () => {
    if (!canvas || !selectedObject) return;
    canvas.sendObjectToBack(selectedObject);
    canvas.renderAll();
    markAsModified();
  };

  //Flip H and Flip V

  const handleFlipHorizontal = () => {
    if (!canvas || !selectedObject) return;
    const flipX = !selectedObject.flipX;
    updateObjectProperty("flipX", flipX);
  };

  const handleFlipVertical = () => {
    if (!canvas || !selectedObject) return;
    const flipY = !selectedObject.flipY;
    updateObjectProperty("flipY", flipY);
  };

  const handleTextChange = (event) => {
    const newText = event.target.value;
    setText(newText);
    updateObjectProperty("text", newText);
  };

  const handleFontSizeChange = async (e) => {
    const newSize = Number(e.target.value);
    setFontSize(newSize);
    // if(selectedObject.type === "group"){
    //   await maybeLiveUpdateSelected(canvas, {fontSize: newSize})
    // }
      // updateObjectProperty("fontSize", newSize);
  };

  const handleFontFamilyChange = (value) => {
    setFontFamily(value);
    updateObjectProperty("fontFamily", value);
  };

  const handleToggleBold = () => {
    const newWeight = fontWeight === "bold" ? "normal" : "bold";
    setFontWeight(newWeight);
    updateObjectProperty("fontWeight", newWeight);
  };

  const handleToggleItalic = () => {
    const newStyle = fontStyle === "italic" ? "normal" : "italic";
    setFontStyle(newStyle);
    updateObjectProperty("fontStyle", newStyle);
  };

  const handleToggleUnderline = () => {
    const newUnderline = !underline;
    setUnderline(newUnderline);
    updateObjectProperty("underline", newUnderline);
  };

  const handleToggleTextColorChange = (e) => {
    const newTextColor = e.target.value;
    setTextColor(newTextColor);
    updateObjectProperty("fill", newTextColor);
  };

  const handleToggleTextBackgroundColorChange = (e) => {
    const newTextBgColor = e.target.value;
    setTextBackgroundColor(newTextBgColor);
    updateObjectProperty("backgroundColor", newTextBgColor);
  };

  const handleLetterSpacingChange = (value) => {
    const newSpacing = value[0];
    setLetterSpacing(newSpacing);
    updateObjectProperty("charSpacing", newSpacing);
  };

  const handleFillColorChange = (event) => {
    const newFillColor = event.target.value;
    setFillColor(newFillColor);
    updateObjectProperty("fill", newFillColor);
  };

  const handleBorderColorChange = (event) => {
    const newBorderColor = event.target.value;
    setBorderColor(newBorderColor);
    updateObjectProperty("stroke", newBorderColor);
  };

  const handleBorderWidthChange = (value) => {
    const newBorderWidth = value[0];
    setBorderWidth(newBorderWidth);
    updateObjectProperty("strokeWidth", newBorderWidth);
  };

  const handleBorderStyleChange = (value) => {
    setBorderStyle(value);

    let strokeDashArray = null;

    if (value === "dashed") {
      strokeDashArray = [5, 5];
    } else if (value === "dotted") {
      strokeDashArray = [2, 2];
    }

    updateObjectProperty("strokeDashArray", strokeDashArray);
  };

  const handleImageFilterChange = async (value) => {
    setFilter(value);

    if (!canvas || !selectedObject || selectedObject.type !== "image") return;
    try {
      canvas.discardActiveObject();

      const { filters } = await import("fabric");

      selectedObject.filters = [];

      switch (value) {
        case "grayscale":
          selectedObject.filters.push(new filters.Grayscale());

          break;
        case "sepia":
          selectedObject.filters.push(new filters.Sepia());

          break;
        case "invert":
          selectedObject.filters.push(new filters.Invert());

          break;
        case "blur":
          selectedObject.filters.push(new filters.Blur({ blur: blur / 100 }));

          break;
        case "none":
        default:
          break;
      }

      selectedObject.applyFilters();

      canvas.setActiveObject(selectedObject);
      canvas.renderAll();
      markAsModified();
    } catch (e) {
      console.error("Failed to apply filters");
    }
  };

  const handleBlurChange = async (value) => {
    const newBlurValue = value[0];
    setBlur(newBlurValue);

    if (
      !canvas ||
      !selectedObject ||
      selectedObject.type !== "image" ||
      filter !== "blur"
    )
      return;

    try {
      const { filters } = await import("fabric");

      selectedObject.filters = [new filters.Blur({ blur: newBlurValue / 100 })];
      selectedObject.applyFilters();
      canvas.renderAll();
      markAsModified();
    } catch (error) {
      console.error("Error while applying blur !", e);
    }
  };


  const handleSeletion = ()=>{
    if(canvas){
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  }



  // -------------- Curved Text ------------

  // async function buildCurvedTextGroup(opts) {
  //     const {
  //       text,
  //       center,
  //       radius,
  //       percent,
  //       fontsize,
  //       fontfamily,
  //       textcolor,
  //     } = opts

  //     const { IText, Group } = await import("fabric");
  
  //     const chars = Array.from(text)
  //     const n = chars.length || 1
  //     const totalAngle = (2 * Math.PI * Math.max(0, Math.min(100, percent))) / 100
  //     // Use equal spacing across the arc. For 100% we distribute across full circle.
  //     const step = totalAngle / n
  //     const orientation = "up" === "up" ? 1 : -1
  //     // Start so text is centered; distribute around center by going negative half span
  //     const startAngle = -totalAngle / 2
  
  //     const charObjects = chars.map((ch, i) => {
  //       const angle = startAngle + step * (i + 0.5) // center each glyph within its segment
  //       const x = radius * Math.cos(angle)
  //       const y = orientation * radius * Math.sin(angle)
  //       const angleDeg = (angle * 180) / Math.PI + (orientation === 1 ? 90 : -90)
  
  //       return new IText(ch, {
  //         left: x,
  //         top: y,
  //         angle: angleDeg,
  //         originX: "center",
  //         originY: "center",
  //         fontsize,
  //         fontfamily,
  //         textcolor,
  //         selectable: false, // group handles selection
  //         evented: false,
  //       })
  //     })
  
  //     const group = new Group(charObjects, {
  //       left: center.x,
  //       top: center.y,
  //       originX: "center",
  //       originY: "center",
  //       subTargetCheck: false,
  //       selectable: true,
  //       hasControls: true,
  //       objectCaching: false,
  //     })
  
  //     group.data = {
  //       curvedText: {
  //         text,
  //         radius,
  //         percent,
  //         fontsize,
  //         fontfamily,
  //         textcolor,
  //       },
  //     }
  
  //     return group
  //   }

    
  //   async function updateCurvedTextGroup(group, props,) 
  //     {
  //       if (!canvas) return
    
  //       const data = (group.data?.curvedText || {
  //         text: textValue,
  //         radius: curveRadius,
  //         percent: curvePercent,
  //         fontsize: fontSize,
  //         fontfamily: fontFamily,
  //         textcolor: textColor,
  //       })
    
  //       const next = {
  //         text: props?.text ?? data.text,
  //         radius: props?.radius ?? data.radius,
  //         percent: props?.percent ?? data.percent,
  //         fontsize: props?.fontsize ?? data.fontsize,
  //         fontfamily: props?.fontfamily ?? data.fontfamily,
  //         textcolor: props?.textcolor ?? data.textcolor,
  //       }

  //       const { Point } = await import("fabric");
    
  //       const { left = 0, top = 0, angle = 0, scaleX = 1, scaleY = 1, skewX = 0, skewY = 0 } = group
  //       const newGroup = await buildCurvedTextGroup({
  //         text: next.text,
  //         center: new Point(left, top),
  //         radius: Math.max(5, next.radius),
  //         percent: Math.max(0, Math.min(100, next.percent)),
  //       })
    
  //       // preserve transforms
  //       newGroup.set({ angle, scaleX, scaleY, skewX, skewY })
    
  //       canvas.remove(group)
  //       canvas.add(newGroup)
  //       canvas.setActiveObject(newGroup)
  //       canvas.requestRenderAll()
  //     }

  //   const handleAddCurvedText = async () => {
  //       if (!canvas) return
  //       try{
  //         const { Point } = await import("fabric");
  //       const center = canvas.getCenter()
  //       const group = await buildCurvedTextGroup({
  //         text: textValue,
  //         center: new Point(center.left, center.top),
  //         radius: Math.max(5, curveRadius),
  //         percent: Math.max(0, Math.min(100, curvePercent)),
  //         fontsize: fontSize,
  //         fontfamily: fontFamily,
  //         textcolor: textColor,
  //       })
  //       canvas.add(group)
  //       canvas.setActiveObject(group)
  //       canvas.requestRenderAll()
  //       }catch(error){
  //         console.error("Group not created", error);
  //       }
  //     }
    
  //     const handleApplyToSelection = () => {
  //       if (!canvas) return
  //       const obj = canvas.getActiveObject()
  //       if (obj && obj.type === "group" && obj.data && obj.data.curvedText) {
  //         updateCurvedTextGroup(obj, {
  //           text: textValue,
  //           radius: curveRadius,
  //           percent: curvePercent,
  //         })
  //       }
  //     }

  // const maybeLiveUpdateSelected = async (
  //   partial,
  // ) => {
  //   if (!canvas) return
  //   const obj = canvas.getActiveObject()
  //   if (obj && obj.type === "group" && obj.data && obj.data.curvedText) {
  //     await updateCurvedTextGroup(obj, partial)
  //   }
  // }


  // function DraggablePanel(){
  //   return( 
  //   <DraggableList 
  //     selectedObject={selectedObject} 
  //     handleCurvedText={handleAddCurvedText} 
  //     updateCurvedText={maybeLiveUpdateSelected} 
  //     curvedStatus={selectedIsCurved}
  //     curveRadius={curveRadius}
  //     curvePercent={curvePercent}
  //     updateCurveRadius={setCurveRadius}
  //     updateCurvePercent={setCurvePercent}
  //     text={text} 
  //     handleTextChange={handleTextChange} 
  //     width={width} height={height} 
  //   /> 
  // )
  // }

  // useEffect(()=>{
  //   DraggablePanel()
  // },[selectedObject, canvas])


  return (
    <>
      {variantSidebar ? (
        <VariantSidebar showVariants={setVariantSidebar} />
      ) : (
        <div className="fixed right-0 top-[65px] bottom-[0px] w-[340px] bg-white border-l border-gray-200 z-50">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="w-full flex items-center justify-between">
              <div className="">
                <span className="font-medium">Properties</span>
              </div>
              <div
                className="float-right text-gray-600 rounded-xs hover:border"
                onClick={() => handleSeletion()}
              >
                <X />
              </div>
            </div>
          </div>
          <div className="h-[calc(100%-96px)] overflow-auto p-4 space-y-6">
            <SelectedVarients
              showVariants={setVariantSidebar}
              variantChanged={variantSidebar}
            />

            {/* Opacity */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="opacity" className={"text-xs"}>
                  Opacity
                </Label>
                <span>{opacity}%</span>
              </div>
              <Slider
                id="opacity"
                min={0}
                max={100}
                step={1}
                value={[opacity]}
                onValueChange={(value) => handleOpacityChange(value)}
              />
            </div>
            {/* Flip H, Flip V */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleFlipHorizontal}
                variant={"outline"}
                size="sm"
                className={"h-8 text-xs"}
              >
                <FlipHorizontal className="h-4 w-4 mr-1" />
                Flip H
              </Button>
              <Button
                variant={"outline"}
                onClick={handleFlipVertical}
                size="sm"
                className={"h-8 text-xs"}
              >
                <FlipVertical className="h-4 w-4 mr-1" />
                Flip V
              </Button>
            </div>
            {/* ------- Curve ------ */}

            {(objectType == "text" || objectType == "group") &&

            <div className="">
              <div className="pb-5">
                <div className="flex justify-between items-center">
                  <p className="">Curved Text</p>
                  <div className="" onClick={() => handleAddCurvedText(canvas, textValue, curveRadius, curvePercent, fontSize, fontFamily, textColor)}>
                    <Switch checked={selectedObject.type === "group"} />
                  </div>
                </div>
              </div>

              {(selectedIsCurved || selectedObject.type === "group") &&
              <div className="text-curve-panel pb-3">
                <div className="flex flex-col gap-2 pb-4">
                  <Label htmlFor="curve-radius">Radius</Label>
                  <Slider
                    className="outline"
                    id="curve-radius"
                    value={[curveRadius]}
                    min={30}
                    max={300}
                    step={1}
                    onValueChange={(v) => {
                      const r = v[0];
                      setCurveRadius(r);
                      if (selectedIsCurved) {
                        maybeLiveUpdateSelected(canvas,{ radius: r });
                      }
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="curve-percent">Curve: {curvePercent}%</Label>
                  <Slider
                    className="outline"
                    id="curve-percent"
                    value={[curvePercent]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(v) => {
                      const p = v[0];
                      setCurvePercent(p);
                      if (selectedIsCurved) {
                        maybeLiveUpdateSelected(canvas,{ percent: p });
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    0% is almost straight; 100% forms a full circle around the
                    radius.
                  </p>
                </div>
              </div>
              }
            </div>
            }

            {/* Text related properties */}
            {(objectType == "text" || objectType == "group") && (
              <div className="space-y-4 border-t">
                <h3 className="text-sm font-medium">Text Properties</h3>
                <div className="space-y-2">
                  <Label className={"text-xs"} htmlFor="font-size">
                    Font Size
                  </Label>
                  <Input
                    id="font-size"
                    value={fontSize}
                    onChange={(e) => {
                      const font = Number(e.target.value)
                      setFontSize(font);
                      if(selectedIsCurved){
                        maybeLiveUpdateSelected(canvas, {fontSize: font})
                      }
                      if(selectedObject.type === "i-text"){
                        updateObjectProperty("fontSize", font);
                      }
                    }}
                    className={"w-16 h-7 text-xs"}
                    type={"number"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="font-family" className="text-sm">
                    Font family
                  </Label>
                  <Select
                    value={fontFamily}
                    onValueChange={handleFontFamilyChange}
                  >
                    <SelectTrigger id="font-family" className={"h-10"}>
                      <SelectValue placeholder="Select Font" />
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
                <div className="space-y-2">
                  <Label className="text-sm">Style</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={fontWeight === "bold" ? "default" : "outline"}
                      size="icon"
                      onClick={handleToggleBold}
                      className={"w-8 h-8"}
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={fontStyle === "italic" ? "default" : "outline"}
                      size="icon"
                      onClick={handleToggleItalic}
                      className={"w-8 h-8"}
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={underline ? "default" : "outline"}
                      size="icon"
                      onClick={handleToggleUnderline}
                      className={"w-8 h-8"}
                    >
                      <Underline className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <Label htmlFor="text-color" className="text-sm">
                      Text Color
                    </Label>
                    <div className="relative w-8 h-8 overflow-hidden rounded-md border">
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: textColor }}
                      />
                      <Input
                        id="text-color"
                        type="color"
                        value={textColor}
                        onChange={handleToggleTextColorChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="text-bg-color" className="text-sm">
                      Text BG Color
                    </Label>
                    <div className="relative w-8 h-8 overflow-hidden rounded-md border">
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: textBackgroundColor }}
                      />
                      <Input
                        id="text-bg-color"
                        type="color"
                        value={textBackgroundColor}
                        onChange={handleToggleTextBackgroundColorChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className={"text-xs"} htmlFor="letter-spacing">
                      Letter Spacing
                    </Label>
                    <span className="text-xs">{letterSpacing}</span>
                  </div>
                  <Slider
                    id="letter-spacing"
                    min={-200}
                    max={800}
                    step={10}
                    value={[letterSpacing]}
                    onValueChange={(value) => handleLetterSpacingChange(value)}
                  />
                </div>
              </div>
            )}

            {objectType === "shape" && !isImageCropActive && (
              <div className="space-y-4 p-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="border-width" className={"text-xs"}>
                    Border Width
                  </Label>
                  <span className={"text-xs mb-2"}>{borderWidth}%</span>
                  <Slider
                    id="border-width"
                    min={0}
                    max={20}
                    step={1}
                    value={[borderWidth]}
                    onValueChange={(value) => handleBorderWidthChange(value)}
                  />
                </div>
              </div>
            )}

            {objectType === "image" && (
              <div className="space-y-4 p-4 border-t">
                <h3 className="text-sm font-medium">Image Properties</h3>
                <div className="space-y-2">
                  <Label htmlFor="border-color" className="text-xs">
                    Border Color
                  </Label>
                  <div className="relative w-8 h-8 overflow-hidden rounded-md border">
                    <div
                      className="absolute inset-0"
                      style={{ backgroundColor: borderColor }}
                    />
                    <Input
                      id="fill-color"
                      type="color"
                      value={borderColor}
                      onChange={handleBorderColorChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="border-width" className={"text-xs"}>
                    Border Width
                  </Label>
                  <span className={"text-xs mb-2"}>{borderWidth}%</span>
                  <Slider
                    id="border-width"
                    min={0}
                    max={20}
                    step={1}
                    value={[borderWidth]}
                    onValueChange={(value) => handleBorderWidthChange(value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="border-style" className={"text-xs"}>
                    Border Style
                  </Label>
                  <Select
                    value={borderStyle}
                    onValueChange={handleBorderStyleChange}
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
                <div className="space-y-2">
                  <Label htmlFor="filter" className={"text-xs"}>
                    Filter
                  </Label>
                  <Select
                    value={filter}
                    onValueChange={handleImageFilterChange}
                  >
                    <SelectTrigger id="filter" className={"h-10"}>
                      <SelectValue placeholder="Select Image Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="grayscale">Grayscale</SelectItem>
                      <SelectItem value="sepia">Sepia</SelectItem>
                      <SelectItem value="invert">Invert</SelectItem>
                      <SelectItem value="blur">Blur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {filter === "blur" && (
                  <div className="space-y-2">
                    <div className="flex justify-between mb-4">
                      <Label htmlFor="blur" className="text-xs">
                        Blur Amount
                      </Label>
                      <span className="font-medium text-xs">{blur}%</span>
                    </div>
                    <Slider
                      id="blur"
                      min={0}
                      max={100}
                      step={1}
                      value={[blur]}
                      onValueChange={(value) => handleBlurChange(value)}
                    />
                  </div>
                )}
              </div>
            )}

            {objectType === "path" && (
              <div className="space-y-4 p-4 border-t">
                <h3 className="text-sm font-medium">Path Properties</h3>
                <div className="space-y-2">
                  <Label htmlFor="border-color" className="text-xs">
                    Border Color
                  </Label>
                  <div className="relative w-8 h-8 overflow-hidden rounded-md border">
                    <div
                      className="absolute inset-0"
                      style={{ backgroundColor: borderColor }}
                    />
                    <Input
                      id="fill-color"
                      type="color"
                      value={borderColor}
                      onChange={handleBorderColorChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="border-width" className={"text-xs"}>
                    Border Width
                  </Label>
                  <span className={"text-xs mb-2"}>{borderWidth}%</span>
                  <Slider
                    id="border-width"
                    min={0}
                    max={20}
                    step={1}
                    value={[borderWidth]}
                    onValueChange={(value) => handleBorderWidthChange(value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="border-style" className={"text-xs"}>
                    Border Style
                  </Label>
                  <Select
                    value={borderStyle}
                    onValueChange={handleBorderStyleChange}
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
              </div>
            )}
            {/* <DraggablePanel /> */}
          </div>
        </div>
      )}
    </>
  );
}

export default Properties;
