"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/conteudos": "Conteúdos",
  "/admin/conteudos/novo": "Novo Conteúdo",
  "/admin/site": "Gerenciar Site",
  "/admin/usuarias": "Usuárias",
  "/admin/relatorios": "Relatórios",
};

export function Header() {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.match(/^\/admin\/conteudos\/[^/]+$/)) {
      return "Editar Conteúdo";
    }
    return pageTitles[pathname] || "Admin";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <h2 className="text-2xl font-title text-foreground">{getTitle()}</h2>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </Button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white font-body">
          A
        </div>
      </div>
    </header>
  );
}
