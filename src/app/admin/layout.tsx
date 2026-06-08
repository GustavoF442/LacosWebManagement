import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/admin/sidebar";
import { Header } from "@/components/admin/header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return <>{children}</>;
    }

    const { data: usuaria } = await supabase
      .from("usuarias")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!usuaria?.is_admin) {
      await supabase.auth.signOut();
      return <>{children}</>;
    }

    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="ml-64">
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </div>
    );
  } catch {
    return <>{children}</>;
  }
}
