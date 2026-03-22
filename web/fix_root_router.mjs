import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');
const mainFile = path.join(srcDir, 'main.tsx');

console.log("🌐 WRAPPING APPLICATION IN BROWSER-ROUTER...");

if (fs.existsSync(mainFile)) {
    let code = fs.readFileSync(mainFile, 'utf8');

    // 1. Add the Import if missing
    if (!code.includes('BrowserRouter')) {
        code = "import { BrowserRouter } from 'react-router-dom';\n" + code;
    }

    // 2. Wrap <App /> with <BrowserRouter>
    // Handles both <App /> and <App></App>
    if (code.includes('<App />') && !code.includes('<BrowserRouter>')) {
        code = code.replace('<App />', '<BrowserRouter>\n    <App />\n  </BrowserRouter>');
    } else if (code.includes('<App>') && !code.includes('<BrowserRouter>')) {
        code = code.replace('<App>', '<BrowserRouter>\n    <App>');
        code = code.replace('</App>', '</App>\n  </BrowserRouter>');
    }

    fs.writeFileSync(mainFile, code);
    console.log("✅ main.tsx updated. The context error is now resolved.");
} else {
    console.log("❌ Could not find main.tsx");
}
