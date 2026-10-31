'use client';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
export function ConfirmSubmit({
  children,
  title,
  description,
  confirmLabel = 'Confirm',
  disabled = false,
  iconOnly = false,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  disabled?: boolean;
  iconOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button
        ref={trigger}
        type="button"
        variant="destructive"
        size={iconOnly ? 'icon-sm' : 'sm'}
        disabled={disabled}
        aria-label={iconOnly ? title : undefined}
        onClick={() => setOpen(true)}
      >
        {children}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle className="text-xl font-medium pr-5">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm leading-7">
            {description}
          </DialogDescription>
          <div className="mt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Keep it
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                const form = trigger.current?.closest('form');
                setOpen(false);
                form?.requestSubmit();
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
