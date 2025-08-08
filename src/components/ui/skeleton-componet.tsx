"use client";

export function SkeletonComponent({type}: {type: "address_loader" | "data_table" | "sub_category" | "edit_product" | null}){

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
    
    if(type === "sub_category")
        return(
            <div className="w-full flex flex-col gap-5 mt-5">
                <div className="flex flex-col gap-2">
                    <div className="w-52 h-4 bg-zinc-500/50 rounded-lg animate-pulse" />
                    <div className="w-36 h-7 bg-zinc-500/50 rounded-lg animate-pulse" />
                </div>

                <div className="flex flex-col gap-2">
                    <div className="w-52 h-4 bg-zinc-500/50 rounded-lg animate-pulse" />
                    <div className="w-full h-7 bg-zinc-500/50 rounded-lg animate-pulse" />
                </div>

                <div className="h-7 w-32 bg-zinc-500/50 animate-pulse rounded-lg" />
            </div>
        )
    
    if(type === "edit_product"){
        return(
            <div className="flex flex-col gap-5">
            {/* Campos principais */}
            <div className="flex flex-col gap-5">
                {/* Nome do produto */}
                <div className="flex flex-col gap-2">
                    <div className="h-4 w-48 bg-zinc-500/50 rounded-lg animate-pulse" />
                    <div className="h-8 w-full bg-zinc-500/50 rounded-lg animate-pulse" />
                </div>

                {/* Preço base */}
                <div className="flex flex-col gap-2">
                    <div className="h-4 w-36 bg-zinc-500/50 rounded-lg animate-pulse" />
                    <div className="h-8 w-full bg-zinc-500/50 rounded-lg animate-pulse" />
                </div>

                {/* Descrição */}
                <div className="flex items-center gap-5 flex-wrap">
                    
                    <div className="flex flex-1/1 sm:flex-3 flex-col gap-2">
                        <div className="h-4 w-56 bg-zinc-500/50 rounded-lg animate-pulse" />
                        <div className="h-30 w-full bg-zinc-500/50 rounded-lg animate-pulse" />
                    </div>

                    <div className="flex sm:flex-col gap-5 flex-1 ">
                        <div className="flex flex-col gap-2">
                            <div className="h-4 w-20 bg-zinc-500/50 rounded-lg animate-pulse" />
                            <div className="h-8 w-40 bg-zinc-500/50 rounded-lg animate-pulse" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="h-4 w-20 bg-zinc-500/50 rounded-lg animate-pulse" />
                            <div className="h-8 w-40 bg-zinc-500/50 rounded-lg animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Estrela e Categorias */}
                <div className="flex flex-col gap-2">
                    <div className="h-4 w-32 bg-zinc-500/50 rounded-lg animate-pulse" />
                    <div className="[&>svg]:fill-zinc-500/50 animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" height="1rem" viewBox="0 0 576 512">
                            <path
                                d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                            ></path>
                        </svg>
                    </div>
                </div>

                {/* Botão adicionar variação */}
                <div className="h-7 w-48 bg-zinc-500/50 rounded-lg animate-pulse" />
            </div>

            {/* Variações */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                <div key={i} className="bg-zinc-700/20 p-4 rounded-lg flex flex-col gap-2">
                    <div className="h-4 w-28 bg-zinc-500/50 rounded-lg animate-pulse mt-4" /> {/* Título variação */}
                    <div className="h-8 w-full bg-zinc-500/50 rounded-lg animate-pulse" /> {/* Valor variação */}
                    <div className="h-4 w-20 bg-zinc-500/50 rounded-lg animate-pulse mt-4" />
                    <div className="h-10 w-38 bg-zinc-500/50 rounded-lg animate-pulse" /> {/* Quantidade */}

                    {/* Atributos (2 por variação) */}
                    {[1, 2].map((j) => (
                    <div key={j} className="flex flex-col gap-2 mt-4">
                        <div className="h-4 w-36 bg-zinc-500/50 rounded-lg mt-3 animate-pulse" />
                        <div className="h-8 w-full bg-zinc-500/50 rounded-lg animate-pulse" />
                        <div className="h-4 w-36 bg-zinc-500/50 rounded-lg mt-3 animate-pulse" />
                        <div className="h-8 w-full bg-zinc-500/50 rounded-lg animate-pulse" />
                    </div>
                    ))}
                </div>
                ))}
            </div>
            </div>

        )
    }
}