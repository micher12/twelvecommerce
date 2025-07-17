"use client";

import { Slider } from "./slider";

export function HomeComponent({heroImages}:{heroImages: string[]}){
    return(
        <>
            <Slider images={heroImages} />

            <div className="container">
                OLA
            </div>
        </>
    )
}