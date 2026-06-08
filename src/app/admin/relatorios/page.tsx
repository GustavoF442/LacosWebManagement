"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#C43A4A", "#C56682", "#E7A48C", "#FBD9E5", "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#6366F1"];

interface ChartData {
  name: string;
  value: number;
}

export default function RelatoriosPage() {
  const [loading, setLoading] = useState(true);
  const [faixaEtaria, setFaixaEtaria] = useState<ChartData[]>([]);
  const [faseDaVida, setFaseDaVida] = useState<ChartData[]>([]);
  const [conteudosPorCategoria, setConteudosPorCategoria] = useState<ChartData[]>([]);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // Faixa etária
      const { data: usuarios } = await supabase
        .from("usuarias")
        .select("data_nascimento");

      if (usuarios) {
        const faixas: Record<string, number> = {
          "10-14": 0,
          "15-19": 0,
          "20-29": 0,
          "30-39": 0,
          "40-49": 0,
          "50+": 0,
          "N/I": 0,
        };

        usuarios.forEach((u: { data_nascimento: string | null }) => {
          if (!u.data_nascimento) {
            faixas["N/I"]++;
            return;
          }
          const birth = new Date(u.data_nascimento);
          const today = new Date();
          let age = today.getFullYear() - birth.getFullYear();
          const m = today.getMonth() - birth.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

          if (age < 15) faixas["10-14"]++;
          else if (age < 20) faixas["15-19"]++;
          else if (age < 30) faixas["20-29"]++;
          else if (age < 40) faixas["30-39"]++;
          else if (age < 50) faixas["40-49"]++;
          else faixas["50+"]++;
        });

        setFaixaEtaria(
          Object.entries(faixas)
            .filter(([, v]) => v > 0)
            .map(([name, value]) => ({ name, value }))
        );
      }

      // Fase da vida
      const { data: fases } = await supabase
        .from("usuarias")
        .select("fase_da_vida");

      if (fases) {
        const faseCount: Record<string, number> = {};
        fases.forEach((u: { fase_da_vida: string | null }) => {
          const fase = u.fase_da_vida || "Não informado";
          faseCount[fase] = (faseCount[fase] || 0) + 1;
        });

        setFaseDaVida(
          Object.entries(faseCount).map(([name, value]) => ({ name, value }))
        );
      }

      // Conteúdos por categoria
      const { data: conteudos } = await supabase
        .from("conteudos")
        .select("categoria");

      if (conteudos) {
        const catCount: Record<string, number> = {};
        conteudos.forEach((c: { categoria: string }) => {
          const cat = c.categoria || "Sem categoria";
          catCount[cat] = (catCount[cat] || 0) + 1;
        });

        setConteudosPorCategoria(
          Object.entries(catCount).map(([name, value]) => ({ name, value }))
        );
      }

      setLoading(false);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground font-body">
        Relatórios com dados anonimizados das usuárias e conteúdos do aplicativo.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-body">Usuárias por Faixa Etária</CardTitle>
          </CardHeader>
          <CardContent>
            {faixaEtaria.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={faixaEtaria}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5D5C5" />
                  <XAxis dataKey="name" fontSize={12} fontFamily="Nunito Sans" />
                  <YAxis fontSize={12} fontFamily="Nunito Sans" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #E5D5C5",
                      fontFamily: "Nunito Sans",
                    }}
                  />
                  <Bar dataKey="value" fill="#C43A4A" radius={[4, 4, 0, 0]} name="Usuárias" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10 font-body">
                Sem dados disponíveis.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-body">Usuárias por Fase da Vida</CardTitle>
          </CardHeader>
          <CardContent>
            {faseDaVida.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={faseDaVida}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }: { name: string; percent: number }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    style={{ fontFamily: "Nunito Sans", fontSize: 11 }}
                  >
                    {faseDaVida.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #E5D5C5",
                      fontFamily: "Nunito Sans",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontFamily: "Nunito Sans", fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10 font-body">
                Sem dados disponíveis.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-body">Conteúdos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {conteudosPorCategoria.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={conteudosPorCategoria} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5D5C5" />
                  <XAxis type="number" fontSize={12} fontFamily="Nunito Sans" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={120}
                    fontSize={12}
                    fontFamily="Nunito Sans"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #E5D5C5",
                      fontFamily: "Nunito Sans",
                    }}
                  />
                  <Bar dataKey="value" fill="#C56682" radius={[0, 4, 4, 0]} name="Conteúdos" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10 font-body">
                Sem dados disponíveis.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
