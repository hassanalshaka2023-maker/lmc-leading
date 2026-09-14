import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LanguageToggle } from '../../components/layout/LanguageToggle';
import { RingMotif } from '../../components/ui/BrandMotif';
import { LogoMark } from '../../components/ui/LogoMark';
import { adminApi, apiErrorMessage } from '../adminApi';
import { useAuth } from '../AuthContext';
import { Btn, Label, TextInput } from '../ui/AdminUI';

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path
        d="M10.6 5.1A10.9 10.9 0 0 1 12 5c5.5 0 9.5 4.5 10.5 7-.4 1-1.1 2.2-2.1 3.3M6.3 6.9C4.4 8.1 3 9.9 1.5 12c1 2.5 5 7 10.5 7 1.2 0 2.3-.2 3.4-.6M9.5 9.8a3 3 0 0 0 4.2 4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/** Password input with a show/hide toggle — shared by the login field and
 * the new-password field in the reset flow. */
function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <TextInput
          type={show ? 'text' : 'password'}
          dir="ltr"
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-10"
          required
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? t('admin.login.hidePassword') : t('admin.login.showPassword')}
          className="absolute inset-y-0 right-2 flex items-center text-muted hover:text-teal-700"
        >
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  );
}

type Mode = 'login' | 'forgot' | 'reset';

export function LoginPage() {
  const { t, i18n } = useTranslation();
  const { user, ready, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    '/leaderrami';

  const [mode, setMode] = useState<Mode>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [forgotEmail, setForgotEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [flowMsg, setFlowMsg] = useState<string | null>(null);
  const [flowError, setFlowError] = useState<string | null>(null);
  const [flowBusy, setFlowBusy] = useState(false);

  if (ready && user) return <Navigate to={from} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const openForgot = () => {
    setForgotEmail(email);
    setFlowMsg(null);
    setFlowError(null);
    setMode('forgot');
  };

  const backToLogin = () => {
    setFlowMsg(null);
    setFlowError(null);
    setCode('');
    setNewPassword('');
    setMode('login');
  };

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlowBusy(true);
    setFlowError(null);
    try {
      await adminApi.post('/auth/forgot-password', { email: forgotEmail });
      setFlowMsg(t('admin.login.codeSentMessage'));
      setMode('reset');
    } catch (err) {
      setFlowError(apiErrorMessage(err));
    } finally {
      setFlowBusy(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlowBusy(true);
    setFlowError(null);
    try {
      await adminApi.post('/auth/reset-password', {
        email: forgotEmail,
        code,
        newPassword,
      });
      setFlowMsg(t('admin.login.resetSuccessMessage'));
      setEmail(forgotEmail);
      setPassword('');
      setCode('');
      setNewPassword('');
      setMode('login');
    } catch (err) {
      setFlowError(apiErrorMessage(err));
    } finally {
      setFlowBusy(false);
    }
  };

  return (
    <div
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-canvas p-4"
      dir={i18n.dir()}
    >
      <span className="lmc-blob start-[-8rem] top-[-6rem] h-72 w-72 bg-teal-200" />
      <span className="lmc-blob end-[-6rem] bottom-[-8rem] h-72 w-72 bg-orange-200" />
      <RingMotif className="lmc-spin-slow hidden end-[-4rem] top-[10%] h-80 w-80 sm:block" />
      <LanguageToggle className="absolute top-4 end-4" />
      <div className="relative w-full max-w-sm rounded-2xl border border-line bg-surface p-7 shadow-[var(--shadow-card-lg)]">
        <div className="flex justify-center">
          <LogoMark />
        </div>

        {mode === 'login' && (
          <>
            <h1 className="mt-6 text-center text-lg font-bold text-teal-700">
              {t('admin.login.title')}
            </h1>

            <form className="mt-6 space-y-4" onSubmit={submit}>
              <div>
                <Label>{t('admin.login.email')}</Label>
                <TextInput
                  type="email"
                  dir="ltr"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <PasswordField
                label={t('admin.login.password')}
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
              />

              <div className="text-end">
                <button
                  type="button"
                  onClick={openForgot}
                  className="text-xs font-semibold text-teal-700 hover:underline"
                >
                  {t('admin.login.forgotPassword')}
                </button>
              </div>

              {error ? (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              ) : null}

              <Btn type="submit" className="w-full" disabled={busy}>
                {busy ? t('admin.login.submitting') : t('admin.login.submit')}
              </Btn>
            </form>
          </>
        )}

        {mode === 'forgot' && (
          <>
            <h1 className="mt-6 text-center text-lg font-bold text-teal-700">
              {t('admin.login.forgotPasswordTitle')}
            </h1>
            <p className="mt-2 text-center text-sm text-ink-soft">
              {t('admin.login.forgotPasswordSubtitle')}
            </p>

            <form className="mt-6 space-y-4" onSubmit={sendCode}>
              <div>
                <Label>{t('admin.login.email')}</Label>
                <TextInput
                  type="email"
                  dir="ltr"
                  autoComplete="username"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>

              {flowError ? (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {flowError}
                </p>
              ) : null}

              <Btn type="submit" className="w-full" disabled={flowBusy}>
                {flowBusy ? t('admin.login.sendingCode') : t('admin.login.sendCode')}
              </Btn>
              <button
                type="button"
                onClick={backToLogin}
                className="block w-full text-center text-xs font-semibold text-teal-700 hover:underline"
              >
                {t('admin.login.backToLogin')}
              </button>
            </form>
          </>
        )}

        {mode === 'reset' && (
          <>
            <h1 className="mt-6 text-center text-lg font-bold text-teal-700">
              {t('admin.login.forgotPasswordTitle')}
            </h1>
            {flowMsg ? (
              <p className="mt-2 text-center text-sm text-teal-700">{flowMsg}</p>
            ) : null}

            <form className="mt-6 space-y-4" onSubmit={resetPassword}>
              <div>
                <Label>{t('admin.login.code')}</Label>
                <TextInput
                  type="text"
                  inputMode="numeric"
                  dir="ltr"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
              <PasswordField
                label={t('admin.login.newPassword')}
                value={newPassword}
                onChange={setNewPassword}
                autoComplete="new-password"
              />

              {flowError ? (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {flowError}
                </p>
              ) : null}

              <Btn type="submit" className="w-full" disabled={flowBusy}>
                {flowBusy ? t('admin.login.resettingPassword') : t('admin.login.resetPassword')}
              </Btn>
              <button
                type="button"
                onClick={backToLogin}
                className="block w-full text-center text-xs font-semibold text-teal-700 hover:underline"
              >
                {t('admin.login.backToLogin')}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
