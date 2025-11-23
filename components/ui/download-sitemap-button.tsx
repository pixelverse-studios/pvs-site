'use client';

import { FileDown } from 'lucide-react';

import { Button } from '@/components/ui/button';

type DownloadSitemapButtonProps = {
  urls: string[];
  filename?: string;
};

export function DownloadSitemapButton({
  urls,
  filename = 'pixelverse-sitemap-urls.csv',
}: DownloadSitemapButtonProps) {
  const uniqueUrls = Array.from(new Set(urls ?? []));

  const handleDownload = () => {
    if (!uniqueUrls.length) return;

    const csv = ['url', ...uniqueUrls].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(href);
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleDownload}
      disabled={!uniqueUrls.length}
      className="gap-2"
    >
      <FileDown className="h-4 w-4" aria-hidden />
      <span>Download CSV</span>
    </Button>
  );
}
