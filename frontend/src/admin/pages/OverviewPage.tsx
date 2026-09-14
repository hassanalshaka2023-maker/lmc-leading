import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAdminQuery } from '../useAdminQuery';
import { PageTitle, Panel, Spinner } from '../ui/AdminUI';

interface Paged {
  total: number;
}

function StatCard({
  label,
  value,
  to,
}: {
  label: string;
  value: string | number;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="rounded-card border border-line bg-surface p-6 shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-16px_rgba(15,82,112,0.28)]"
    >
      <div className="text-4xl font-extrabold text-teal-700">{value}</div>
      <div className="mt-1 text-sm text-muted">{label}</div>
    </Link>
  );
}

export function OverviewPage() {
  const { t } = useTranslation();
  const newMsgs = useAdminQuery<Paged>('/admin/submissions?status=new&limit=1');
  const programs = useAdminQuery<unknown[]>('/admin/language-programs');
  const trainers = useAdminQuery<unknown[]>('/admin/trainers');
  const media = useAdminQuery<Paged>('/admin/media?limit=1');

  const loading =
    newMsgs.loading || programs.loading || trainers.loading || media.loading;

  return (
    <div>
      <PageTitle eyebrow={t('admin.overview.eyebrow')} title={t('admin.overview.title')} />

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label={t('admin.overview.newMessages')}
            value={newMsgs.data?.total ?? 0}
            to="/leaderrami/submissions"
          />
          <StatCard
            label={t('admin.overview.languagePrograms')}
            value={programs.data?.length ?? 0}
            to="/leaderrami/language-programs"
          />
          <StatCard
            label={t('admin.overview.trainers')}
            value={trainers.data?.length ?? 0}
            to="/leaderrami/trainers"
          />
          <StatCard
            label={t('admin.overview.mediaFiles')}
            value={media.data?.total ?? 0}
            to="/leaderrami/media"
          />
        </div>
      )}

      <Panel title={t('admin.overview.quickLinks')} className="mt-6">
        <div className="flex flex-wrap gap-2 text-sm">
          {[
            ['/leaderrami/pages', t('admin.overview.editPages')],
            ['/leaderrami/stats', t('admin.overview.updateStats')],
            ['/leaderrami/submissions', t('admin.overview.reviewMessages')],
            ['/leaderrami/media', t('admin.nav.media')],
            ['/', t('admin.common.viewSite')],
          ].map(([to, label]) => (
            <Link
              key={to}
              to={to}
              className="rounded-full border border-line px-4 py-1.5 font-semibold text-teal-700 transition hover:bg-surface-2"
            >
              {label}
            </Link>
          ))}
        </div>
      </Panel>
    </div>
  );
}
