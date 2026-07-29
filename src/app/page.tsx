import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Package, TrendingUp } from "lucide-react";
import Link from "next/link"
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 lg:p-24 bg-background">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-sans text-sm lg:flex">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Image src="/logo.png" alt="GoldAds Logo" width={200} height={200} className="w-auto h-12 object-contain rounded-md shadow-sm" />
          GoldAds
        </div>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-background via-background lg:static lg:h-auto lg:w-auto lg:bg-none">
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button>Criar Conta</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl mt-16 space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Design System Preview</h2>
          <p className="text-muted-foreground">
            A estética do GoldAds foi pensada para transmitir seriedade, agilidade e valor.
            Nada de designs genéricos. Interface de alta performance para lojistas de alta performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Giro de Estoque
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14.5 dias</div>
              <p className="text-xs text-muted-foreground mt-1">
                +2.1% em relação ao último mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                ROAS Médio (Meta)
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">4.2x</div>
              <p className="text-xs text-muted-foreground mt-1">
                Baseado em R$ 12.450 investidos
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Alerta de Ruptura
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">3 SKUs</div>
              <p className="text-xs text-muted-foreground mt-1">
                Com anúncios ativos gastando verba
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full text-xs h-8">Ver Ações Sugeridas</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-border/50">
          <div className="space-y-4">
             <h3 className="text-lg font-medium">Variantes de Botões</h3>
             <div className="flex flex-wrap gap-4">
                <Button variant="default">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
