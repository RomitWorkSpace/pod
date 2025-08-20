import { create } from 'zustand'

import { poloColor, roundedColor, hoodieColor } from '../config/index'


function setColor(tshirt){
  if(tshirt === "Polo"){
    return poloColor
  }
  else if(tshirt === "Rounded"){
    return roundedColor
  }
  else if(tshirt === "Hoodie"){
    return hoodieColor
  }
}

export const useTshirtStore = create((set) => ({
  tshirtType: '',
  selectedTshirt: (tshirt) => set({ tshirtType: tshirt }),

  tshirtColor: [],
  setTshirtColor: (tshirtType) => set({ tshirtColor: setColor(tshirtType) }),
}))
