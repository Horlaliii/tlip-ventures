/**
 * Ghanaian phone numbers. Stored as 233XXXXXXXXX (12 digits, no "+").
 * Accepted input: 0XXXXXXXXX, +233XXXXXXXXX or 233XXXXXXXXX, with optional
 * spaces, dashes, dots or brackets.
 */

/** A normalised Ghanaian number: "233" followed by 9 digits. */
export type GhanaPhone = string;

// The 9-digit national number starts with 2 or 5 (mobile) or 3 (fixed line).
const NATIONAL_NUMBER = /^[235]\d{8}$/;

/** Returns the number as 233XXXXXXXXX, or null if it is not a valid Ghanaian number. */
export function normaliseGhanaPhone(input: string): GhanaPhone | null {
  const trimmed = input.trim();
  if (!/^\+?[\d\s\-.()]+$/.test(trimmed)) return null;

  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");

  let national: string;
  if (hasPlus || digits.startsWith("233")) {
    if (!digits.startsWith("233") || digits.length !== 12) return null;
    national = digits.slice(3);
  } else if (digits.startsWith("0") && digits.length === 10) {
    national = digits.slice(1);
  } else {
    return null;
  }

  return NATIONAL_NUMBER.test(national) ? `233${national}` : null;
}

export function isGhanaPhone(input: string): boolean {
  return normaliseGhanaPhone(input) !== null;
}

/** Formats a stored number for people to read: "233241234567" → "024 123 4567". */
export function formatGhanaPhone(phone: GhanaPhone): string {
  const normalised = normaliseGhanaPhone(phone);
  if (!normalised) {
    throw new Error(`Not a valid Ghanaian phone number: ${phone}`);
  }
  const local = `0${normalised.slice(3)}`;
  return `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
}
