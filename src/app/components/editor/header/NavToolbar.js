"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { fontFamilies } from "@/app/config/EditorConfig";

import {
  cloneSelectedObject,
  deletedSelectedObject,
} from "@/fabric/fabric-utils";
import { useTshirtStore } from "@/app/store";
import {
  Bold,
  Copy,
  Italic,
  Trash,
  Underline,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import TextToolstrip from "./TextToolbar";
import ShapeToolbar from "./ShapeToolbar";
import ImageToolbar from "./ImageToolbar";
import PathToolbar from "./PathToolbar";

//all states one by one -> reason for tutorial ->

function NavToolbar() {
  const { canvas, markAsModified, setImageCropActive, isImageCropActive } = useTshirtStore();
  let cropArea = null;

  //active object
  const [selectedObject, setSelectedObject] = useState(null);
  const [objectType, setObjectType] = useState("");


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
    const handleSelectionCreated = () => {
      const activeObject = canvas.getActiveObject();

      if (activeObject) {
        console.log(activeObject.type, "activeObjecttype");

        setSelectedObject(activeObject);
        //update common properties
        
        
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
        } else if (activeObject.type === "image") {
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


  const handleTextChange = (event) => {
    const newText = event.target.value;
    setText(newText);
    updateObjectProperty("text", newText);
  };

  const handleFontSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setFontSize(newSize);
    updateObjectProperty("fontSize", newSize);
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

  const handleImageToFit =()=>{
    if (!canvas || !selectedObject || selectedObject.type !== "image") return;
    selectedObject.set("left", 10)
    selectedObject.scaleToWidth(198)
    canvas.renderAll();
  }


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


const cropSelectedImage = async (canvas, selectedImg) => {
  if(!canvas) return null

  try{
    const { Rect } = await import("fabric");

    const startLeft = selectedImg.left + 30;
    const startTop = selectedImg.top + 30;

      cropArea = new Rect({
      left: startLeft,
      top: startTop,
      originX: 'left',
      originY: 'top',
      width: Math.min(300, selectedImg.getScaledWidth() - 60),
      height: Math.min(200, selectedImg.getScaledHeight() - 60),
      fill: 'rgba(0,0,0,0.18)',
      stroke: 'rgba(255,255,255,0.6)',
      strokeWidth: 1,
      cornerStyle: 'circle',
      transparentCorners: false,
      hasRotatingPoint: false,
      lockRotation: true,
    })

    cropArea.setControlsVisibility({
      mtr: false // hide rotation control
    });

    if(isImageCropActive){
      canvas.add(cropArea);
      canvas.setActiveObject(cropArea);
    }
    canvas.renderAll();

    
  } catch (error) {
    console.error("Error cropping image");

    return null;
  }
}

  const handleImageCrop = async ()=>{
    if(!canvas || !selectedObject || selectedObject.type !== "image") return
    setImageCropActive(true);
    await cropSelectedImage(canvas, selectedObject)
  }

  const handleCropButton = async ()=>{
    if (!cropArea) return;
  const r = await cropArea.getBoundingRect(true);

  // increase multiplier if you want higher DPI (2 or window.devicePixelRatio)
  try{
    const dataURL = canvas.toDataURL({
    format: 'png',
    left: r.left,
    top: r.top,
    width: r.width,
    height: r.height,
    multiplier: 2
  });

  // replace canvas content with cropped image
  fabric.Image.fromURL(dataURL, function(croppedImg) {
    canvas.clear();
    croppedImg.set({ left: 0, top: 0, selectable: false });
    canvas.setWidth(croppedImg.width);
    canvas.setHeight(croppedImg.height);
    canvas.add(croppedImg);
    canvas.renderAll();
  });
  }catch(error){
    console.error("image not cropped");
  }
  }

  console.log(isImageCropActive)

  return (

    <>
    
        {/* Text related properties */}
        {objectType === "text" && 
        <TextToolstrip 
            textFontWeight={fontWeight}
            textFont={fontFamily}
            textItalic={fontStyle}
            textUnderline={underline}
            textcolor={textColor}
            textFontSize={fontSize}
            bgColor={textBackgroundColor}
            changeText={handleTextChange}
            changeFontSize={handleFontSizeChange}
            changeFontFamily={handleFontFamilyChange}
            changeFontWeight={handleToggleBold}
            handleTextItalic={handleToggleItalic}
            handleTextUnderline={handleToggleUnderline}
            changeTextColor={handleToggleTextColorChange}
            changeBackgroundColor={handleToggleTextBackgroundColorChange}
        />}


        {(objectType === "shape" && !isImageCropActive) && 
        <ShapeToolbar
            shapeBorderStyle={borderStyle}
            bgColor={fillColor}
            shapeBorderColor={borderColor}
            deleteObject={handleDelete}
            duplicateObject={handleDuplicate}
            changeFillColor={handleFillColorChange}
            changeBorderColor={handleBorderColorChange}
            changeBorderWidth={handleBorderWidthChange}
            changeBorderStyle={handleBorderStyleChange}
        />}


        {(isImageCropActive || objectType === "image") &&
        <ImageToolbar 
            fitImage={handleImageToFit}
            flipImageHorizontally={handleFlipHorizontal}
            flipImageVertically={handleFlipVertical}
            cropCanvasImage={handleImageCrop}
            changeBorderColor={handleBorderColorChange}
            changeBorderWidth={handleBorderWidthChange}
            changeBorderStyle={handleBorderStyleChange}
            changeImageFilter={handleImageFilterChange}
        />
        }


        {objectType === "path" && 
        <PathToolbar
          changeBorderColor={handleBorderColorChange}
          changeBorderWidth={handleBorderWidthChange}
          changeBorderStyle={handleBorderStyleChange}
        />
        }
    </>
    
  );
}

export default NavToolbar;
