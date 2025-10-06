"use client"

import axios from "axios";
import { SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function RecentDesign() {

    const router = useRouter();
    const [tshirtDesigns, setTshirtDesigns] = useState([]);

    useEffect(()=>{
        axios.get('/api/design').then(res=>{
        if(res.status == 200){
            setTshirtDesigns(res.data.designs);
        }
    }).catch(console.log("design fetching arror"))

    },[]);

    console.log(tshirtDesigns);

    const handleEditDesign = (designId)=>{
        if(designId)
            router.push(`/editor/?id=${designId}`);
        else
            console.log("Design id is not exist");
    }

    return (
        <>
            <div className="max-w-6xl mx-auto mt-5">
                <div className="font-semibold p-4">Recent Designs</div>
                <div className="">
                    <div className="flex flex-wrap">
                        {
                            tshirtDesigns && tshirtDesigns.map((item ,index)=>(
                                <div key={index} className="w-full md:w-1/4 p-4">
                                    <div className="w-full border border-gray-300">
                                        <img src={item.userDesign} width="100%" alt={item.name} />
                                    </div>
                                    <div className="p-3 shadow-sm">
                                        <div className="font-semibold text-sm text-gray-700 pb-3">
                                            {item.name} - Untitled Design
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <button className="bg-amber-400 px-5 py-2 text-xs font-semibold rounded-md"
                                            onClick={()=>handleEditDesign(item._id)}
                                            >Book to Print
                                            </button>
                                            <div className="flex text-xs items-center text-gray-700"><SquarePen className="w-[15px] text-gray-700" /> Edit</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default RecentDesign
