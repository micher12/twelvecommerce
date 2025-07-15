import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";

export function Slider({className, images}: {className?: string, images: string[]}){
    return(
        <Carousel
            plugins={[
                Autoplay({
                    delay: 8000
                })
            ]}
            opts={{
                loop: true,
            }}
            className={`w-full rounded-xl relative ${className}`}
        >
            <CarouselContent >
                {images.map((item)=>(
                    <CarouselItem key={item} className="min-h-[600px] flex items-center justify-center ">
                        
                        <Link href={"/"} className="w-full h-auto">
                            <Image className="pointer-events-auto rounded-xl" style={{width: "100%"}} priority src={item} width={1920} height={1080} quality={100} alt="Teste" />
                        </Link>

                    </CarouselItem>
                ))}
                
            </CarouselContent>
            <CarouselPrevious className="abosolute top-[50%] left-5 " />
            <CarouselNext className="absolute top-[50%] right-5" />
        </Carousel>
    )
}