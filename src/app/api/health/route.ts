import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({
      status: "error",
      message: "Variáveis de ambiente não configuradas",
      url_exists: !!url,
      key_exists: !!key,
    });
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("usuarias")
      .select("id", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({
        status: "error",
        message: error.message,
        code: error.code,
        hint: error.hint,
        url_prefix: url.substring(0, 30),
      });
    }

    return NextResponse.json({
      status: "ok",
      message: "Conexão com Supabase funcionando",
      url_prefix: url.substring(0, 30),
    });
  } catch (e: any) {
    return NextResponse.json({
      status: "error",
      message: e?.message || "Erro desconhecido",
      url_prefix: url.substring(0, 30),
    });
  }
}
