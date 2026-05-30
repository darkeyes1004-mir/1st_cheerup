/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type VocalCategory = 'MALE' | 'FEMALE' | 'DUET' | 'INSTRUMENTAL';

export interface Song {
  id: string;
  title: string;
  artist: string;
  category: VocalCategory; // 'MALE' for 남보컬, 'FEMALE' for 여보컬, etc.
  youtubeUrl: string;
  tempo?: string; // fast, medium, slow
  memo?: string;
  createdAt: string;
  attachmentName?: string; // Optional attachment name (e.g. "Grandal_Sheet_Gkey.pdf")
  attachmentUrl?: string;  // Optional attachment link/URL details
}

export interface GigEvent {
  id: string;
  title: string; // e.g., "정기 공연", "버스킹"
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  location: string; // e.g., "홍대 라이브클럽", "뚝섬 수변무대"
  description?: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  setlistSongIds: string[]; // Ordered song IDs selected for this event
}

export interface ChecklistItem {
  id: string;
  gigId: string; // Linked to a specific gig, or "global" for templates
  category: 'PERSONAL_INSTRUMENT' | 'COMMON_EQUIPMENT' | 'STAGE_CLOTHES' | 'OTHER'; 
  name: string;
  isCompleted: boolean;
  assignee?: string; // Who is responsible
}

export interface SongStat {
  songId: string;
  songTitle: string;
  artist: string;
  category: VocalCategory;
  count: number;
}
