import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');
console.log("🚨 INITIATING EMERGENCY DOOR BREACH...");

function findFile(dir, fileName) {
    if (!fs.existsSync(dir)) return null;
    for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            const res = findFile(fullPath, fileName);
            if (res) return res;
        } else if (file === fileName) return fullPath;
    }
    return null;
}

// 1. RESTORE NATIVE DEMO MODE
const authFile = findFile(srcDir, 'AuthProvider.tsx');
if (authFile) {
    let code = fs.readFileSync(authFile, 'utf8');
    code = code.replace(/mode:\s*['"]supabase['"]/g, "mode: 'demo'");
    code = code.replace(/enableDemoFallback:\s*false/g, "enableDemoFallback: true");
    fs.writeFileSync(authFile, code);
    console.log("✅ Internal logic reverted to Demo Mode.");
}

// 2. DESTROY THE ROUTER SECURITY GUARDS
const appFile = findFile(srcDir, 'App.tsx');
if (appFile) {
    let code = fs.readFileSync(appFile, 'utf8');
    code = code.replace(/<ProtectedRoute[^>]*>/g, "<>");
    code = code.replace(/<\/ProtectedRoute>/g, "</>");
    code = code.replace(/<RequireAuth[^>]*>/g, "<>");
    code = code.replace(/<\/RequireAuth>/g, "</>");
    fs.writeFileSync(appFile, code);
    console.log("✅ Security guards permanently removed from router.");
}

// 3. HIJACK THE LOGIN BUTTON
const mainFile = findFile(srcDir, 'main.tsx');
if (mainFile) {
    let code = fs.readFileSync(mainFile, 'utf8');
    if (!code.includes('britiumEmergencyBypass')) {
        code += `
// --- EMERGENCY LOGIN BYPASS ---
window.britiumEmergencyBypass = true;
if (typeof document !== 'undefined') {
    document.addEventListener('click', (e) => {
        const text = (e.target.textContent || '').toLowerCase();
        const value = (e.target.value || '').toLowerCase();
        if (text.includes('sign in') || text.includes('signing in') || value.includes('sign in')) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = '/enterprise-admin/dashboard';
        }
    }, true);
}
`;
        fs.writeFileSync(mainFile, code);
        console.log("✅ Login button hijacked. It will now instantly teleport you.");
    }
}

console.log("--------------------------------------------------------");
console.log("🚪 THE DOOR IS OBLITERATED. Restart your server and click Sign In.");
console.log("--------------------------------------------------------");
