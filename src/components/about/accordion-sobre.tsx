import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"

const items = [
    {
        id: "1",
        title: "O que é a Twelve Commerce?",
        content:
            "A Twelve Commerce é apenas um nome ilustrativo criado para este projeto. Este projeto foi criado visando um sistema de e-commerce completo, o projeto foi 100% desenvolvido pelo ",
    },
    {
        id: "2",
        title: "Quem é Michel?",
        content:
            "Sou um desenvolvedor FullStack, criei este projeto visando tanto melhorar quanto mostrar o domínio das minhas habilidades como desenvolvedor web.",
    },
]

export function AccordionSobre() {
    return (
        <div className="space-y-4">
            <Accordion
                type="single"
                collapsible
                className="w-full space-y-2"
                defaultValue="3"
            >
                {items.map((item) => (
                    <AccordionItem
                        value={item.id}
                        key={item.id}
                        className="bg-background has-focus-visible:border-ring has-focus-visible:ring-ring/50 rounded-md border px-4 py-1 outline-none last:border-b has-focus-visible:ring-[3px]"
                    >
                        <AccordionTrigger className="justify-start gap-3 py-2 text-[15px] leading-6 hover:no-underline focus-visible:ring-0 [&>svg]:-order-1 cursor-pointer">
                            {item.title}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground ps-7 pb-2">
                            {item.id === "1" ? (
                                <>
                                {item.content}
                                <Link target="_blank" className="underline" href={"https://code12.vercel.app/"}>Michel.</Link>
                                </>
                            ) : item.content}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
