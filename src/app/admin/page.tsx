import { createClient } from "@/lib/supabase/server";
import { Users, FileText, Activity, Calendar, TrendingUp, Clock, BookOpen, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = createClient();

  const [
    { count: totalUsuarias },
    { count: totalConteudos },
    { count: totalSintomas },
    { count: totalCiclos },
    { count: totalLembretes },
  ] = await Promise.all([
    supabase.from("usuarias").select("*", { count: "exact", head: true }),
    supabase.from("conteudos").select("*", { count: "exact", head: true }),
    supabase.from("sintomas").select("*", { count: "exact", head: true }),
    supabase.from("ciclos_menstruais").select("*", { count: "exact", head: true }),
    supabase.from("lembretes").select("*", { count: "exact", head: true }),
  ]);

  const { data: recentContent } = await supabase
    .from("conteudos")
    .select("id, titulo, categoria, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentUsers } = await supabase
    .from("usuarias")
    .select("id, nome, email, fase_da_vida, created_at")
    .order("created_at", { ascending: false })
    .limit(6);

  const { data: faseStats } = await supabase
    .from("usuarias")
    .select("fase_da_vida");

  const faseCount: Record<string, number> = {};
  faseStats?.forEach((u) => {
    const fase = u.fase_da_vida || "Não informado";
    faseCount[fase] = (faseCount[fase] || 0) + 1;
  });

  const { data: categoriaStats } = await supabase
    .from("conteudos")
    .select("categoria");

  const categoriaCount: Record<string, number> = {};
  categoriaStats?.forEach((c) => {
    categoriaCount[c.categoria] = (categoriaCount[c.categoria] || 0) + 1;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Hoje";
    if (days === 1) return "Ontem";
    if (days < 7) return `${days} dias atrás`;
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  return (
    <div className="space-y-6">
      {/* Stats principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-none shadow-sm bg-gradient-to-br from-pink-50 to-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100">
                <Users className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalUsuarias ?? 0}</p>
                <p className="text-xs text-muted-foreground">Usuárias</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-violet-50 to-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100">
                <BookOpen className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalConteudos ?? 0}</p>
                <p className="text-xs text-muted-foreground">Conteúdos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-orange-50 to-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
                <Activity className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalSintomas ?? 0}</p>
                <p className="text-xs text-muted-foreground">Sintomas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-rose-50 to-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100">
                <Calendar className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalCiclos ?? 0}</p>
                <p className="text-xs text-muted-foreground">Ciclos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-teal-50 to-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100">
                <Heart className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalLembretes ?? 0}</p>
                <p className="text-xs text-muted-foreground">Lembretes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-body flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Usuárias por Fase da Vida
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(faseCount).length > 0 ? (
              <div className="space-y-2.5">
                {Object.entries(faseCount)
                  .sort(([, a], [, b]) => b - a)
                  .map(([fase, count]) => (
                    <div key={fase} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-body text-foreground">{fase}</span>
                          <span className="font-body text-muted-foreground">{count}</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all"
                            style={{ width: `${(count / (totalUsuarias || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground font-body">Sem dados ainda.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-body flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Conteúdos por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(categoriaCount).length > 0 ? (
              <div className="space-y-2.5">
                {Object.entries(categoriaCount)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, count]) => (
                    <div key={cat} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-body text-foreground">{cat}</span>
                          <span className="font-body text-muted-foreground">{count}</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-400 to-purple-500 transition-all"
                            style={{ width: `${(count / (totalConteudos || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground font-body">Sem dados ainda.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Atividade recente */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-body flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Conteúdos Recentes
              </CardTitle>
              <Link href="/admin/conteudos" className="text-xs text-primary hover:underline font-body">
                Ver todos →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentContent && recentContent.length > 0 ? (
              <div className="space-y-2">
                {recentContent.map((item) => (
                  <Link
                    key={item.id}
                    href={`/admin/conteudos/${item.id}`}
                    className="flex items-center justify-between rounded-lg bg-background p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
                        <BookOpen className="h-4 w-4 text-violet-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium font-body">{item.titulo}</p>
                        <p className="text-xs text-muted-foreground font-body">{item.categoria}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-body">
                      {formatDate(item.created_at)}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground font-body">
                Nenhum conteúdo cadastrado ainda.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-body flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Usuárias Recentes
              </CardTitle>
              <Link href="/admin/usuarias" className="text-xs text-primary hover:underline font-body">
                Ver todas →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentUsers && recentUsers.length > 0 ? (
              <div className="space-y-2">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg bg-background p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-200 to-rose-300 text-sm font-bold text-white">
                        {user.nome?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-medium font-body">
                          {user.nome || "Sem nome"}
                        </p>
                        <p className="text-xs text-muted-foreground font-body">
                          {user.fase_da_vida || user.email}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-body">
                      {formatDate(user.created_at)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground font-body">
                Nenhuma usuária cadastrada ainda.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
