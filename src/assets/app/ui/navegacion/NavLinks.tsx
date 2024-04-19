'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";

const links = [
  {name: "Home", href: "/"},
  {name: "Instalaciones", href: "/instalaciones"},
  {name: "Servicios", href: "/servicios"},
  {name: "Reservas", href: "/reservas"},
  {name: "Restaurante", href: "/restaurante"},
  {name: "Localización y contacto", href: "/contacto"},
]

export default function NavLinks(){
  const pathname = usePathname();

  return(
    <>
      {links.map((link) => {
        return(
          <Link
            key={link.name}
            href={link.href}
            className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-gray-300 md:flex-none md:justify-start md:p-2 md:px-3
            
            ${pathname === link.href ? 'bg-gray-200 font-bold' : ''}
            `}
          >
            <p className="hidden md:block">{link.name}</p>
          </Link>
        )
      })}
    </>
  )
}

/* TODO
- ¿Le metemos Iconos a los links?
*/