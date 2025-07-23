"use client";

export function SkeletonComponent({type}: {type: "address_loader" | "data_table" | null}){

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

    if(type === "data_table")
        return(
            <div className="w-full mt-5 space-y-4">

                <div className="flex gap-4">
                    <div className="h-9 w-40 bg-zinc-500/50 animate-pulse rounded-md" />
                    <div className="h-9 w-full bg-zinc-500/50 animate-pulse rounded-md" />
                </div>

                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                    key={i}
                    className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_80px] gap-4 px-2 py-3 bg-zinc-500/20 rounded-lg animate-pulse mt-5"
                    >
                    <div className="h-5 w-5 bg-zinc-500/50 rounded" />
                    <div className="h-5 bg-zinc-500/50 rounded" />
                    <div className="h-5 bg-zinc-500/50 rounded" />
                    <div className="h-5 bg-zinc-500/50 rounded" />
                    <div className="h-5 bg-zinc-500/50 rounded" />
                    <div className="h-5 w-6 bg-zinc-500/50 rounded" />
                    </div>
                ))}

                <div className="flex items-center justify-between mt-5">
                    <div className="h-5 w-32 bg-zinc-500/50 rounded animate-pulse" />
                    <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-8 w-8 rounded bg-zinc-500/50 animate-pulse" />
                    ))}
                    </div>
                </div>
            </div>
        )
  
}