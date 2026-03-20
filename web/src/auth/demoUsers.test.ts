import { describe, expect, it } from 'vitest';
import { demoUsers } from '@/auth/demoUsers';

describe('demoUsers', () => {
  it('uses unique emails', () => {
    const emails = demoUsers.map((user) => user.email);
    expect(new Set(emails).size).toBe(emails.length);
  });

  it('maps one role per demo persona', () => {
    const roles = demoUsers.map((user) => user.role);
    expect(new Set(roles).size).toBe(roles.length);
  });
});
