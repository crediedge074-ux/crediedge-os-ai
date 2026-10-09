/**
 * User-facing error text.
 *
 * Errors returned by the database layer contain schema detail — table names,
 * column names, constraint names and row level security policy names. Rendering
 * them verbatim hands an attacker a map of the data model and the access rules,
 * so every user-facing surface routes its caught error through this helper:
 * the real error goes to the console for debugging, and the person using the
 * app sees a plain sentence.
 */
export function toUserMessage(error: unknown, fallback: string): string {
  if (error) {
    // Keep full detail available to developers, never to the screen.
    console.error("[error]", error);
  }
  return fallback;
}

/**
 * Neutral messages for authentication surfaces.
 *
 * Sign-in and sign-up must not reveal whether an email address already has an
 * account, so every failure maps to the same wording regardless of cause.
 */
export function toAuthMessage(error: unknown, mode: "signin" | "signup"): string {
  if (error) {
    console.error("[auth error]", error);
  }
  return mode === "signin"
    ? "We could not sign you in. Please check your email address and password and try again."
    : "We could not complete your sign-up. Please check your details and try again.";
}
