# 2026-05-22 — Supabase Migration

## What we built

Replaced the custom Express/JWT backend with Supabase across the entire app:

- **Auth** (`auth.repository.ts`, `current-user.store.ts`): signup/signin/signout now use `supabase.auth`; session state is tracked reactively via `onAuthStateChange` stored in Zustand.
- **Notes** (`note.repository.ts`): CRUD + image upload rewritten to use Supabase DB queries and Storage (`images` bucket). Pagination uses `.range()` and `count: 'exact'`.
- **Labels** (`label.repository.ts`): create/get/delete labels via Supabase, with RLS requiring `user_id` on insert.
- **CLAUDE.md**: Added Project Context, Debugging, and Workflow sections; created `/wrap` and `/notes` skills.

## Key concepts learned

- **Row Level Security (RLS)**: Supabase enforces policies on the DB side. Inserts must include `user_id` matching `auth.uid()` or the request gets a 400/403.
- **`supabase.auth.onAuthStateChange`**: A subscription that fires on login/logout/token refresh. Replaces the old "GET /auth/me on mount" pattern.
- **Supabase Storage**: Files are uploaded with `supabase.storage.from(bucket).upload(path, file)`, then `getPublicUrl` gives you the CDN URL.
- **`.select('*, labels(*)')`**: Supabase supports embedded foreign-key joins in a single query using the `*` wildcard — avoids extra round-trips.
- **`count: 'exact'`**: Pass this option to `.select()` to get the total row count alongside paginated results.

## Code patterns introduced

```ts
// RLS-compliant insert — always pass user_id explicitly
const { data: { session } } = await supabase.auth.getSession();
const userId = session!.user.id;
await supabase.from('notes').insert({ ...fields, user_id: userId });

// Pagination with total count
const { data, count, error } = await supabase
  .from('notes')
  .select('*', { count: 'exact' })
  .range((page - 1) * limit, page * limit - 1);

// Reactive auth state in Zustand
initAuth: () => {
  supabase.auth.onAuthStateChange((_event, session) => {
    set({ currentUser: session?.user ? mapUser(session.user) : null });
  });
}
```

## Gotchas / things that broke

- **400 on `createNote`**: Initial insert was missing `user_id`. RLS rejected it silently with a 400. Fixed in commit `9d43d1f`.
- **`onAuthStateChange` has no cleanup**: `initAuth()` registers a Supabase subscription but never calls `subscription.unsubscribe()` on teardown. Harmless since `App` never unmounts, but in a component that remounts (e.g. Strict Mode double-invoke) this would register duplicate listeners. Proper fix: return the unsubscribe from `initAuth` and call it in a `useEffect` cleanup.
- **`toLabel` / `toNote` helpers duplicated**: Both `note.repository.ts` and `label.repository.ts` define a `toLabel` function. Fine for now, but could be consolidated into a shared mapper file.

## Questions to revisit

- Should `initAuth` return the `subscription` object so `App.tsx` can unsubscribe on unmount?
- Can we add a Supabase Storage RLS policy so users can only read/write their own images?
- What happens if `signUp` is called but email confirmation is required — `data.user` could be `null`, causing the profile insert to crash.
- Is there a cleaner way to handle the note_labels join-table (delete-all + reinsert on every update)?
