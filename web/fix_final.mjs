import fs from 'fs';
import path from 'path';

const appFile = path.join(process.cwd(), 'src', 'App.tsx');
console.log("🛠️ APPLYING THE FINAL SYNTAX CURE...");

if (fs.existsSync(appFile)) {
    let code = fs.readFileSync(appFile, 'utf8');

    // Violently hunt down any empty fragments inside an element prop
    code = code.replace(/element=\{\s*<>\s*\}/g, 'element={<Outlet />}');

    // Ensure Outlet is imported so React knows what it is
    if (!code.includes('Outlet')) {
        code = "import { Outlet } from 'react-router-dom';\n" + code;
    }

    fs.writeFileSync(appFile, code);
    console.log("✅ Broken tag obliterated and replaced with <Outlet />.");
} else {
    console.log("❌ Could not find App.tsx");
}
