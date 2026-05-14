import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContextValue";

type Mode = "login" | "signup" | "phone";

function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpHint, setOtpHint] = useState("");
  const [error, setError] = useState("");
  const from = (location.state as { from?: string } | null)?.from || "/";

  if (auth.user) {
    return <Navigate to={from} replace />;
  }

  const completeAuth = () => {
    auth.refreshUser();
    navigate(from, { replace: true });
  };

  const submitEmail = async () => {
    setError("");
    try {
      if (mode === "signup") {
        await auth.signUpWithEmail({ name, email, password });
      } else {
        await auth.loginWithEmail(email, password);
      }
      completeAuth();
    } catch (currentError) {
      setError(
        currentError instanceof Error ? currentError.message : "Could not sign in."
      );
    }
  };

  const requestOtp = () => {
    setError("");
    try {
      const code = auth.requestPhoneOtp(phone);
      setOtpHint(`Demo OTP: ${code}`);
    } catch (currentError) {
      setError(
        currentError instanceof Error ? currentError.message : "Could not send OTP."
      );
    }
  };

  const submitPhone = () => {
    setError("");
    try {
      auth.loginWithPhone(phone, otp);
      completeAuth();
    } catch (currentError) {
      setError(
        currentError instanceof Error ? currentError.message : "Could not sign in."
      );
    }
  };

  const submitGoogle = () => {
    auth.loginWithGoogleDemo();
    completeAuth();
  };

  return (
    <main className="min-h-screen bg-[#080a0f] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.18),transparent_24%),radial-gradient(circle_at_78%_14%,rgba(168,85,247,0.15),transparent_24%),linear-gradient(135deg,rgba(15,23,42,0.9),rgba(2,6,23,0.98))]" />
      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl gap-8 px-5 py-8 lg:grid-cols-[0.9fr_1fr] lg:items-center">
        <section>
          <p className="text-sm font-black uppercase tracking-[0.26em] text-cyan-200">
            Secure candidate workspace
          </p>
          <h1 className="mt-4 text-5xl font-black tracking-normal sm:text-6xl">
            Rolequill
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            Keep resumes, ATS history, saved jobs, network outreach, and
            application tracking scoped to your signed-in account.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <AuthCapability title="Email" detail="Password hash" />
            <AuthCapability title="Phone OTP" detail="Demo local OTP" />
            <AuthCapability title="Google" detail="OAuth-ready demo" />
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-950/70 p-1">
            {[
              ["login", "Login"],
              ["signup", "Sign Up"],
              ["phone", "Phone"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => {
                  setMode(value as Mode);
                  setError("");
                }}
                className={`rounded-md px-3 py-2 text-sm font-black ${
                  mode === value
                    ? "bg-white text-slate-950"
                    : "text-slate-300 hover:bg-white/10"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {mode !== "phone" ? (
            <div className="mt-5 grid gap-4">
              {mode === "signup" && (
                <label className="block">
                  <span className="text-sm font-semibold text-slate-300">
                    Full name
                  </span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-2 min-h-12 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-white outline-none focus:border-cyan-300"
                  />
                </label>
              )}
              <label className="block">
                <span className="text-sm font-semibold text-slate-300">
                  Email
                </span>
                <input
                  value={email}
                  type="email"
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 min-h-12 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-white outline-none focus:border-cyan-300"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-300">
                  Password
                </span>
                <input
                  value={password}
                  type="password"
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 min-h-12 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-white outline-none focus:border-cyan-300"
                />
              </label>
              <button
                onClick={() => void submitEmail()}
                className="min-h-12 rounded-md bg-cyan-300 font-black text-slate-950"
              >
                {mode === "signup" ? "Create Account" : "Login"}
              </button>
            </div>
          ) : (
            <div className="mt-5 grid gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-300">
                  Phone number
                </span>
                <input
                  value={phone}
                  type="tel"
                  placeholder="+91 98765 43210"
                  onChange={(event) => setPhone(event.target.value)}
                  className="mt-2 min-h-12 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-white outline-none focus:border-cyan-300"
                />
              </label>
              <button
                onClick={requestOtp}
                className="min-h-12 rounded-md border border-cyan-300/40 font-black text-cyan-100 hover:bg-cyan-300/10"
              >
                Request OTP
              </button>
              {otpHint && (
                <p className="rounded-md border border-emerald-300/30 bg-emerald-300/10 p-3 text-sm text-emerald-100">
                  {otpHint}
                </p>
              )}
              <label className="block">
                <span className="text-sm font-semibold text-slate-300">
                  OTP
                </span>
                <input
                  value={otp}
                  inputMode="numeric"
                  onChange={(event) => setOtp(event.target.value)}
                  className="mt-2 min-h-12 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-white outline-none focus:border-cyan-300"
                />
              </label>
              <button
                onClick={submitPhone}
                className="min-h-12 rounded-md bg-cyan-300 font-black text-slate-950"
              >
                Login With Phone
              </button>
            </div>
          )}

          <div className="my-5 h-px bg-white/10" />
          <button
            onClick={submitGoogle}
            className="min-h-12 w-full rounded-md border border-white/10 bg-white/[0.03] font-black text-slate-100 hover:bg-white/10"
          >
            Continue With Google Demo
          </button>

          {error && (
            <p className="mt-4 rounded-md border border-rose-300/30 bg-rose-300/10 p-3 text-sm text-rose-100">
              {error}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

function AuthCapability({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <p className="text-sm font-black text-cyan-100">{title}</p>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
    </div>
  );
}

export default Login;
