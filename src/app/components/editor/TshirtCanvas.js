"use client"

import { useEffect, useRef } from "react"
import { useTshirtStore } from "@/app/store"
import { drawTShirt } from "@/fabric/tshirt-utils"
import { customizeBoundingBox, initializeFabric } from "@/fabric/fabric-utils";
import DesignSavingButton from "./DesignSavingButton";


export default function TShirtCanvas({ width, height }) {

  const {
    setCanvasReference,
    canvas, 
    setCanvas, 
    markAsModified, 
    setSelectedVariantCollection,
    selectedColorCode,
    saveState} = useTshirtStore()
  

  const canvasRef = useRef(null)
  const designCanvasRef = useRef(null)
  const fabricCanvasRef = useRef(null);
  const initAttemptedRef = useRef(false);


    

    // Draw the t-shirt
    useEffect(()=>{
const tshirtCanvas = canvasRef.current
    const ctx = tshirtCanvas.getContext("2d")

    // Set canvas size
    tshirtCanvas.width = width
    tshirtCanvas.height = height
      setCanvasReference(tshirtCanvas)
      const fillColor = selectedColorCode || "#FFFFFF"
      drawTShirt(ctx, width, height, fillColor)
    },[selectedColorCode]);


  useEffect(() => {


    const cleanUpCanvas = () => {
      // if (fabricCanvasRef.current) {
      //   try {
      //     fabricCanvasRef.current.off("object:added");
      //     fabricCanvasRef.current.off("object:modified");
      //     fabricCanvasRef.current.off("object:removed");
      //     fabricCanvasRef.current.off("path:created");
      //   } catch (e) {
      //     console.error("Error remvoing event listeners", e);
      //   }

      //   try {
      //     fabricCanvasRef.current.dispose();
      //   } catch (e) {
      //     console.error("Error disposing canvas", e);
      //   }

      //   fabricCanvasRef.current = null;
      //   setCanvas(null);
      // }
      if(canvas){ canvas.dispose() }
    };

    // cleanUpCanvas();

    //reset init flag
    initAttemptedRef.current = false;

    //init our canvas
    const initcanvas = async () => {
      if (
        typeof window === undefined ||
        !canvasRef.current ||
        initAttemptedRef.current
      ) {
        return;
      }

      initAttemptedRef.current = true;

      try {
        const fabricCanvas = await initializeFabric(
          designCanvasRef.current,
        );

        setSelectedVariantCollection({M:['#ffffff-White']});

        if (!fabricCanvas) {
          console.error("Failed to initialize Fabric.js canvas");

          return;
        }

        fabricCanvasRef.current = fabricCanvas;
        //set the canvas in store
        setCanvas(fabricCanvas);

        console.log("Canvas init is done and set in store");

        //apply custom style for the controls
        // customizeBoundingBox(fabricCanvas);

        //set up event listeners

        // const handleCanvasChange = () => {
        //   markAsModified();
        //   saveState();
        // };

        // fabricCanvas.on("object:added", handleCanvasChange);
        // fabricCanvas.on("object:modified", handleCanvasChange);
        // fabricCanvas.on("object:removed", handleCanvasChange);
        // fabricCanvas.on("path:created", handleCanvasChange);

        // handleCanvasChange();


      } catch (e) {
        console.error("Failed to init canvas", e);
      }
    };

    const timer = setTimeout(() => {
      initcanvas();
    }, 50);

    return () => {
      clearTimeout(timer);
      cleanUpCanvas();
    };

  }, [width, height, setCanvas]);


  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-auto" style={{ maxWidth: "100%", height: "auto" }} />
      <canvas ref={designCanvasRef} />

      <DesignSavingButton designBox={designCanvasRef.current} />
    </div>
  )
}
