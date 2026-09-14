import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LanguageToggle } from '../components/layout/LanguageToggle';
import { LogoMark } from '../components/ui/LogoMark';
import { ADMIN_NAV } from './adminNav';
import { useAuth } from './AuthContext';

export function AdminLayout() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [location.pathname]);

  const onLogout = async () => {
    await logout();
    navigate('/leaderrami/login', { replace: true });
  };

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
      isActive
        ? 'bg-teal-50 text-teal-700 shadow-[inset_3px_0_0_var(--color-orange-500)]'
        : 'text-ink-soft hover:bg-surface-2 hover:text-teal-700'
    }`;

  const Sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b border-line px-5 py-4">
        <NavLink to="/leaderrami" aria-label="LMC">
          <LogoMark />
        </NavLink>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {ADMIN_NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={'end' in n ? n.end : undefined}
            className={linkCls}
          >
            {t(n.labelKey)}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-line p-3">
        <NavLink
          to="/"
          className="block rounded-xl px-3 py-2 text-sm font-semibold text-ink-soft hover:bg-surface-2 hover:text-teal-700"
        >
          {i18n.dir() === 'rtl' ? '←' : '→'} {t('admin.common.viewSite')}
        </NavLink>
      </div>
    </div>
  );

  return (
    <div className="min-h-svh bg-canvas" dir={i18n.dir()}>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-64 border-e border-line bg-surface lg:block">
        {Sidebar}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <>
          <button
            aria-label={t('admin.shell.closeMenu')}
            className="fixed inset-0 z-40 bg-ink/30 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed inset-y-0 start-0 z-50 w-64 border-e border-line bg-surface lg:hidden">
            {Sidebar}
          </aside>
        </>
      )}

      <div className="lg:ps-64">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-surface/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg border border-line px-2.5 py-1.5 text-sm lg:hidden"
              aria-label={t('admin.shell.openMenu')}
              onClick={() => setOpen(true)}
            >
              ☰
            </button>
            <span className="text-sm font-bold text-teal-700">
              {t('admin.shell.title')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted sm:inline">
              {user?.email}
            </span>
            <LanguageToggle />
            <button
              onClick={onLogout}
              className="rounded-full border border-line px-4 py-1.5 text-sm font-semibold text-teal-700 transition hover:bg-surface-3"
            >
              {t('admin.shell.logout')}
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
