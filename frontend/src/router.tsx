import { lazy, Suspense, type ComponentType } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './components/layout/RootLayout';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CorporateTrainingPage } from './pages/CorporateTrainingPage';
import { HomePage } from './pages/HomePage';
import { MembershipPage } from './pages/MembershipPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PartnersPage } from './pages/PartnersPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { ServicesPage } from './pages/ServicesPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { TrainersPage } from './pages/TrainersPage';

/** Admin bundle is code-split — the public site never downloads it. */
const AdminSpinner = () => (
  <div className="flex min-h-svh items-center justify-center">
    <span className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-teal-200 border-t-teal-600" />
  </div>
);

function lazyEl(
  loader: () => Promise<Record<string, ComponentType>>,
  name: string,
) {
  const C = lazy(() =>
    loader().then((m) => ({ default: m[name] })),
  );
  return (
    <Suspense fallback={<AdminSpinner />}>
      <C />
    </Suspense>
  );
}

const adminResource = (key: string) => ({
  path: key,
  element: lazyEl(
    async () => {
      const { ResourcePage } = await import('./admin/resource/ResourcePage');
      const Wrapped = () => <ResourcePage resourceKey={key} />;
      return { [`R_${key}`]: Wrapped };
    },
    `R_${key}`,
  ),
});

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'programs', element: <ProgramsPage /> },
      { path: 'corporate-training', element: <CorporateTrainingPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'membership', element: <MembershipPage /> },
      { path: 'trainers', element: <TrainersPage /> },
      { path: 'partners', element: <PartnersPage /> },
      { path: 'testimonials', element: <TestimonialsPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/leaderrami',
    // AuthProvider lives here, not in main.tsx — scoped to the admin
    // subtree so public pages never mount it / never call /auth/me.
    element: lazyEl(() => import('./admin/AdminRoot'), 'AdminRoot'),
    children: [
      {
        path: 'login',
        element: lazyEl(() => import('./admin/pages/LoginPage'), 'LoginPage'),
      },
      {
        element: lazyEl(() => import('./admin/AdminGate'), 'AdminGate'),
        children: [
          {
            index: true,
            element: lazyEl(
              () => import('./admin/pages/OverviewPage'),
              'OverviewPage',
            ),
          },
          {
            path: 'pages',
            element: lazyEl(
              () => import('./admin/pages/PagesEditorPage'),
              'PagesEditorPage',
            ),
          },
          {
            path: 'stats',
            element: lazyEl(
              () => import('./admin/pages/StatsPage'),
              'StatsPage',
            ),
          },
          adminResource('language-programs'),
          adminResource('corporate-programs'),
          adminResource('educational-services'),
          adminResource('trainers'),
          adminResource('testimonials'),
          adminResource('partners'),
          {
            path: 'membership',
            element: lazyEl(
              () => import('./admin/pages/MembershipEditorPage'),
              'MembershipEditorPage',
            ),
          },
          {
            path: 'contact-info',
            element: lazyEl(
              () => import('./admin/pages/ContactInfoPage'),
              'ContactInfoPage',
            ),
          },
          {
            path: 'submissions',
            element: lazyEl(
              () => import('./admin/pages/SubmissionsPage'),
              'SubmissionsPage',
            ),
          },
          {
            path: 'media',
            element: lazyEl(
              () => import('./admin/pages/MediaPage'),
              'MediaPage',
            ),
          },
        ],
      },
    ],
  },
]);
