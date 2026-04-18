import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../supabase/types";
import { env } from "./env";

export const supabaseServer = createClient<Database>(
  env.supabaseUrl,
  env.supabasePublishableKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);
