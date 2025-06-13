function encodeToSafe(str: string): string {
  return Array.from(str)
    .map(c => c.codePointAt(0)!.toString(36)) // base36 = shorter than hex
    .join("z"); // z is a safe delimiter not in base36 digits
}

function decodeFromSafe(str: string): string {
  return str.split("z")
    .map(c => String.fromCodePoint(parseInt(c, 36)))
    .join("");
}

// Create a valid, ASCII-only "proxy" email for Better Auth
export function encodeThaiEmail(email: string): string {
  const [local, domain] = email.split("@");
  const safeLocal = encodeToSafe(local);
  const safeDomain = encodeToSafe(domain.replace(/\./g, "_"));
  return `${safeLocal}@${safeDomain}.thai.local`; // ensure domain is fixed and fake
}

// Decode the real Thai email from the encoded one
export function decodeThaiEmail(fakeEmail: string): string {
  const [local, domainWithTLD] = fakeEmail.split("@");
  const domainParts = domainWithTLD.split(".");
  const encodedDomain = domainParts.slice(0, -2).join("."); // remove .thai.local
  const decodedLocal = decodeFromSafe(local);
  const decodedDomain = decodeFromSafe(encodedDomain).replace(/_/g, ".");
  return `${decodedLocal}@${decodedDomain}`;
}
