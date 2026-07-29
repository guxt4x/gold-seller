"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Package, Megaphone, CheckCircle2, ArrowRight, UploadCloud } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
    else router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8 px-4">
          <div className={`flex flex-col items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? "border-primary bg-primary/10" : "border-border"}`}>1</div>
            <span className="text-xs font-medium">Boas-vindas</span>
          </div>
          <div className={`h-px flex-1 mx-4 ${step >= 2 ? "bg-primary" : "bg-border"}`} />
          <div className={`flex flex-col items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? "border-primary bg-primary/10" : "border-border"}`}>2</div>
            <span className="text-xs font-medium">Estoque</span>
          </div>
          <div className={`h-px flex-1 mx-4 ${step >= 3 ? "bg-primary" : "bg-border"}`} />
          <div className={`flex flex-col items-center gap-2 ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? "border-primary bg-primary/10" : "border-border"}`}>3</div>
            <span className="text-xs font-medium">Meta Ads</span>
          </div>
        </div>

        <Card className="border-border/50 shadow-lg">
          {step === 1 && (
            <>
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-4">
                  <Image src="/logo.png" alt="GoldAds Logo" width={400} height={400} className="w-auto h-24 object-contain" />
                </div>
                <CardTitle className="text-3xl">Bem-vindo ao GoldAds</CardTitle>
                <CardDescription className="text-base mt-2">
                  Seu copiloto de operações para escalar vendas sem medo de ruptura de estoque.
                  Vamos configurar seu ambiente em 2 passos simples.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <p className="text-center text-muted-foreground max-w-sm">
                  Nós cruzamos os dados do seu estoque com a performance das suas campanhas no Meta para gerar insights e alertas automáticos.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button onClick={handleNext} size="lg" className="w-full sm:w-auto px-8">
                  Começar configuração <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-6 w-6 text-primary" />
                  Conecte seu Estoque
                </CardTitle>
                <CardDescription>
                  Para calcular o giro de estoque e gerar alertas de reposição, precisamos dos seus SKUs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-border rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-3 hover:border-primary/50 cursor-pointer transition-colors">
                    <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center">
                      <UploadCloud className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Planilha (CSV)</h4>
                      <p className="text-xs text-muted-foreground mt-1">Importe seus produtos via planilha Excel/CSV.</p>
                    </div>
                  </div>
                  <div className="border border-border rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-3 hover:border-primary/50 cursor-pointer transition-colors opacity-60">
                    <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Plataforma (Em breve)</h4>
                      <p className="text-xs text-muted-foreground mt-1">Integração nativa com Shopify e Nuvemshop.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-accent/20 border border-accent rounded-md flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Para este teste inicial, já carregamos 5 produtos de demonstração automaticamente.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>Voltar</Button>
                <Button onClick={handleNext}>Continuar <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </CardFooter>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                  Integração Meta Ads
                </CardTitle>
                <CardDescription>
                  Vincule sua conta de anúncios para que possamos cruzar o gasto diário com a disponibilidade de estoque.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-lg bg-secondary/20">
                  <Button variant="outline" className="gap-2 font-medium">
                    <Megaphone className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                    Conectar com o Facebook
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4 text-center max-w-xs">
                    O GoldAds precisará de permissão de leitura (ads_read) para analisar o desempenho de campanhas ativas.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)}>Voltar</Button>
                <Button onClick={handleNext}>Finalizar Setup <CheckCircle2 className="ml-2 h-4 w-4" /></Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
