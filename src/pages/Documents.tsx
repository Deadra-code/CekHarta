import { useRef, useState } from 'react';
import { useStore, type AppDocument } from '../store/useStore';
import { saveFile, deleteFile } from '../store/db';
import DocumentViewer from '../components/DocumentViewer';

export default function Documents() {
  const { documents, addDocument, deleteDocument, addActivity, showDialog } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDoc, setSelectedDoc] = useState<AppDocument | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showDialog({
        title: 'File Terlalu Besar',
        message: 'Ukuran file maksimal adalah 10 MB untuk menjamin stabilitas penyimpanan lokal.',
        type: 'primary',
        confirmLabel: 'Mengerti'
      });
      return;
    }

    const newId = `doc_${Date.now()}`;
    
    try {
      // Save file to IndexedDB
      await saveFile(newId, file);
      
      // Save metadata to Store
      const newDoc: AppDocument = {
        id: newId,
        name: file.name,
        type: file.type || 'unknown',
        size: file.size,
        dateAdded: new Date().toISOString()
      };
      
      addDocument(newDoc);
      addActivity({
        id: `act_${Date.now()}`,
        title: 'Dokumen Baru Diunggah',
        description: file.name,
        date: new Date().toISOString(),
        type: 'document'
      });
      
    } catch (err) {
      showDialog({
        title: 'Gagal Simpan',
        message: 'Tidak dapat menyimpan dokumen ke penyimpanan lokal.',
        type: 'danger',
        confirmLabel: 'Tutup'
      });
      console.error(err);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openDocument = (doc: AppDocument) => {
    setSelectedDoc(doc);
  };

  const handleDelete = (id: string, name: string) => {
    showDialog({
      title: 'Hapus Dokumen?',
      message: `Apakah Anda yakin ingin menghapus "${name}"? Tindakan ini tidak dapat dibatalkan.`,
      type: 'danger',
      confirmLabel: 'Ya, Hapus',
      onConfirm: async () => {
        await deleteFile(id);
        deleteDocument(id);
      }
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <>
      <header className="w-full top-0 sticky z-50 bg-slate-50 shadow-sm flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-sm">folder_open</span>
          </div>
          <h1 className="font-manrope font-extrabold text-xl text-blue-900 tracking-tight">Cek Harta</h1>
        </div>
      </header>

      <main className="px-6 pt-8 pb-32 max-w-md mx-auto">
        <section className="mb-10">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="font-inter text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">Repositori Brankas Lokal</span>
              <h2 className="font-headline font-bold text-3xl leading-tight text-primary">Dokumen Aman</h2>
            </div>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors flex flex-col items-center shadow-sm border border-primary/20 bg-surface-container-lowest"
            >
              <span className="material-symbols-outlined">upload_file</span>
            </button>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="*/*"
              aria-label="Unggah File"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {documents.length === 0 ? (
              <div className="text-center p-8 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant/30 mt-6">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">folder_off</span>
                <p className="font-body text-sm text-on-surface-variant mb-2">Belum ada dokumen yang diunggah.</p>
                <p className="font-body text-xs text-outline">Gunakan tombol unggah di atas untuk menyimpan salinan dokumen Anda secara offline.</p>
              </div>
            ) : (
              documents.map(doc => (
                <div key={doc.id} onClick={() => openDocument(doc)} className="bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-container/10 rounded-lg text-primary">
                      <span className="material-symbols-outlined">description</span>
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-sm text-primary line-clamp-1">{doc.name}</h3>
                      <p className="font-body text-[10px] text-on-surface-variant mt-1">
                        {formatSize(doc.size)} • {new Date(doc.dateAdded).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(doc.id, doc.name);
                    }} 
                    className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {selectedDoc && (
        <DocumentViewer 
          docId={selectedDoc.id}
          docName={selectedDoc.name}
          docType={selectedDoc.type}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </>
  );
}
