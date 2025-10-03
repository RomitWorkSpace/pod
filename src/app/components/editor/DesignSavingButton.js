"use client"

import { Button } from "@/components/ui/button"
import { useTshirtStore } from '@/app/store';
import { saveDesign, saveSVG } from "@/fabric/tshirt-utils";
import { useSnapshot } from 'valtio'
import state from "@/app/store/store3d";
import { useState } from "react";
 

function DesignSavingButton({ designBox }) {

    const { canvas } = useTshirtStore();
    const designContainer = designBox;
    const designDetail = canvas;
    const snap = useSnapshot(state);

    const [isSaving, setIsSaving] = useState(false);

    const saveTshirtDesign = async ()=>{
    setIsSaving(true);
    const imgUrl = await saveSVG(canvas, designDetail);
    if(imgUrl){
        state.logoDecal = imgUrl;
        setIsSaving(false);
        console.log("pass ho gya", imgUrl);
    }else{
        console.log("nosd");
    }
  }


    return (
        <>
        <Button
            onClick={()=>saveTshirtDesign()} 
            className={`absolute bottom-0 left-0 bg-amber-500 text-white rounded-md ${isSaving ? 'cursor-none':'cursor-pointer'}`}
            >{isSaving ? 'Saving...':'Save'}
        </Button>
        </>
    )
}

export default DesignSavingButton
