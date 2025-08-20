import { useTshirtStore } from "../../store/index.js";

function Sidebar() {
    const tshirtColor = useTshirtStore((state) => state.tshirtColor)
    console.log(tshirtColor)

    return (
        <>
        <div className="shadow-md h-full w-full border border-gray-300">
            <div className="p-4 text-center text-xl text-gray-700 font-semibold border-b border-gray-300">Variants</div>
            <div className="p-4">
                <h5 className="text-gray-700 font-semibold">Colors</h5>
                <div className="tshirt-color py-5">
                    <div className="flex gap-4">
                        {tshirtColor && tshirtColor.map((color, index)=>(
                            <button key={index} className="w-10 h-10 rounded-full border border-gray-400" style={{backgroundColor:color.colorCode}}></button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="sizeWidget p-4">
                <h5 className="text-gray-700 font-semibold">Available Size</h5>
                <div className="py-5">
                    <div className="flex gap-4">
                        <button className="py-2 px-4 rounded-md border border-gray-400">S</button>
                        <button className="py-2 px-4 rounded-md border border-gray-400">M</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Sidebar
