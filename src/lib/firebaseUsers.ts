/**
 * Firebase Authentication + `users/` Realtime Database access.
 *
 * Identity mapping
 * ----------------
 * The application issues a 16-character User ID (see `campusStore`). The
 * Realtime Database rules require the `users` key to be exactly 19 characters
 * in the shape XXXX-XXXX-XXXX-XXXX, so the campus ID is hyphenated into
 * groups of four to form the database key. The mapping is deterministic and
 * reversible:
 *
 *   campus ID   ABCD1234EFGH5678
 *   database key ABCD-1234-EFGH-5678
 *
 * The Firebase Authentication UID is a *separate* identifier owned by
 * Firebase. It is stored on the profile as `firebaseUid` so feedback records
 * (which the rules key by `auth.uid`) can be correlated with campus users.
 *
 * Security
 * --------
 * - Passwords are only ever handed to Firebase Authentication. `passwordHash`
 *   is written as the literal marker "[FIREBASE_SSO]" exactly as the rules
 *   demand; no real hash ever reaches the browser or the database.
 * - `walletBalance` is intentionally never written from the client: the rules
 *   forbid a non-admin from raising it, and on creation there is no previous
 *   value to compare against. Balance changes belong to an admin/server path.
 * - Nothing here re-implements the rules; failures from the database are
 *   propagated so the caller can react.
 */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { get, ref, set, update } from "firebase/database";
import { getFirebaseAuth, getFirebaseDb } from "./firebase";
import type { Role } from "@/types/campus";

/** Role strings accepted by the Realtime Database rules. */
export type FirebaseRole = "STUDENT" | "STANDARD" | "VENDOR" | "ADMIN";

export interface FirebaseUserProfile
{
  userId: string;
  fullName: string;
  email: string;
  role: FirebaseRole;
  passwordHash: "[FIREBASE_SSO]";
  status?: string;
  firebaseUid?: string;
}

/** Converts the app's 16-character ID into the 19-character database key. */
export function toDatabaseUserId(campusId: string): string
{
  const raw = campusId.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, 16).padEnd(16, "0");
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}`;
}

export function toFirebaseRole(role: Role): FirebaseRole
{
  return role.toUpperCase() as FirebaseRole;
}

/**
 * Signs the user in to Firebase Authentication, creating the account on first
 * use. Returns the Firebase user, or throws with an explicit message.
 */
export async function signInOrCreate(email: string, password: string): Promise<FirebaseUser>
{
  const auth = await getFirebaseAuth();

  try
  {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  }
  catch (err)
  {
    const code = (err as { code?: string }).code ?? "";

    // Only "no such account" justifies a sign-up; a wrong password must fail.
    if (code === "auth/user-not-found" || code === "auth/invalid-credential")
    {
      try
      {
        const created = await createUserWithEmailAndPassword(auth, email, password);
        return created.user;
      }
      catch (createErr)
      {
        throw new Error(
          `Firebase sign-in failed: ${(createErr as { code?: string }).code ?? String(createErr)}`
        );
      }
    }

    throw new Error(`Firebase sign-in failed: ${code || String(err)}`);
  }
}

/**
 * Google single sign-on. Firebase owns the credential exchange, so no
 * password ever reaches this application. The returned account's e-mail is
 * what the database rules match against `users/<id>/email`.
 */
export async function signInWithGoogle(): Promise<FirebaseUser>
{
  const auth = await getFirebaseAuth();
  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({ prompt: "select_account" });

  try
  {
    const cred = await signInWithPopup(auth, provider);
    return cred.user;
  }
  catch (err)
  {
    const code = (err as { code?: string }).code ?? "";
    throw new Error(`Google sign-in failed: ${code || String(err)}`);
  }
}

export async function firebaseSignOut(): Promise<void>
{
  const auth = await getFirebaseAuth();
  await signOut(auth);
}

/**
 * Creates the caller's own `users/<19-char id>` record, or refreshes the
 * mutable parts of an existing one. The rules allow this only when the
 * authenticated e-mail matches the record's e-mail.
 */
export async function syncOwnProfile(params: {
  campusId: string;
  fullName: string;
  email: string;
  role: Role;
  firebaseUid: string;
}): Promise<string>
{
  const db = await getFirebaseDb();
  const key = toDatabaseUserId(params.campusId);
  const node = ref(db, `users/${key}`);
  const snapshot = await get(node);

  if (!snapshot.exists())
  {
    const profile: FirebaseUserProfile = {
      userId: key,
      fullName: params.fullName,
      email: params.email,
      role: toFirebaseRole(params.role),
      passwordHash: "[FIREBASE_SSO]",
      status: "active",
      firebaseUid: params.firebaseUid,
    };

    await set(node, profile);
    return key;
  }

  // E-mail, role and status are immutable for a normal user, so only the
  // fields a user is allowed to change are sent.
  await update(node, { fullName: params.fullName, firebaseUid: params.firebaseUid });
  return key;
}

/** Reads a single profile. The rules reject any key the caller does not own. */
export async function readProfile(campusId: string): Promise<FirebaseUserProfile | null>
{
  const db = await getFirebaseDb();
  const snapshot = await get(ref(db, `users/${toDatabaseUserId(campusId)}`));
  return snapshot.exists() ? (snapshot.val() as FirebaseUserProfile) : null;
}
