import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const supabaseServer = async () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: async () => {
          const cookieStore = await cookies();
          return cookieStore.getAll();
        },
        setAll: async (cookiesToSet) => {
          const cookieStore = await cookies();
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );
};
