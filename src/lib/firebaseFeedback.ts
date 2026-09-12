/**
 * Firebase Realtime Database access for the `feedback/` path.
 *
 * The rules require every record to carry the authenticated user's Firebase
 * UID in `userId`, restrict `type` to "complaint" | "compliment", and allow a
 * normal user to create (never update or delete) a record whose status is
 * "pending". All of that is enforced server-side; the helpers below simply
 * produce a conforming payload and surface any rejection.
 */
import { get, orderByChild, equalTo, push, query, ref } from "firebase/database";
import { getFirebaseAuth, getFirebaseDb } from "./firebase";

export type FeedbackType = "complaint" | "compliment";

export interface FirebaseFeedback
{
  userId: string;
  type: FeedbackType;
  subject: string;
  message: string;
  userName: string;
  userEmail: string;
  status: "pending" | "resolved";
  createdAt: string;
  updatedAt: string;
}

/**
 * Creates a feedback record for the currently authenticated Firebase user.
 * Throws when nobody is signed in — an auth failure must never be mistaken
 * for a successful write.
 */
export async function createFeedback(input: {
  type: FeedbackType;
  subject: string;
  message: string;
  userName: string;
  userEmail: string;
}): Promise<string>
{
  const auth = await getFirebaseAuth();
  const current = auth.currentUser;

  if (!current)
  {
    throw new Error("Not signed in to Firebase — feedback was not saved.");
  }

  const now = new Date().toISOString();
  const record: FirebaseFeedback = {
    userId: current.uid,
    type: input.type,
    subject: input.subject,
    message: input.message,
    userName: input.userName,
    userEmail: input.userEmail,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  const db = await getFirebaseDb();
  const created = await push(ref(db, "feedback"), record);

  if (!created.key)
  {
    throw new Error("Firebase did not return a feedback key.");
  }

  return created.key;
}

/**
 * Reads the signed-in user's own feedback.
 *
 * NOTE: the supplied rules only grant read access per child, so this listing
 * query is rejected unless a `.read` rule exists on the `feedback` collection
 * itself. The caller is expected to handle the PERMISSION_DENIED error and
 * fall back to locally stored feedback. See documentation for the proposed
 * minimal rule addition.
 */
export async function readMyFeedback(): Promise<(FirebaseFeedback & { id: string })[]>
{
  const auth = await getFirebaseAuth();
  const current = auth.currentUser;

  if (!current)
  {
    throw new Error("Not signed in to Firebase.");
  }

  const db = await getFirebaseDb();
  const snapshot = await get(
    query(ref(db, "feedback"), orderByChild("userId"), equalTo(current.uid))
  );

  const rows: (FirebaseFeedback & { id: string })[] = [];

  snapshot.forEach((child) =>
  {
    rows.push({ id: child.key as string, ...(child.val() as FirebaseFeedback) });
  });

  return rows;
}
