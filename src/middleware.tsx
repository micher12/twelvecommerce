import { NextResponse, NextRequest } from 'next/server'
 
const publicRoutes = [
    {path: "/", whenAuthenticated: "redirect", to: "/home"},
    {path: "/home", whenAuthenticated: "ok"},
    {path: "/sobre", whenAuthenticated: "ok"},
    {path: "/login", whenAuthenticated: "redirect", to: "/profile"},
    {path: "/register", whenAuthenticated: "redirect", to: "/profile"},
    {path: "/profile", whenAuthenticated: "next"},
    {path: "/cart", whenAuthenticated: "next"},
    {path: "/products", whenAuthenticated: "ok"},
] as const;


export function middleware(request: NextRequest) {

    const path = request.nextUrl.pathname;
    const url = request.nextUrl;
    const authToken = false;

    const publicRoute = publicRoutes.find(route => route.path === path);

    if (request.nextUrl.pathname.startsWith('/images/')) 
        return NextResponse.next();

    // Logado + rota publica + redirecionar.
    if(publicRoute && publicRoute.whenAuthenticated === "redirect" && authToken){
        url.pathname = publicRoute.to;
        return NextResponse.redirect(url);
    }

    //rota publica + não logado
    if(publicRoute && publicRoute.whenAuthenticated === "redirect" && !authToken){
        // Verifica se está no endereço principal.
        if(publicRoute.path === "/"){
            url.pathname = publicRoute.to;
            return NextResponse.redirect(url);
        }

        return NextResponse.next();
    }

    // Se é rota publica e precisa estar logado
    if(publicRoute && publicRoute.whenAuthenticated === "next" && authToken){
        return NextResponse.next();
    }

    // Se é rota publica e precisa estar logado e NÃO ESTOU LOGADO
    if(publicRoute && publicRoute.whenAuthenticated === "next" && !authToken){
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // Se não é rota pública e não está logado
    if(!publicRoute && !authToken){
        url.pathname = "/home"
        return NextResponse.redirect(url);
    }

    // Se não é rota publica e está logado
    if(!publicRoute && authToken){
        // Verificar level_user

        return NextResponse.next();
    }

    return NextResponse.next();
}


export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}