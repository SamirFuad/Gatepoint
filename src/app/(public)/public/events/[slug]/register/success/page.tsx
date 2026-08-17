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
  searchParams: Promise<{ confirmation?: string; qr?: string }>;
}) {
  const { slug } = await params;
  const { confirmation, qr } = await searchParams;
  const qrResult = qr ? await createQRCodeService().getByCode(qr) : null;
  const qrCode = qrResult?.data ?? null;

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-12 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <CheckCircle2 className="size-6" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold">Registration confirmed</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Your confirmation number is{' '}
        <span className="font-medium text-foreground">
          {confirmation ?? 'pending'}
        </span>
        .
      </p>
      {qrCode?.qrImageUrl ? (
        <section className="mx-auto mt-6 w-full max-w-sm rounded-lg border bg-card p-5">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <QrCode className="size-4 text-primary" />
            Your check-in QR code
          </div>
          <Image
            src={qrCode.qrImageUrl}
            alt="Your event check-in QR code"
            width={280}
            height={280}
            className="mx-auto mt-4 size-56"
            unoptimized
          />
          <a
            href={qrCode.qrImageUrl}
            download={`${slug}-qr-code.png`}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'mx-auto mt-4 gap-2'
            )}
          >
            <Download />
            Download QR code
          </a>
        </section>
      ) : null}
      <Link
        href={`/public/events/${slug}`}
        className={cn(buttonVariants({ variant: 'outline' }), 'mx-auto mt-6')}
      >
        Back to event
      </Link>
    </main>
  );
}

