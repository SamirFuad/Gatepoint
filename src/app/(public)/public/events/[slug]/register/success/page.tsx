import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Download, QrCode } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createQRCodeService } from '@/features/qr-codes/services/supabase-qr-code-service';

export const metadata = {
  title: 'Registration Confirmed',
};

export default async function RegistrationSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ confirmation?: string; qr?: string; email?: string }>;
}) {
  const { slug } = await params;
  const { confirmation, qr, email } = await searchParams;
  const qrResult = qr ? await createQRCodeService().getByCode(qr) : null;
  const qrCode = qrResult?.data ?? null;

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-12 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/10">
        <CheckCircle2 className="size-7 text-primary" />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Registration confirmed</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Your confirmation number is{' '}
        <span className="font-semibold tabular-nums text-foreground">
          {confirmation ?? 'pending'}
        </span>
        .
      </p>
      {email === 'failed' ? (
        <p className="mx-auto mt-4 max-w-md rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800 dark:border-amber-800/30 dark:bg-amber-950/20 dark:text-amber-200">
          Your registration is complete, but the confirmation email could not be delivered. Download your QR code below.
        </p>
      ) : null}
      {qrCode?.qrImageUrl ? (
        <section className="mx-auto mt-8 w-full max-w-sm overflow-hidden rounded-lg border bg-card shadow-sm">
          <div className="border-b bg-muted/30 px-4 py-3">
            <div className="flex items-center justify-center gap-2 text-sm font-medium">
              <QrCode className="size-4 text-primary" />
              Your check-in QR code
            </div>
          </div>
          <div className="p-6">
            <Image
              src={qrCode.qrImageUrl}
              alt="Your event check-in QR code"
              width={280}
              height={280}
              className="mx-auto size-56"
              unoptimized
            />
          </div>
          <div className="border-t bg-muted/20 p-4">
            <a
              href={qrCode.qrImageUrl}
              download={`${slug}-qr-code.png`}
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'mx-auto gap-2'
              )}
            >
              <Download />
              Download QR code
            </a>
          </div>
        </section>
      ) : null}
      <Link
        href={`/public/events/${slug}`}
        className={cn(buttonVariants({ variant: 'outline' }), 'mx-auto mt-8')}
      >
        Back to event
      </Link>
    </main>
  );
}
