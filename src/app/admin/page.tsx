import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/admin/stat-card";
import { Users, FileText, Activity, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = createClient();

  const [
    { count: totalUsuarias },
    { count: totalConteudos },
    { count: totalSintomas },
    { count: totalCiclos },
  ] = await Promise.all([
    supabase.from("usuarias").select("*", { count: "exact", head: true }),
    supabase.from("conteudos").select("*", { count: "exact", head: true }),
    supabase.from("sintomas").select("*", { count: "exact", head: true }),
    supabase.from("ciclos_menstruais").select("*", { count: "exact", head: true }),
  ]);

  const { data: recentContent } = await supabase
    .from("conteudos")
    .select("id, titulo, categoria, publicado, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentUsers } = await supabase
    .from("usuarias")
    .select("id, nome, email, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Usuárias"
          value={totalUsuarias ?? 0}
          icon={Users}
          description="Cadastradas no app"
        />
        <StatCard
          title="Conteúdos Publicados"
          value={totalConteudos ?? 0}
          icon={FileText}
          description="Conteúdos educativos"
        />
        <StatCard
          title="Sintomas Registrados"
          value={totalSintomas ?? 0}
          icon={Activity}
          description="Total de registros"
        />
        <StatCard
          title="Ciclos Registrados"
          value={totalCiclos ?? 0}
          icon={Calendar}
          description="Total de ciclos"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-body">Conteúdos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentContent && recentContent.length > 0 ? (
              <div className="space-y-3">
                {recentContent.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg bg-background p-3"
                  >
                    <div>
                      <p className="text-sm font-medium font-body">{item.titulo}</p>
                      <p className="text-xs text-muted-foreground font-body">
                        {item.categoria}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium font-body ${
                        item.publicado
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.publicado ? "Publicado" : "Rascunho"}
                    </span>
                  </div>
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
          <CardHeader>
            <CardTitle className="text-lg font-body">Usuárias Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentUsers && recentUsers.length > 0 ? (
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 rounded-lg bg-background p-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-sm font-bold text-primary font-body">
                      {user.nome?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-medium font-body">
                        {user.nome || "Sem nome"}
                      </p>
                      <p className="text-xs text-muted-foreground font-body">
                        {user.email}
                      </p>
                    </div>
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
