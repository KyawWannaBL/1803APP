import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');
console.log("🚨 INITIATING GOD MODE...");

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

// 1. KILL THE DEMO MODE TRAP
const authFile = findFile(srcDir, 'authprovider.tsx');
if (authFile) {
    let code = fs.readFileSync(authFile, 'utf8');
    code = code.replace(/mode:\s*['"]demo['"]/g, "mode: 'supabase'");
    fs.writeFileSync(authFile, code);
    console.log("✅ Demo Mode trap disabled.");
}

// 2. FORCE SUPABASE TO RECOGNIZE YOU AS SUPER_ADMIN
const supabasePath = findFile(srcDir, 'supabase.ts');
if (supabasePath) {
    const mockSupabase = `// @ts-nocheck
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: { user: { id: '1', role: 'SUPER_ADMIN' } } }, error: null }),
    getUser: async () => ({ data: { user: { id: '1', role: 'SUPER_ADMIN' } }, error: null }),
    onAuthStateChange: (cb) => {
      setTimeout(() => cb('SIGNED_IN', { session: { user: { id: '1', role: 'SUPER_ADMIN' } } }), 50);
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signInWithPassword: async () => {
      setTimeout(() => { window.location.href = '/enterprise-admin/dashboard'; }, 100);
      return { data: { session: {}, user: { id: '1', role: 'SUPER_ADMIN' } }, error: null };
    },
    signOut: async () => {
      setTimeout(() => { window.location.href = '/login'; }, 100);
      return { error: null };
    }
  },
  from: () => ({ 
      select: () => ({ 
          limit: () => ({ data: [], error: null }),
          single: () => ({ data: { role: 'SUPER_ADMIN', role_level: 'L5', is_active: true }, error: null })
      }) 
  })
};
`;
    fs.writeFileSync(supabasePath, mockSupabase);
    console.log("✅ Security mocked. You are now permanently recognized as L5 SUPER_ADMIN.");
}

// 3. OBLITERATE THE LOGIN SCREEN AND REPLACE IT WITH A GIANT BUTTON
const loginFiles = ['login.tsx', 'loginform.tsx', 'loginpage.tsx'];
for (const lName of loginFiles) {
    const loginFile = findFile(srcDir, lName);
    if (loginFile) {
        const fakeLogin = `import React from 'react';
export default function Login() {
    return (
        <div style={{height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a'}}>
            <h1 style={{color: '#10b981', fontSize: '32px', marginBottom: '20px', fontWeight: '900', fontFamily: 'sans-serif'}}>SECURITY BYPASSED</h1>
            <p style={{color: '#94a3b8', marginBottom: '40px'}}>L5 SUPER_ADMIN Authorized.</p>
            <button 
                onClick={() => window.location.href = '/enterprise-admin/dashboard'}
                style={{padding: '20px 40px', background: '#10b981', color: 'white', fontWeight: '900', fontSize: '24px', borderRadius: '12px', cursor: 'pointer', border: 'none', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.5)'}}
            >
                ENTER ENTERPRISE DASHBOARD
            </button>
        </div>
    );
}
`;
        fs.writeFileSync(loginFile, fakeLogin);
        console.log(`✅ Login screen (${lName}) completely overwritten with God Mode entry point.`);
    }
}

console.log("--------------------------------------------------------");
console.log("🔥 GOD MODE ENABLED. Start server and click the giant green button.");
console.log("--------------------------------------------------------");