import {
  assignDeliveryTask,
  createRecord,
  deleteRecord,
  fetchDataset,
  resetDemoState,
  updateOrderStatus,
  confirmPickup,
} from '@/services/repositories';

describe('repositories demo state', () => {
  beforeEach(() => {
    resetDemoState();
  });

  it('creates, updates and deletes records in demo mode', async () => {
    const createResult = await createRecord('tickets', { subject: 'Test ticket', status: 'open' });
    expect(createResult.error).toBeNull();

    const tickets = await fetchDataset('tickets', 20);
    const created = tickets.find((row) => row.subject === 'Test ticket');
    expect(created).toBeTruthy();

    const updateResult = await updateOrderStatus('ord-1001', 'validated', { assigned_rider_id: 'rider-02' });
    expect(updateResult.error).toBeNull();

    const orders = await fetchDataset('orders', 20);
    expect(orders.find((row) => row.id === 'ord-1001')?.status_code).toBe('validated');

    const deleteResult = await deleteRecord('tickets', String(created?.id));
    expect(deleteResult.error).toBeNull();

    const afterDelete = await fetchDataset('tickets', 20);
    expect(afterDelete.find((row) => row.id === created?.id)).toBeUndefined();
  });

  it('keeps rider workflow mutations across reloads', async () => {
    const assignResult = await assignDeliveryTask('task-1001', 'rider-02');
    expect(assignResult.error).toBeNull();

    const pickupResult = await confirmPickup('task-1002');
    expect(pickupResult.error).toBeNull();

    const tasks = await fetchDataset('delivery_tasks', 20);
    expect(tasks.find((row) => row.id === 'task-1001')?.assigned_rider_id).toBe('rider-02');
    expect(tasks.find((row) => row.id === 'task-1002')?.status).toBe('picked_up');
  });
});