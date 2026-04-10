import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserClips } from "@/lib/supabase/queries";
import { ClipsGallery } from "@/components/organisms/ClipsGallery";

export default async function ClipsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const clips = await getUserClips(user.id);

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-white">Meus clipes</h1>
      <ClipsGallery clips={clips} />
    </div>
  );
}
