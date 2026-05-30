/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChecklistItem, GigEvent } from '../types';
import { ClipboardCheck, Plus, CheckSquare, Square, Trash2, Award, User, Tag, ShieldCheck } from 'lucide-react';

interface ChecklistProps {
  checklists: ChecklistItem[];
  gigs: GigEvent[];
  onAddCheckItem: (item: Omit<ChecklistItem, 'id'>) => void;
  onToggleCheckItem: (id: string) => void;
  onDeleteCheckItem: (id: string) => void;
}

export default function ChecklistManager({ checklists, gigs, onAddCheckItem, onToggleCheckItem, onDeleteCheckItem }: ChecklistProps) {
  const [selectedGigId, setSelectedGigId] = useState<string>(gigs.length > 0 ? gigs[0].id : 'all');
  const [activeCategory, setActiveCategory] = useState<'ALL' | ChecklistItem['category']>('ALL');

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ChecklistItem['category']>('PERSONAL_INSTRUMENT');
  const [newItemAssignee, setNewItemAssignee] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || selectedGigId === 'all') return;

    onAddCheckItem({
      gigId: selectedGigId,
      name: newItemName.trim(),
      category: newItemCategory,
      isCompleted: false,
      assignee: newItemAssignee.trim() || '미지정'
    });

    setNewItemName('');
    setNewItemAssignee('');
  };

  // Filter checklists based on selected Gig & selected Category
  const filteredItems = checklists.filter(item => {
    const matchesGig = selectedGigId === 'all' || item.gigId === selectedGigId;
    const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
    return matchesGig && matchesCategory;
  });

  const getCategoryLabel = (cat: ChecklistItem['category']) => {
    switch (cat) {
      case 'PERSONAL_INSTRUMENT': return '개인 악기/장비';
      case 'COMMON_EQUIPMENT': return '팀 공용 장비';
      case 'STAGE_CLOTHES': return '무대 의상/액세서리';
      case 'OTHER': return '기타 물품';
    }
  };

  const getCategoryTheme = (cat: ChecklistItem['category']) => {
    switch (cat) {
      case 'PERSONAL_INSTRUMENT': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'COMMON_EQUIPMENT': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'STAGE_CLOTHES': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'OTHER': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  // Calculate stats for current selected gig
  const stats = (() => {
    const itemsForStats = checklists.filter(i => selectedGigId === 'all' || i.gigId === selectedGigId);
    const total = itemsForStats.length;
    const completed = itemsForStats.filter(i => i.isCompleted).length;
    const ratio = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, ratio };
  })();

  return (
    <div className="space-y-6 text-left">
      {/* Top Controller */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <ClipboardCheck className="w-5 h-5 text-amber-500" />
              공연 리허설 & 본식 준비물 매니저
            </h3>
            <p className="text-xs text-slate-500">각 세션별 악기, 잭케이블, 마이크 및 공용 파트를 분류하고 멤버별 역할을 매칭합니다.</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">대상 공연 선택:</span>
            <select
              id="checklist-gig-select"
              value={selectedGigId}
              onChange={(e) => setSelectedGigId(e.target.value)}
              className="w-full sm:w-64 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
            >
              <option value="all">전체 일정 공용 체크리스트</option>
              {gigs.map(g => (
                <option key={g.id} value={g.id}>
                  {g.title} ({g.date})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                선택공연 준비 완료 현황
              </span>
              <span className="text-amber-600">{stats.completed} / {stats.total} 품목 ({stats.ratio}%)</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${stats.ratio}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-bold bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
              {stats.total - stats.completed}개 장비 확보 필요
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ADD ITEM FORM (left is 4 col) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm h-fit">
          <h4 className="font-bold text-slate-900 text-sm mb-4 border-b border-slate-100 pb-2">기념품/장비 추가 등록</h4>
          
          {selectedGigId === 'all' ? (
            <p className="text-xs text-rose-500 bg-rose-50 border border-rose-100 rounded-xl p-3 text-center leading-relaxed font-sans">
              ⚠️ 준비물을 개별 등록하려면 위에 있는 대상 지정 필터에서 <strong>특정 공연 일정을 먼저 선택</strong>해 주세요.
            </p>
          ) : (
            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">장비/물품명 <span className="text-rose-500">*</span></label>
                <input
                  id="chk-input-name"
                  type="text"
                  required
                  placeholder="예: 3구 멀티탭 10m"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">장비 분류구 <span className="text-rose-500">*</span></label>
                <select
                  id="chk-input-category"
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:bg-white"
                >
                  <option value="PERSONAL_INSTRUMENT">개인 악기/이펙터 및 세션장비</option>
                  <option value="COMMON_EQUIPMENT">팀 공용 마이크/전기선/튜너</option>
                  <option value="STAGE_CLOTHES">무대용 화려한 밴드 의상</option>
                  <option value="OTHER">식수/리플렛/관객 이벤트용품</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">담당 밴드멤버 (선택)</label>
                <input
                  id="chk-input-assignee"
                  type="text"
                  placeholder="예: 리나, 지노, 민성(전체)"
                  value={newItemAssignee}
                  onChange={(e) => setNewItemAssignee(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:bg-white"
                />
              </div>

              <button
                id="btn-save-check-item"
                type="submit"
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1 transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                준비물 품목 신규 세팅
              </button>
            </form>
          )}
        </div>

        {/* LIST VIEW (right is 8 col) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Category Tabs inside content list */}
          <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-none gap-1">
            {[
              { key: 'ALL', label: '전체 목록' },
              { key: 'PERSONAL_INSTRUMENT', label: '개인 악기 🎸' },
              { key: 'COMMON_EQUIPMENT', label: '공용 장비 🔌' },
              { key: 'STAGE_CLOTHES', label: '의상 👕' },
              { key: 'OTHER', label: '기타 물품 📦' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key as any)}
                className={`px-3 py-2 text-xs font-bold whitespace-nowrap border-b-2 transition cursor-pointer ${
                  activeCategory === tab.key
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl text-slate-400">
                <ClipboardCheck className="w-10 h-10 stroke-[1.2] text-slate-300 mx-auto mb-1" />
                <p className="text-xs font-semibold">조건에 맞는 공연 준비물이 없습니다.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">선택된 카테고리에 새로운 품목을 추가하여 동기화해 보세요.</p>
              </div>
            ) : (
              filteredItems.map(item => {
                const gigName = gigs.find(g => g.id === item.gigId)?.title || '공용 일정';
                return (
                  <div
                    key={item.id}
                    id={`checklist-item-${item.id}`}
                    className={`flex items-center justify-between p-3.5 bg-white border rounded-xl transition-all shadow-sm ${
                      item.isCompleted ? 'border-emerald-100 bg-emerald-50/10' : 'border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        id={`btn-toggle-chk-${item.id}`}
                        onClick={() => onToggleCheckItem(item.id)}
                        className={`transition-colors p-0.5 rounded cursor-pointer ${
                          item.isCompleted ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {item.isCompleted ? (
                          <CheckSquare className="w-5 h-5 fill-emerald-100" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                      
                      <div>
                        <span className={`text-xs font-semibold ${item.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {item.name}
                        </span>
                        
                        {/* Meta lines */}
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 border rounded-md ${getCategoryTheme(item.category)}`}>
                            {getCategoryLabel(item.category)}
                          </span>
                          <span className="text-[9px] bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded-md inline-flex items-center gap-0.5">
                            <User className="w-2.5 h-2.5" />
                            지정: {item.assignee || '미지정'}
                          </span>
                          {selectedGigId === 'all' && (
                            <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-100 px-1.5 py-0.5 rounded-md">
                              공연: {gigName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      id={`btn-delete-chk-${item.id}`}
                      onClick={() => onDeleteCheckItem(item.id)}
                      className="p-1 text-slate-300 hover:text-rose-500 rounded transition-colors"
                      title="준비물 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
