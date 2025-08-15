"use client";

import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";

interface CustomZoomImageProps{
    src: string
    alt: string
    setExpandeImage: Dispatch<SetStateAction<boolean>>;
}

export function CustomZoomImage({ src, alt, setExpandeImage }: CustomZoomImageProps){

    const [undu, setUndo] = useState(false);

    return(
        <div onClick={()=>{
            setUndo(true);
            setTimeout(()=>{
                setExpandeImage(false)
            },600)
        }} className={`absolute ${undu && "fadeOut-sm"} cursor-zoom-out p-6 top-0 fadeIn-sm left-0 w-full min-h-screen bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center`}>
            <Image src={src} width={1024} height={1024} alt={alt} className={`rounded-md max-h-[95vh] zoomIn ${undu && "zoomOut"}`} />
        </div>
    )

}