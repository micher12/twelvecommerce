import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";

const images = [
    {path: "/images/white_logo.png"},
    {path: "/images/black_logo.png"},
]

export function Slider({className}: {className?: string}){
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
            className={`w-full rounded-lg relative ${className}`}
        >
            <CarouselContent>
                {images.map((item)=>(
                    <CarouselItem key={item.path} className="min-h-[600px] flex items-center justify-center">
                        
                        <Link href={"/"} className="">
                            <Image className="pointer-events-auto" src={item.path} width={100} height={100} alt="Teste" />
                        </Link>

                    </CarouselItem>
                ))}
                
            </CarouselContent>
            <CarouselPrevious className="abosolute top-[50%] left-5 " />
            <CarouselNext className="absolute top-[50%] right-5" />
        </Carousel>
    )
}