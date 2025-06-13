function encodeToSafe(str: string): string {
  return Array.from(str)
    .map(c => c.codePointAt(0)!.toString(36)) // base36 = shorter than hex
    .join("z"); // "z" is not in base36 and safe as delimiter
}

function decodeFromSafe(str: string): string {
  return str.split("z")
    .map(c => String.fromCodePoint(parseInt(c, 36)))
    .join("");
}

// Check if string contains any Thai or non-ASCII character
function hasUnicode(str: string): boolean {
  return /[^\x00-\x7F]/.test(str);
}

// Encode only if email contains Thai or Unicode characters
export function encodeThaiEmail(email: string): string {
  if (!hasUnicode(email)) return email; // Return unchanged if English

  const [local, domain] = email.split("@");
  const safeLocal = encodeToSafe(local);
  const safeDomain = encodeToSafe(domain.replace(/\./g, "_"));
  return `${safeLocal}@${safeDomain}.thai.local`;
}

// Decode only if it's our special encoded format
export function decodeThaiEmail(fakeEmail: string): string {
  if (!fakeEmail.endsWith(".thai.local")) return fakeEmail; // Return unchanged if not encoded

  const [local, domainWithTLD] = fakeEmail.split("@");
  const domainParts = domainWithTLD.split(".");
  const encodedDomain = domainParts.slice(0, -2).join("."); // remove .thai.local
  const decodedLocal = decodeFromSafe(local);
  const decodedDomain = decodeFromSafe(encodedDomain).replace(/_/g, ".");
  return `${decodedLocal}@${decodedDomain}`;
}
