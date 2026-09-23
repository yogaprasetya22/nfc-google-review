import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { NfcTagEntity } from '@/types/nfc';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { MetricCards } from '@/components/admin/MetricCards';
import { TagTable } from '@/components/admin/TagTable';

export default function AdminDashboard() {
  const [tags, setTags] = useState<NfcTagEntity[]>([]);
  const [totalTaps, setTotalTaps] = useState<number>(0);
  const [newTagId, setNewTagId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, []);

  async function fetchMetrics() {
    setLoading(true);

    const { data: tagList, error } = await supabase
      .from('nfc_tags')
      .select('id, type, business_name, google_place_id, is_active, total_taps, hub_config, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Gagal mengambil data: ' + error.message);
    }

    const list = (tagList as NfcTagEntity[]) || [];
    setTags(list);
    
    const aggregateTaps = list.reduce((sum, item) => sum + (Number(item.total_taps) || 0), 0);
    setTotalTaps(aggregateTaps);
    
    setLoading(false);
  }

  async function handleCreateTag(e: React.FormEvent) {
    e.preventDefault();
    if (!newTagId.trim()) return;

    const formattedId = newTagId.trim().toUpperCase();
    const { error } = await supabase
      .from('nfc_tags')
      .insert([{ id: formattedId, is_active: false }]);

    if (!error) {
      toast.success(`Tag ${formattedId} berhasil didaftarkan!`);
      setNewTagId('');
      fetchMetrics();
    } else {
      if (error.code === '23505') {
        toast.error(`Tag ID "${formattedId}" sudah pernah didaftarkan sebelumnya.`);
      } else {
        toast.error(`Error (${error.code || 'DB'}): ${error.message}`);
      }
    }
  }

  const activeUnits = tags.filter((t) => t.is_active).length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">NFC Fleet Management</h1>
          <p className="text-sm text-slate-500">Monitoring status aktivasi unit akrilik dan metrik interaksi tap.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchMetrics} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          Perbarui
        </Button>
      </div>

      {/* Overview Stat Cards */}
      <MetricCards totalUnits={tags.length} activeUnits={activeUnits} totalTaps={totalTaps} />

      {/* Input Tag ID Baru */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Pre-Generate Tag ID Fisik</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateTag} className="flex gap-2">
            <Input
              placeholder="Contoh: TAG-A101"
              value={newTagId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTagId(e.target.value)}
              className="max-w-xs font-mono uppercase text-sm"
              required
            />
            <Button type="submit" size="sm" className="bg-slate-900 hover:bg-slate-800 text-white">
              <Plus className="h-4 w-4 mr-1" /> Daftarkan Tag
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tabel Inventaris */}
      <TagTable tags={tags} />
    </div>
  );
}
