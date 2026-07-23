'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Download, Search, X } from 'lucide-react';
import { exportAttendeesCsvAction } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AttendeeToolbar({
  eventId,
  initialSearch,
}: {
  eventId: string;
  initialSearch?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [exporting, startExport] = useTransition();
  const [searchValue, setSearchValue] = useState(initialSearch ?? '');

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();

    if (searchValue.trim()) {
      params.set('search', searchValue.trim());
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  function handleClear() {
    setSearchValue('');
    router.push(pathname);
  }

  function handleExport() {
    startExport(async () => {
      const result = await exportAttendeesCsvAction(eventId);

      if (result.error || !result.csv) {
        return;
      }

      const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `attendees-${eventId.slice(0, 8)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, email, or confirmation…"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-72 pl-9"
          />
        </div>
        <Button type="submit" size="sm" variant="secondary">
          Search
        </Button>
        {initialSearch ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleClear}
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </form>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={handleExport}
        disabled={exporting}
      >
        <Download className="size-4" />
        {exporting ? 'Exporting…' : 'Export CSV'}
      </Button>
    </div>
  );
}
