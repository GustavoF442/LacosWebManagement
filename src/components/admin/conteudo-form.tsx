"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { type Conteudo, CATEGORIAS, FASES_DA_VIDA } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, ArrowLeft, Eye, PenLine, CheckCircle, AlertTriangle, Building2, Home } from "lucide-react";
import Link from "next/link";

interface ConteudoFormProps {
  conteudo?: Conteudo;
}

export function ConteudoForm({ conteudo }: ConteudoFormProps) {
  const isEditing = !!conteudo;
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"form" | "preview">("form");
  const [formData, setFormData] = useState({
    titulo: conteudo?.titulo || "",
    categoria: conteudo?.categoria || "",
    descricao: conteudo?.descricao || "",
    fase_da_vida: conteudo?.fase_da_vida || "",
    o_que_e_normal: conteudo?.o_que_e_normal || "",
    sinais_alerta: conteudo?.sinais_alerta || "",
    quando_procurar_ubs: conteudo?.quando_procurar_ubs || "",
    o_que_fazer_em_casa: conteudo?.o_que_fazer_em_casa || "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isEditing) {
        const { error: err } = await supabase
          .from("conteudos")
          .update(formData)
          .eq("id", conteudo.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("conteudos").insert(formData);
        if (err) throw err;
      }

      router.push("/admin/conteudos");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Erro ao salvar conteúdo. Verifique os campos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/conteudos">
          <Button variant="ghost" size="icon" type="button">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h2 className="text-lg font-semibold font-body">
          {isEditing ? "Editar Conteúdo" : "Novo Conteúdo"}
        </h2>
        <div className="flex-1" />
        <div className="flex items-center gap-2 rounded-lg bg-muted p-1">
          <button
            type="button"
            onClick={() => setTab("form")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-body transition-colors ${
              tab === "form" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"
            }`}
          >
            <PenLine className="h-3.5 w-3.5" />
            Editar
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-body transition-colors ${
              tab === "preview" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isEditing ? "Salvar" : "Criar"}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 font-body">
          {error}
        </div>
      )}

      {tab === "form" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-body">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => handleChange("titulo", e.target.value)}
                  placeholder="Ex: Cólica Menstrual"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(v) => handleChange("categoria", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIAS.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fase_da_vida">Fase da Vida</Label>
                  <Select
                    value={formData.fase_da_vida}
                    onValueChange={(v) => handleChange("fase_da_vida", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {FASES_DA_VIDA.map((fase) => (
                        <SelectItem key={fase} value={fase}>{fase}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleChange("descricao", e.target.value)}
                  placeholder="Texto introdutório do conteúdo..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-body">Seções do Conteúdo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="o_que_e_normal" className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    O que é normal
                  </Label>
                  <Textarea
                    id="o_que_e_normal"
                    value={formData.o_que_e_normal}
                    onChange={(e) => handleChange("o_que_e_normal", e.target.value)}
                    placeholder="Descreva o que é considerado normal..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sinais_alerta" className="flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-yellow-600" />
                    Sinais de alerta
                  </Label>
                  <Textarea
                    id="sinais_alerta"
                    value={formData.sinais_alerta}
                    onChange={(e) => handleChange("sinais_alerta", e.target.value)}
                    placeholder="Quais sinais merecem atenção..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quando_procurar_ubs" className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-red-600" />
                    Quando procurar a UBS
                  </Label>
                  <Textarea
                    id="quando_procurar_ubs"
                    value={formData.quando_procurar_ubs}
                    onChange={(e) => handleChange("quando_procurar_ubs", e.target.value)}
                    placeholder="Quando é hora de procurar ajuda profissional..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="o_que_fazer_em_casa" className="flex items-center gap-1.5">
                    <Home className="h-3.5 w-3.5 text-violet-600" />
                    O que fazer em casa
                  </Label>
                  <Textarea
                    id="o_que_fazer_em_casa"
                    value={formData.o_que_fazer_em_casa}
                    onChange={(e) => handleChange("o_que_fazer_em_casa", e.target.value)}
                    placeholder="Dicas de cuidados caseiros..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Preview - simula a visualização no app */
        <div className="flex justify-center">
          <div className="w-[375px] rounded-[2.5rem] border-[8px] border-gray-800 bg-[#FBF4EB] shadow-2xl overflow-hidden">
            {/* Status bar simulada */}
            <div className="bg-gradient-to-r from-[#C43A4A] to-[#C56682] px-6 pt-10 pb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowLeft className="h-3 w-3 text-white" />
                </div>
              </div>
              <p className="text-white text-lg font-semibold leading-tight">
                {formData.titulo || "Título do Conteúdo"}
              </p>
            </div>

            {/* Corpo do conteúdo */}
            <div className="px-5 py-5 space-y-4 max-h-[500px] overflow-y-auto">
              {/* Badge categoria */}
              {formData.categoria && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#C56682]/10 text-[#C56682]">
                  {formData.categoria}
                </span>
              )}

              {/* Descrição */}
              {formData.descricao && (
                <p className="text-sm text-[#2D2D2D] leading-relaxed">
                  {formData.descricao}
                </p>
              )}

              {/* Seção: O que é normal */}
              {formData.o_que_e_normal && (
                <PreviewSection
                  icon={<CheckCircle className="h-4 w-4 text-green-600" />}
                  title="O que é normal"
                  content={formData.o_que_e_normal}
                  color="green"
                />
              )}

              {/* Seção: Sinais de alerta */}
              {formData.sinais_alerta && (
                <PreviewSection
                  icon={<AlertTriangle className="h-4 w-4 text-yellow-600" />}
                  title="Sinais de alerta"
                  content={formData.sinais_alerta}
                  color="yellow"
                />
              )}

              {/* Seção: Quando procurar a UBS */}
              {formData.quando_procurar_ubs && (
                <PreviewSection
                  icon={<Building2 className="h-4 w-4 text-red-600" />}
                  title="Quando procurar a UBS"
                  content={formData.quando_procurar_ubs}
                  color="red"
                />
              )}

              {/* Seção: O que fazer em casa */}
              {formData.o_que_fazer_em_casa && (
                <PreviewSection
                  icon={<Home className="h-4 w-4 text-violet-600" />}
                  title="O que fazer em casa"
                  content={formData.o_que_fazer_em_casa}
                  color="violet"
                />
              )}

              {!formData.descricao && !formData.o_que_e_normal && !formData.sinais_alerta && !formData.quando_procurar_ubs && !formData.o_que_fazer_em_casa && (
                <p className="text-center text-sm text-[#9E9E9E] py-8">
                  Preencha os campos para ver a pré-visualização
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

function PreviewSection({
  icon,
  title,
  content,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  color: string;
}) {
  const styles: Record<string, { border: string; bg: string; text: string }> = {
    green: { border: "border-green-200", bg: "bg-green-100", text: "text-green-600" },
    yellow: { border: "border-yellow-200", bg: "bg-yellow-100", text: "text-yellow-600" },
    red: { border: "border-red-200", bg: "bg-red-100", text: "text-red-600" },
    violet: { border: "border-violet-200", bg: "bg-violet-100", text: "text-violet-600" },
  };

  const s = styles[color] || styles.green;

  return (
    <div className={`rounded-2xl border ${s.border} bg-white p-4 shadow-sm`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.bg}`}>
          {icon}
        </div>
        <span className={`text-sm font-semibold ${s.text}`}>{title}</span>
      </div>
      <p className="text-sm text-[#2D2D2D] leading-relaxed whitespace-pre-line">{content}</p>
    </div>
  );
}
