import Image from 'next/image';
import { Download, QrCode } from 'lucide-react';
import { notFound } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createQRCodeService } from '@/features/qr-codes/services/supabase-qr-code-service';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Your QR Code',
};

export default async function QRCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const result = await createQRCodeService().getByCode(code);
  const qrImageUrl = result.data?.qrImageUrl;

  if (result.error || !qrImageUrl) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-12 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <QrCode className="size-6" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold">Your check-in QR code</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Present this code at the event check-in desk.
      </p>
      <div className="mx-auto mt-6 rounded-lg border bg-card p-5">
        <Image
          src={qrImageUrl}
          alt="Your event check-in QR code"
          width={320}
          height={320}
          className="size-64"
          unoptimized
        />
      </div>
      <a
        href={qrImageUrl}
        download="gatepoint-qr-code.png"
        className={cn(buttonVariants(), 'mx-auto mt-6 gap-2')}
      >
        <Download />
        Download QR code
      </a>
    </main>
  );
}
