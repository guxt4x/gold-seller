"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Megaphone, Settings, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Visão Geral", href: "/dashboard", icon: LayoutDashboard },
  { name: "Estoque", href: "/dashboard/inventory", icon: Package },
  { name: "Meta Ads", href: "/dashboard/campaigns", icon: Megaphone },
  { name: "Insights", href: "/dashboard/insights", icon: Lightbulb },
  { name: "Configurações", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-background">
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg text-foreground">
          <Image src="/logo.png" alt="GoldAds Logo" width={200} height={200} className="w-auto h-8 object-contain rounded shadow-sm" />
          GoldAds
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="rounded-md bg-secondary p-4 text-xs">
          <p className="font-semibold mb-1">Precisa de ajuda?</p>
          <p className="text-muted-foreground mb-3">Nossa equipe de suporte está online.</p>
          <Link href="#" className="text-primary hover:underline font-medium">Falar com Suporte</Link>
        </div>
      </div>
    </div>
  )
}
