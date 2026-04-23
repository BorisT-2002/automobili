import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "../../supabase/types";
import { env } from "./env";

export const supabase = createBrowserClient<Database>(
  env.supabaseUrl,
  env.supabasePublishableKey,
);
