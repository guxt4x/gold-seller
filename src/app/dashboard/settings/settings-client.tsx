"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Settings, User, Link as LinkIcon, CreditCard, Share2, Store, CheckCircle2, Loader2, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SettingsClient({ session, dbUser }: { session: any, dbUser?: any }) {
  const searchParams = useSearchParams()
  const initialTab = searchParams?.get("tab") || "integrations"
  const [activeTab, setActiveTab] = useState(initialTab)
  
  const [metaAccounts, setMetaAccounts] = useState<any[]>([])
  const [loadingMeta, setLoadingMeta] = useState(false)
  const [selectedMetaAccount, setSelectedMetaAccount] = useState(dbUser?.metaAccountId || "")
  const [savingMeta, setSavingMeta] = useState(false)

  const isMetaConnected = !!dbUser?.metaToken

  const handleConnectMeta = () => {
    const clientId = process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || "1361586715477884"
    const redirectUri = `${window.location.origin}/api/meta/callback`
    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=ads_read`
    window.location.href = url
  }

  const loadMetaAccounts = async () => {
    setLoadingMeta(true)
    try {
      const res = await fetch("/api/meta/accounts")
      const data = await res.json()
      if (data.accounts) {
        setMetaAccounts(data.accounts)
      } else if (data.error === "Token expirado") {
        alert("Sua conexão com o Facebook expirou. Por favor, conecte novamente.")
        window.location.reload()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingMeta(false)
    }
  }

  const saveMetaAccount = async () => {
    if (!selectedMetaAccount) return
    setSavingMeta(true)
    try {
      await fetch("/api/meta/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId: selectedMetaAccount })
      })
      alert("Conta de anúncios vinculada com sucesso!")
    } catch (e) {
      alert("Erro ao salvar conta.")
    } finally {
      setSavingMeta(false)
    }
  }

  useEffect(() => {
    if (isMetaConnected && activeTab === "integrations") {
      loadMetaAccounts()
    }
  }, [isMetaConnected, activeTab])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-secondary rounded-lg flex items-center justify-center border border-border">
          <Settings className="h-5 w-5 text-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground text-sm">Gerencie seu perfil, assinatura e integrações.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64">
          <nav className="flex flex-col space-y-1">
            <button
              onClick={() => setActiveTab("integrations")}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "integrations" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}
            >
              <LinkIcon className="h-4 w-4" />
              Integrações
            </button>
            <button
              onClick={() => setActiveTab("billing")}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "billing" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}
            >
              <CreditCard className="h-4 w-4" />
              Assinatura & Faturamento
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "profile" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}
            >
              <User className="h-4 w-4" />
              Perfil da Conta
            </button>
          </nav>
        </aside>

        <div className="flex-1">
          {activeTab === "integrations" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h3 className="text-lg font-medium">Lojas e Anúncios</h3>
                <p className="text-sm text-muted-foreground">Conecte o GoldAds às suas ferramentas de trabalho reais.</p>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Share2 className="h-5 w-5 text-blue-500" />
                      Meta Ads
                    </CardTitle>
                    <CardDescription>Conecte sua conta de anúncios para importar campanhas e métricas automaticamente.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!isMetaConnected ? (
                      <div className="bg-secondary/20 border border-border p-4 rounded-md text-sm flex justify-between items-center">
                        <span className="text-muted-foreground">Nenhuma conta conectada.</span>
                        <Button variant="outline" onClick={handleConnectMeta}>Conectar Facebook</Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-green-500/10 text-green-600 border border-green-500/20 p-3 rounded-md text-sm flex items-center gap-2 font-medium">
                          <Check className="h-4 w-4" /> Facebook Conectado
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Selecione a Conta de Anúncios</label>
                          {loadingMeta ? (
                            <div className="flex items-center text-sm text-muted-foreground gap-2 h-10">
                              <Loader2 className="h-4 w-4 animate-spin" /> Carregando contas...
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                value={selectedMetaAccount}
                                onChange={(e) => setSelectedMetaAccount(e.target.value)}
                              >
                                <option value="">Selecione uma conta...</option>
                                {metaAccounts.map(acc => (
                                  <option key={acc.account_id} value={acc.account_id}>
                                    {acc.name} ({acc.account_id})
                                  </option>
                                ))}
                              </select>
                              <Button onClick={saveMetaAccount} disabled={savingMeta || !selectedMetaAccount}>
                                {savingMeta ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Store className="h-5 w-5 text-[#96bf48]" />
                      Shopify
                    </CardTitle>
                    <CardDescription>Sincronize seu catálogo de produtos e níveis de estoque em tempo real.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Store URL</label>
                        <Input placeholder="sua-loja.myshopify.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Admin API Access Token</label>
                        <Input type="password" placeholder="shpat_xxxxxxxxxxxxx" />
                      </div>
                      <Button className="mt-2">Salvar & Conectar</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h3 className="text-lg font-medium">Plano Atual</h3>
                <p className="text-sm text-muted-foreground">Gerencie sua assinatura do GoldAds.</p>
              </div>

              <Card className="border-primary/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <CreditCard className="w-24 h-24 text-primary" />
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center justify-between">
                    <span>Plano Gratuito (MVP)</span>
                    <span className="text-sm px-3 py-1 bg-primary/20 text-primary rounded-full">Ativo</span>
                  </CardTitle>
                  <CardDescription>Você está utilizando a versão de acesso antecipado.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Até 100 SKUs rastreados</div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> 1 Conta de Anúncios</div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Sugestões básicas de IA</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Fazer Upgrade para PRO (Em breve)</Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h3 className="text-lg font-medium">Informações Pessoais</h3>
                <p className="text-sm text-muted-foreground">Atualize os dados da sua conta.</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Perfil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome Completo</label>
                    <Input defaultValue={session?.user?.name || ""} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">E-mail</label>
                    <Input defaultValue={session?.user?.email || ""} disabled />
                    <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado no momento.</p>
                  </div>
                  <Button className="mt-4">Salvar Alterações</Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
