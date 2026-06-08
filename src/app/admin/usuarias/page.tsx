"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { type Usuaria } from "@/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UsuariasPage() {
  const [usuarias, setUsuarias] = useState<Usuaria[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const supabase = createClient();

  const fetchUsuarias = async () => {
    setLoading(true);
    let query = supabase
      .from("usuarias")
      .select("id, nome, email, idade, fase_da_vida, is_admin, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(`nome.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data } = await query;
    setUsuarias(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsuarias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsuarias();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };

  const formatAge = (idade: number | null) => {
    if (!idade) return "—";
    return `${idade} anos`;
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground font-body">
          Visualização das usuárias cadastradas no aplicativo. Apenas consulta — dados sensíveis não são exibidos.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="secondary">
          Buscar
        </Button>
      </form>

      <div className="rounded-xl border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Idade</TableHead>
              <TableHead>Fase da Vida</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Cadastro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground font-body">Carregando...</p>
                </TableCell>
              </TableRow>
            ) : usuarias.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground font-body">
                    Nenhuma usuária encontrada.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              usuarias.map((usuaria) => (
                <TableRow key={usuaria.id}>
                  <TableCell className="font-body">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-xs font-bold text-primary font-body">
                        {usuaria.nome?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      {usuaria.nome || "Sem nome"}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-body">
                    {usuaria.email}
                  </TableCell>
                  <TableCell className="font-body">
                    {formatAge(usuaria.idade)}
                  </TableCell>
                  <TableCell>
                    {usuaria.fase_da_vida ? (
                      <Badge variant="outline">{usuaria.fase_da_vida}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={usuaria.is_admin ? "default" : "secondary"}>
                      {usuaria.is_admin ? "Admin" : "Usuária"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-body">
                    {formatDate(usuaria.created_at)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
