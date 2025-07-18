"use client";

export function SkeletonComponent({type}: {type: "address_loader" | null}){

    if(!type) return null;

    const defaultClass = "animate-pulse rounded-lg";

    if(type === "address_loader")
        return(
            <div className="w-full flex gap-8 mt-4 flex-wrap" >
                {[1,2,3].map(item=>(
                    <div key={item} className={`${defaultClass} h-68  w-[calc((100%/2)-16px)] 2lg:w-[calc((100%/3)-21.5px)] bg-zinc-500/50`}  />
                ))}
            </div>
        )
}