import { createClient } from '@supabase/supabase-js';
import { getEnv } from './env';

// ==========================================
// 🚀 SUPABASE CONFIGURATION
// We check localStorage first to allow the user to input their own credentials
// via the Admin Dashboard without editing code.
// ==========================================

const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('supabaseProjectUrl') : null;
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('supabaseAnonKey') : null;

// Default fallbacks (using getEnv for dynamic injection support)
const defaultUrl = getEnv('VITE_SUPABASE_URL') || process.env.SUPABASE_URL || '';
const defaultKey = getEnv('VITE_SUPABASE_ANON_KEY') || process.env.SUPABASE_ANON_KEY || '';

// Helper to validate URL
const isValidUrl = (url: string | null): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

let clientUrl = defaultUrl;
let clientKey = defaultKey;

// Only use stored credentials if they look valid
if (storedUrl && isValidUrl(storedUrl) && storedKey) {
  clientUrl = storedUrl.trim();
  clientKey = storedKey.trim();
}

let supabaseInstance;

const createMockClient = (msg: string) => {
    const mockQuery: any = {
        select: () => mockQuery,
        order: () => mockQuery,
        eq: () => mockQuery,
        insert: () => mockQuery,
        update: () => mockQuery,
        delete: () => mockQuery,
        single: () => mockQuery,
        maybeSingle: () => mockQuery,
        limit: () => mockQuery,
        then: (onfulfilled: any) => Promise.resolve({ data: [], error: { message: 'Failed to fetch: No database configured', code: 'MOCK_ERROR' } }).then(onfulfilled),
    };
    return {
        from: () => mockQuery,
        storage: { 
            from: () => ({ 
                getPublicUrl: () => ({ data: { publicUrl: '' } }), 
                upload: async () => ({ data: null, error: { message: msg } }),
                list: async () => ({ data: [], error: { message: msg } })
            }) 
        },
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: msg } }),
            signOut: async () => ({ error: null })
        }
    } as any;
};

try {
  if (!clientUrl || !isValidUrl(clientUrl)) {
      throw new Error("Invalid Supabase URL");
  }
  // Attempt to initialize with determined credentials
  supabaseInstance = createClient(clientUrl, clientKey);
} catch (error) {
  // Only log if it's an actual error, not just missing credentials
  if (clientUrl) {
    console.error("Supabase client initialization failed:", error);
  }
  
  // Fallback to defaults if custom ones crash
  try {
    if (defaultUrl && isValidUrl(defaultUrl)) {
        supabaseInstance = createClient(defaultUrl, defaultKey);
    } else {
        throw new Error("Default URL invalid");
    }
  } catch (fallbackError) {
    if (defaultUrl) {
      console.error("Critical: Default Supabase client failed to initialize.", fallbackError);
    }
    supabaseInstance = createMockClient('Supabase Client Failed to Initialize');
  }
}

export const supabase = supabaseInstance;

export const getSupabaseConfig = () => ({
  url: clientUrl,
  isDefault: false,
  isValid: isValidUrl(clientUrl)
});
