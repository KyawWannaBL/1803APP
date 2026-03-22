import fs from 'fs';
import path from 'path';

const appFile = path.join(process.cwd(), 'src', 'App.tsx');
console.log("🛠️ FIXING APPSHELL IMPORT SYNTAX...");

if (fs.existsSync(appFile)) {
    let code = fs.readFileSync(appFile, 'utf8');

    // Change default import to a named import to match your component structure
    // This converts: import AppShell from '...'  TO  import { AppShell } from '...'
    code = code.replace(/import AppShell from/g, "import { AppShell } from");

    fs.writeFileSync(appFile, code);
    console.log("✅ App.tsx updated: Changed AppShell to a named import.");
} else {
    console.log("❌ Could not find App.tsx");
}
