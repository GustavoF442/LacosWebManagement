"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2 } from "lucide-react";

interface SiteConfig {
  [key: string]: string;
}

const defaultConfig: SiteConfig = {
  titulo_site: "Laço's - Minha Saúde Feminina",
  descricao_site: "",
  sobre_titulo: "Sobre o Projeto",
  sobre_descricao: "",
  sobre_missao: "",
  sobre_visao: "",
  contato_email: "",
  contato_telefone: "",
  contato_endereco: "",
  rede_apoio_cras: "",
  rede_apoio_caps: "",
  rede_apoio_ubs: "",
  rede_apoio_emergencia: "",
  link_apk: "",
  versao_apk: "",
};

export default function SitePage() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const supabase = createClient();

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase
        .from("configuracoes_site")
        .select("chave, valor");

      if (data) {
        const configMap: SiteConfig = { ...defaultConfig };
        data.forEach((item: { chave: string; valor: string }) => {
          configMap[item.chave] = item.valor || "";
        });
        setConfig(configMap);
      }
      setLoading(false);
    };

    fetchConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedMessage("");

    try {
      for (const [chave, valor] of Object.entries(config)) {
        await supabase
          .from("configuracoes_site")
          .upsert(
            { chave, valor, updated_at: new Date().toISOString() },
            { onConflict: "chave" }
          );
      }
      setSavedMessage("Configurações salvas com sucesso!");
      setTimeout(() => setSavedMessage(""), 3000);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setSavedMessage("Erro ao salvar configurações.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-body">
          Gerencie as informações exibidas no site público e no aplicativo.
        </p>
        <div className="flex items-center gap-3">
          {savedMessage && (
            <span className="text-sm text-green-600 font-body">{savedMessage}</span>
          )}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Salvar Alterações
          </Button>
        </div>
      </div>

      <Tabs defaultValue="institucional" className="space-y-4">
        <TabsList>
          <TabsTrigger value="institucional">Institucional</TabsTrigger>
          <TabsTrigger value="sobre">Sobre</TabsTrigger>
          <TabsTrigger value="contatos">Contatos & Rede de Apoio</TabsTrigger>
          <TabsTrigger value="apk">Download APK</TabsTrigger>
        </TabsList>

        <TabsContent value="institucional">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-body">Textos Institucionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título do Site</Label>
                <Input
                  value={config.titulo_site}
                  onChange={(e) => handleChange("titulo_site", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição do Site</Label>
                <Textarea
                  value={config.descricao_site}
                  onChange={(e) => handleChange("descricao_site", e.target.value)}
                  rows={4}
                  placeholder="Descrição que aparecerá na página inicial..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sobre">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-body">Página Sobre</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={config.sobre_titulo}
                  onChange={(e) => handleChange("sobre_titulo", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={config.sobre_descricao}
                  onChange={(e) => handleChange("sobre_descricao", e.target.value)}
                  rows={4}
                  placeholder="Sobre o projeto Laço's..."
                />
              </div>
              <div className="space-y-2">
                <Label>Missão</Label>
                <Textarea
                  value={config.sobre_missao}
                  onChange={(e) => handleChange("sobre_missao", e.target.value)}
                  rows={3}
                  placeholder="Nossa missão..."
                />
              </div>
              <div className="space-y-2">
                <Label>Visão</Label>
                <Textarea
                  value={config.sobre_visao}
                  onChange={(e) => handleChange("sobre_visao", e.target.value)}
                  rows={3}
                  placeholder="Nossa visão..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contatos">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-body">Contatos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>E-mail de contato</Label>
                  <Input
                    value={config.contato_email}
                    onChange={(e) => handleChange("contato_email", e.target.value)}
                    placeholder="contato@lacos.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    value={config.contato_telefone}
                    onChange={(e) => handleChange("contato_telefone", e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Endereço</Label>
                  <Textarea
                    value={config.contato_endereco}
                    onChange={(e) => handleChange("contato_endereco", e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-body">Rede de Apoio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>CRAS</Label>
                  <Textarea
                    value={config.rede_apoio_cras}
                    onChange={(e) => handleChange("rede_apoio_cras", e.target.value)}
                    rows={2}
                    placeholder="Informações sobre o CRAS..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>CAPS</Label>
                  <Textarea
                    value={config.rede_apoio_caps}
                    onChange={(e) => handleChange("rede_apoio_caps", e.target.value)}
                    rows={2}
                    placeholder="Informações sobre o CAPS..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>UBS</Label>
                  <Textarea
                    value={config.rede_apoio_ubs}
                    onChange={(e) => handleChange("rede_apoio_ubs", e.target.value)}
                    rows={2}
                    placeholder="Informações sobre a UBS..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Emergência</Label>
                  <Textarea
                    value={config.rede_apoio_emergencia}
                    onChange={(e) => handleChange("rede_apoio_emergencia", e.target.value)}
                    rows={2}
                    placeholder="Números de emergência..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="apk">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-body">Download do APK</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Link de download do APK</Label>
                <Input
                  value={config.link_apk}
                  onChange={(e) => handleChange("link_apk", e.target.value)}
                  placeholder="https://exemplo.com/lacos.apk"
                />
              </div>
              <div className="space-y-2">
                <Label>Versão do APK</Label>
                <Input
                  value={config.versao_apk}
                  onChange={(e) => handleChange("versao_apk", e.target.value)}
                  placeholder="1.0.0"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
