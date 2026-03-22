import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Activity = {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'verified' | 'appraisal' | 'document' | 'other';
};

export type AssetChecklist = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
};

export type Asset = {
  id: string;
  name: string;
  category: 'Real Estat' | 'Finansial' | 'Kendaraan Klasik' | 'Koleksi Barang' | 'Aset Fisik';
  status: 'Siap' | 'Dalam Proses';
  valuation: number;
  valuationLabel: string;
  checklist: AssetChecklist[];
  safeLocation?: string;
  progressPercentage?: number;
};

export type AppDocument = {
  id: string;
  name: string;
  type: string; // e.g. 'application/pdf', 'image/jpeg'
  size: number;
  dateAdded: string;
  assetId?: string; // Optional linkage to an asset
};

export type Contact = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatarUrl?: string; // If no avatar, we'll use an icon
};

interface StoreState {
  assets: Asset[];
  activities: Activity[];
  documents: AppDocument[];
  contacts: Contact[];
  pin: string | null;
  isLocked: boolean;
  dialog: {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
    type: 'primary' | 'danger';
  };
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, updatedAsset: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  toggleChecklist: (assetId: string, checklistId: string) => void;
  addActivity: (activity: Activity) => void;
  addDocument: (doc: AppDocument) => void;
  deleteDocument: (id: string) => void;
  addContact: (contact: Contact) => void;
  deleteContact: (id: string) => void;
  clearAllData: () => void;
  importState: (newState: Pick<StoreState, 'assets' | 'activities' | 'documents' | 'contacts'>) => void;
  setPin: (pin: string | null) => void;
  unlock: () => void;
  lock: () => void;
  showDialog: (params: Omit<StoreState['dialog'], 'isOpen'>) => void;
  hideDialog: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      assets: [],
      activities: [],
      documents: [],
      contacts: [],
      pin: null,
      isLocked: false,
      dialog: {
        isOpen: false,
        title: '',
        message: '',
        type: 'primary'
      },

      addAsset: (asset) => set((state) => ({ 
        assets: [asset, ...state.assets] 
      })),
      updateAsset: (id, updatedAsset) => set((state) => {
        const newAssets = state.assets.map(a => a.id === id ? { ...a, ...updatedAsset } : a);
        return { assets: newAssets };
      }),
      deleteAsset: (id) => set((state) => ({
        assets: state.assets.filter(a => a.id !== id)
      })),
      toggleChecklist: (assetId, checklistId) => set((state) => {
        const newAssets = state.assets.map(a => {
          if (a.id === assetId) {
            const newChecklist = a.checklist.map(c => c.id === checklistId ? { ...c, isCompleted: !c.isCompleted } : c);
            const total = newChecklist.length;
            const completed = newChecklist.filter(c => c.isCompleted).length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
            return { ...a, checklist: newChecklist, progressPercentage: progress };
          }
          return a;
        });
        return { assets: newAssets };
      }),
      addActivity: (activity) => set((state) => ({ activities: [activity, ...state.activities] })),
      addDocument: (doc) => set((state) => ({ documents: [doc, ...state.documents] })),
      deleteDocument: (id) => set((state) => ({ documents: state.documents.filter(d => d.id !== id) })),
      addContact: (contact) => set((state) => ({ contacts: [...state.contacts, contact] })),
      deleteContact: (id) => set((state) => ({ contacts: state.contacts.filter(c => c.id !== id) })),
      clearAllData: () => set({ assets: [], activities: [], documents: [], contacts: [] }),
      importState: (newState) => set(newState),
      setPin: (pin) => set({ pin }),
      lock: () => set({ isLocked: true }),
      unlock: () => set({ isLocked: false }),

      showDialog: (params) => set({ 
        dialog: { ...params, isOpen: true } 
      }),
      
      hideDialog: () => set((state) => ({ 
        dialog: { ...state.dialog, isOpen: false } 
      })),
    }),
    {
      name: 'waris-tracker-storage', 
    }
  )
);
