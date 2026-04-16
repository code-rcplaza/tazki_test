import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getRequests, updateRequestStatus } from './requests.api';

const SEED = [
  { id: '1', title: 'Actualizar documentación', requester: 'María Pérez', status: 'pending', created_at: '2026-04-01T09:00:00Z' },
  { id: '2', title: 'Revisar acceso', requester: 'Juan Soto', status: 'approved', created_at: '2026-04-03T11:00:00Z' },
  { id: '3', title: 'Corregir información', requester: 'Ana Torres', status: 'rejected', created_at: '2026-04-05T14:00:00Z' },
  { id: '4', title: 'Solicitar vacaciones', requester: 'Carlos López', status: 'pending', created_at: '2026-04-06T08:00:00Z' },
];

beforeEach(() => {
  // Simula localStorage con los datos seed antes de cada test
  const store = { tazki_requests: JSON.stringify(SEED) };
  vi.stubGlobal('localStorage', {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = value; },
  });
});

describe('getRequests', () => {
  it('devuelve todas las solicitudes sin filtros', async () => {
    const result = await getRequests({});
    expect(result).toHaveLength(4);
  });

  it('filtra por status pending', async () => {
    const result = await getRequests({ status: 'pending' });
    expect(result).toHaveLength(2);
    expect(result.every((r) => r.status === 'pending')).toBe(true);
  });

  it('filtra por status approved', async () => {
    const result = await getRequests({ status: 'approved' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('filtra por búsqueda de texto en título (case-insensitive)', async () => {
    const result = await getRequests({ search: 'documentación' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filtra por búsqueda de texto en solicitante (case-insensitive)', async () => {
    const result = await getRequests({ search: 'ana torres' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('combina filtro de status y búsqueda de texto', async () => {
    const result = await getRequests({ status: 'pending', search: 'vacaciones' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('4');
  });

  it('devuelve lista vacía si no hay coincidencias', async () => {
    const result = await getRequests({ search: 'zzz_no_existe' });
    expect(result).toHaveLength(0);
  });

  it('ignora el filtro de status cuando es "all"', async () => {
    const result = await getRequests({ status: 'all' });
    expect(result).toHaveLength(4);
  });
});

describe('updateRequestStatus', () => {
  it('actualiza el status de una solicitud pending a approved', async () => {
    const updated = await updateRequestStatus('1', 'approved');
    expect(updated.status).toBe('approved');
    expect(updated.id).toBe('1');
  });

  it('persiste el cambio: getRequests refleja el nuevo estado', async () => {
    await updateRequestStatus('1', 'rejected');
    const result = await getRequests({ status: 'rejected' });
    const ids = result.map((r) => r.id);
    expect(ids).toContain('1');
  });

  it('lanza error si el status ya es approved (estado final)', async () => {
    await expect(updateRequestStatus('2', 'rejected')).rejects.toThrow();
  });

  it('lanza error si el status ya es rejected (estado final)', async () => {
    await expect(updateRequestStatus('3', 'approved')).rejects.toThrow();
  });

  it('lanza error si el id no existe', async () => {
    await expect(updateRequestStatus('999', 'approved')).rejects.toThrow();
  });
});
