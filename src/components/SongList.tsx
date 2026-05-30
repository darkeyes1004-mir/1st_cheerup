/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Song, VocalCategory } from '../types';
import { Music, Play, Plus, Search, Trash2, Youtube, X, ExternalLink, Edit2, Check, RefreshCw } from 'lucide-react';

interface SongListProps {
  songs: Song[];
  onAddSong: (song: Omit<Song, 'id' | 'createdAt'>) => void;
  onDeleteSong: (id: string) => void;
  onEditSong: (id: string, updatedSong: Partial<Song>) => void;
  onResetSongs?: () => void;
}

export function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  } catch (error) {
    return null;
  }
}

export function getYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  } catch (error) {
    return null;
  }
}

export default function SongList({ songs, onAddSong, onDeleteSong, onEditSong, onResetSongs }: SongListProps) {
  const [activeTab, setActiveTab] = useState<'ALL' | VocalCategory>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [selectedSongTitle, setSelectedSongTitle] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New song form states
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newCategory, setNewCategory] = useState<VocalCategory>('FEMALE');
  const [newYoutubeUrl, setNewYoutubeUrl] = useState('');
  const [newTempo, setNewTempo] = useState('Medium');
  const [newMemo, setNewMemo] = useState('');

  // Editing song state
  const [editingSongId, setEditingSongId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editArtist, setEditArtist] = useState('');
  const [editCategory, setEditCategory] = useState<VocalCategory>('FEMALE');
  const [editYoutubeUrl, setEditYoutubeUrl] = useState('');
  const [editTempo, setEditTempo] = useState('Medium');
  const [editMemo, setEditMemo] = useState('');

  const handleCreateSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newArtist.trim()) return;

    onAddSong({
      title: newTitle.trim(),
      artist: newArtist.trim(),
      category: newCategory,
      youtubeUrl: newYoutubeUrl.trim(),
      tempo: newTempo,
      memo: newMemo.trim()
    });

    // Reset Form
    setNewTitle('');
    setNewArtist('');
    setNewCategory('FEMALE');
    setNewYoutubeUrl('');
    setNewTempo('Medium');
    setNewMemo('');
    setIsAddOpen(false);
  };

  const startEditSong = (song: Song) => {
    setEditingSongId(song.id);
    setEditTitle(song.title);
    setEditArtist(song.artist);
    setEditCategory(song.category);
    setEditYoutubeUrl(song.youtubeUrl);
    setEditTempo(song.tempo || 'Medium');
    setEditMemo(song.memo || '');
  };

  const handleSaveEdit = (id: string) => {
    onEditSong(id, {
      title: editTitle,
      artist: editArtist,
      category: editCategory,
      youtubeUrl: editYoutubeUrl,
      tempo: editTempo,
      memo: editMemo
    });
    setEditingSongId(null);
  };

  const filteredSongs = songs.filter(song => {
    const matchesTab = activeTab === 'ALL' || song.category === activeTab;
    const matchesSearch = 
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (song.memo && song.memo.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesSearch;
  }).sort((a, b) => a.title.localeCompare(b.title, 'ko'));

  const getCategoryColor = (category: VocalCategory) => {
    switch (category) {
      case 'MALE': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'FEMALE': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'DUET': return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'INSTRUMENTAL': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCategoryLabel = (category: VocalCategory) => {
    switch (category) {
      case 'MALE': return '남성 보컬 ♂';
      case 'FEMALE': return '여성 보컬 ♀';
      case 'DUET': return '혼성/듀엣 ⚤';
      case 'INSTRUMENTAL': return '연주곡 🎸';
      default: return '기타';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            id="song-search-input"
            type="text"
            placeholder="노래 제목, 아티스트, 메모 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          {onResetSongs && (
            <button
              id="btn-reset-songs"
              type="button"
              onClick={() => {
                if (window.confirm('기존 모디파이 데이터를 초기화하고 쳐럽밴드 공식 곡목(34곡)으로 변경하시겠습니까? 수동 추가된 곡과 구버전 기록은 삭제됩니다.')) {
                  onResetSongs();
                }
              }}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium active:scale-95 transition-all"
              title="데이터를 쳐럽밴드 기본 공식 곡목 34곡 배열로 새로고침합니다."
            >
              <RefreshCw className="w-4.5 h-4.5 text-slate-500" />
              <span>공식 곡목으로 데이터 초기화 (34곡)</span>
            </button>
          )}
          <button
            id="btn-add-song-toggle"
            onClick={() => setIsAddOpen(!isAddOpen)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 active:scale-95 transition-all shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            새 곡 추가하기
          </button>
        </div>
      </div>

      {/* Add New Song Expandable Panel */}
      {isAddOpen && (
        <form onSubmit={handleCreateSong} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-amber-500" />
              신규 등록 곡 세부 정보 작성
            </h3>
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">곡 제목 <span className="text-rose-500">*</span></label>
              <input
                id="song-input-title"
                type="text"
                required
                placeholder="예: 사건의 지평선"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">아티스트 <span className="text-rose-500">*</span></label>
              <input
                id="song-input-artist"
                type="text"
                required
                placeholder="예: 윤하"
                value={newArtist}
                onChange={(e) => setNewArtist(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">보컬 구분 <span className="text-rose-500">*</span></label>
              <select
                id="song-input-category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as VocalCategory)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="FEMALE">여성 보컬 ♀</option>
                <option value="MALE">남성 보컬 ♂</option>
                <option value="DUET">혼성 / 듀엣 ⚤</option>
                <option value="INSTRUMENTAL">연주곡 🎸</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">템포</label>
              <select
                id="song-input-tempo"
                value={newTempo}
                onChange={(e) => setNewTempo(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="Fast">빠름 (Fast-paced)</option>
                <option value="Medium">보통 (Medium Tempo)</option>
                <option value="Slow">느림 (Ballad/Slow)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">유튜브 링크 (선택 시 재생 가능)</label>
            <input
              id="song-input-url"
              type="url"
              placeholder="예: https://www.youtube.com/watch?v=..."
              value={newYoutubeUrl}
              onChange={(e) => setNewYoutubeUrl(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">합주 메모 / 특이사항</label>
            <textarea
              id="song-input-memo"
              rows={2}
              placeholder="예: 기타 원키 연주 필수, 코러스 화음 라인 체크 필요"
              value={newMemo}
              onChange={(e) => setNewMemo(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
            >
              저장하기
            </button>
          </div>
        </form>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-none gap-1">
        {[
          { key: 'ALL', label: '전체 목록' },
          { key: 'FEMALE', label: '여성 보컬 ♀' },
          { key: 'MALE', label: '남성 보컬 ♂' },
          { key: 'DUET', label: '혼성/듀엣' },
          { key: 'INSTRUMENTAL', label: '연주곡' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Song Grid */}
      {filteredSongs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-100 rounded-2xl text-slate-400">
          <Music className="w-12 h-12 stroke-[1.5] mb-2 text-slate-300" />
          <p className="text-sm font-medium">편성된 노래 목록이 비어 있습니다.</p>
          <p className="text-xs text-slate-400 mt-1">검색어를 지우거나 우측 상단에서 새 곡을 등록해 보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSongs.map(song => {
            const isEditing = editingSongId === song.id;
            return (
              <div
                key={song.id}
                id={`song-card-${song.id}`}
                className={`flex flex-col justify-between p-5 bg-white border rounded-2xl transition-all shadow-sm group hover:shadow-md hover:border-slate-300/80 ${
                  isEditing ? 'border-amber-400 ring-2 ring-amber-400/10' : 'border-slate-200/80'
                }`}
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="제목"
                        className="px-2.5 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        value={editArtist}
                        onChange={(e) => setEditArtist(e.target.value)}
                        placeholder="아티스트"
                        className="px-2.5 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as VocalCategory)}
                        className="px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="FEMALE">여성 보컬 ♀</option>
                        <option value="MALE">남성 보컬 ♂</option>
                        <option value="DUET">혼성 / 듀엣 ⚤</option>
                        <option value="INSTRUMENTAL">연주곡 🎸</option>
                      </select>
                      <select
                        value={editTempo}
                        onChange={(e) => setEditTempo(e.target.value)}
                        className="px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="Fast">빠름</option>
                        <option value="Medium">보통</option>
                        <option value="Slow">느림</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      value={editYoutubeUrl}
                      onChange={(e) => setEditYoutubeUrl(e.target.value)}
                      placeholder="유튜브 URL 링크"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:outline-none"
                    />
                    <textarea
                      value={editMemo}
                      onChange={(e) => setEditMemo(e.target.value)}
                      placeholder="메모 사항"
                      rows={2}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:outline-none resize-none"
                    />
                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={() => setEditingSongId(null)}
                        className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded transition-colors"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => handleSaveEdit(song.id)}
                        className="flex items-center gap-1 px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        저장
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                            {song.title}
                          </h4>
                          <span className="text-xs text-slate-500">{song.artist}</span>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border text-center whitespace-nowrap ${getCategoryColor(song.category)}`}>
                          {getCategoryLabel(song.category)}
                        </span>
                      </div>

                      {song.memo && (
                        <p className="bg-slate-50 text-[11px] text-slate-600 px-3 py-2 rounded-lg border border-slate-100 leading-relaxed font-sans">
                          {song.memo}
                        </p>
                      )}

                      <div className="flex items-center gap-2">
                        {song.tempo && (
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/50">
                            ⚡ Tempo: {song.tempo}
                          </span>
                        )}
                        {song.youtubeUrl && (
                          <span className="text-[10px] text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 inline-flex items-center gap-0.5 font-sans">
                            <Youtube className="w-3 h-3 text-rose-600" />
                            영상 포함
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4">
                      <div className="flex items-center gap-1.5">
                        {song.youtubeUrl ? (
                          <>
                            <button
                              id={`btn-play-${song.id}`}
                              onClick={() => {
                                setSelectedVideoUrl(song.youtubeUrl);
                                setSelectedSongTitle(song.title);
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-semibold hover:bg-rose-100 hover:text-rose-700 transition active:scale-95"
                            >
                              <Play className="w-3 h-3 fill-rose-600 stroke-[3]" />
                              인앱 재생
                            </button>
                            <a
                              id={`link-youtube-external-${song.id}`}
                              href={song.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-50 rounded-lg transition"
                              title="유튜브 새창으로 열기"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">등록된 영상 없음</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          id={`btn-edit-${song.id}`}
                          onClick={() => startEditSong(song)}
                          className="p-1.5 hover:bg-slate-100 hover:text-slate-700 text-slate-400 rounded-lg transition-colors"
                          title="곡 수정"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`btn-delete-${song.id}`}
                          onClick={() => {
                            if (window.confirm(`'${song.title}' 곡을 정말 카탈로그에서 삭제하시겠습니까?`)) {
                              onDeleteSong(song.id);
                            }
                          }}
                          className="p-1.5 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-lg transition-colors"
                          title="곡 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* YouTube Embedded Modal */}
      {selectedVideoUrl && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden w-full max-w-2xl shadow-2xl relative">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h4 className="font-bold text-white text-sm line-clamp-1">
                  유튜브 플레이어: {selectedSongTitle}
                </h4>
              </div>
              <button
                id="btn-close-modal-player"
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
                  id="youtube-embed-iframe"
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
                  <a
                    href={selectedVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition"
                  >
                    외부 새 브라우저 창에서 열기
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <div className="bg-slate-950 px-5 py-3 flex justify-between items-center text-xs text-slate-400">
              <span>쳐럽밴드 합주 리액트 매니저 인앱 미디어 링크</span>
              <a
                href={selectedVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 hover:underline flex items-center gap-0.5"
              >
                유튜브 오리지널 링크 이동
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
