// Convertir un fichier en base64 (data URL)
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Vérifier si une URL est valide
export function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith('blob:')) return false; // Les blob expirent
  if (url.startsWith('data:')) return true;  // Base64 est valide
  if (url.startsWith('http')) return true;   // URL externe
  if (url.startsWith('indexeddb:')) return true; // IndexedDB
  return false;
}

// Nettoyer les URLs blob d'un objet
export function cleanBlobUrls(obj: any): any {
  const cleaned = { ...obj };
  if (cleaned.image?.startsWith('blob:')) {
    cleaned.image = '';
  }
  if (cleaned.pdfUrl?.startsWith('blob:')) {
    cleaned.pdfUrl = '';
  }
  if (cleaned.coverImage?.startsWith('blob:')) {
    cleaned.coverImage = '';
  }
  return cleaned;
}
