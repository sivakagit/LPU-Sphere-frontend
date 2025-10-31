import { createClient } from "@supabase/supabase-js";

// ✅ Use dummy fallback values so build never breaks
const url = import.meta.env.VITE_SUPABASE_URL || "https://dummy.supabase.co";
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || "dummy-key";

console.log("🔧 Supabase initialized with:", { url, key: key ? "exists ✅" : "missing ❌" });

export const supabase = createClient(url, key);
