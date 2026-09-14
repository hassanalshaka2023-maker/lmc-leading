import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { api } from '../lib/api';
import type { ContactInfo } from '../lib/types';
import { useLocalized } from '../lib/useLocalized';
import { usePageHero } from '../lib/usePageHero';
import { useResource } from '../lib/useResource';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PageHero } from '../components/ui/PageHero';
import { Section } from '../components/ui/Section';

const digits = (v: string) => (v || '').replace(/\D/g, '');

/** Only ever embed a real absolute http(s) URL — a garbage/relative value
 * (e.g. saved by mistake from the admin form) would otherwise resolve
 * relative to the current page and could embed the site inside itself. */
const isEmbeddableUrl = (v: string) => /^https?:\/\//i.test(v);

export function ContactPage() {
  const { t } = useTranslation();
  const loc = useLocalized();
  const [params] = useSearchParams();
  const isRegister = params.get('intent') === 'register';
  const { data: info } = useResource<ContactInfo>('/contact-info');
  const hero = usePageHero('contact', {
    eyebrow: t('contact.eyebrow'),
    title: t('contact.title'),
    subtitle: t('contact.subtitle'),
  });

  const schema = z.object({
    name: z.string().min(2, t('contact.validation.name')),
    phone: z.string().min(4, t('contact.validation.phone')),
    email: z.string().email(t('contact.validation.email')),
    serviceOfInterest: z.string().optional(),
    message: z.string().min(5, t('contact.validation.message')),
  });
  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const [status, setStatus] = useState<'idle' | 'ok' | 'error' | 'rateLimited'>(
    'idle',
  );

  const onSubmit = async (values: FormValues) => {
    setStatus('idle');
    try {
      await api.post('/submissions', {
        ...values,
        type: isRegister ? 'enrollment' : 'contact',
      });
      setStatus('ok');
      reset();
    } catch (err) {
      const httpStatus = (err as AxiosError)?.response?.status;
      setStatus(httpStatus === 429 ? 'rateLimited' : 'error');
    }
  };

  const err = (name: keyof FormValues) =>
    errors[name] ? (
      <p className="mt-1 text-xs font-medium text-danger">
        {errors[name]?.message}
      </p>
    ) : null;

  const wa = digits(info?.whatsapp ?? '');
  const addr = loc(info?.address);

  const contactRows: { label: string; value: string; href?: string }[] = [];
  if (info?.phone)
    contactRows.push({
      label: t('contact.phoneLabel'),
      value: info.phone,
      href: `tel:${digits(info.phone) ? '+' + digits(info.phone) : info.phone}`,
    });
  if (wa)
    contactRows.push({
      label: t('contact.whatsapp'),
      value: info?.whatsapp ?? '',
      href: `https://wa.me/${wa}`,
    });
  if (info?.email)
    contactRows.push({
      label: t('contact.emailLabel'),
      value: info.email,
      href: `mailto:${info.email}`,
    });
  if (addr) contactRows.push({ label: t('contact.address'), value: addr });

  const socials = (info?.socialLinks ?? [])
    .slice()
    .sort((a, b) => a.order - b.order)
    .filter((s) => s.url);

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={isRegister ? t('nav.registerNow') : hero.title}
        subtitle={hero.subtitle}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <div data-reveal="left">
            <h2 className="text-xl font-bold text-teal-700">
              {t('contact.infoTitle')}
            </h2>

            <dl className="mt-6 space-y-4">
              {contactRows.map((row) => (
                <div key={row.label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {row.label}
                  </dt>
                  <dd className="mt-0.5 text-ink-soft">
                    {row.href ? (
                      <a
                        href={row.href}
                        className="font-medium text-teal-700 transition hover:text-orange-700"
                        {...(row.href.startsWith('http')
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {row.value}
                      </a>
                    ) : (
                      <span className="whitespace-pre-line">{row.value}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            {socials.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {t('contact.followUs')}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {socials.map((s) => (
                    <li key={s.platform + s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full border border-line px-3 py-1.5 text-sm font-medium capitalize text-teal-700 transition hover:border-orange-400 hover:text-orange-700"
                      >
                        {s.platform}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Card reveal="right">
            <h2 className="text-xl font-bold text-teal-700">
              {t('contact.formTitle')}
            </h2>

            {status === 'ok' ? (
              <div className="mt-6 rounded-xl bg-teal-50 p-6 text-center">
                <p className="font-bold text-teal-700">
                  {t('contact.successTitle')}
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  {t('contact.successBody')}
                </p>
              </div>
            ) : (
              <form
                className="mt-6 space-y-4"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <div>
                  <label className="mb-1 block text-sm font-semibold">
                    {t('contact.name')}
                  </label>
                  <input className="field" {...register('name')} />
                  {err('name')}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-semibold">
                      {t('contact.phone')}
                    </label>
                    <input className="field" inputMode="tel" {...register('phone')} />
                    {err('phone')}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold">
                      {t('contact.email')}
                    </label>
                    <input className="field" type="email" {...register('email')} />
                    {err('email')}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold">
                    {t('contact.service')}
                  </label>
                  <input
                    className="field"
                    placeholder={t('contact.servicePlaceholder')}
                    {...register('serviceOfInterest')}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold">
                    {t('contact.message')}
                  </label>
                  <textarea className="field" rows={4} {...register('message')} />
                  {err('message')}
                </div>

                {status === 'error' && (
                  <p className="text-sm font-medium text-danger">
                    {t('contact.errorBody')}
                  </p>
                )}
                {status === 'rateLimited' && (
                  <p className="text-sm font-medium text-danger">
                    {t('contact.errorRateLimit')}
                  </p>
                )}

                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? t('contact.sending') : t('contact.submit')}
                </Button>
              </form>
            )}
          </Card>
        </div>

        {info?.mapEmbedUrl && isEmbeddableUrl(info.mapEmbedUrl) ? (
          <div
            data-reveal="scale"
            className="mt-12 overflow-hidden rounded-card border border-line"
          >
            <iframe
              src={info.mapEmbedUrl}
              title={t('contact.mapTitle')}
              className="h-[320px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        ) : null}
      </Section>
    </>
  );
}
