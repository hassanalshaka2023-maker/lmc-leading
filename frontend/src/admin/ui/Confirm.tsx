import { useTranslation } from 'react-i18next';
import { Btn } from './AdminUI';
import { Modal } from './Modal';

export function Confirm({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  busy = false,
}: {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <Modal
      open={open}
      title={title ?? t('admin.common.confirmDeleteTitle')}
      onClose={onCancel}
      footer={
        <>
          <Btn tone="ghost" onClick={onCancel} disabled={busy}>
            {t('admin.common.cancel')}
          </Btn>
          <Btn tone="danger" onClick={onConfirm} disabled={busy}>
            {busy ? '…' : (confirmLabel ?? t('admin.common.delete'))}
          </Btn>
        </>
      }
    >
      <p className="text-sm text-ink-soft">{message}</p>
    </Modal>
  );
}
