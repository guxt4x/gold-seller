"use client"

import { signOut } from "next-auth/react"
import { Bell, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  userName?: string | null
}

export function Header({ userName }: HeaderProps) {
  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-medium text-foreground hidden sm:block">
          Visão Geral
        </h2>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notificações</span>
        </Button>
        
        <div className="h-8 w-px bg-border mx-2" />
        
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center border border-border">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground hidden sm:block">
            {userName || "Usuário"}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-muted-foreground hover:text-destructive"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
