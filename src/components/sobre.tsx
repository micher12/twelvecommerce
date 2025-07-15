import { AccordionSobre } from "./accordion-sobre";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function AboutComponnent(){
    return(
        <>
            <Card >
                <CardHeader>
                    <CardTitle><h2 className="text-3xl font-bold">Sobre</h2></CardTitle>
                    <CardDescription>Conheça mais sobre o projeto <b>Twelve Commerce</b></CardDescription>
                </CardHeader>
                <CardContent>
                   <AccordionSobre />
                </CardContent>
            </Card>
        </>
    )
}