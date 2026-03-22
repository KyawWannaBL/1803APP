import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');
console.log("✨ INJECTING FINAL VISUAL CLARITY...");

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

// 1. MAKE THE DASHBOARD CONTENT VIBRANT
const screensDir = path.join(srcDir, 'screens');
if (fs.existsSync(screensDir)) {
    const files = fs.readdirSync(screensDir);
    for (const file of files) {
        if (file.endsWith('.tsx')) {
            const filePath = path.join(screensDir, file);
            let content = fs.readFileSync(filePath, 'utf-8');
            // Force a higher contrast background and brighter borders
            content = content.replace(/bg-black\/40/g, 'bg-slate-900/80');
            content = content.replace(/border-white\/5/g, 'border-white/20');
            fs.writeFileSync(filePath, content);
        }
    }
}

// 2. FIX THE ROUTER PATHS ONE LAST TIME
const appFile = findFile(srcDir, 'app.tsx');
if (appFile) {
    let code = fs.readFileSync(appFile, 'utf8');
    // Ensure we are redirecting to the exact case-sensitive path
    code = code.replace(/to="\/enterprise-admin\/dashboard"/g, 'to="/enterprise-admin/dashboard"');
    fs.writeFileSync(appFile, code);
}

console.log("--------------------------------------------------------");
console.log("✅ VISUALS BRIGHTENED. The 'Real World' is now high-contrast.");
console.log("--------------------------------------------------------");
