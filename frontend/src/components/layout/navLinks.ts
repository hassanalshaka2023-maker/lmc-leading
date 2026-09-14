/** Primary navigation — order matches the requirements document. */
export const NAV_LINKS = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/about', key: 'nav.about' },
  { to: '/programs', key: 'nav.programs' },
  { to: '/services', key: 'nav.services' },
  { to: '/trainers', key: 'nav.trainers' },
  { to: '/membership', key: 'nav.membership' },
  { to: '/partners', key: 'nav.partners' },
  { to: '/contact', key: 'nav.contact' },
] as const;
