"use client"

import { useTshirtStore } from "@/app/store";
import { Shirt } from "lucide-react";
import { useEffect } from "react";
function SelectedVarients({ showVariants, variantChanged }) {

    const { setColorDropdown, selectedVariantCollection, setSelectedColorCode } = useTshirtStore();

    function handleVariantSidebar(tab){
      setColorDropdown(tab);
      showVariants(true);
    }



    function SelectedData(){
      return (
        <>
        

          {/*   if S size selected   */}
          { 
            selectedVariantCollection?.S && Object.keys(selectedVariantCollection?.S).length > 0 &&
              <div className="px-3 py-2 mt-2 text-center border rounded-md border-gray-300 hover:bg-purple-100 cursor-pointer">
                <div className="flex items-center justify-between">
                    <div className="flex flex-1 items-center gap-1" onClick={()=>handleVariantSidebar("S")}>
                        {
                          selectedVariantCollection?.S.map((item, index)=>(
                            <div key={index} className="h-8 w-8 rounded-full outline" style={{backgroundColor:item.split("-")[0]}}></div>
                          ))
                        }
                        <div className="text-xl text-gray-700 px-4">S</div>
                    </div>
                    <div className="text-sm text-gray-700">1 piece</div>
                </div>
              </div>
              }


            { 
            selectedVariantCollection?.M && Object.keys(selectedVariantCollection?.M).length >0 &&
              <div className="pl-6 pr-3 py-2 mt-2 text-center border rounded-md border-gray-300 hover:bg-purple-100 cursor-pointer">
                <div className="flex items-center justify-between">
                    <div className="flex flex-1 items-center">

                        {
                          selectedVariantCollection?.M.map((item, index)=>(
                            <div key={index} 
                              className="h-8 w-8 rounded-full -ml-3 outline" 
                              style={{backgroundColor:item.split("-")[0]}}
                              onClick={()=>setSelectedColorCode(item.split("-")[0])}
                              >
                            </div>
                          ))
                        }

                        <div className="text-xl text-gray-700 px-4">M</div>
                    </div>
                    <div className="text-sm text-gray-700" onClick={()=>handleVariantSidebar("M")}><span className="text-xs text-blue-600">More</span> <Shirt /></div>
                </div>
              </div>
              }


            { 
            selectedVariantCollection?.L && Object.keys(selectedVariantCollection?.L).length >0 &&
              <div className="px-3 py-2 mt-2 text-center border rounded-md border-gray-300 hover:bg-purple-100 cursor-pointer">
                <div className="flex items-center justify-between">
                    <div className="flex flex-1 items-center gap-1" onClick={()=>handleVariantSidebar("L")}>
                        {
                          selectedVariantCollection?.L.map((item, index)=>(
                            <div key={index} className="h-8 w-8 rounded-full outline" style={{backgroundColor:item.split("-")[0]}}></div>
                          ))
                        }
                        <div className="text-xl text-gray-700 px-4">L</div>
                    </div>
                    <div className="text-sm text-gray-700">1 piece</div>
                </div>
              </div>
              }


            { 
             selectedVariantCollection?.XL && Object.keys(selectedVariantCollection?.XL).length >0 &&
              <div className="px-3 py-2 mt-2 text-center border rounded-md border-gray-300 hover:bg-purple-100 cursor-pointer">
                <div className="flex items-center justify-between">
                    <div className="flex flex-1 items-center gap-1" onClick={()=>handleVariantSidebar("XL")}>
                        {
                          selectedVariantCollection?.XL.map((item, index)=>(
                            <div key={index} className="h-8 w-8 rounded-full outline" style={{backgroundColor:item.split("-")[0]}}></div>
                          ))
                        }
                        <div className="text-xl text-gray-700 px-4">XL</div>
                    </div>
                    <div className="text-sm text-gray-700">1 piece</div>
                </div>
              </div>
              }
        </>
      )
    }


    useEffect(()=>{
      SelectedData()
    },[variantChanged])


    return (
      <>
        <div className="">
          <h3 className="text-sm font-medium">Selected Variants</h3>


          {/*  if any variant not selected */}

          <SelectedData />
              
        </div>
      </>
    );
}

export default SelectedVarients
