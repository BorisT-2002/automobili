import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../supabase/types";
import { env } from "./env";

export const supabaseUserServer = (accessToken: string) =>
  createClient<Database>(env.supabaseUrl, env.supabasePublishableKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
