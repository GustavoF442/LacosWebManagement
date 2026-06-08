"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { type Conteudo } from "@/types";
import { ConteudoForm } from "@/components/admin/conteudo-form";
import { Loader2 } from "lucide-react";

export default function EditarConteudoPage() {
  const params = useParams();
  const [conteudo, setConteudo] = useState<Conteudo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConteudo = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("conteudos")
        .select("*")
        .eq("id", params.id)
        .single();

      setConteudo(data);
      setLoading(false);
    };

    fetchConteudo();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!conteudo) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground font-body">Conteúdo não encontrado.</p>
      </div>
    );
  }

  return <ConteudoForm conteudo={conteudo} />;
}
