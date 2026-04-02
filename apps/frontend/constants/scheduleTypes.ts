export const SCHEDULE_TYPE_OPTIONS = [
  { value: 'OTC',        label: 'OTC / General' },
  { value: 'G',          label: 'Schedule G' },
  { value: 'H',          label: 'Schedule H' },
  { value: 'H1',         label: 'Schedule H1' },
  { value: 'X',          label: 'Schedule X' },
  { value: 'C',          label: 'Schedule C (Biological)' },
  { value: 'Narcotic',   label: 'Narcotic (NDPS)' },
  { value: 'Ayurvedic',  label: 'Ayurvedic / Herbal' },
  { value: 'Surgical',   label: 'Surgical / Device' },
  { value: 'Cosmetic',   label: 'Cosmetic' },
  { value: 'Veterinary', label: 'Veterinary' },
] as const;

/** Schedules that require doctor/patient details on sale */
export const PRESCRIPTION_REQUIRED_SCHEDULES = ['G', 'H', 'H1', 'X', 'C', 'Narcotic'] as const;

/** Schedules with the strictest controls (mandatory, not just recommended) */
export const STRICT_CONTROLLED_SCHEDULES = ['H1', 'X', 'C', 'Narcotic'] as const;

/**
 * Printed prescription markers per Drugs & Cosmetics Act (India).
 * Used on invoice line items and cart badges.
 * OTC / unrecognised schedules → '' (no marker).
 */
export const SCHEDULE_MARKERS: Record<string, string> = {
  H:        'Rx',
  H1:       'Rx\u2726', // visually distinct from plain H (✦)
  X:        'NRx',
  Narcotic: 'NRx',
  G:        'G',
  C:        'C',
};
