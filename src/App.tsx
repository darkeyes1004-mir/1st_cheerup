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
  Guitar
} from 'lucide-react';

export default function App() {
  // 1. STATE INITIALIZATION (Local Storage hydrated or seeded with default initial data)
  const [songs, setSongs] = useState<Song[]>(() => {
    const saved = localStorage.getItem('cheerup_songs_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_SONGS;
  });

  const [gigs, setGigs] = useState<GigEvent[]>(() => {
    const saved = localStorage.getItem('cheerup_gigs_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
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


  // 6. DASHBOARD STATISTICS CALCULATOR HELPERS
  const upcomingGig = useMemo(() => {
    const sortedUpcoming = gigs
      .filter(g => g.status === 'UPCOMING')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sortedUpcoming.length > 0 ? sortedUpcoming[0] : null;
  }, [gigs]);

  const nearestDDay = useMemo(() => {
    if (!upcomingGig) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const gigDate = new Date(upcomingGig.date);
    gigDate.setHours(0, 0, 0, 0);

    const diffTime = gigDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'D-Day ⚡';
    if (diffDays < 0) return null;
    return `D-${diffDays}`;
  }, [upcomingGig]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-16">
      {/* GLOBAL HEADER BAR */}
      <header id="global-header" className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo Brand heading */}
          <div className="flex items-center gap-2.5 text-left">
            <svg viewBox="0 0 100 100" className="w-11 h-11 shrink-0 drop-shadow-sm" aria-hidden="true">
              <defs>
                <path id="logo-text-path" d="M 18,74 A 40,40 0 0,0 82,74" />
              </defs>

              {/* Green outer ring matching user's original image */}
              <circle cx="50" cy="50" r="48" fill="#3bb143" />
              <circle cx="50" cy="50" r="43.5" fill="none" stroke="white" strokeWidth="1.2" />
              <circle cx="50" cy="50" r="35" fill="white" />

              {/* Hand icon pointing up in center top, tilted counter-clockwise */}
              <g transform="translate(50, 22.5) rotate(-16) scale(0.95)">
                {/* Complete hand outline with white fill and black outline */}
                <path 
                  d="M -3.2,-3 
                     C -3.2,-14.5 0.5,-16.5 2,-14.5 
                     C 3,-12.5 3,-3 3,-3 
                     C 3,-3 6.2,-4 7.5,-2.2 
                     C 8.8,-0.5 8.2,1.5 7.8,2.5
                     C 7.2,3.5 9.5,3.8 9.5,5.8
                     C 9.5,7.8 8,8.8 6.5,9
                     C 5,9.2 -2.5,9.2 -4.5,7.8
                     C -6.5,6.3 -8.2,2.8 -5.5,0.3
                     C -4, -0.6 -3.2,-3 -3.2,-3 Z" 
                  fill="white" 
                  stroke="black" 
                  strokeWidth="2.4" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                {/* Folded lines for finger separation */}
                <path d="M 3,-3 Q 6,-3 7,-1.5" fill="none" stroke="black" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M 2.5,1 Q 5.5,1 6.5,2.5" fill="none" stroke="black" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M 1.8,5 Q 4.5,5 5.5,6.5" fill="none" stroke="black" strokeWidth="1.6" strokeLinecap="round" />
              </g>

              {/* Playful 'CHEER' title */}
              <text 
                x="50" 
                y="48" 
                textAnchor="middle" 
                fontFamily="'Arial Black', 'Impact', 'Arial Rounded MT Bold', sans-serif" 
                fontWeight="900" 
                fontSize="18.5" 
                letterSpacing="-0.03em" 
                fill="black"
              >
                CHEER
              </text>

              {/* Playful lowercase 'up' label */}
              <text 
                x="57" 
                y="71.5" 
                fontFamily="'Arial Black', 'Impact', 'Arial Rounded MT Bold', sans-serif" 
                fontWeight="900" 
                fontSize="20.5" 
                letterSpacing="-0.02em" 
                fill="black"
              >
                up
              </text>

              {/* Dual eighth notes separately positioned on the left side of 'up' to match the image */}
              <g transform="translate(30, 56) rotate(14) scale(0.9)" fill="black">
                {/* Upper Right Note */}
                <g transform="translate(9, -7)">
                  <ellipse cx="4.5" cy="11.5" rx="3.5" ry="2.2" transform="rotate(-15 4.5 11.5)" />
                  <rect x="6.8" y="2.5" width="1.4" height="9.2" />
                  <path d="M8.2,2.5 Q11.2,3.2 10.2,7" stroke="black" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </g>
                {/* Lower Left Note */}
                <g transform="translate(0, 3)">
                  <ellipse cx="4.5" cy="11.5" rx="3.5" ry="2.2" transform="rotate(-15 4.5 11.5)" />
                  <rect x="6.8" y="2.5" width="1.4" height="9.2" />
                  <path d="M8.2,2.5 Q11.2,3.2 10.2,7" stroke="black" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </g>
              </g>

              {/* Concentric curved bottom band title '쳐럽 밴드' */}
              <text fontSize="7.2" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fill="white" letterSpacing="0.1em">
                <textPath href="#logo-text-path" startOffset="50%" textAnchor="middle">
                  쳐럽 밴드
                </textPath>
              </text>
            </svg>
            <div>
              <h1 className="font-extrabold text-slate-950 text-base md:text-lg tracking-tight flex items-center gap-1.5">
                쳐럽밴드 매니저
                <span className="text-xs font-semibold px-2 py-0.5 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-md">
                  Cheer Up Band
                </span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium">공연 곡·일정·수준 높은 락밴드 세트리스트 조율 시스템</p>
            </div>
          </div>

          {/* D-Day Counter quick helper (Header integrated) */}
          {upcomingGig && nearestDDay && (
            <div className="hidden sm:flex items-center bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-1.5 gap-2 text-left animate-pulse">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <div className="text-xs">
                <span className="font-semibold text-slate-600">가장 가까운 행사:</span>{' '}
                <strong className="text-slate-900">{upcomingGig.title}</strong>{' '}
                <span className="font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded ml-1">
                  {nearestDDay}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* PRIMARY NAVIGATION TABS */}
      <nav id="workspace-primary-nav" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex space-x-1.5 bg-slate-200/60 p-1 rounded-2xl overflow-x-auto scrollbar-none shadow-inner">
          {[
            { id: 'DASHBOARD', label: '대시보드', icon: Sparkles },
            { id: 'SONGS', label: '보컬별 곡 목록', icon: Music },
            { id: 'SCHEDULER', label: '공연 일정 & 선곡', icon: Calendar },
            { id: 'CHECKLIST', label: '공연 준비물', icon: ClipboardCheck },
            { id: 'STATS', label: '선곡 통계', icon: BarChart3 }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id.toLowerCase()}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-amber-600 shadow-sm'
                    : 'text-slate-600 hover:bg-white/40 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* CORE WORKSPACE CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
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
                  <div className="flex flex-wrap gap-2 mt-4">
                    {[
                      { role: '보컬', name: '이승현' },
                      { role: '보컬', name: '김하라' },
                      { role: '기타', name: '김덕홍' },
                      { role: '신디', name: '이소정' },
                      { role: '카혼', name: '신을식' }
                    ].map((m, idx) => (
                      <div key={idx} className="flex items-center shadow-md shrink-0">
                        <span className="bg-[#d91f34] text-white text-[10px] font-bold px-1.5 py-1 rounded-l border-y border-l border-[#d91f34]">
                          {m.role}
                        </span>
                        <span className="bg-white text-slate-800 font-extrabold text-[10px] px-2 py-1 rounded-r border-y border-r border-slate-200">
                          {m.name}
                        </span>
                      </div>
                    ))}
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
                  <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 mb-3">
                    <Megaphone className="w-4 h-4 text-amber-500" />
                    쳐럽밴드 약속 및 회정식
                  </h3>
                  <div className="space-y-2.5">
                    {[
                      { idx: '1', title: '개인 연습의 중요성', detail: '합주 칠 전까지 배포용 코드를 기반으로 최소 3회 가량 가사 및 기타 악보 완벽 숙지.' },
                      { idx: '2', title: '합주 지각 회비', detail: '합주 당일 약속 실각 시간 10분 초과당 누적 1,000원 벌금! (지각비는 반기 밴드 회식비로 직행)' },
                      { idx: '3', title: '장비 및 소모품 챙기기', detail: '모든 보컬용 무선 인이어 인서트, 일렉 기타 케이블 젠더 및 페달 파워 서플라이는 직전 체크리스트 필수 검사.' },
                      { idx: '4', title: '기본 에티켓 준수', detail: '피드백 시 예의바르게 웃으며 주고받기! 우리는 즐기기 위해 뭉친 Cheer-Up 밴드니까요 🌸' }
                    ].map(notice => (
                      <div key={notice.idx} className="flex gap-2.5 items-start bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        <span className="w-5 h-5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                          {notice.idx}
                        </span>
                        <div className="text-xs">
                          <strong className="text-slate-800 block">{notice.title}</strong>
                          <p className="text-slate-600 mt-0.5 leading-relaxed">{notice.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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
    </div>
  );
}
