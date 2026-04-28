import localforage from "localforage";

localforage.config({
  name: "lasg-doc-storage",
  storeName: "documents",
});

export const saveFile = async (id: string, file: File): Promise<void> => {
  try {
    await localforage.setItem(`doc-${id}`, file);
  } catch (error) {
    console.error("Failed to save file:", error);
  }
};

export const getFile = async (id: string): Promise<File | Blob | null> => {
  try {
    return await localforage.getItem<File | Blob>(`doc-${id}`);
  } catch (error) {
    console.error("Failed to get file:", error);
    return null;
  }
};
