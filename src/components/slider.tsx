import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import 'react-medium-image-zoom/dist/styles.css'

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
                    <CarouselItem key={item} className="min-h-[80vh] flex items-center justify-center ">
                        
                        <Zoom>
                            <Image className="pointer-events-auto rounded-xl object-cover h-[80vh] lg:h-auto" priority src={item} width={1920} height={1080} quality={100} alt="Teste" />
                        </Zoom>

                    </CarouselItem>
                ))}
                
            </CarouselContent>
            <CarouselPrevious className="abosolute top-[50%] left-5 backdrop-blur-sm" />
            <CarouselNext className="absolute top-[50%] right-5 backdrop-blur-sm" />
        </Carousel>
    )
}