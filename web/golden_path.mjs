import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');
console.log("🌟 INITIATING THE GOLDEN PATH...");

function findFile(dir, fileName) {
    if (!fs.existsSync(dir)) return null;
    for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            const res = findFile(fullPath, fileName);
            if (res) return res;
        } else if (file.toLowerCase() === fileName.toLowerCase()) return fullPath;
    }
    return null;
}

// 1. HARDCODE THE AUTH PROVIDER (100% SYNCHRONOUS L5 ADMIN)
const authProviderPath = findFile(srcDir, 'authprovider.tsx') || findFile(srcDir, 'authcontext.tsx');
if (authProviderPath) {
    const authCode = `// @ts-nocheck
import React, { createContext, useContext } from 'react';

const mockUser = { id: 'admin-123', email: 'master@britium.com', role: 'SUPER_ADMIN', role_level: 'L5', full_name: 'Master Admin' };
const AuthContext = createContext({ user: mockUser, session: { user: mockUser }, isLoading: false, isInitialized: true, signOut: () => {} });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    return (
        <AuthContext.Provider value={{ user: mockUser, session: { user: mockUser }, isLoading: false, isInitialized: true, signOut: () => {} }}>
            {children}
        </AuthContext.Provider>
    );
};
export default AuthProvider;
`;
    fs.writeFileSync(authProviderPath, authCode);
    console.log("✅ AuthProvider fully bypassed. You are synchronously L5 SUPER_ADMIN.");
}

// 2. OVERWRITE LOGIN.TSX TO BE AN INVISIBLE REDIRECT
const loginFiles = ['login.tsx', 'loginform.tsx', 'loginpage.tsx'];
for (const lName of loginFiles) {
    const loginPath = findFile(srcDir, lName);
    if (loginPath) {
        const redirectCode = `// @ts-nocheck
import React, { useEffect } from 'react';
export default function Login() {
    useEffect(() => {
        window.location.href = '/enterprise-admin/dashboard';
    }, []);
    return null; // Renders completely invisible
}
`;
        fs.writeFileSync(loginPath, redirectCode);
        console.log(`✅ ${lName} converted to an invisible instant redirect.`);
    }
}

// 3. FORCE SUPABASE MOCK TO BE 0-MILLISECOND SYNCHRONOUS
const supabasePath = findFile(srcDir, 'supabase.ts');
if (supabasePath) {
    const syncSupabase = `// @ts-nocheck
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: { user: { id: '1', role: 'SUPER_ADMIN' } } }, error: null }),
    getUser: async () => ({ data: { user: { id: '1', role: 'SUPER_ADMIN' } }, error: null }),
    onAuthStateChange: (cb) => {
      // Synchronous execution. No setTimeout delays.
      cb('SIGNED_IN', { user: { id: '1', role: 'SUPER_ADMIN' } }); 
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  from: () => ({ select: () => ({ limit: () => ({ data: [], error: null }), single: () => ({ data: { role: 'SUPER_ADMIN' }}) }) })
};
`;
    fs.writeFileSync(supabasePath, syncSupabase);
    console.log("✅ Supabase mock updated to be 100% synchronous.");
}

console.log("--------------------------------------------------------");
console.log("🚀 GOLDEN PATH SECURED. Start server and go to localhost:5175.");
console.log("--------------------------------------------------------");