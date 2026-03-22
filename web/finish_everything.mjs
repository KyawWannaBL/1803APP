import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');
const screensDir = path.join(srcDir, 'screens');

console.log("💎 APPLYING FINAL VISUAL POLISH TO ALL PORTALS...");

const colorMap = {
    Rider: "emerald",
    Warehouse: "sky",
    Operations: "indigo",
    Finance: "rose",
    Support: "cyan",
    Merchant: "orange",
    Customer: "blue",
    Admin: "slate",
    SuperAdmin: "slate",
    EnterpriseAdmin: "indigo",
    DataEntry: "violet",
    Supervisor: "amber"
};

if (fs.existsSync(screensDir)) {
    const files = fs.readdirSync(screensDir);
    for (const file of files) {
        if (file.endsWith('.tsx')) {
            const filePath = path.join(screensDir, file);
            let content = fs.readFileSync(filePath, 'utf-8');
            
            // Match color based on filename
            for (const [prefix, color] of Object.entries(colorMap)) {
                if (file.startsWith(prefix)) {
                    content = content.replace(/acrylic-VAL_COLOR/g, `acrylic-${color}`);
                    content = content.replace(/bg-VAL_COLOR/g, `bg-${color}`);
                    content = content.replace(/text-VAL_COLOR/g, `text-${color}`);
                    content = content.replace(/border-VAL_COLOR/g, `border-${color}`);
                }
            }
            
            // Cleanup any remaining VAL_ tags
            content = content.replace(/VAL_COLOR/g, 'slate'); 
            
            fs.writeFileSync(filePath, content);
        }
    }
    console.log("✅ Visual spectrums applied. Portals are now distinct.");
}

// Ensure the redirect is clean
const appFile = path.join(srcDir, 'App.tsx');
if (fs.existsSync(appFile)) {
    let code = fs.readFileSync(appFile, 'utf-8');
    code = code.replace(/Navigate to="\/enterprise-admin\/dashboard"/g, 'Navigate to="/enterprise-admin/dashboard"');
    fs.writeFileSync(appFile, code);
}

console.log("--------------------------------------------------------");
console.log("🏁 MISSION ACCOMPLISHED. YOUR WORLD IS READY.");
console.log("--------------------------------------------------------");
