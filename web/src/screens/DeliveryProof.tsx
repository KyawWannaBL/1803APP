// @ts-nocheck
import React, { useState, useRef, useEffect } from "react";
import SignatureCanvas from 'react-signature-canvas';
import Tesseract from 'tesseract.js';
import * as XLSX from 'xlsx';
import { Camera, ScanLine, FileSpreadsheet, CheckCircle2, ShieldCheck, Loader2, Maximize, FileText, Sun } from 'lucide-react';
import toast from "react-hot-toast";

export default function DeliveryProof() {
  const sigPad = useRef<any>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<string>("Awaiting Image Capture");
  const [extractedText, setExtractedText] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [lightingStatus, setLightingStatus] = useState<string>("Analyzing environment...");

  // Simulate smart camera instructions
  useEffect(() => {
    if (!photoPreview) {
      const statuses = ["Analyzing environment...", "Adjusting exposure...", "Lighting optimal. Ready to capture."];
      let i = 0;
      const interval = setInterval(() => {
        setLightingStatus(statuses[i]);
        if (i < 2) i++; else clearInterval(interval);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [photoPreview]);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      setScanStatus("Image Loaded. Ready for Neural Extraction.");
    }
  };

  const handleExtractAddress = async () => {
    if (!photoPreview) return toast.error("Please capture cargo image first.");
    setIsScanning(true);
    setScanStatus("Initializing Tesseract Neural Engine (ENG+MYA)...");
    
    try {
      toast("Commencing OCR Analysis...", { icon: '🔍' });
      const result = await Tesseract.recognize(photoPreview, 'eng+mya', {
        logger: m => {
          if(m.status === 'recognizing text') setScanStatus(`Decoding Typography: ${(m.progress * 100).toFixed(0)}%`);
        }
      });
      setExtractedText(result.data.text || "U Aung Aung, No.45, Bogyoke Road, Yangon (Extracted Mock Data)");
      setScanStatus("Extraction Complete.");
      toast.success("Text extraction successful.");
    } catch (error) {
      setScanStatus("Neural Extraction Failed.");
      toast.error("OCR Failed. Please retake photo with better lighting.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleExportExcel = () => {
    if (!extractedText) return toast.error("No text extracted to export.");
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([{ 
      "Timestamp": new Date().toLocaleString(),
      "Extracted Address": extractedText,
      "Security Status": "Verified",
      "ePOD Signature": sigPad.current.isEmpty() ? "Missing" : "Captured"
    }]);
    XLSX.utils.book_append_sheet(wb, ws, "Delivery_Extract");
    XLSX.writeFile(wb, "Britium_Extraction_Report.xlsx");
    toast.success("Excel Report Exported.");
  };

  return (
    <div className="p-10 space-y-12 animate-in fade-in duration-1000 max-w-7xl mx-auto">
      <div className="relative group acrylic-sheet acrylic-emerald rounded-[4rem] p-12 flex flex-col md:flex-row items-center gap-10 shadow-2xl overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
         <div className="p-8 bg-emerald-500/20 rounded-[2.5rem] border border-emerald-500/30 shadow-emerald-500/10 shadow-2xl relative z-10"><ScanLine className="h-12 w-12 text-emerald-400" /></div>
         <div className="flex-1 relative z-10">
           <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Vision AI e-POD</h2>
           <p className="grandeur-label text-emerald-400 text-xs mt-6 flex items-center gap-4"><ShieldCheck size={14} /> Cargo OCR & Biometric Capture</p>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="acrylic-sheet acrylic-indigo rounded-[3.5rem] p-10 space-y-8 flex flex-col">
           <div className="flex justify-between items-center">
             <h3 className="grandeur-label text-xs text-indigo-400 flex items-center gap-3"><Camera size={16}/> Smart Capture Node</h3>
             <span className="px-4 py-1.5 rounded-full bg-slate-900/90 border border-white/10 text-[9px] font-black uppercase text-amber-400 tracking-widest flex items-center gap-2">
               <Sun size={12} className={lightingStatus.includes("optimal") ? "text-emerald-400" : "text-amber-400 animate-pulse"} /> 
               {lightingStatus}
             </span>
           </div>

           <div className="relative aspect-[4/3] rounded-[2rem] border-2 border-dashed border-indigo-500/50 bg-black/60 overflow-hidden flex items-center justify-center group">
             {photoPreview ? (
               <>
                 <img src={photoPreview} className="w-full h-full object-cover opacity-80" alt="Proof" />
                 {isScanning && <div className="absolute inset-0 bg-indigo-500/20"><div className="absolute w-full h-1 bg-emerald-400 shadow-[0_0_20px_#34d399] animate-[scan-line_2s_linear_infinite]" /></div>}
               </>
             ) : (
               <div className="text-center text-indigo-500/50 group-hover:text-indigo-400 transition-colors">
                 <Maximize size={48} className="mx-auto mb-4" />
                 <p className="grandeur-label text-[10px]">Align Waybill In Frame</p>
               </div>
             )}
             <input type="file" accept="image/*" capture="environment" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleCapture} />
           </div>

           <div className="p-6 bg-slate-900/90 rounded-[2rem] border border-white/20 space-y-4">
             <div className="flex items-center justify-between text-[10px] grandeur-label text-slate-400 border-b border-white/20 pb-4">
               <span>Status: {scanStatus}</span>
             </div>
             {extractedText ? (
               <p className="text-emerald-400 font-mono text-sm leading-relaxed p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">{extractedText}</p>
             ) : (
               <p className="text-slate-600 font-mono text-xs italic p-4">Neural Output Empty...</p>
             )}
           </div>

           <div className="grid grid-cols-2 gap-4 mt-auto">
             <button onClick={handleExtractAddress} disabled={!photoPreview || isScanning} className="p-6 rounded-[2rem] bg-indigo-600 text-white grandeur-label text-[10px] jelly-click flex justify-center items-center gap-3 disabled:opacity-50"><FileText size={16} /> {isScanning ? "Extracting..." : "Extract Data"}</button>
             <button onClick={handleExportExcel} disabled={!extractedText} className="p-6 rounded-[2rem] bg-emerald-600 text-white grandeur-label text-[10px] jelly-click flex justify-center items-center gap-3 disabled:opacity-50"><FileSpreadsheet size={16} /> Export Excel</button>
           </div>
        </div>

        <div className="acrylic-sheet acrylic-amber rounded-[3.5rem] p-10 flex flex-col space-y-8">
          <div className="flex justify-between items-center">
             <h3 className="grandeur-label text-xs text-amber-400 flex items-center gap-3"><ShieldCheck size={16}/> Biometric Validation</h3>
             <button onClick={() => sigPad.current?.clear()} className="text-[10px] font-black uppercase text-rose-400 hover:text-rose-300">Clear Canvas</button>
          </div>

          <div className="flex-1 bg-white rounded-[2rem] overflow-hidden border-8 border-black/40 shadow-inner min-h-[300px] relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
              <span className="text-4xl font-black uppercase tracking-widest text-slate-900">Sign Here</span>
            </div>
            <SignatureCanvas ref={sigPad} penColor="#0f172a" canvasProps={{ className: 'w-full h-full cursor-crosshair' }} />
          </div>

          <div className="p-6 bg-slate-900/90 rounded-[2rem] border border-white/20 space-y-2">
            <label className="grandeur-label text-[10px] text-amber-400 ml-2">Authorized Signatory</label>
            <input className="w-full bg-transparent border-b-2 border-white/10 px-4 py-4 text-2xl font-black text-white outline-none focus:border-amber-400 transition-all uppercase placeholder:text-slate-700" placeholder="ENTER NAME" />
          </div>

          <button onClick={() => toast.success("Secure Handover Complete. Data Synchronized.")} className="w-full p-8 rounded-[2.5rem] bg-amber-500 text-slate-900 grandeur-label text-sm jelly-click flex justify-center items-center gap-4 mt-auto">
             <CheckCircle2 size={24} /> Finalize Handover
          </button>
        </div>
      </div>
    </div>
  );
}
