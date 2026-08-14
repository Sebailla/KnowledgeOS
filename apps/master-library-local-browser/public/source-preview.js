export const sourcePreviewFor = (source) => {
  if (!source) return { kind: 'empty', message: 'Choose a PDF to preview its first page locally.' };
  const name = String(source.name ?? '');
  const type = String(source.type ?? '').toLowerCase();
  if (type === 'application/pdf' || name.toLowerCase().endsWith('.pdf')) {
    return { kind: 'pdf', message: 'Page 1 preview. This file remains only in your browser until you upload it.' };
  }
  if (type === 'application/epub+zip' || name.toLowerCase().endsWith('.epub')) {
    return { kind: 'unsupported', message: 'EPUB preview is not available. Metadata inspection can still continue locally.' };
  }
  return { kind: 'unsupported', message: 'Preview is available for PDF files only.' };
};
