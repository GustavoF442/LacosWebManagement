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
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ConteudoFormProps {
  conteudo?: Conteudo;
}

export function ConteudoForm({ conteudo }: ConteudoFormProps) {
  const isEditing = !!conteudo;
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: conteudo?.titulo || "",
    categoria: conteudo?.categoria || "",
    descricao: conteudo?.descricao || "",
    fase_da_vida: conteudo?.fase_da_vida || "",
    o_que_e_normal: conteudo?.o_que_e_normal || "",
    sinais_de_alerta: conteudo?.sinais_de_alerta || "",
    quando_procurar_ubs: conteudo?.quando_procurar_ubs || "",
    o_que_fazer_em_casa: conteudo?.o_que_fazer_em_casa || "",
    publicado: conteudo?.publicado ?? false,
  });

  const handleChange = (
    field: string,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await supabase
          .from("conteudos")
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq("id", conteudo.id);
      } else {
        await supabase.from("conteudos").insert(formData);
      }

      router.push("/admin/conteudos");
      router.refresh();
    } catch (error) {
      console.error("Erro ao salvar conteúdo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/conteudos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-body">
            <input
              type="checkbox"
              checked={formData.publicado}
              onChange={(e) => handleChange("publicado", e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            Publicado
          </label>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isEditing ? "Salvar Alterações" : "Criar Conteúdo"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-body">Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => handleChange("titulo", e.target.value)}
                placeholder="Ex: Cólica Menstrual"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select
                value={formData.categoria}
                onValueChange={(v) => handleChange("categoria", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
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
                  <SelectValue placeholder="Selecione a fase" />
                </SelectTrigger>
                <SelectContent>
                  {FASES_DA_VIDA.map((fase) => (
                    <SelectItem key={fase} value={fase}>
                      {fase}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => handleChange("descricao", e.target.value)}
                placeholder="Descreva o conteúdo..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-body">Detalhes do Conteúdo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="o_que_e_normal">O que é normal</Label>
                <Textarea
                  id="o_que_e_normal"
                  value={formData.o_que_e_normal}
                  onChange={(e) => handleChange("o_que_e_normal", e.target.value)}
                  placeholder="Descreva o que é considerado normal..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sinais_de_alerta">Sinais de alerta</Label>
                <Textarea
                  id="sinais_de_alerta"
                  value={formData.sinais_de_alerta}
                  onChange={(e) => handleChange("sinais_de_alerta", e.target.value)}
                  placeholder="Quais sinais merecem atenção..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quando_procurar_ubs">Quando procurar a UBS</Label>
                <Textarea
                  id="quando_procurar_ubs"
                  value={formData.quando_procurar_ubs}
                  onChange={(e) => handleChange("quando_procurar_ubs", e.target.value)}
                  placeholder="Quando é hora de procurar ajuda profissional..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="o_que_fazer_em_casa">O que fazer em casa</Label>
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
    </form>
  );
}
