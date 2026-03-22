import { useState, useEffect } from 'react';
import { getFile } from '../store/db';

interface Props {
  docId: string;
  docName: string;
  docType: string;
  onClose: () => void;
}

export default function DocumentViewer({ docId, docName, docType, onClose }: Props) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadFile = async () => {
      try {
        setLoading(true);
        const file = await getFile(docId);
        if (file) {
          const url = URL.createObjectURL(file);
          setBlobUrl(url);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to load file:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadFile();

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [docId]);

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-slate-900/95 backdrop-blur-md animate-in fade-in duration-300">
      <header className="flex justify-between items-center p-4 text-white border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary-container">description</span>
          <div className="flex flex-col">
            <h3 className="font-headline font-bold text-sm truncate max-w-[200px]">{docName}</h3>
            <span className="text-[10px] opacity-60 uppercase">{docType.split('/')[1] || docType}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
           {blobUrl && (
             <a 
               href={blobUrl} 
               download={docName}
               className="p-2 rounded-full hover:bg-white/10 transition-colors"
               title="Unduh File"
             >
               <span className="material-symbols-outlined">download</span>
             </a>
           )}
           <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto flex items-center justify-center p-4">
        {loading && (
          <div className="flex flex-col items-center gap-4 text-white/60">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-label">Memuat dokumen...</span>
          </div>
        )}

        {error && (
          <div className="text-center text-white/80 space-y-4">
            <span className="material-symbols-outlined text-red-400 text-5xl">error</span>
            <p className="text-sm">Gagal memuat dokumen. File mungkin telah dihapus.</p>
          </div>
        )}

        {!loading && !error && blobUrl && (
          <>
            {docType.startsWith('image/') ? (
              <img src={blobUrl} alt={docName} className="max-w-full max-h-full object-contain shadow-2xl rounded-lg" />
            ) : docType === 'application/pdf' ? (
              <iframe src={blobUrl} title={docName} className="w-full h-full bg-white rounded-lg shadow-2xl" />
            ) : (
              <div className="text-center text-white/80 space-y-4">
                <span className="material-symbols-outlined text-white/40 text-6xl">draft</span>
                <p className="text-sm">Pratinjau tidak tersedia untuk tipe file ini.</p>
                <a href={blobUrl} download={docName} className="inline-block bg-primary text-white px-6 py-2 rounded-full text-xs font-bold">Unduh untuk Melihat</a>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
