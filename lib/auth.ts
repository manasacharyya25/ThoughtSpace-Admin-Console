import { cookies } from "next/headers";
import { env } from "@/lib/env";

export const SESSION_COOKIE = "ts_admin_session";

const SESSION_PAYLOAD = "thoughtspace-admin";

async function getSigningKey() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env.adminPassword()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(): Promise<string> {
  const key = await getSigningKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(SESSION_PAYLOAD)
  );
  return bufferToHex(signature);
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const expected = await createSessionToken();
    if (expected.length !== token.length) return false;

    let mismatch = 0;
    for (let i = 0; i < expected.length; i++) {
      mismatch |= expected.charCodeAt(i) ^ token.charCodeAt(i);
    }
    return mismatch === 0;
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}
