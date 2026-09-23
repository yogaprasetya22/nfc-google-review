import React from 'react';
import type { NfcTagEntity } from '@/types/nfc';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink } from 'lucide-react';

interface TagTableProps {
  tags: NfcTagEntity[];
}

export function TagTable({ tags }: TagTableProps) {
  return (
    <Card className="border-slate-200 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-32 font-semibold">ID Tag</TableHead>
            <TableHead className="font-semibold">Tipe Produk</TableHead>
            <TableHead className="font-semibold">Nama Bisnis</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-center font-semibold">Total Tap</TableHead>
            <TableHead className="text-right font-semibold">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tags.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-mono font-semibold text-xs">{item.id}</TableCell>
              <TableCell>
                <Badge variant={item.type === 'DIRECT_REVIEW' ? 'default' : 'secondary'} className="text-[10px]">
                  {item.type}
                </Badge>
              </TableCell>
              <TableCell className="font-medium text-sm text-slate-800">{item.business_name || '-'}</TableCell>
              <TableCell>
                {item.is_active ? (
                  <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px]">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700 text-[10px]">
                    Unclaimed
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-center font-semibold text-slate-900">
                {item.total_taps || 0}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <a
                    href={`/manage/${item.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors shadow-xs"
                  >
                    Buka CMS
                  </a>
                  <a
                    href={`/t/${item.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-xs font-medium text-slate-600 hover:text-black p-1 hover:underline"
                  >
                    Tampilan Meja <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
