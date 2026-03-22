import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');
const appFile = path.join(srcDir, 'App.tsx');

console.log("🏗️ APPLYING DEEP ROOT ROUTER FIX...");

if (fs.existsSync(appFile)) {
    let code = fs.readFileSync(appFile, 'utf8');

    // 1. Ensure BrowserRouter is imported
    if (!code.includes('BrowserRouter')) {
        code = code.replace("import { Routes", "import { BrowserRouter, Routes");
    }

    // 2. Wrap the entire return statement in BrowserRouter
    // This moves the "Engine" inside the App component itself
    if (code.includes('<Routes>') && !code.includes('<BrowserRouter>')) {
        code = code.replace('<Routes>', '<BrowserRouter>\n      <Routes>');
        code = code.replace('</Routes>', '</Routes>\n    </BrowserRouter>');
    }

    fs.writeFileSync(appFile, code);
    console.log("✅ App.tsx updated: BrowserRouter is now internally integrated.");
}

// 3. Clean main.tsx to be a simple, standard entry point
const mainFile = path.join(srcDir, 'main.tsx');
if (fs.existsSync(mainFile)) {
    let mainCode = fs.readFileSync(mainFile, 'utf8');
    // Remove the extra wrapper from main to avoid "Nested Router" errors
    mainCode = mainCode.replace('<BrowserRouter>', '').replace('</BrowserRouter>', '');
    fs.writeFileSync(mainFile, mainCode);
    console.log("✅ main.tsx cleaned.");
}
