import fs from 'fs';
import path from 'path';

const appFile = path.join(process.cwd(), 'src', 'App.tsx');
console.log("🛠️ FIXING ROUTER SYNTAX ERROR...");

if (fs.existsSync(appFile)) {
    let code = fs.readFileSync(appFile, 'utf8');

    // 1. Fix the broken half-tag
    code = code.replace(/<Route\s+element=\{<>\}\s*>/g, "<Route element={<Outlet />}>");
    
    // Clean up any other broken fragments left by the security wipe
    code = code.replace(/element=\{<>\s*<\/>\}/g, "element={<Outlet />}");

    // 2. Make sure Outlet is imported so React knows what it is
    if (!code.includes('Outlet')) {
        code = "import { Outlet } from 'react-router-dom';\n" + code;
    }

    fs.writeFileSync(appFile, code);
    console.log("✅ Syntax fixed! Broken tag replaced with transparent <Outlet />.");
} else {
    console.log("❌ Could not find App.tsx");
}

console.log("--------------------------------------------------------");
console.log("🎉 DONE. Restart your server.");
console.log("--------------------------------------------------------");
