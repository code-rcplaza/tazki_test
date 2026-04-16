import { describe, it, expect } from 'vitest';
import { getStatusConfig, isFinalStatus } from './statusConfig';

describe('getStatusConfig', () => {
  it('devuelve color warning para pending', () => {
    expect(getStatusConfig('pending').color).toBe('warning');
  });

  it('devuelve color success para approved', () => {
    expect(getStatusConfig('approved').color).toBe('success');
  });

  it('devuelve color error para rejected', () => {
    expect(getStatusConfig('rejected').color).toBe('error');
  });

  it('devuelve labelKey correcto para cada estado', () => {
    expect(getStatusConfig('pending').labelKey).toBe('requests:status.pending');
    expect(getStatusConfig('approved').labelKey).toBe('requests:status.approved');
    expect(getStatusConfig('rejected').labelKey).toBe('requests:status.rejected');
  });

  it('devuelve color default para un estado desconocido', () => {
    expect(getStatusConfig('foo').color).toBe('default');
  });

  it('devuelve color default para undefined', () => {
    expect(getStatusConfig(undefined).color).toBe('default');
  });
});

describe('isFinalStatus', () => {
  it('retorna true para approved', () => {
    expect(isFinalStatus('approved')).toBe(true);
  });

  it('retorna true para rejected', () => {
    expect(isFinalStatus('rejected')).toBe(true);
  });

  it('retorna false para pending', () => {
    expect(isFinalStatus('pending')).toBe(false);
  });

  it('retorna false para string vacío', () => {
    expect(isFinalStatus('')).toBe(false);
  });

  it('retorna false para undefined', () => {
    expect(isFinalStatus(undefined)).toBe(false);
  });
});
