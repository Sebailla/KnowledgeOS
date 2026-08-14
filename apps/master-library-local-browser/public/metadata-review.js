export const metadataForSource = (source) => {
  const filename = source.name.toLowerCase();
  const declaredMediaType = source.type === 'application/pdf' || filename.endsWith('.pdf')
    ? 'application/pdf'
    : source.type === 'application/epub+zip' || filename.endsWith('.epub')
    ? 'application/epub+zip'
    : undefined;
  return declaredMediaType ? { originalFilename: source.name, declaredMediaType, byteLength: source.size } : undefined;
};

export const shouldApplySuggestion = (dirty, value) => Boolean(value) && !dirty;

export const candidatesForField = (result, field) => (result?.candidates ?? []).filter((candidate) => candidate.field === field);

export const provenanceForAppliedSuggestions = (titleSuggestion, authorSuggestions) => ({
  title: titleSuggestion ? { evidence: titleSuggestion.evidence, confidence: titleSuggestion.confidence } : { evidence: 'user-entered', confidence: 'high' },
  authors: authorSuggestions?.length ? authorSuggestions.map(({ evidence, confidence }) => ({ evidence, confidence })) : [{ evidence: 'user-entered', confidence: 'high' }],
});

export const acceptedProvenance = (result, titleSuggestionUsed, authorSuggestionsUsed) => ({
  ...provenanceForAppliedSuggestions(
    titleSuggestionUsed ? result?.title : undefined,
    authorSuggestionsUsed ? result?.authors : undefined,
  ),
});
