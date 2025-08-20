
"use client"

import { useTshirtStore } from "../../store/index.js";

function MainArea() {

    const tshirtType = useTshirtStore((state) => state.tshirtType)
    const selectedTshirt = useTshirtStore((state) => state.selectedTshirt)
    const setTshirtColor = useTshirtStore((state) => state.setTshirtColor)

    const setTshirtVariant = (tshirtName)=>{
        selectedTshirt(tshirtName)
        setTshirtColor(tshirtName)
    }

    return (
        <>
        <div className="main-area bg-gray-50">
            <div className="items-center flex justify-center h-screen">
                <div className="">
                    <div className="text-center py-5">
                        <h2 className="text-3xl font-semibold">Select Your Tshirt Type</h2>
                    </div>
                    <div className="flex gap-4">
                        <div className={`text-center p-4 ${tshirtType === "Rounded" ? 'rounded-md border border-gray-300 bg-white':''}`}
                            onClick={()=>setTshirtVariant("Rounded")}
                        >
                            <img src="/rounded.png" width="120" />
                            <span className="text-sm text-gray-700">Rounded Neck</span>
                        </div>
                        <div className={`text-center p-4 ${tshirtType === "Polo" ? 'rounded-md border border-gray-300 bg-white':''}`}
                            onClick={()=>setTshirtVariant("Polo")}
                        >
                            <img src="/polo.png" width="120" />
                            <span className="text-sm text-gray-700">Polo Tshirt</span>
                        </div>
                        <div className={`text-center p-4 ${tshirtType === "Hoodie" ? 'rounded-md border border-gray-300 bg-white':''}`}
                            onClick={()=>setTshirtVariant("Hoodie")}
                        >
                            <img src="/hoodie.png" width="100" />
                            <span className="text-sm text-gray-700">Hoodie</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default MainArea
