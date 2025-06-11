
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

// It's generally recommended to use createBrowserClient for client-side Supabase interactions in Next.js
// For server-side operations (e.g., in Route Handlers or Server Actions), you'd use createServerClient.
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
);

// If you need a server client for Route Handlers or Server Actions, you can define it like this:
// import { createServerClient, type CookieOptions } from '@supabase/ssr'
// import { cookies } from 'next/headers'
//
// export function createSupabaseServerClient() {
//   const cookieStore = cookies()
//   return createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name: string) {
//           return cookieStore.get(name)?.value
//         },
//         set(name: string, value: string, options: CookieOptions) {
//           cookieStore.set({ name, value, ...options })
//         },
//         remove(name: string, options: CookieOptions) {
//           cookieStore.set({ name, value: '', ...options })
//         },
//       },
//     }
//   )
// }
