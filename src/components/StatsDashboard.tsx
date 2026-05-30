/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { GigEvent, Song } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { BarChart2, Calendar, Award, Music, Percent, Layers } from 'lucide-react';

interface StatsDashboardProps {
  gigs: GigEvent[];
  songs: Song[];
}

export default function StatsDashboard({ gigs, songs }: StatsDashboardProps) {
  const years = useMemo(() => {
    const list = gigs.map(g => new Date(g.date).getFullYear());
    const unique = Array.from(new Set(list));
    return unique.sort((a, b) => b - a); // descending
  }, [gigs]);

  const [selectedYear, setSelectedYear] = useState<number | 'ALL'>('ALL');

  const filteredGigs = useMemo(() => {
    if (selectedYear === 'ALL') return gigs;
    return gigs.filter(g => new Date(g.date).getFullYear() === selectedYear);
  }, [gigs, selectedYear]);

  // 1. TOP POPULAR SONGS RANKING
  const topSongsData = useMemo(() => {
    const counts: { [songId: string]: number } = {};
    
    // Aggregate counts across filtered gigs
    filteredGigs.forEach(gig => {
      gig.setlistSongIds.forEach(id => {
        counts[id] = (counts[id] || 0) + 1;
      });
    });

    return songs
      .map(song => ({
        id: song.id,
        title: song.title,
        artist: song.artist,
        category: song.category,
        count: counts[song.id] || 0
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // TOP 10
  }, [filteredGigs, songs]);

  // 2. YEARLY STATS - Number of total song selections per year
  const yearlyStatsData = useMemo(() => {
    const yearCounts: { [year: string]: number } = {};
    const yearGigCounts: { [year: string]: number } = {};

    gigs.forEach(gig => {
      const year = new Date(gig.date).getFullYear().toString();
      yearGigCounts[year] = (yearGigCounts[year] || 0) + 1;
      yearCounts[year] = (yearCounts[year] || 0) + gig.setlistSongIds.length;
    });

    // Sort keys chronological
    return Object.keys(yearCounts)
      .sort()
      .map(year => ({
        year: year + '년',
        '선곡 횟수': yearCounts[year],
        '공연 횟수': yearGigCounts[year] || 0
      }));
  }, [gigs]);

  // 3. MONTHLY STATS for a selected year
  const monthlyStatsData = useMemo(() => {
    // Array with 12 months initialized to 0
    const monthlyCounts = Array(12).fill(0).map((_, i) => ({
      name: `${i + 1}월`,
      '선곡된 곡 수': 0,
      '공연 일정 수': 0
    }));

    gigs.forEach(gig => {
      const gigDate = new Date(gig.date);
      if (selectedYear === 'ALL' || gigDate.getFullYear() === selectedYear) {
        const monthIndex = gigDate.getMonth(); // 0 to 11
        monthlyCounts[monthIndex]['선곡된 곡 수'] += gig.setlistSongIds.length;
        monthlyCounts[monthIndex]['공연 일정 수'] += 1;
      }
    });

    return monthlyCounts;
  }, [gigs, selectedYear]);

  // 4. VOCAL RATIO - played songs by gender/vocal category
  const vocalSelectionRatio = useMemo(() => {
    const ratios = {
      FEMALE: 0,
      MALE: 0,
      DUET: 0,
      INSTRUMENTAL: 0
    };

    filteredGigs.forEach(gig => {
      gig.setlistSongIds.forEach(id => {
        const song = songs.find(s => s.id === id);
        if (song && song.category in ratios) {
          ratios[song.category as keyof typeof ratios] += 1;
        }
      });
    });

    return [
      { name: '여성 보컬 ♀', value: ratios.FEMALE, color: '#f43f5e' }, // rose-500
      { name: '남성 보컬 ♂', value: ratios.MALE, color: '#0284c7' },   // sky-600
      { name: '혼성 및 듀엣 ⚤', value: ratios.DUET, color: '#8b5cf6' }, // violet-500
      { name: '연주/밴드 전용 🎸', value: ratios.INSTRUMENTAL, color: '#f59e0b' } // amber-500
    ].filter(item => item.value > 0);
  }, [filteredGigs, songs]);

  // Highlight Colors for top ranks
  const TOP_COLORS = ['#f59e0b', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'];

  return (
    <div className="space-y-6 text-left">
      {/* Global Year Filter Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 border border-slate-200/60 p-4 rounded-2xl">
        <div className="text-left">
          <h3 className="font-extrabold text-[#0c0d12] text-sm flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-amber-500 font-bold" />
            년도별 선곡 및 공연 통계 조회
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">원하는 활동 년도를 필터링하여 선곡 비중, 장르 비율, 베스트 리퍼토리를 비교 분석할 수 있습니다.</p>
        </div>
        <div className="flex flex-wrap gap-1 bg-slate-200/60 p-1 rounded-xl text-xs shrink-0">
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
          {years.map(year => (
            <button
              key={year}
              type="button"
              onClick={() => setSelectedYear(year)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedYear === year
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {year}년
            </button>
          ))}
        </div>
      </div>

      {/* Overview stats bar cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 rounded-xl">
            <Music className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block">카탈로그 총 곡 수</span>
            <span id="stat-total-songs" className="text-xl font-extrabold text-slate-800">{songs.length}곡</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-sky-50 rounded-xl">
            <Calendar className="w-5 h-5 text-sky-500" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block">
              {selectedYear === 'ALL' ? '등록된 총 공연' : `${selectedYear}년 공연 횟수`}
            </span>
            <span id="stat-total-gigs" className="text-xl font-extrabold text-slate-800">{filteredGigs.length}회</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-xl">
            <Layers className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block">
              {selectedYear === 'ALL' ? '누적 선곡 횟수' : `${selectedYear}년 누적 선곡`}
            </span>
            <span id="stat-total-plays" className="text-xl font-extrabold text-slate-800">
              {filteredGigs.reduce((acc, current) => acc + current.setlistSongIds.length, 0)}회
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 rounded-xl">
            <Percent className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block">보컬 최다 지분</span>
            <span id="stat-vocal-ratio" className="text-xl font-extrabold text-slate-800">
              {vocalSelectionRatio.length > 0
                ? vocalSelectionRatio.slice().sort((a, b) => b.value - a.value)[0]?.name.split(' ')[0]
                : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MONTHLY SELECTION (7 columns) */}
        <div className="lg:col-span-12 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-amber-500" />
                {selectedYear === 'ALL' ? '전체 기간' : `${selectedYear}년도`} 월별 선곡 추이 및 공연 횟수
              </h4>
              <p className="text-xs text-slate-500">각 월별로 선곡된 곡 수와 예정/종료된 공연의 관계를 통계로 봅니다.</p>
            </div>
          </div>

          <div className="h-[250px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyStatsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold', fontSize: '11px', color: '#94a3b8' }}
                />
                <Bar dataKey="선곡된 곡 수" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                  {monthlyStatsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry['선곡된 곡 수'] > 0 ? '#f59e0b' : '#e2e8f0'} />
                  ))}
                </Bar>
                <Bar dataKey="공연 일정 수" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* YEARLY STACK CHART (6 columns) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div>
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-500" />
              연도별 선곡 합계
            </h4>
            <p className="text-xs text-slate-500">년도별 연동된 공연에서 연주한 전체 곡 수 통계</p>
          </div>

          {yearlyStatsData.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-10 text-center">공연을 진행한 년도 데이터가 아직 없습니다.</p>
          ) : (
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyStatsData} layout="vertical" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis dataKey="year" type="category" stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff' }}
                  />
                  <Bar dataKey="선곡 횟수" fill="#fdba74" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="공연 횟수" fill="#38bdf8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* VOCAL SELECTION DISPOSITION (6 columns) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div>
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Percent className="w-4 h-4 text-purple-500" />
              보컬 장르 선곡 분배율
            </h4>
            <p className="text-xs text-slate-500">실시간 공연 세트리스트에 반영된 곡 성비 비율</p>
          </div>

          {vocalSelectionRatio.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-10 text-center">세트리스트를 헌팅한 데이터가 연동되지 않았습니다.</p>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="h-[180px] w-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vocalSelectionRatio}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {vocalSelectionRatio.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 flex-1">
                {vocalSelectionRatio.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="text-slate-800 font-mono">{item.value}회 연주</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* TOP REPERTOIRE (12 columns full list) */}
        <div className="lg:col-span-12 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              쳐럽밴드 베스트 선곡 곡 수 TOP 10 (Most Frequently Performed)
            </h4>
            <p className="text-xs text-slate-500">공연 세트리스트에 가장 자주 포함된 명예의 밴드 커버 곡 목록입니다.</p>
          </div>

          {topSongsData.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-10">아직 합산할 공연 완료 선곡 데이터가 부족합니다.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topSongsData.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-rose-500 text-sm w-6 text-center">
                      #{index + 1}
                    </span>
                    <div>
                      <h5 className="font-bold text-slate-950 text-xs">{item.title}</h5>
                      <span className="text-[10px] text-slate-400">{item.artist}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-amber-500/10 text-amber-700 font-extrabold px-2.5 py-1 rounded-full">
                      {item.count}회 초이스
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
