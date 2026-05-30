/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { Song, GigEvent, ChecklistItem } from './types';
import { INITIAL_SONGS, INITIAL_GIGS, INITIAL_CHECKLISTS } from './data';
import SongList from './components/SongList';
import Scheduler from './components/Scheduler';
import StatsDashboard from './components/StatsDashboard';
import ChecklistManager from './components/ChecklistManager';

// Import Icons
import {
  Music,
  Calendar,
  ClipboardCheck,
  BarChart3,
  Sparkles,
  Clock,
  MapPin,
  Flame,
  AlertCircle,
  Megaphone,
  CheckCircle,
  ChevronRight,
  TrendingUp,
  Award,
  Mic,
  Guitar,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  RotateCcw
} from 'lucide-react';

interface NoticeItem {
  idx: string;
  title: string;
  detail: string;
}

const DEFAULT_NOTICES: NoticeItem[] = [
  { idx: '1', title: '개인 연습의 중요성', detail: '합주 전까지 배포용 코드를 기반으로 최소 3회 가량 가사 및 기타 악보 완벽 숙지.' },
  { idx: '2', title: '합주 지각 회비', detail: '합주 당일 약속 시각 시간 10분 초과당 누적 1,000원 벌금! (지각비는 반기 밴드 회식비로 직행)' },
  { idx: '3', title: '장비 및 소모품 챙기기', detail: '모든 보컬용 무선 인이어 인서트, 일렉 기타 케이블 젠더 및 페달 파워 서플라이는 직전 체크리스트 필수 검사.' },
  { idx: '4', title: '기본 에티켓 준수', detail: '피드백 시 예의바르게 웃으며 주고받기! 우리는 즐기기 위해 뭉친 Cheer-Up 밴드니까요 🌸' }
];

export default function App() {
  // 1. STATE INITIALIZATION (Local Storage hydrated or seeded with default initial data)
  const [songs, setSongs] = useState<Song[]>(() => {
    const saved = localStorage.getItem('cheerup_songs_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_SONGS;
  });

  const [notices, setNotices] = useState<NoticeItem[]>(() => {
    const saved = localStorage.getItem('cheerup_notices_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_NOTICES;
  });

  const [isEditingNotices, setIsEditingNotices] = useState(false);
  const [editingNoticesTemp, setEditingNoticesTemp] = useState<NoticeItem[]>([]);

  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('cheerup_members_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { role: '보컬', name: '이승현' },
      { role: '보컬', name: '김하라' },
      { role: '기타', name: '김덕홍' },
      { role: '신디', name: '이소정' },
      { role: '카혼', name: '신을식' }
    ];
  });
  const [isEditingMembers, setIsEditingMembers] = useState(false);
  const [tempMembers, setTempMembers] = useState<{role: string; name: string}[]>([]);

  const [gigs, setGigs] = useState<GigEvent[]>(() => {
    const saved = localStorage.getItem('cheerup_gigs_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // 스마트 병합: INITIAL_GIGS 소스코드의 공식 일정 중 로컬스토리지에 누락된 id를 식별하여 주입합니다.
          const parsedIds = new Set(parsed.map((g: any) => g.id));
          const missingGigs = INITIAL_GIGS.filter(g => !parsedIds.has(g.id));
          if (missingGigs.length > 0) {
            const merged = [...parsed, ...missingGigs];
            // 날짜 최신순 정렬
            merged.sort((a, b) => b.date.localeCompare(a.date));
            localStorage.setItem('cheerup_gigs_v2', JSON.stringify(merged));
            return merged;
          }
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_GIGS;
  });

  const [checklists, setChecklists] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('cheerup_checklists_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_CHECKLISTS;
  });

  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'SONGS' | 'SCHEDULER' | 'CHECKLIST' | 'STATS'>('DASHBOARD');

  // 2. SYNCHRONIZE WITH LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem('cheerup_songs_v2', JSON.stringify(songs));
  }, [songs]);

  useEffect(() => {
    localStorage.setItem('cheerup_gigs_v2', JSON.stringify(gigs));
  }, [gigs]);

  useEffect(() => {
    localStorage.setItem('cheerup_checklists_v2', JSON.stringify(checklists));
  }, [checklists]);

  useEffect(() => {
    localStorage.setItem('cheerup_notices_v1', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('cheerup_members_v1', JSON.stringify(members));
  }, [members]);

  const handleResetSongs = () => {
    // Overwrite with original 34 songs
    setSongs(INITIAL_SONGS);
    // Overwrite gigs and checklists to ensure setlists don't break
    setGigs(INITIAL_GIGS);
    setChecklists(INITIAL_CHECKLISTS);
  };

  // 3. HANDLERS FOR SONGS
  const handleAddSong = (newSong: Omit<Song, 'id' | 'createdAt'>) => {
    const songWithId: Song = {
      ...newSong,
      id: `s-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setSongs(prev => [songWithId, ...prev]);
  };

  const handleDeleteSong = (id: string) => {
    // Delete Song
    setSongs(prev => prev.filter(s => s.id !== id));
    
    // Also remove from any gig setlists using it
    setGigs(prev => prev.map(gig => ({
      ...gig,
      setlistSongIds: gig.setlistSongIds.filter(sid => sid !== id)
    })));
  };

  const handleEditSong = (id: string, updatedSong: Partial<Song>) => {
    setSongs(prev => prev.map(s => s.id === id ? { ...s, ...updatedSong } : s));
  };


  // 4. HANDLERS FOR GIGS
  const handleAddGig = (newGig: Omit<GigEvent, 'id'>) => {
    const gigWithId: GigEvent = {
      ...newGig,
      id: `g-${Date.now()}`
    };
    setGigs(prev => [...prev, gigWithId]);
  };

  const handleDeleteGig = (id: string) => {
    // Delete Gig
    setGigs(prev => prev.filter(g => g.id !== id));
    // Also clean checklists associated with deleted gig
    setChecklists(prev => prev.filter(item => item.gigId !== id));
  };

  const handleUpdateGig = (id: string, updatedGig: Partial<GigEvent>) => {
    setGigs(prev => prev.map(g => g.id === id ? { ...g, ...updatedGig } : g));
  };


  // 5. HANDLERS FOR CHECKLIST
  const handleAddCheckItem = (newItem: Omit<ChecklistItem, 'id'>) => {
    const itemWithId: ChecklistItem = {
      ...newItem,
      id: `c-${Date.now()}`
    };
    setChecklists(prev => [...prev, itemWithId]);
  };

  const handleToggleCheckItem = (id: string) => {
    setChecklists(prev => prev.map(item => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item));
  };

  const handleDeleteCheckItem = (id: string) => {
    setChecklists(prev => prev.filter(item => item.id !== id));
  };

  const handleEditCheckItem = (id: string, updatedFields: Partial<ChecklistItem>) => {
    setChecklists(prev => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
  };


  // 6. DASHBOARD STATISTICS CALCULATOR HELPERS
  const upcomingGig = useMemo(() => {
    const sortedUpcoming = gigs
      .filter(g => g.status === 'UPCOMING' && g.date)
      .sort((a, b) => new Date(a.date.replace(/-/g, '/')).getTime() - new Date(b.date.replace(/-/g, '/')).getTime());
    return sortedUpcoming.length > 0 ? sortedUpcoming[0] : null;
  }, [gigs]);

  const nearestDDay = useMemo(() => {
    if (!upcomingGig || !upcomingGig.date) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const gigDate = new Date(upcomingGig.date.replace(/-/g, '/'));
    gigDate.setHours(0, 0, 0, 0);

    const diffTime = gigDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'D-Day ⚡';
    if (diffDays < 0) return null;
    return `D-${diffDays}`;
  }, [upcomingGig]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-16 flex flex-col justify-between relative">
      
      {/* RESPONSIVE HEADER */}
      <header id="global-header" className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-sm px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 w-full">
          {/* Logo Brand heading */}
          <div className="flex items-center gap-2.5 text-left w-full sm:w-auto">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 text-white font-black text-lg shrink-0">
              🎸
            </div>
            <div>
              <h1 className="font-extrabold text-slate-950 text-base md:text-lg tracking-tight flex items-center gap-1.5">
                쳐럽밴드 매니저
                <span className="text-[11px] font-bold px-1.5 py-0.5 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-md">
                  Cheer Up
                </span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium">여수 직밴 라이브 조율 시스템</p>
            </div>
          </div>

          {/* Top Navigation for Desktop/Tablet Screens */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'DASHBOARD', label: '홈', icon: Sparkles },
              { id: 'SONGS', label: '곡목록', icon: Music },
              { id: 'SCHEDULER', label: '공연일정', icon: Calendar },
              { id: 'CHECKLIST', label: '준비물', icon: ClipboardCheck },
              { id: 'STATS', label: '통계', icon: BarChart3 }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-amber-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* D-Day Counter quick helper (Header integrated) as a compact badge */}
          {upcomingGig && nearestDDay && (
            <div className="flex items-center bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-1.5 gap-1.5 animate-pulse shrink-0 self-end sm:self-auto">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-xs font-black text-amber-700">
                {upcomingGig.title} ({nearestDDay})
              </span>
            </div>
          )}
        </div>
      </header>

      {/* CORE WORKSPACE CONTENT AREA WITH THUMB-REACHABLE NAVIGATION BAR */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6 animate-fadeIn">
            {/* HERO CARD WIDGET - 3 PANEL BAND BANNER */}
            <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-xl border border-slate-200 lg:border-slate-800 text-white">
              
              {/* Left Panel: Red Banner (Meanings) */}
              <div className="lg:col-span-3 bg-[#d91f34] p-5 sm:p-6 flex flex-col justify-between text-left relative min-h-[220px]">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold tracking-widest text-[#ffd700] uppercase block">BAND CONCEPT</span>
                  <p className="text-xs text-white leading-relaxed font-medium">
                    <strong className="text-yellow-200">Cheer up</strong>은 <strong className="text-yellow-105">힘내요, 기운내요</strong> 라는 뜻으로 거리공연(버스킹)을 통하여 저희와 함께하는 시간 만큼은 힘내고 즐거운 시간 가지면서 그 기분 그대로 일상으로 이어졌으면 하는 바램으로 지역 사회의 밝고 아름다운 사회적 분위기를 만들어 가는데 노력하는 어쿠스틱 밴드입니다.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/20 mt-3 text-[10px] text-white/90 leading-tight">
                  ※ <strong className="text-yellow-200 font-bold">Cheer Up</strong>을 빨리 발음하면 <strong className="text-yellow-105 font-extrabold">쳐럽밴드</strong>. 철없는 사람들이 모인 다세대 밴드 🌸
                </div>
              </div>

              {/* Center Panel: Stage & Members Grid */}
              <div className="lg:col-span-6 bg-[#0c0d12] bg-gradient-to-br from-[#240c11] via-[#090b10] to-[#161225] p-5 sm:p-6 flex flex-col justify-between text-left relative overflow-hidden border-y lg:border-y-0 lg:border-x border-slate-800">
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#d91f34]/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative z-10">
                  <span className="text-[10px] font-black tracking-widest text-amber-500 uppercase flex items-center gap-1">
                    <Guitar className="w-3.5 h-3.5 text-amber-500" /> 여수 어쿠스틱 밴드
                  </span>
                  <div className="flex flex-wrap items-baseline gap-2 mt-1">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">쳐럽밴드</h2>
                    <div className="flex items-center gap-1.5 bg-black/30 border border-white/10 px-2.5 py-0.5 rounded-full">
                      <span className="text-[#ffd700] text-xs">★★★★★</span>
                      <span className="text-[9px] text-white font-bold px-1.5 py-0.5 bg-rose-600 rounded">공연보러 오세요</span>
                    </div>
                  </div>

                  {/* Members badges grid matching Image 2 perfectly */}
                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    {isEditingMembers ? (
                      <div className="w-full bg-black/40 border border-white/10 p-3 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-amber-500 font-bold text-[10px]">멤버명 & 파트 편집</span>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => {
                                setMembers(tempMembers);
                                setIsEditingMembers(false);
                              }}
                              className="text-[9px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-0.5 rounded cursor-pointer"
                            >
                              저장
                            </button>
                            <button
                              onClick={() => setIsEditingMembers(false)}
                              className="text-[9px] bg-slate-700 hover:bg-slate-600 text-white px-2 py-0.5 rounded cursor-pointer"
                            >
                              취소
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1.5 max-h-40 overflow-y-auto">
                          {tempMembers.map((m, idx) => (
                            <div key={idx} className="flex gap-1 items-center">
                              <input
                                type="text"
                                value={m.role}
                                onChange={(e) => {
                                  const updated = [...tempMembers];
                                  updated[idx].role = e.target.value;
                                  setTempMembers(updated);
                                }}
                                className="bg-slate-900 border border-slate-700 text-white px-1.5 py-0.5 rounded text-[10px] w-12 font-bold focus:outline-none"
                                placeholder="파트"
                              />
                              <input
                                type="text"
                                value={m.name}
                                onChange={(e) => {
                                  const updated = [...tempMembers];
                                  updated[idx].name = e.target.value;
                                  setTempMembers(updated);
                                }}
                                className="bg-slate-900 border border-slate-700 text-white px-1.5 py-0.5 rounded text-[10px] flex-1 font-bold focus:outline-none"
                                placeholder="이름"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        {members.map((m, idx) => (
                          <div key={idx} className="flex items-center shadow-md shrink-0">
                            <span className="bg-[#d91f34] text-white text-[10px] font-bold px-1.5 py-1 rounded-l border-y border-l border-[#d91f34]">
                              {m.role}
                            </span>
                            <span className="bg-white text-slate-800 font-extrabold text-[10px] px-2 py-1 rounded-r border-y border-r border-slate-200">
                              {m.name}
                            </span>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            setTempMembers(JSON.parse(JSON.stringify(members)));
                            setIsEditingMembers(true);
                          }}
                          className="p-1 px-2 border border-white/20 hover:border-white/30 text-[9px] text-white/70 hover:text-white rounded-lg transition-all flex items-center gap-1 cursor-pointer bg-white/5"
                          title="밴드 멤버 수정"
                        >
                          <Edit className="w-2.5 h-2.5 text-amber-500" />
                          <span>멤버 수정</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Integrated Upcoming Gig Counter */}
                <div className="relative z-10 mt-4 pt-4 border-t border-slate-800/60">
                  {upcomingGig && nearestDDay ? (
                    <div className="bg-white/5 border border-white/10 hover:border-amber-500/30 p-3 rounded-2xl flex items-center justify-between gap-3 transition">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                        <div className="text-left">
                          <span className="text-[9px] text-amber-400 font-bold tracking-widest block">가장 가까운 행사 스케줄</span>
                          <strong className="text-white text-xs sm:text-sm font-extrabold block truncate max-w-[180px] sm:max-w-[260px]">
                            {upcomingGig.title}
                          </strong>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 lg:inline hidden">{upcomingGig.date}</span>
                        <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono tracking-tighter animate-bounce shrink-0">
                          {nearestDDay}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs bg-white/5 p-3 rounded-xl">
                      <span className="text-slate-400">진행 예정인 공연 일정이 없습니다.</span>
                      <button
                        id="hero-create-gig-btn"
                        onClick={() => setActiveTab('SCHEDULER')}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-[10px] font-bold rounded-lg transition"
                      >
                        일정 만들기 &rarr;
                      </button>
                    </div>
                  )}
                </div>

                {/* Lower hashtags info tags */}
                <div className="relative z-10 text-[10px] text-slate-400 flex flex-wrap gap-x-1.5 gap-y-1 mt-3.5 border-t border-slate-800/40 pt-2 font-mono">
                  <span>#CheerUp</span> • <span>#쳐럽밴드</span> • <span>#어쿠스틱밴드</span> • <span>#직장인밴드</span> • <span>#여수버스킹</span> • <span>#축제행사</span> • <span>#음향</span>
                </div>
              </div>

              {/* Right Panel: Black Achievements list */}
              <div className="lg:col-span-3 bg-black p-5 sm:p-6 flex flex-col justify-between text-left min-h-[220px]">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-[11px] font-bold tracking-widest text-[#ffd700] uppercase block">BAND TIMELINE</span>
                    <span className="text-[9px] font-black text-rose-500 animate-pulse uppercase">2015년~ 현재 ing</span>
                  </div>
                  
                  {/* Achievements and milestones list formatted as quick scroll list */}
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 text-[10px] text-slate-300 scrollbar-thin scrollbar-thumb-slate-800 leading-tight">
                    {[
                      '🎬 여수시 관광홍보영상 출연',
                      '🎪 여수 엑스포 대형 버스킹 대표 참여',
                      '🌳 순천 정원박람회 초청 버스킹',
                      '🎺 여수 기업사랑 음악회 합동합주',
                      '🏮 여수 낭만포차 정기 주말 버스킹',
                      '📚 씽씽갓도그 기획 북 콘서트 세션',
                      '🌍 제53주년 지구의 날 공식기념식 공연',
                      '🥪 갓섬 크리에이티브 피크닉 공연',
                      '🐚 완도 장보고수산물축제 무대',
                      '🏵️ 화순고인돌 가을 꽃축제 공식 초청',
                      '🌃 여수 문화유산야행 야간 라이브',
                      '🐢 여수 거북선 축제 메인 메들리',
                      '🎆 여수 불꽃 축제 오프닝 무대',
                      '🥩 여수 B.B KING FEST 록 세트',
                      '🌊 여수 낭만 & 청춘 버스킹 다수 참여',
                      '💼 여수 여성 일자리 박람회 축하 등...'
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-1.5 items-center hover:text-white transition py-0.5 border-b border-slate-900/40">
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-[9px] text-slate-500 text-right mt-2 border-t border-slate-900 pt-1">
                  Yeosu Acoustic Cheer Up Band
                </div>
              </div>

            </div>

            {/* SECONDARY INFO GRID / CARDS BODY */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: 7 columns (Notice board, Upcoming Setlist Preview) */}
              <div className="md:col-span-7 space-y-6">
                {/* 1. Band Official Rules / Notices */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-left">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                      <Megaphone className="w-4 h-4 text-amber-500" />
                      쳐럽밴드 약속 및 회정식
                    </h3>
                    {!isEditingNotices && (
                      <button
                        onClick={() => {
                          setEditingNoticesTemp(JSON.parse(JSON.stringify(notices)));
                          setIsEditingNotices(true);
                        }}
                        className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold hover:text-slate-800 transition-colors inline-flex items-center gap-1"
                        title="약속 편집"
                      >
                        <Edit className="w-3 h-3 text-slate-500" />
                        수정하기
                      </button>
                    )}
                  </div>
                  {isEditingNotices ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center mb-1 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/60">
                        <span className="text-[10px] font-bold text-amber-800">💡 약속 및 회정식 내용을 기입하고 설정을 저장해 주세요.</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('모든 약속을 기본값으로 복원하시겠습니까?')) {
                              setEditingNoticesTemp(JSON.parse(JSON.stringify(DEFAULT_NOTICES)));
                            }
                          }}
                          className="text-[10px] text-amber-600 font-bold hover:underline inline-flex items-center gap-1 active:scale-95 transition-transform"
                        >
                          <RotateCcw className="w-3 h-3" />
                          기본값 복원
                        </button>
                      </div>
                      
                      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                        {editingNoticesTemp.map((notice, index) => (
                          <div key={index} className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl space-y-2 relative group hover:border-amber-200 transition-colors">
                            <div className="flex justify-between items-center gap-2">
                              <div className="flex items-center gap-2 flex-grow">
                                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                                  {index + 1}
                                </span>
                                <input
                                  type="text"
                                  value={notice.title}
                                  onChange={(e) => {
                                    const updated = [...editingNoticesTemp];
                                    updated[index].title = e.target.value;
                                    setEditingNoticesTemp(updated);
                                  }}
                                  className="w-full text-xs font-bold px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-amber-500 focus:outline-none focus:border-amber-500 shadow-sm transition"
                                  placeholder="약속 제목 (예: 합주 지각비)"
                                  required
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = editingNoticesTemp.filter((_, i) => i !== index);
                                  setEditingNoticesTemp(updated);
                                }}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition active:scale-90"
                                title="삭제"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <textarea
                              value={notice.detail}
                              onChange={(e) => {
                                const updated = [...editingNoticesTemp];
                                updated[index].detail = e.target.value;
                                setEditingNoticesTemp(updated);
                              }}
                              rows={2}
                              className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-amber-500 focus:outline-none focus:border-amber-500 font-sans shadow-sm transition leading-relaxed"
                              placeholder="상세 규칙이나 운영 기준을 작성해 주세요."
                              required
                            />
                          </div>
                        ))}
                        
                        {editingNoticesTemp.length === 0 && (
                          <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                            <p className="text-xs text-slate-400 italic">등록된 대원 약속 또는 규칙 지침이 존재하지 않습니다.</p>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingNoticesTemp([
                            ...editingNoticesTemp,
                            { idx: String(editingNoticesTemp.length + 1), title: '', detail: '' }
                          ]);
                        }}
                        className="w-full py-2.5 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 border border-dashed border-slate-300 rounded-2xl text-xs font-bold text-slate-600 flex items-center justify-center gap-1.5 transition-all active:scale-[0.99]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        새로운 약속/지침 추가
                      </button>
                      
                      <div className="flex gap-2 pt-2 border-t border-slate-100 mt-3">
                        <button
                          type="button"
                          onClick={() => {
                            // Ensure beautiful sequentials index labels
                            const finalized = editingNoticesTemp.map((notice, idx) => ({
                              ...notice,
                              idx: String(idx + 1)
                            }));
                            setNotices(finalized);
                            setIsEditingNotices(false);
                          }}
                          className="flex-grow py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors shadow-sm shadow-amber-500/10"
                        >
                          <Save className="w-3.5 h-3.5" />
                          설정 저장
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingNotices(false)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {notices.map(notice => (
                        <div key={notice.idx} className="flex gap-2.5 items-start bg-slate-50/50 border border-slate-100 p-3.5 rounded-2xl hover:shadow-sm hover:border-slate-200 transition-all duration-200">
                          <span className="w-5 h-5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                            {notice.idx}
                          </span>
                          <div className="text-xs">
                            <strong className="text-slate-800 block leading-tight">{notice.title || '(제목 없음)'}</strong>
                            <p className="text-slate-600 mt-1 leading-relaxed whitespace-pre-line">{notice.detail || '(세부 항목이 비어있습니다)'}</p>
                          </div>
                        </div>
                      ))}
                      {notices.length === 0 && (
                        <div className="text-center py-8 border border-dashed border-slate-200 rounded-2xl">
                          <p className="text-xs text-slate-400 italic">등록된 대원 및 회비 운영 약속이 없습니다.</p>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNoticesTemp([]);
                              setIsEditingNotices(true);
                            }}
                            className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:underline"
                          >
                            <Plus className="w-3 h-3" /> 첫 규칙 등록하기
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Upcoming setlist preview */}
                {upcomingGig && (
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-left">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        예정공연 세트리스트 ({upcomingGig.title})
                      </h3>
                      <button
                        id="dash-edit-set-btn"
                        onClick={() => setActiveTab('SCHEDULER')}
                        className="text-xs text-amber-600 font-semibold hover:underline flex items-center gap-0.5"
                      >
                        선곡 편집하기 <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {upcomingGig.setlistSongIds.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-4 text-center">선곡된 곡이 없습니다. '공연 일정 & 선곡' 메뉴에서 편성해 보세요!</p>
                      ) : (
                        upcomingGig.setlistSongIds.map((sid, idx) => {
                          const matchedSong = songs.find(s => s.id === sid);
                          if (!matchedSong) return null;
                          return (
                            <div key={sid} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-slate-400 w-4 text-center">{idx + 1}</span>
                                <div>
                                  <span className="text-xs font-bold text-slate-900">{matchedSong.title}</span>
                                  <span className="text-[10px] text-slate-500 ml-1.5">({matchedSong.artist})</span>
                                </div>
                              </div>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border inline-block ${
                                matchedSong.category === 'MALE'
                                  ? 'bg-sky-50 text-sky-600 border-sky-100'
                                  : matchedSong.category === 'FEMALE'
                                  ? 'bg-rose-50 text-rose-600 border-rose-100'
                                  : matchedSong.category === 'DUET'
                                  ? 'bg-violet-50 text-violet-600 border-violet-100'
                                  : 'bg-amber-50 text-amber-600 border-amber-100'
                              }`}>
                                {matchedSong.category === 'MALE'
                                  ? '남보컬 ♂'
                                  : matchedSong.category === 'FEMALE'
                                  ? '여보컬 ♀'
                                  : matchedSong.category === 'DUET'
                                  ? '혼성/듀엣 ⚤'
                                  : '연주곡 🎸'}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: 5 columns (Quick Rep Ratios, Live gear checker summary) */}
              <div className="md:col-span-5 space-y-6">
                
                {/* 1. Gear checklist completion card */}
                {upcomingGig ? (
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-left space-y-3">
                    <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                      <ClipboardCheck className="w-4 h-4 text-amber-500" />
                      직전 공연 확보 장비 현황
                    </h3>
                    <p className="text-xs text-slate-500">지정된 공연 날짜의 준비물 체크 진행률을 추적합니다.</p>

                    {(() => {
                      const gigItems = checklists.filter(item => item.gigId === upcomingGig.id);
                      const total = gigItems.length;
                      const completed = gigItems.filter(i => i.isCompleted).length;
                      const ratio = total > 0 ? Math.round((completed / total) * 100) : 0;

                      return (
                        <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl space-y-2">
                          <div className="flex justify-between items-center text-xs font-semibold">
                            <span className="text-slate-600">준비물 완료</span>
                            <span className="text-amber-500 font-bold">{completed} / {total}개 ({ratio}%)</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${ratio}%` }} />
                          </div>
                          <div className="flex justify-between items-center text-[10px] pt-1 text-slate-400 font-medium">
                            <span>{upcomingGig.title} 연계</span>
                            <button
                              id="dash-link-check"
                              onClick={() => {
                                setActiveTab('CHECKLIST');
                              }}
                              className="text-amber-600 hover:underline"
                            >
                              체크 완료하러 가기 &rarr;
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-left">
                    <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 mb-2">
                      <ClipboardCheck className="w-4 h-4 text-slate-400" />
                      준비물 카운터 비활성
                    </h3>
                    <p className="text-xs text-slate-400">연결 가능한 예정된 공연이 없어 정렬이 미완료 상태입니다. 신규 일정을 먼저 등록해 주세요.</p>
                  </div>
                )}

                {/* 2. Rep Stat summary card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-left space-y-4">
                  <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    밴드 카탈로그 구조
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#f0f9ff] border border-sky-100 p-3 rounded-xl">
                      <span className="text-[10px] text-sky-600 font-bold block">남성 보컬 곡 ♂</span>
                      <strong className="text-lg text-sky-800 font-extrabold font-mono mt-0.5 inline-block">
                        {songs.filter(s => s.category === 'MALE').length}수록곡
                      </strong>
                    </div>
                    <div className="bg-[#fff1f2] border border-rose-100 p-3 rounded-xl">
                      <span className="text-[10px] text-rose-600 font-bold block">여성 보컬 곡 ♀</span>
                      <strong className="text-lg text-rose-800 font-extrabold font-mono mt-0.5 inline-block">
                        {songs.filter(s => s.category === 'FEMALE').length}수록곡
                      </strong>
                    </div>
                    <div className="bg-[#f5f3ff] border border-violet-100 p-3 rounded-xl">
                      <span className="text-[10px] text-violet-600 font-bold block">혼성 및 듀엣 ⚤</span>
                      <strong className="text-lg text-violet-800 font-extrabold font-mono mt-0.5 inline-block">
                        {songs.filter(s => s.category === 'DUET').length}수록곡
                      </strong>
                    </div>
                    <div className="bg-[#fef3c7] border border-amber-100 p-3 rounded-xl">
                      <span className="text-[10px] text-amber-600 font-bold block">전체 가사 카피 곡</span>
                      <strong className="text-lg text-amber-800 font-extrabold font-mono mt-0.5 inline-block">
                        {songs.length}곡 보유
                      </strong>
                    </div>
                  </div>

                  <button
                    id="dash-view-stats-btn"
                    onClick={() => setActiveTab('STATS')}
                    className="w-full text-center py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition"
                  >
                    전체 시각화 통계 분석 대시보드 열기
                  </button>
                </div>

              </div>
            </div>

            {/* DEVELOPER SOURCE-CODE SYNC TOOL */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-left mt-6 text-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4 mb-4">
                <div>
                  <span className="text-[9px] font-black tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded uppercase font-mono">Developer Sync Support</span>
                  <h3 className="font-extrabold text-white text-sm sm:text-base mt-1 flex items-center gap-2">
                    🛠️ 미리보기(Preview) 일정 데이터 기증 & 복구 도구
                  </h3>
                </div>
                <div className="text-[11px] text-slate-400">
                  브라우저 로컬 저장소와 소스 코드 동기화
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <p className="text-slate-300 leading-relaxed">
                  <strong>안내사항:</strong> 회원님께서 '미리보기(Preview)' 화면에서 직접 클릭하여 등록하신 2025~2026년 공연 일정들은 회원님의 컴퓨터 웹브라우저 로컬 저장소(<code className="bg-slate-800 text-amber-300 px-1 rounded">Local Storage</code>)에 보관됩니다.
                  AI 코딩 에이전트는 프라이버시 및 보안 격리상, 네트워킹을 통해 직접 브라우저 로컬 저장소 속 데이터를 엿볼 수 없습니다.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  따라서, 아래 텍스트 창에 채워진 <strong>현재 로컬 스퀘어 스케줄 JSON 데이터</strong>를 복사한 뒤, 
                  <strong className="text-amber-400"> 대화 창(AI 채팅방)으로 그대로 붙여넣어(Ctrl+V) 전송</strong>해 주시면 즉시 분석하여 <code className="bg-slate-800 text-amber-300 px-1 rounded">src/data.ts</code>의 영구 초기값으로 완벽하게 심어 드리겠습니다! 더불어 수동으로 데이터를 임포트하고 싶으시면 우측 하단에 붙여넣고 동기화를 누르실 수도 있습니다.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
                  {/* Export Section */}
                  <div className="space-y-2 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200">1. 내 브라우저에서 추출된 JSON 코드</span>
                      <button
                        onClick={() => {
                          const str = JSON.stringify(gigs, null, 2);
                          navigator.clipboard.writeText(str);
                          alert('JSON 코드가 성공적으로 클립보드에 복사되었습니다! 이제 대화 창에 전송해 주세요 🚀');
                        }}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold rounded-lg text-[10px] transition cursor-pointer"
                      >
                        클립보드 복사하기 📋
                      </button>
                    </div>
                    <textarea
                      readOnly
                      value={JSON.stringify(gigs, null, 2)}
                      rows={6}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-xl p-3 font-mono text-[9px] focus:outline-none focus:border-amber-500/50"
                    />
                    <p className="text-[10px] text-slate-400 italic">※ 추가하신 스케줄을 포함하여 현재 저장되어 있는 순수 일정 데이터 묶음입니다.</p>
                  </div>

                  {/* Import Section */}
                  <div className="space-y-2 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const target = (e.target as any).json_data.value.trim();
                      if (!target) return;
                      try {
                        const parsed = JSON.parse(target);
                        if (Array.isArray(parsed)) {
                          setGigs(parsed);
                          localStorage.setItem('cheerup_gigs_v2', JSON.stringify(parsed));
                          alert('축하합니다! 입력하신 JSON 일정 데이터가 현재 브라우저 상태에 실시간 주입 및 저장되었습니다. 🌟');
                        } else {
                          alert('JSON 형식이 올바르지 않습니다. 반드시 배열형식( [ ... ] )이어야 합니다.');
                        }
                      } catch (err) {
                        alert('JSON 파싱 에러: ' + (err as any).message);
                      }
                    }} className="space-y-2">
                      <div className="flex justify-between items-center bg-transparent border-0 p-0 shadow-none m-0">
                        <span className="font-bold text-slate-200">2. 코드 수동 강제 주입하기 (임포트)</span>
                        <button
                          type="submit"
                          className="px-2.5 py-1 bg-[#d91f34] hover:bg-red-700 active:scale-95 text-white font-extrabold rounded-lg text-[10px] transition cursor-pointer"
                        >
                          상태 강제 주입하기 ⚡
                        </button>
                      </div>
                      <textarea
                        name="json_data"
                        placeholder="[ { id: '...', title: '...', date: '2025-06-15', ... } ] 등 주입할 JSON 배열 데이터를 붙여넣으세요..."
                        rows={6}
                        className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-xl p-3 font-mono text-[9px] focus:outline-none focus:border-red-500/50"
                      />
                      <p className="text-[10px] text-slate-400 italic">※ 타 장치나 타인에게 전달받은 기획 스케줄 덩어리를 즉시 이 브라우저에 임포트합니다.</p>
                    </form>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: SONG DIRECTORY CATALOG */}
        {activeTab === 'SONGS' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm animate-fadeIn">
            <div className="text-left mb-6">
              <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
                <Music className="w-5 h-5 text-amber-500" />
                보컬별 연주 곡목 카탈로그
              </h2>
              <p className="text-xs text-slate-500 mt-1">쳐럽밴드에서 활동하는 남/여 보컬 별 수록곡과 이펙터 템포 및 개인 메모, 인앱 유튜브 연동 링크를 한눈에 관리합니다.</p>
            </div>
            
            <SongList
              songs={songs}
              onAddSong={handleAddSong}
              onDeleteSong={handleDeleteSong}
              onEditSong={handleEditSong}
              onResetSongs={handleResetSongs}
            />
          </div>
        )}

        {/* TAB 3: SCHEDULER & SETLIST */}
        {activeTab === 'SCHEDULER' && (
          <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 shadow-sm animate-fadeIn">
            <div className="text-left mb-6">
              <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                공연 일정 & 당일 대표 세트리스트
              </h2>
              <p className="text-xs text-slate-500 mt-1">다가올 축제, 연습실 라이브 등의 일정을 만들고, 해당 공연 일지에 참여시킬 노래를 카탈로그에서 매칭하고 순서를 지정합니다.</p>
            </div>

            <Scheduler
              gigs={gigs}
              songs={songs}
              onAddGig={handleAddGig}
              onDeleteGig={handleDeleteGig}
              onUpdateGig={handleUpdateGig}
            />
          </div>
        )}

        {/* TAB 4: GIG CHECKLIST PREPARATION */}
        {activeTab === 'CHECKLIST' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm animate-fadeIn">
            <div className="text-left mb-6">
              <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-amber-500" />
                지각 타파! 공연 당일 악기 및 준비물 체크리스트
              </h2>
              <p className="text-xs text-slate-500 mt-1">공연장으로 이동 시 미싱나기 쉬운 패치스 기타, 오디오 변환잭, 전기릴선, 굿즈 의상 등을 멤버별로 배분해 꼼꼼히 체크하세요.</p>
            </div>

            <ChecklistManager
              checklists={checklists}
              gigs={gigs}
              onAddCheckItem={handleAddCheckItem}
              onToggleCheckItem={handleToggleCheckItem}
              onDeleteCheckItem={handleDeleteCheckItem}
              onEditCheckItem={handleEditCheckItem}
            />
          </div>
        )}

        {/* TAB 5: STATISTICS DASHBOARD */}
        {activeTab === 'STATS' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm animate-fadeIn">
            <div className="text-left mb-6">
              <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-500" />
                선곡 분석 및 월별·년도별 연주 통계 리포트
              </h2>
              <p className="text-xs text-slate-500 mt-1">정기적으로 쳐럽밴드 세트 목록에 올랐던 노래의 통산 가중치와 보컬 분배율, 활발히 연주된 축제 월별 점유율을 도표로 자동 산출합니다.</p>
            </div>

            <StatsDashboard
              gigs={gigs}
              songs={songs}
            />
          </div>
        )}

      </main>

      {/* MOBILE STICKY BOTTOM TAB NAVIGATION */}
      <nav id="workspace-primary-nav" className="md:hidden sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-200/85 shadow-[0_-5px_20px_rgba(0,0,0,0.06)] z-50 rounded-t-2xl flex justify-around items-center py-2 px-1">
        {[
          { id: 'DASHBOARD', label: '홈', icon: Sparkles },
          { id: 'SONGS', label: '곡목록', icon: Music },
          { id: 'SCHEDULER', label: '공연일정', icon: Calendar },
          { id: 'CHECKLIST', label: '준비물', icon: ClipboardCheck },
          { id: 'STATS', label: '통계', icon: BarChart3 }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id.toLowerCase()}`}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex flex-col items-center justify-center flex-1 py-1 transition-all text-center cursor-pointer relative"
            >
              <div className={`p-1 rounded-xl transition-all duration-300 ${
                isActive ? 'bg-amber-500/10 text-amber-600 scale-110' : 'text-slate-400 hover:text-slate-600'
              }`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <span className={`text-[9px] font-bold mt-0.5 transition-all ${
                isActive ? 'text-amber-600 font-extrabold' : 'text-slate-500'
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-1 h-1 bg-amber-500 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

    </div>
  );
}
