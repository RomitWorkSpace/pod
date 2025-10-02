"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import EditorToolBar from "../components/editor/EditorToolBar"
import TShirtCanvas from "../components/editor/TshirtCanvas"

import { useTshirtStore } from "../store"
import Properties from "../components/properties"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation.js"
import { getUserDesignByID } from "@/services/design-service"
import Header from "../components/editor/editor-header"

function Editor() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const designId = searchParams.get('id');

    const [selectedColor, setSelectedColor] = useState(null);
    const [isLoading, setIsLoading] = useState(!!designId);
    const [error, setError] = useState(null);
    const [loadAttempted, setLoadAttempted] = useState(false);
    const boxRef = useRef(null);

    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [dragEnabled, setDragEnabled] = useState(false);
      // local vars for dragging
   const dragState = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
  });

    const { 
        canvas,
        showProperties,
        setDesignId,
        setName,
        resetStore,
        setShowProperties } = useTshirtStore();


  useEffect(() => {
    //reset the store
    resetStore();

    //set the design id

    if (designId) setDesignId(designId);

    return () => {
      resetStore();
    };
  }, []);


  useEffect(() => {
    setLoadAttempted(false);
    setError(null);
  }, [designId]);

  useEffect(() => {
    if (isLoading && !canvas && designId) {
      const timer = setTimeout(() => {
        if (isLoading) {
          console.log("Canvas init timeout");
          setIsLoading(false);
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, canvas, designId]);


  useEffect(() => {
    if (canvas) {
      console.log("Canvas is now available in editor");
    }
  }, [canvas]);

  //load the design ->
  const loadDesign = useCallback(async () => {
    if (!canvas || !designId || loadAttempted) return;
    try {
      setIsLoading(true);
      setLoadAttempted(true);

      const response = await getUserDesignByID(designId);
      const design = response;
      console.log(design);

      if (design) {
        //update name
        setName(design.name);

        //set the design ID just incase after getting the data
        setDesignId(designId);

        try {
          if (design.canvasData) {
            canvas.clear();
            if (design.width && design.height) {
              canvas.setDimensions({
                width: design.width,
                height: design.height,
              });
            }

            const canvasData =
              typeof design.canvasData === "string"
                ? JSON.parse(design.canvasData)
                : design.canvasData;

            const hasObjects =
              canvasData.objects && canvasData.objects.length > 0;

            if (canvasData.background) {
              canvas.backgroundColor = canvasData.background;
            } else {
              canvas.backgroundColor = "#ffffff";
            }

            if (!hasObjects) {
              canvas.renderAll();
              return true;
            }

            canvas
              .loadFromJSON(design.canvasData)
              .then((canvas) => canvas.requestRenderAll());
          } else {
            console.log("no canvas data");
            canvas.clear();
            canvas.setWidth(design.width);
            canvas.setHeight(design.height);
            canvas.backgroundColor = "#ffffff";
            canvas.renderAll();
          }
        } catch (e) {
          console.error(("Error loading canvas", e));
          setError("Error loading canvas");
        } finally {
          setIsLoading(false);
        }
      }

      console.log(response);
    } catch (e) {
      console.error("Failed to load design", e);
      setError("failed to load design");
      setIsLoading(false);
    }
  }, [canvas, designId, loadAttempted, setDesignId]);

  useEffect(() => {
    if (designId && canvas && !loadAttempted) {
      loadDesign();
    }
  }, [canvas, designId, loadDesign, loadAttempted, router]);


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



  // Handlers
  const onPointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    e.preventDefault();
    const { x, y } = pos;

    dragState.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      lastX: x,
      lastY: y,
    };

    e.target.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragState.current.dragging) return;
    e.preventDefault();

    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;

    setPos({
      x: dragState.current.lastX + dx,
      y: dragState.current.lastY + dy,
    });
  };

  const onPointerUp = (e) => {
    if (!dragState.current.dragging) return;
    e.target.releasePointerCapture(e.pointerId);
    dragState.current.dragging = false;
  };



    useEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    if (dragEnabled) {
      el.addEventListener("pointerdown", onPointerDown);
      el.addEventListener("pointermove", onPointerMove);
      el.addEventListener("pointerup", onPointerUp);
      el.addEventListener("pointercancel", onPointerUp);
    } else {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
    }

    // Cleanup when component unmounts or state changes
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
    };
  }, [dragEnabled, pos]); // re-run when state changes


    return (
      <>
        <Header />
        <div className="h-screen overflow-hidden">
          <div className="flex">
            <div className="sidebar-tool relative">
              <EditorToolBar />
            </div>
            <div className="bg-gray-100 pt-8 relative">
              {/* <div className="relative w-[38%] mx-auto"> */}
              <div className="w-[1200px] relative mx-auto">
                <div
                  ref={boxRef}
                  className={`absolute top-0 left-0 cursor-grab active:cursor-grabbing
                    ${
                      dragEnabled
                        ? "cursor-grab active:cursor-grabbing"
                        : "cursor-not-allowed"
                    }`}
                  style={{
                    transform: `translate(${pos.x}px, ${pos.y}px)`,
                    touchAction: "none", // allows pointer events on touch devices
                  }}
                >
                  <TShirtCanvas width={500} height={600} />
                </div>
              </div>

              <Button
                onClick={() => setDragEnabled(!dragEnabled)}
                className="absolute bottom-0 left-0 bg-sky-500 text-white rounded-md"
              >
                {dragEnabled ? 'Drag Disable' : 'Drag Enable'}
              </Button>

              {/* </div> */}
              {showProperties && (
                <Properties setTshirtColor={setSelectedColor} />
              )}
            </div>
          </div>
        </div>
      </>
    );
}

export default Editor
