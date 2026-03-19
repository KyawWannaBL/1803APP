import demoRecords from '@/data/demoRecords.json';
import tableSchemas from '@/data/tableSchemas.json';
import { supabase } from '@/lib/supabase';
import { env } from '@/lib/env';
import type { ScreenCatalogEntry } from '@/types';

export type GenericRecord = Record<string, any>;
export type TableSchemaField = {
  name: string;
  type: string;
  required: boolean;
  hasDefault: boolean;
  references: string | null;
};

const DEMO_STORAGE_KEY = 'britium-demo-db-v1';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function useDemo() {
  return !supabase || env.enableDemoFallback;
}

function readDemoDb(): Record<string, GenericRecord[]> {
  const seed = clone(demoRecords as Record<string, GenericRecord[]>);

  if (typeof window === 'undefined') return seed;

  const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }

  try {
    return JSON.parse(raw);
  } catch {
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
}

function writeDemoDb(db: Record<string, GenericRecord[]>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(db));
}

function demoTable(table: string): GenericRecord[] {
  return readDemoDb()[table] ?? [];
}

function patchDemoTable(
  table: string,
  updater: (rows: GenericRecord[]) => GenericRecord[],
): GenericRecord[] {
  const db = readDemoDb();
  const nextRows = updater(clone(db[table] ?? []));
  db[table] = nextRows;
  writeDemoDb(db);
  return nextRows;
}

function nowIso() {
  return new Date().toISOString();
}

export function resetDemoState() {
  writeDemoDb(clone(demoRecords as Record<string, GenericRecord[]>));
}

export function getTableSchema(table: string): TableSchemaField[] {
  return (tableSchemas as Record<string, TableSchemaField[]>)[table] ?? [];
}

export async function fetchPortalSummary(role: string) {
  const primaryTables = [
    'orders',
    'delivery_tasks',
    'tickets',
    'inbound_manifests',
    'outbound_manifests',
    'notifications',
  ];

  const counts = await Promise.all(primaryTables.map((table) => countTable(table)));
  const summary = Object.fromEntries(primaryTables.map((table, index) => [table, counts[index]]));

  return {
    role,
    totalOrders: summary.orders ?? 0,
    activeTasks: summary.delivery_tasks ?? 0,
    openTickets: summary.tickets ?? 0,
    inboundManifests: summary.inbound_manifests ?? 0,
    outboundManifests: summary.outbound_manifests ?? 0,
    notifications: summary.notifications ?? 0,
  };
}

export async function countTable(table: string): Promise<number> {
  if (!table) return 0;
  if (useDemo()) return demoTable(table).length;

  const { count, error } = await supabase!.from(table).select('*', { count: 'exact', head: true });
  if (error) {
    console.warn(`countTable(${table}) failed:`, error.message);
    return 0;
  }
  return count ?? 0;
}

async function selectWithBestOrder(table: string, limit = 25) {
  const ordered = await supabase!
    .from(table)
    .select('*')
    .limit(limit)
    .order('updated_at', { ascending: false, nullsFirst: false });

  if (!ordered.error) return ordered.data ?? [];

  const createdFallback = await supabase!
    .from(table)
    .select('*')
    .limit(limit)
    .order('created_at', { ascending: false, nullsFirst: false });

  if (!createdFallback.error) return createdFallback.data ?? [];

  const fallback = await supabase!.from(table).select('*').limit(limit);
  if (fallback.error) {
    console.warn(`fetchDataset(${table}) failed:`, fallback.error.message);
    return [];
  }
  return fallback.data ?? [];
}

export async function fetchDataset(table: string, limit = 25): Promise<GenericRecord[]> {
  if (!table) return [];
  if (useDemo()) {
    return clone(demoTable(table))
      .sort((a, b) => String(b.updated_at ?? b.created_at ?? '').localeCompare(String(a.updated_at ?? a.created_at ?? '')))
      .slice(0, limit);
  }
  return selectWithBestOrder(table, limit);
}

export async function fetchScreenDatasets(screen: ScreenCatalogEntry, limit = 10) {
  const datasets: Record<string, GenericRecord[]> = {};
  for (const table of screen.tables.slice(0, 3)) {
    datasets[table] = await fetchDataset(table, limit);
  }
  return datasets;
}

export function normalizeDraft(table: string, draft: GenericRecord) {
  const schema = getTableSchema(table);
  const normalized: GenericRecord = {};
  for (const field of schema) {
    if (['id', 'created_at', 'updated_at'].includes(field.name)) continue;
    const value = draft[field.name];
    if (value === '' || value === undefined) continue;
    if (field.type.startsWith('numeric')) normalized[field.name] = Number(value);
    else if (field.type === 'integer') normalized[field.name] = Number(value);
    else if (field.type === 'boolean') normalized[field.name] = value === true || value === 'true';
    else normalized[field.name] = value;
  }
  return normalized;
}

export async function createRecord(table: string, draft: GenericRecord) {
  const payload = normalizeDraft(table, draft);
  if (useDemo()) {
    const id = draft.id ?? `${table}-${Date.now()}`;
    const row = { id, ...payload, created_at: nowIso(), updated_at: nowIso() };
    patchDemoTable(table, (rows) => [row, ...rows]);
    return { data: row, error: null };
  }
  const { data, error } = await supabase!.from(table).insert(payload).select().single();
  return { data, error };
}

export async function updateRecord(table: string, id: string, draft: GenericRecord) {
  const payload = normalizeDraft(table, draft);
  if (useDemo()) {
    let updated: GenericRecord = { id, ...payload, updated_at: nowIso() };
    patchDemoTable(table, (rows) =>
      rows.map((row) => {
        if (String(row.id) !== id) return row;
        updated = { ...row, ...updated };
        return updated;
      }),
    );
    return { data: updated, error: null };
  }
  const { data, error } = await supabase!.from(table).update(payload).eq('id', id).select().single();
  return { data, error };
}

export async function deleteRecord(table: string, id: string) {
  if (useDemo()) {
    patchDemoTable(table, (rows) => rows.filter((row) => String(row.id) !== id));
    return { error: null };
  }
  const { error } = await supabase!.from(table).delete().eq('id', id);
  return { error };
}

export async function fetchOperationsWorkspace() {
  const [orders, tasks, routes, tracking] = await Promise.all([
    fetchDataset('orders', 20),
    fetchDataset('delivery_tasks', 20),
    fetchDataset('route_plans', 10).catch(() => []),
    fetchDataset('tracking_events', 15),
  ]);

  return { orders, tasks, routes, tracking };
}

export async function fetchWarehouseWorkspace() {
  const [inbound, outbound, putaway, inventory, lanes, locations] = await Promise.all([
    fetchDataset('inbound_manifests', 20),
    fetchDataset('outbound_manifests', 20),
    fetchDataset('putaway_tasks', 20),
    fetchDataset('inventory_snapshots', 20),
    fetchDataset('staging_lanes', 20),
    fetchDataset('storage_locations', 20),
  ]);

  return { inbound, outbound, putaway, inventory, lanes, locations };
}

export async function fetchRiderWorkspace(riderId?: string) {
  if (useDemo()) {
    const tasks = demoTable('delivery_tasks')
      .filter((row) => !riderId || row.assigned_rider_id === riderId)
      .slice(0, 20);

    return {
      tasks,
      manifests: demoTable('handover_manifests').slice(0, 10),
      shifts: demoTable('rider_shifts').slice(0, 10),
      devices: demoTable('rider_devices').slice(0, 10),
      routes: demoTable('route_plans').slice(0, 10),
    };
  }

  let taskQuery = supabase!.from('delivery_tasks').select('*').limit(20);
  if (riderId) taskQuery = taskQuery.eq('assigned_rider_id', riderId);
  const taskResult = await taskQuery.order('planned_at', { ascending: true, nullsFirst: false });

  const [manifests, shifts, devices, routes] = await Promise.all([
    supabase!.from('handover_manifests').select('*').limit(10),
    supabase!.from('rider_shifts').select('*').limit(10),
    supabase!.from('rider_devices').select('*').limit(10),
    supabase!.from('route_plans').select('*').limit(10),
  ]);

  return {
    tasks: taskResult.data ?? [],
    manifests: manifests.data ?? [],
    shifts: shifts.data ?? [],
    devices: devices.data ?? [],
    routes: routes.data ?? [],
  };
}

export async function assignDeliveryTask(taskId: string, riderId: string) {
  if (useDemo()) {
    let updated: GenericRecord = { id: taskId, assigned_rider_id: riderId, status: 'assigned' };
    patchDemoTable('delivery_tasks', (rows) =>
      rows.map((row) => {
        if (String(row.id) !== taskId) return row;
        updated = { ...row, assigned_rider_id: riderId, status: 'assigned', updated_at: nowIso() };
        return updated;
      }),
    );
    return { data: updated, error: null };
  }
  const { data, error } = await supabase!
    .from('delivery_tasks')
    .update({ assigned_rider_id: riderId, status: 'assigned' })
    .eq('id', taskId)
    .select()
    .single();
  return { data, error };
}

export async function updateDeliveryTaskStatus(taskId: string, status: string, extra: GenericRecord = {}) {
  if (useDemo()) {
    let updated: GenericRecord = { id: taskId, status, ...extra };
    patchDemoTable('delivery_tasks', (rows) =>
      rows.map((row) => {
        if (String(row.id) !== taskId) return row;
        updated = { ...row, status, updated_at: nowIso(), ...extra };
        return updated;
      }),
    );
    return { data: updated, error: null };
  }

  const payload = { status, updated_at: nowIso(), ...extra };
  const { data, error } = await supabase!
    .from('delivery_tasks')
    .update(payload)
    .eq('id', taskId)
    .select()
    .single();

  return { data, error };
}

export async function acceptDeliveryTask(taskId: string) {
  return updateDeliveryTaskStatus(taskId, 'accepted', {
    accepted_at: nowIso(),
    rider_acceptance: true,
  });
}

export async function confirmPickup(taskId: string) {
  return updateDeliveryTaskStatus(taskId, 'picked_up', {
    pickup_confirmed_at: nowIso(),
    pickup_scan_completed: true,
  });
}

export async function startTransit(taskId: string) {
  return updateDeliveryTaskStatus(taskId, 'in_transit', {
    departed_at: nowIso(),
    departure_confirmed: true,
  });
}

export async function confirmDelivery(taskId: string) {
  return updateDeliveryTaskStatus(taskId, 'delivered', {
    delivered_at: nowIso(),
    pod_completed: true,
    signature_captured: true,
  });
}

export async function failDeliveryTask(taskId: string, reason: string) {
  return updateDeliveryTaskStatus(taskId, 'failed', {
    failed_at: nowIso(),
    failure_reason: reason,
  });
}

export async function updateOrderStatus(orderId: string, statusCode: string, extra: GenericRecord = {}) {
  if (useDemo()) {
    let updated: GenericRecord = { id: orderId, status_code: statusCode, ...extra };
    patchDemoTable('orders', (rows) =>
      rows.map((row) => {
        if (String(row.id) !== orderId) return row;
        updated = { ...row, status_code: statusCode, updated_at: nowIso(), ...extra };
        return updated;
      }),
    );
    return { data: updated, error: null };
  }
  const { data, error } = await supabase!
    .from('orders')
    .update({ status_code: statusCode, updated_at: nowIso(), ...extra })
    .eq('id', orderId)
    .select()
    .single();
  return { data, error };
}

export async function advanceManifest(
  table: 'inbound_manifests' | 'outbound_manifests',
  id: string,
  status: string,
  extra: GenericRecord = {},
) {
  if (useDemo()) {
    let updated: GenericRecord = { id, status, ...extra };
    patchDemoTable(table, (rows) =>
      rows.map((row) => {
        if (String(row.id) !== id) return row;
        updated = { ...row, status, updated_at: nowIso(), ...extra };
        return updated;
      }),
    );
    return { data: updated, error: null };
  }
  const { data, error } = await supabase!
    .from(table)
    .update({ status, updated_at: nowIso(), ...extra })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

export async function logWarehouseException(manifestId: string, notes: string) {
  if (useDemo()) {
    const row = { id: `exc-${Date.now()}`, manifest_id: manifestId, notes, status: 'open', created_at: nowIso() };
    patchDemoTable('cargo_exception_cases', (rows) => [row, ...rows]);
    return { data: row, error: null };
  }
  const { data, error } = await supabase!
    .from('cargo_exception_cases')
    .insert({ manifest_id: manifestId, notes, status: 'open' })
    .select()
    .single();
  return { data, error };
}

export function getPrimaryEntityType(
  table: string,
): 'order' | 'delivery_task' | 'inbound_manifest' | 'outbound_manifest' | null {
  if (table === 'orders') return 'order';
  if (table === 'delivery_tasks') return 'delivery_task';
  if (table === 'inbound_manifests') return 'inbound_manifest';
  if (table === 'outbound_manifests' || table === 'handover_manifests') return 'outbound_manifest';
  return null;
}