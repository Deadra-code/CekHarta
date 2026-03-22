import { useState } from 'react';
import { useStore, type Contact } from '../store/useStore';

export default function Contacts() {
  const { contacts, addContact, deleteContact, showDialog } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    const newContact: Contact = {
      id: `contact_${Date.now()}`,
      name,
      role,
      email,
      phone
    };
    addContact(newContact);
    setName(''); setRole(''); setEmail(''); setPhone('');
    setIsModalOpen(false);
  };

  return (
    <>
      <header className="w-full top-0 sticky z-50 bg-slate-50 shadow-sm flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-sm">contacts</span>
          </div>
          <h1 className="font-manrope font-extrabold text-xl text-blue-900 tracking-tight">Cek Harta</h1>
        </div>
      </header>

      <main className="px-6 pt-8 pb-32 max-w-md mx-auto">
        <section className="mb-12">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <span className="font-inter text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">Akses Terotorisasi</span>
              <h2 className="font-headline font-bold text-3xl leading-tight text-primary">Buku Kontak</h2>
            </div>
          </div>

          <div className="space-y-4">
            {contacts.length === 0 ? (
              <div className="text-center p-8 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant/30 mt-6">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">person_off</span>
                <p className="font-body text-sm text-on-surface-variant mb-2">Belum ada kontak terdaftar.</p>
                <p className="font-body text-xs text-outline">Tambahkan kontak pengacara, notaris, atau agen pajak Anda dengan tombol di bawah.</p>
              </div>
            ) : (
              contacts.map(contact => (
                <div key={contact.id} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm relative">
                  <div className="p-6 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-2xl">person</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-headline font-bold text-base text-primary line-clamp-1">{contact.name}</h3>
                      <p className="font-body text-xs text-on-surface-variant line-clamp-1">{contact.role}</p>
                    </div>
                    <button 
                      onClick={() => {
                        showDialog({
                          title: 'Hapus Kontak?',
                          message: `Apakah Anda yakin ingin menghapus "${contact.name}" dari daftar kontak terotorisasi?`,
                          type: 'danger',
                          confirmLabel: 'Ya, Hapus',
                          onConfirm: () => deleteContact(contact.id)
                        });
                      }} 
                      className="text-red-300 hover:text-red-500 transition-colors p-2"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                  <div className="bg-surface-container-low px-4 py-3 flex gap-2">
                    <a href={`mailto:${contact.email}`} className="flex-1 bg-primary text-on-primary py-2 rounded-md flex items-center justify-center gap-2 font-medium text-xs hover:bg-primary/90 transition-colors cursor-pointer shadow-sm">
                      <span className="material-symbols-outlined text-sm">mail</span>
                      Email
                    </a>
                    <a href={`tel:${contact.phone}`} className="flex-1 bg-secondary-container text-on-secondary-container py-2 rounded-md flex items-center justify-center gap-2 font-medium text-xs hover:bg-secondary-container/80 transition-colors cursor-pointer shadow-sm">
                      <span className="material-symbols-outlined text-sm">call</span>
                      Telepon
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-40 transition-transform active:scale-90"
      >
        <span className="material-symbols-outlined">person_add</span>
      </button>

      {/* Add Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-surface-container-lowest w-full max-w-md p-6 rounded-t-3xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline font-bold text-xl text-primary">Tambah Kontak</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant p-2 rounded-full hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-4">
              <div>
                <label className="block font-label text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">Nama Lengkap</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Budi Santoso S.H." />
              </div>
              <div>
                <label className="block font-label text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">Peran / Jabatan</label>
                <input required type="text" value={role} onChange={e => setRole(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Pengacara Hukum Keluarga" />
              </div>
              <div>
                <label className="block font-label text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">Alamat Email</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="budi@contoh.com" />
              </div>
              <div>
                <label className="block font-label text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">Nomor Telepon</label>
                <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="08123456789" />
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-primary text-on-primary font-body font-semibold py-3.5 rounded-xl hover:bg-primary/90 transition-colors shadow-lg active:scale-[0.98]">
                  Simpan Kontak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
