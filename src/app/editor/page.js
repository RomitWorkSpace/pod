"use client"

import { useEffect, useState } from "react"
import EditorToolBar from "../components/editor/EditorToolBar"
import TShirtCanvas from "../components/editor/TshirtCanvas"
import Header from "../components/home/header"
import { useTshirtStore } from "../store"
import Properties from "../components/properties"

function Editor() {

    const [loadAttempted, setLoadAttempted] = useState(false);
    const { 
        canvas,
        showProperties,
        setShowProperties } = useTshirtStore();

    useEffect(() => {
    if (!canvas) return;

    const handleSelectionCreated = () => {
      const activeObject = canvas.getActiveObject();

      console.log(activeObject, "activeObject");

      if (activeObject) {
        setShowProperties(true);
      }
    };

    const handleSelectionCleared = () => {
      setShowProperties(false);
    };

    canvas.on("selection:created", handleSelectionCreated);
    canvas.on("selection:updated", handleSelectionCreated);
    canvas.on("selection:cleared", handleSelectionCleared);

    return () => {
      canvas.off("selection:created", handleSelectionCreated);
      canvas.off("selection:updated", handleSelectionCreated);
      canvas.off("selection:cleared", handleSelectionCleared);
    };
  }, [canvas]);

    return (
        <>
        <Header />
        <div className="h-screen overflow-hidden">
            <div className="flex">
                <div className="sidebar-tool relative">
                    <EditorToolBar />
                </div>
                <div className="flex-1 bg-gray-100 pt-8">
                    <div className="relative w-[38%] mx-auto">
                        <TShirtCanvas color="light-gray" width={500} height={600} />
                    </div>
                    { showProperties && <Properties />}
                </div>
            </div>
        </div>
        </>
    )
}

export default Editor
