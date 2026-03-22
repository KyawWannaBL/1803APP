// @ts-nocheck
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: { user: { id: '1', role: 'SUPER_ADMIN' } } }, error: null }),
    getUser: async () => ({ data: { user: { id: '1', role: 'SUPER_ADMIN' } }, error: null }),
    onAuthStateChange: (cb) => {
      setTimeout(() => cb('SIGNED_IN', { session: { user: { id: '1', role: 'SUPER_ADMIN' } } }), 50);
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signInWithPassword: async () => {
      setTimeout(() => { window.location.href = '/enterprise-admin/dashboard'; }, 100);
      return { data: { session: {}, user: { id: '1', role: 'SUPER_ADMIN' } }, error: null };
    },
    signOut: async () => {
      setTimeout(() => { window.location.href = '/login'; }, 100);
      return { error: null };
    }
  },
  from: () => ({ 
      select: () => ({ 
          limit: () => ({ data: [], error: null }),
          single: () => ({ data: { role: 'SUPER_ADMIN', role_level: 'L5', is_active: true }, error: null })
      }) 
  })
};
