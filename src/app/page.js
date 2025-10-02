"use client"

import Image from "next/image";
import Header from "./components/home/header";
import MainArea from "./components/home/main-area";
import Sidebar from "./components/home/sidebar";
import { useTshirtStore } from "./store/index.js";
import RecentDesign from "./components/home/recent-design";

export default function Home() {

  // const tshirtType = useTshirtStore((state) => state.tshirtType)

  return (
    <>
    <Header />
    <div className="max-w-7xl mx-auto">
    <div className="w-full overflow-hidden">
      <div className="flex">
        <div className="flex-1">
          <MainArea />
        </div>
        {/* <div className={`home-sidebar relative ${tshirtType ? 'w-1/4' : 'w-0'}`}>
          <Sidebar />
        </div> */}
      </div>
      <RecentDesign />
    </div>
    </div>
    </>
  );
}
