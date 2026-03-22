import { get, set, del } from 'idb-keyval';

export const saveFile = async (id: string, file: File) => {
  await set(`doc_${id}`, file);
};

export const getFile = async (id: string): Promise<File | undefined> => {
  return await get(`doc_${id}`);
};

export const deleteFile = async (id: string) => {
  await del(`doc_${id}`);
};
