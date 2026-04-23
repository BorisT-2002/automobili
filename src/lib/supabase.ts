import { createBrowserClient } from "@supabase/ssr";
import { env } from "./env";

export const supabase = createBrowserClient(env.supabaseUrl, env.supabasePublishableKey);
