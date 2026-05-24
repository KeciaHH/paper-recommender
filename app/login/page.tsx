import { loginAction } from "./actions";

export default function LoginPage({
  searchParams
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="login">
      <form className="login-panel" action={loginAction}>
        <h1>Paper Recommender</h1>
        <p>Enter the private password to view and rate recommendations.</p>
        <label className="field">
          Password
          <input name="password" type="password" autoFocus required />
        </label>
        <button className="button primary" type="submit">
          Sign in
        </button>
        {searchParams.error ? <div className="error">Incorrect password.</div> : null}
      </form>
    </main>
  );
}
