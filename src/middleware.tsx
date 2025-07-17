import { NextResponse, NextRequest } from 'next/server'
 
const publicRoutes = [
    {path: "/", whenAuthenticated: "redirect", to: "/home"},
    {path: "/home", whenAuthenticated: "ok"},
    {path: "/about", whenAuthenticated: "ok"},
    {path: "/login", whenAuthenticated: "redirect", to: "/profile"},
    {path: "/register", whenAuthenticated: "redirect", to: "/profile"},
    {path: "/profile", whenAuthenticated: "next"},
    {path: "/profile/address", whenAuthenticated: "next"},
    {path: "/cart", whenAuthenticated: "next"},
    {path: "/products", whenAuthenticated: "ok"},
] as const;


export async function middleware(request: NextRequest) {

    const path = request.nextUrl.pathname;
    const url = request.nextUrl;
    let Authentiqued = false;
    let uid: string | null = null;

    const session = request.cookies.get("session");

    if(session){          

        const res = await fetch(`${url.origin}/api/auth/me`, {
            headers:{
                Cookie: session.value
            },
            cache: 'no-store',
        })
        .then(res => res.json());

        if(res.sucesso){
            uid = res.uid;
            Authentiqued = true;
        }
    }

    const publicRoute = publicRoutes.find(route => route.path === path);

    if (request.nextUrl.pathname.startsWith('/images/')) 
        return NextResponse.next();

    // Logado + rota publica + redirecionar.
    if(publicRoute && publicRoute.whenAuthenticated === "redirect" && Authentiqued){
        url.pathname = publicRoute.to;
        return NextResponse.redirect(url);
    }

    //rota publica + não logado
    if(publicRoute && publicRoute.whenAuthenticated === "redirect" && !Authentiqued){
        // Verifica se está no endereço principal.
        if(publicRoute.path === "/"){
            url.pathname = publicRoute.to;
            return NextResponse.redirect(url);
        }

        return NextResponse.next();
    }

    // Se é rota publica e precisa estar logado
    if(publicRoute && publicRoute.whenAuthenticated === "next" && Authentiqued){
        return NextResponse.next();
    }

    // Se é rota publica e precisa estar logado e NÃO ESTOU LOGADO
    if(publicRoute && publicRoute.whenAuthenticated === "next" && !Authentiqued){
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // Se não é rota pública e não está logado
    if(!publicRoute && !Authentiqued){
        url.pathname = "/home"
        return NextResponse.redirect(url);
    }

    // Se não é rota publica e está logado
    if(!publicRoute && Authentiqued && uid){
        // Verificar level_user

        const admin_uid = new Set(JSON.parse(process.env.ADMIN_UID as string) as string[]);

        if(admin_uid.has(uid))
            return NextResponse.next();

        url.pathname = "/home"
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}


export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}