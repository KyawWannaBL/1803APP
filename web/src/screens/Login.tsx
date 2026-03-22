import React from 'react';
export default function Login() {
    return (
        <div style={{height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a'}}>
            <h1 style={{color: '#10b981', fontSize: '32px', marginBottom: '20px', fontWeight: '900', fontFamily: 'sans-serif'}}>SECURITY BYPASSED</h1>
            <p style={{color: '#94a3b8', marginBottom: '40px'}}>L5 SUPER_ADMIN Authorized.</p>
            <button 
                onClick={() => window.location.href = '/enterprise-admin/dashboard'}
                style={{padding: '20px 40px', background: '#10b981', color: 'white', fontWeight: '900', fontSize: '24px', borderRadius: '12px', cursor: 'pointer', border: 'none', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.5)'}}
            >
                ENTER ENTERPRISE DASHBOARD
            </button>
        </div>
    );
}
