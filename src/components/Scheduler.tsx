/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GigEvent, Song } from '../types';
import { Calendar, MapPin, Clock, Music, ChevronDown, ChevronUp, Plus, Trash2, Edit2, Play, Check, ArrowUp, ArrowDown, X, Youtube, ExternalLink } from 'lucide-react';
import { getYoutubeEmbedUrl } from './SongList';

interface SchedulerProps {
  gigs: GigEvent[];
  songs: Song[];
  onAddGig: (gig: Omit<GigEvent, 'id'>) => void;
  onDeleteGig: (id: string) => void;
  onUpdateGig: (id: string, updatedGig: Partial<GigEvent>) => void;
}

export default function Scheduler({ gigs, songs, onAddGig, onDeleteGig, onUpdateGig }: SchedulerProps) {
  const availableYears = React.useMemo(() => {
    const list = gigs.map(g => {
      if (!g.date) return '';
      return g.date.split('-')[0];
    }).filter(Boolean);
    const unique = Array.from(new Set(list));
    return unique.sort((a, b) => b.localeCompare(a)); // descending
  }, [gigs]);

  const [selectedYear, setSelectedYear] = useState<string>('ALL');

  const filteredGigs = React.useMemo(() => {
    if (selectedYear === 'ALL') return gigs;
    return gigs.filter(g => g.date && g.date.startsWith(selectedYear));
  }, [gigs, selectedYear]);

  const [selectedGigId, setSelectedGigId] = useState<string | null>(null);

  React.useEffect(() => {
    if (filteredGigs.length > 0) {
      const hasSelected = filteredGigs.some(g => g.id === selectedGigId);
      if (!hasSelected) {
        setSelectedGigId(filteredGigs[0].id);
      }
    } else {
      setSelectedGigId(null);
    }
  }, [filteredGigs, selectedGigId]);

  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states for new gig
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Editing gig state
  const [editingGigId, setEditingGigId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  // Live video player in Scheduler
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [selectedSongTitle, setSelectedSongTitle] = useState<string | null>(null);

  // D-Day calculator helper
  const calculateDDay = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const gigDate = new Date(dateStr);
    gigDate.setHours(0, 0, 0, 0);

    const diffTime = gigDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'D-Day ⚡';
    if (diffDays < 0) return `공연 완료`;
    return `D-${diffDays}`;
  };

  const handleCreateGig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate || !newTime || !newLocation.trim()) return;

    onAddGig({
      title: newTitle.trim(),
      date: newDate,
      time: newTime,
      location: newLocation.trim(),
      description: newDescription.trim(),
      status: 'UPCOMING',
      setlistSongIds: []
    });

    // Reset Form
    setNewTitle('');
    setNewDate('');
    setNewTime('');
    setNewLocation('');
    setNewDescription('');
    setIsAddOpen(false);
  };

  const startEditGig = (gig: GigEvent) => {
    setEditingGigId(gig.id);
    setEditTitle(gig.title);
    setEditDate(gig.date);
    setEditTime(gig.time);
    setEditLocation(gig.location);
    setEditDescription(gig.description || '');
    setEditStatus(gig.status);
  };

  const saveEditGig = (id: string) => {
    onUpdateGig(id, {
      title: editTitle,
      date: editDate,
      time: editTime,
      location: editLocation,
      description: editDescription,
      status: editStatus
    });
    setEditingGigId(null);
  };

  const selectedGig = gigs.find(g => g.id === selectedGigId);

  // Setlist manipulation
  const moveSongInSetlist = (gigId: string, songId: string, direction: 'UP' | 'DOWN') => {
    if (!selectedGig) return;
    const songIds = [...selectedGig.setlistSongIds];
    const index = songIds.indexOf(songId);
    if (index === -1) return;

    if (direction === 'UP' && index > 0) {
      const temp = songIds[index];
      songIds[index] = songIds[index - 1];
      songIds[index - 1] = temp;
    } else if (direction === 'DOWN' && index < songIds.length - 1) {
      const temp = songIds[index];
      songIds[index] = songIds[index + 1];
      songIds[index + 1] = temp;
    }

    onUpdateGig(gigId, { setlistSongIds: songIds });
  };

  const removeSongFromSetlist = (gigId: string, songId: string) => {
    if (!selectedGig) return;
    const updatedIds = selectedGig.setlistSongIds.filter(id => id !== songId);
    onUpdateGig(gigId, { setlistSongIds: updatedIds });
  };

  const addSongToSetlist = (gigId: string, songId: string) => {
    if (!selectedGig) return;
    if (selectedGig.setlistSongIds.includes(songId)) return; // Prevent duplicates
    const updatedIds = [...selectedGig.setlistSongIds, songId];
    onUpdateGig(gigId, { setlistSongIds: updatedIds });
  };

  const getStatusBadge = (status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED') => {
    switch (status) {
      case 'UPCOMING':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'COMPLETED':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-500 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  const getStatusLabel = (status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED') => {
    switch (status) {
      case 'UPCOMING': return '공연 예정';
      case 'COMPLETED': return '종료됨';
      case 'CANCELLED': return '취소됨';
    }
  };

  // Maps song ids to actual song structures
  const resolvedSetlistSongs = selectedGig
    ? selectedGig.setlistSongIds
        .map(id => songs.find(s => s.id === id))
        .filter((s): s is Song => !!s)
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* GIGS LIST (4 Columns on large screen) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            공연 일정 스케쥴러
          </h3>
          <button
            id="btn-add-gig-toggle"
            onClick={() => setIsAddOpen(!isAddOpen)}
            className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            공연 추가
          </button>
        </div>

        {/* Year Filter tabs */}
        {availableYears.length > 0 && (
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setSelectedYear('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedYear === 'ALL'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              전체 년도
            </button>
            {availableYears.map(yr => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedYear === yr
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {yr}년
              </button>
            ))}
          </div>
        )}

        {isAddOpen && (
          <form onSubmit={handleCreateGig} className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl space-y-3 animate-fadeIn">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">행사/공연 이름 <span className="text-rose-500">*</span></label>
              <input
                id="gig-input-title"
                type="text"
                required
                placeholder="예: 2026 하반기 정기 단독 라이브"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">공연 날짜 <span className="text-rose-500">*</span></label>
                <input
                  id="gig-input-date"
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">시작 시간 <span className="text-rose-500">*</span></label>
                <input
                  id="gig-input-time"
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">공연 장소 <span className="text-rose-500">*</span></label>
              <input
                id="gig-input-location"
                type="text"
                required
                placeholder="예: 마포 아트센터 / 뚝섬 한강 수변무대"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">상세 행사 내용</label>
              <textarea
                id="gig-input-desc"
                rows={2}
                placeholder="관객 수 타겟 및 게스트 초대 현황, 드레스 코드 등 작성"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none resize-none"
              />
            </div>
            <div className="flex justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-3 py-1 text-xs text-slate-500 hover:bg-slate-200 rounded transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-xs bg-slate-800 text-white rounded hover:bg-slate-900 transition-colors"
              >
                등록 완료
              </button>
            </div>
          </form>
        )}

        {/* Gigs Vertical Stack */}
        <div id="scheduler-gigs-container" className="space-y-3">
          {filteredGigs.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              {selectedYear === 'ALL'
                ? '스케줄러에 등록된 공연이 없습니다.'
                : `${selectedYear}년도에 등록된 공연이 없습니다.`}
            </p>
          ) : (
            filteredGigs
              .slice()
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // sort by date descending
              .map(gig => {
                const isSelected = selectedGigId === gig.id;
                const isEditing = editingGigId === gig.id;
                const dDayStr = calculateDDay(gig.date);

                return (
                  <div
                    key={gig.id}
                    id={`gig-item-${gig.id}`}
                    onClick={() => {
                      if (!isEditing) setSelectedGigId(gig.id);
                    }}
                    className={`p-4 border rounded-xl transition-all cursor-pointer relative text-left ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/20 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {isEditing ? (
                      <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                          <span>공연 세부수정</span>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as any)}
                            className="bg-white border rounded px-1.5 py-0.5"
                          >
                            <option value="UPCOMING">공연 예정</option>
                            <option value="COMPLETED">종료됨</option>
                            <option value="CANCELLED">취소됨</option>
                          </select>
                        </div>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-2 py-1 text-xs border rounded"
                          placeholder="공연 타이틀"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="px-2 py-1 text-xs border rounded"
                          />
                          <input
                            type="time"
                            value={editTime}
                            onChange={(e) => setEditTime(e.target.value)}
                            className="px-2 py-1 text-xs border rounded"
                          />
                        </div>
                        <input
                          type="text"
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          className="w-full px-2 py-1 text-xs border rounded"
                          placeholder="장소"
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full px-2 py-1 text-xs border rounded resize-none"
                          rows={2}
                          placeholder="공연 상세설명"
                        />
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setEditingGigId(null)}
                            className="px-2 py-1 text-[10px] text-slate-500"
                          >
                            취소
                          </button>
                          <button
                            onClick={() => saveEditGig(gig.id)}
                            className="px-2.5 py-1 text-[10px] bg-emerald-600 text-white font-medium rounded hover:bg-emerald-700"
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h4 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-amber-600">
                            {gig.title}
                          </h4>
                          <div className="flex gap-1 items-center">
                            <span className={`text-[9px] px-1.5 py-0.5 border rounded-md font-semibold ${getStatusBadge(gig.status)}`}>
                              {getStatusLabel(gig.status)}
                            </span>
                            {gig.status === 'UPCOMING' && (
                              <span className="text-[9px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-md">
                                {dDayStr}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1 text-xs text-slate-600">
                          <p className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{gig.date}</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{gig.time}시 시작</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span className="line-clamp-1">{gig.location}</span>
                          </p>
                        </div>

                        {gig.description && (
                          <p className="text-[11px] text-slate-500 mt-2 border-t border-slate-100 pt-1.5 line-clamp-2 italic">
                            "{gig.description}"
                          </p>
                        )}

                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Music className="w-3 h-3 text-slate-400" />
                            {gig.setlistSongIds.length}곡 선곡됨
                          </span>
                          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              id={`btn-gig-edit-${gig.id}`}
                              onClick={() => startEditGig(gig)}
                              className="hover:text-amber-500 p-1"
                              title="공연 정보 수정"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              id={`btn-gig-delete-${gig.id}`}
                              onClick={() => {
                                if (window.confirm(`'${gig.title}' 공연을 삭제하시겠습니까? 연관된 세트리스트 구성도 해제됩니다.`)) {
                                  onDeleteGig(gig.id);
                                  if (selectedGigId === gig.id) {
                                    setSelectedGigId(gigs.length > 0 ? gigs[0].id : null);
                                  }
                                }
                              }}
                              className="hover:text-rose-600 p-1"
                              title="공연 일정 삭제"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
          )}
        </div>
      </div>

      {/* SELECTED GIG SETLIST / PERFORMANCE SONGS (7 Columns logic) */}
      <div className="lg:col-span-7 space-y-4">
        {selectedGig ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full min-h-[400px]">
            <div>
              {/* Header Info */}
              <div className="pb-4 border-b border-slate-100 mb-4 text-left">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 border rounded-md text-[10px] font-semibold ${getStatusBadge(selectedGig.status)}`}>
                    {getStatusLabel(selectedGig.status)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {selectedGig.id}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg mt-1">{selectedGig.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  일정: {selectedGig.date} • {selectedGig.time} | 장소: {selectedGig.location}
                </p>
              </div>

              {/* Setlist Summary */}
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Music className="w-4 h-4 text-amber-500" />
                  당일 세트리스트 연주 순서 ({resolvedSetlistSongs.length}곡 선곡)
                </h4>
                <button
                  id="btn-open-setlist-picker"
                  onClick={() => setIsPickerOpen(true)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  곡 추가/선택
                </button>
              </div>

              {/* Connected Items / Songs in order */}
              {resolvedSetlistSongs.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400">
                  <Music className="w-10 h-10 text-slate-300 mb-1" />
                  <p className="text-xs">이 공연 날짜짜리에 등록된 노래가 없습니다.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">우측의 "곡 추가/선택" 버튼을 통해 밴드 카탈로그에서 노래를 선곡할 수 있습니다.</p>
                </div>
              ) : (
                <div id="setlist-songs-order-list" className="space-y-2">
                  {resolvedSetlistSongs.map((song, idx) => {
                    return (
                      <div
                        key={song.id}
                        id={`setlist-song-order-item-${song.id}`}
                        className="flex items-center justify-between p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl group hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 flex items-center justify-center bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-md font-mono text-[11px] font-bold">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h5 className="font-bold text-slate-900 text-sm">{song.title}</h5>
                              <span className="text-[10px] text-slate-400">({song.artist})</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                              보컬: {song.category === 'MALE' ? '♂ 남보컬' : song.category === 'FEMALE' ? '♀ 여보컬' : song.category === 'DUET' ? '혼성/듀엣 ⚤' : '연주곡 🎸'}
                              {song.tempo ? ` | 템포: ${song.tempo}` : ''}
                            </p>
                          </div>
                        </div>

                        {/* Song operations and Youtube launcher */}
                        <div className="flex items-center gap-1.5">
                          {song.youtubeUrl && (
                            <button
                              id={`setlist-play-${song.id}`}
                              onClick={() => {
                                setSelectedVideoUrl(song.youtubeUrl);
                                setSelectedSongTitle(song.title);
                              }}
                              className="p-1 px-2.5 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-bold hover:bg-rose-100 transition-colors inline-flex items-center gap-0.5"
                            >
                              <Play className="w-2.5 h-2.5 fill-rose-600" />
                              재생
                            </button>
                          )}

                          {/* Reordering indicators */}
                          <div className="flex flex-col">
                            <button
                              id={`btn-move-up-${song.id}`}
                              onClick={() => moveSongInSetlist(selectedGig.id, song.id, 'UP')}
                              disabled={idx === 0}
                              className={`p-0.5 text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-30`}
                              title="순서 한 칸 위로"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              id={`btn-move-down-${song.id}`}
                              onClick={() => moveSongInSetlist(selectedGig.id, song.id, 'DOWN')}
                              disabled={idx === resolvedSetlistSongs.length - 1}
                              className={`p-0.5 text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-30`}
                              title="순서 한 칸 아래로"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Delete from this specific gig setlist */}
                          <button
                            id={`btn-remove-set-song-${song.id}`}
                            onClick={() => removeSongFromSetlist(selectedGig.id, song.id)}
                            className="p-1 text-slate-300 hover:text-rose-500 rounded transition-colors"
                            title="세트리스트에서 제거"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Preparation/Schedule overview bottom nudge */}
            <div className="mt-8 border-t border-slate-100 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50 -mx-6 -mb-6 p-6 rounded-b-2xl">
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">BAND GIG PREPARATION STATUS</span>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  이 공연에 대한 고유 준비물 관리 탭은 상단의 <strong>공연 준비물</strong> 메뉴에서 별도로 정교하게 체크할 수 있습니다.
                </p>
              </div>
              <span className="text-[10px] font-mono bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded px-2 py-0.5 self-start sm:self-center">
                CheerUp Band Setlist
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 shadow-sm text-center flex flex-col justify-center items-center h-full min-h-[400px]">
            <Calendar className="w-12 h-12 stroke-[1.2] text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-500">지정된 공연이 선택되지 않았습니다.</p>
            <p className="text-xs text-slate-400 mt-1">왼쪽 공연 리스트에서 일정을 누르면 세부 세트리스트 구성 및 연주곡 조정 믹서가 활성화됩니다.</p>
          </div>
        )}
      </div>

      {/* POPUP FULL-PAGE SELECT DIALOG FOR SETLIST PICKER */}
      {isPickerOpen && selectedGig && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="text-left">
                <h3 className="font-extrabold text-slate-900 text-sm">
                  {selectedGig.title} - 세트리스트 선곡
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">원하는 노래를 클릭하여 공연 세트 목록에 올릴 수 있습니다.</p>
              </div>
              <button
                id="btn-close-song-picker"
                onClick={() => {
                  setIsPickerOpen(false);
                  setPickerSearch('');
                }}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Picker Search input */}
            <div className="my-3">
              <input
                id="picker-song-search"
                type="text"
                placeholder="곡명, 아티스트명 등으로 검색..."
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none"
              />
            </div>

            {/* Scrollable Song selection lists */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2">
              {songs
                .filter(song => {
                  const keyword = pickerSearch.toLowerCase();
                  return (
                    song.title.toLowerCase().includes(keyword) ||
                    song.artist.toLowerCase().includes(keyword)
                  );
                })
                .sort((a, b) => a.title.localeCompare(b.title, 'ko'))
                .map(song => {
                  const isSelected = selectedGig.setlistSongIds.includes(song.id);
                  return (
                    <div
                      key={song.id}
                      onClick={() => {
                        if (isSelected) {
                          removeSongFromSetlist(selectedGig.id, song.id);
                        } else {
                          addSongToSetlist(selectedGig.id, song.id);
                        }
                      }}
                      className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer text-left transition ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/20'
                          : 'border-slate-100 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-950 text-xs">{song.title}</span>
                          <span className="text-[10px] text-slate-400 font-medium">({song.artist})</span>
                        </div>
                        <span className="text-[9px] text-slate-400 block mt-0.5">
                          장르: {song.category === 'MALE' ? '남보컬 ♂' : song.category === 'FEMALE' ? '여보컬 ♀' : song.category === 'DUET' ? '혼성/듀엣 ⚤' : '연주곡 🎸'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isSelected ? (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-md">
                            선택됨 ✔
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-medium rounded-md">
                            선택 추가
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

              {songs.length === 0 && (
                <p className="text-xs text-slate-400 text-center italic py-6">카탈로그에 등록된 노래가 없습니다.</p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                id="btn-close-picker-modal"
                onClick={() => {
                  setIsPickerOpen(false);
                  setPickerSearch('');
                }}
                className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition"
              >
                구성 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* YouTube Embedded Modal for Setlist Preview */}
      {selectedVideoUrl && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden w-full max-w-2xl shadow-2xl relative">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h4 className="font-bold text-white text-sm line-clamp-1">
                  공연곡 예습 플레이어: {selectedSongTitle}
                </h4>
              </div>
              <button
                id="btn-close-modal-player2"
                onClick={() => {
                  setSelectedVideoUrl(null);
                  setSelectedSongTitle(null);
                }}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-video bg-black w-full">
              {getYoutubeEmbedUrl(selectedVideoUrl) ? (
                <iframe
                  id="youtube-embed-iframe2"
                  src={getYoutubeEmbedUrl(selectedVideoUrl) || ''}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-slate-400 p-6">
                  <p className="text-sm">올바른 유튜브 주소 형식이 아닙니다.</p>
                  <p className="text-xs text-slate-500 mt-1">{selectedVideoUrl}</p>
                </div>
              )}
            </div>

            <div className="bg-slate-950 px-5 py-3 flex justify-between items-center text-xs text-slate-400Mixer">
              <span>쳐럽밴드 합주 리액트 매니저 인앱 미디어 링크</span>
              <a
                href={selectedVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 hover:underline flex items-center gap-0.5"
              >
                유튜브 오리지널 링크 이동
                <ExternalLink className="w-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
