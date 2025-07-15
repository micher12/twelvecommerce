"use client";

import { Slider } from "./slider";

export default function HomeComponente({heroImages}:{heroImages: string[]}){
    return(
        <>
            <Slider images={heroImages} />

            <div className="container">
                OLA
            </div>
        </>
    )
}