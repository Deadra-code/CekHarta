import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './useStore';

describe('useStore', () => {
  beforeEach(() => {
    useStore.getState().clearAllData();
  });

  it('harusnya bisa menambah aset baru', () => {
    const asset = {
      id: 'test-1',
      name: 'Rumah Tes',
      category: 'Real Estat' as const,
      status: 'Siap' as const,
      valuation: 1000000,
      valuationLabel: 'Rp 1.000.000',
      checklist: []
    };

    useStore.getState().addAsset(asset);
    
    expect(useStore.getState().assets).toHaveLength(1);
    expect(useStore.getState().assets[0].name).toBe('Rumah Tes');
  });

  it('harusnya bisa menghapus aset', () => {
    const asset = {
      id: 'test-del',
      name: 'Aset Hapus',
      category: 'Finansial' as const,
      status: 'Siap' as const,
      valuation: 500000,
      valuationLabel: 'Rp 500.000',
      checklist: []
    };

    useStore.getState().addAsset(asset);
    expect(useStore.getState().assets).toHaveLength(1);

    useStore.getState().deleteAsset('test-del');
    expect(useStore.getState().assets).toHaveLength(0);
  });

  it('harusnya bisa mengatur dan mengubah PIN', () => {
    const { setPin } = useStore.getState();
    
    setPin('1234');
    expect(useStore.getState().pin).toBe('1234');
    
    setPin('5678');
    expect(useStore.getState().pin).toBe('5678');
    
    setPin(null);
    expect(useStore.getState().pin).toBeNull();
  });

  it('harusnya bisa mengunci dan membuka aplikasi', () => {
    const { lock, unlock } = useStore.getState();
    
    unlock();
    expect(useStore.getState().isLocked).toBe(false);
    
    lock();
    expect(useStore.getState().isLocked).toBe(true);
  });

  it('harusnya bisa melakukan CRUD aset', () => {
    const { addAsset, updateAsset, deleteAsset } = useStore.getState();
    const asset = { id: 'asset-1', name: 'Aset 1', category: 'Real Estat', status: 'Siap', valuation: 1000, checklist: [] } as any;
    
    addAsset(asset);
    expect(useStore.getState().assets).toHaveLength(1);
    
    updateAsset('asset-1', { name: 'Aset 1 Updated' });
    expect(useStore.getState().assets[0].name).toBe('Aset 1 Updated');
    
    deleteAsset('asset-1');
    expect(useStore.getState().assets).toHaveLength(0);
  });

  it('harusnya menghitung progres ceklis dengan benar saat di-toggle', () => {
    const { addAsset, toggleChecklist } = useStore.getState();
    const asset = { 
      id: 'asset-check', 
      name: 'Aset Check', 
      checklist: [
        { id: 'c1', title: 'Task 1', isCompleted: false },
        { id: 'c2', title: 'Task 2', isCompleted: false }
      ] 
    } as any;
    
    addAsset(asset);
    
    toggleChecklist('asset-check', 'c1');
    expect(useStore.getState().assets[0].checklist[0].isCompleted).toBe(true);
    expect(useStore.getState().assets[0].progressPercentage).toBe(50);
    
    toggleChecklist('asset-check', 'c1');
    expect(useStore.getState().assets[0].checklist[0].isCompleted).toBe(false);
    expect(useStore.getState().assets[0].progressPercentage).toBe(0);
  });

  it('harusnya bisa mengelola dokumen', () => {
    const { addDocument, deleteDocument } = useStore.getState();
    const doc = { id: 'doc-1', name: 'doc.pdf' } as any;
    
    addDocument(doc);
    expect(useStore.getState().documents).toHaveLength(1);
    
    deleteDocument('doc-1');
    expect(useStore.getState().documents).toHaveLength(0);
  });

  it('harusnya bisa mengelola kontak', () => {
    const { addContact, deleteContact } = useStore.getState();
    const contact = { id: 'con-1', name: 'John' } as any;
    
    addContact(contact);
    expect(useStore.getState().contacts).toHaveLength(1);
    
    deleteContact('con-1');
    expect(useStore.getState().contacts).toHaveLength(0);
  });

  it('harusnya bisa clear all data', () => {
    const { addAsset, clearAllData } = useStore.getState();
    addAsset({ id: '1' } as any);
    
    clearAllData();
    expect(useStore.getState().assets).toHaveLength(0);
  });

  it('harusnya menghitung progres ceklis dengan benar', () => {
    const asset = {
      id: 'test-progress',
      name: 'Aset Progres',
      category: 'Aset Fisik' as const,
      status: 'Dalam Proses' as const,
      valuation: 0,
      valuationLabel: 'Rp 0',
      checklist: [
        { id: 'c1', title: 'Task 1', description: '', isCompleted: false },
        { id: 'c2', title: 'Task 2', description: '', isCompleted: false }
      ],
      progressPercentage: 0
    };

    useStore.getState().addAsset(asset);
    
    // Toggle first task
    useStore.getState().toggleChecklist('test-progress', 'c1');
    
    const updatedAsset = useStore.getState().assets[0];
    expect(updatedAsset.checklist[0].isCompleted).toBe(true);
    expect(updatedAsset.progressPercentage).toBe(50);
  });
});
