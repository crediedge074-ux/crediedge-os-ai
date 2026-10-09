import { supabase } from "@/lib/supabase";

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  // signInWithPassword resolves before onAuthStateChange fires in some
  // environments. If the caller navigates immediately, the destination page
  // can see session=null and bounce back to /login. Wait for the session to
  // appear so the navigation lands on a page that already knows you're signed in.
  if (!data.session) {
    await new Promise<void>((resolve) => {
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          sub.subscription.unsubscribe();
          resolve();
        }
      });
      setTimeout(() => { sub.subscription.unsubscribe(); resolve(); }, 3000);
    });
  }

  return data;
}

export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
