import { evaluateTransitionRequirements, transitionEntity } from '@/services/workflowService';
import { fetchDataset, resetDemoState } from '@/services/repositories';

describe('workflowService', () => {
  beforeEach(() => {
    resetDemoState();
  });

  it('evaluates transition requirements correctly', () => {
    const results = evaluateTransitionRequirements(
      {
        sender_name: 'Merchant',
        sender_address: 'Yangon',
        receiver_name: 'Customer',
        receiver_address: 'Tamwe',
        total_charge_mm_k: 5,
      },
      ['required_fields_complete', 'pricing_validated', 'address_validated'],
    );

    expect(results.every((row) => row.passed)).toBe(true);
  });

  it('transitions orders in demo mode using fallback persistence', async () => {
    const result = await transitionEntity('order', 'ord-1001', 'validate_order', {
      from: 'created',
      to: 'validated',
      context: { validated_at: new Date().toISOString() },
    });

    expect(result.error).toBeNull();

    const orders = await fetchDataset('orders', 20);
    expect(orders.find((row) => row.id === 'ord-1001')?.status_code).toBe('validated');
  });
});