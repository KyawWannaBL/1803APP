// @ts-nocheck
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export const WaybillTemplate = ({ data, size = "4x6", userId }) => {
  const getContainerClass = () => {
    switch(size) {
      case "A4": return "w-[210mm] h-[297mm] p-8 text-base";
      case "A5": return "w-[148mm] h-[210mm] p-6 text-sm";
      case "4x6": return "w-[4in] h-[6in] p-3 text-[11px]";
      case "4x3": return "w-[4in] h-[3in] p-2 text-[9px]";
      case "4x3_dual": return "w-[4in] h-[6in] flex flex-col"; 
      default: return "w-[4in] h-[6in] p-3 text-[11px]";
    }
  };

  const SingleWaybill = ({ item, isHalf = false }) => (
    <div className={`bg-white border-2 border-black text-black font-sans overflow-hidden ${isHalf ? 'h-[3in] p-2 text-[9px] border-b-dashed' : 'h-full flex flex-col'}`}>
      <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-black italic text-xs shrink-0">BE</div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-tighter leading-none">Britium Express</h1>
            <p className="text-[9px] font-bold text-slate-700">DELIVERY SERVICE</p>
            <p className="text-[9px] font-bold">HotLine: 09 - 897 44 77 44</p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <p className="text-[8px] font-bold mb-1">{new Date().toISOString().replace('T', ' ').substring(0, 19)}</p>
          <QRCodeSVG value={item.waybillId} size={isHalf ? 45 : 55} />
          <p className="text-[8px] font-mono mt-1 font-black">{item.waybillId}</p>
        </div>
      </div>

      <div className="border-b-2 border-black pb-2 mb-2 space-y-1">
        <div className="flex gap-2">
          <span className="font-bold w-14 text-[9px]">Merchant:</span>
          <div className="flex-1 leading-tight">
            <p className="font-bold">{item.merchantName}</p>
            <p className="text-[9px]">{item.merchantPhone}</p>
            <p className="text-[9px] text-slate-700 truncate">{item.merchantAddress}</p>
          </div>
        </div>
        <div className="flex gap-2 border-t border-black pt-1 mt-1">
          <span className="font-bold w-14 text-[9px]">Recipient:</span>
          <div className="flex-1 leading-tight">
            <p className="font-black text-base leading-none mb-1">{item.recipientName}</p>
            <p className="font-black text-[10px]">{item.recipientPhone}</p>
            <p className="text-[9px] truncate">{item.recipientAddress}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 border-b-2 border-black mb-2 text-center py-1 font-black text-xs uppercase bg-slate-50">
        <div className="border-r-2 border-black">** {item.origin} **</div>
        <div>** {item.destination} **</div>
      </div>

      <div className="grid grid-cols-2 gap-0 border-b-2 border-black mb-2">
        <div className="border-r-2 border-black p-1.5 space-y-0.5">
          <div className="flex justify-between text-[9px]"><span>CBM:</span> <span className="font-black">{item.cbm}</span></div>
          <div className="flex justify-between text-[9px]"><span>Weight (kg):</span> <span className="font-black">≤{item.weight}</span></div>
          <div className="flex justify-between text-[9px]"><span>Delivery:</span> <span className="font-black">{item.type}</span></div>
        </div>
        <div className="p-1.5 space-y-0.5">
          <div className="flex justify-between text-[9px]"><span>Item Price:</span> <span>{item.itemPrice}</span></div>
          <div className="flex justify-between text-[9px]"><span>Delivery Fees:</span> <span>{item.fees}</span></div>
          <div className="flex justify-between text-[9px]"><span>Prepaid:</span> <span>{item.prepaid}</span></div>
        </div>
      </div>

      <div className="bg-slate-300 border-2 border-black p-2 flex justify-between items-center mb-2">
        <span className="font-black text-xs">COD</span>
        <div className="text-right">
          <span className="text-2xl font-black">{item.cod}</span>
          <span className="block text-[8px] font-black uppercase text-slate-700 -mt-1">MMK</span>
        </div>
      </div>

      <div className="text-[8px] mt-auto">
        <p className="leading-tight mb-1"><span className="font-bold">Remarks:</span> {item.remarks}</p>
        <div className="border-t-2 border-black pt-1">
          <p className="font-black text-[7.5px] leading-tight">အောက်ပါ စည်းကမ်းချက်များကို ဖတ်ရှုရန်... Hotline သို့ ဆက်သွယ် တိုင်ကြားနိုင်ပါသည်။</p>
          <div className="flex justify-between items-center mt-1">
             <span className="font-black text-[7px]">USER: {userId}</span>
             <span className="bg-black text-white px-1.5 py-0.5 text-[6px] uppercase tracking-widest rounded-sm">Verified</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (size === "4x3_dual" && Array.isArray(data) && data.length >= 2) {
    return (
      <div className={getContainerClass()}>
        <SingleWaybill item={data[0]} isHalf={true} />
        <div className="w-full border-t-2 border-dashed border-slate-400 relative">
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[6px] font-black text-slate-400 tracking-[0.2em]">CUT HERE</span>
        </div>
        <SingleWaybill item={data[1]} isHalf={true} />
      </div>
    );
  }

  const itemData = Array.isArray(data) ? data[0] : data;
  return <div className={getContainerClass()}><SingleWaybill item={itemData} /></div>;
};
