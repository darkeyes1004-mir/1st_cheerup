/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Song, GigEvent, ChecklistItem } from './types';

export const INITIAL_SONGS: Song[] = [
  // === 남자 보컬 노래 곡목 ===
  {
    id: 's-m1',
    title: '그날들',
    artist: '김광석',
    category: 'MALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=SglM8VwB9P0',
    tempo: 'Slow',
    memo: '풍부한 감성의 어쿠스틱 포크 발라드. 아르페지오 주법 중요.',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 's-m2',
    title: '본능적으로',
    artist: '윤종신',
    category: 'MALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=qTsk5fFAtz8',
    tempo: 'Fast',
    memo: '펑키한 베이스 슬랩 리듬과 랩 파트 강렬한 그루브 유지.',
    createdAt: '2025-01-02T00:00:00Z'
  },
  {
    id: 's-m3',
    title: '고백',
    artist: '뜨거운 감자',
    category: 'MALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=kY3P8QAn78g',
    tempo: 'Medium',
    memo: '경쾌하고 편안한 비트. 인트루 브라스 또는 건반 라인이 메인.',
    createdAt: '2025-01-03T00:00:00Z'
  },
  {
    id: 's-m4',
    title: '장미의 미소',
    artist: '신인수',
    category: 'MALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=sO-oFas74t8',
    tempo: 'Medium',
    memo: '레트로한 90년대 댄스 락. 관객 떼창 유도 최고.',
    createdAt: '2025-01-04T00:00:00Z'
  },
  {
    id: 's-m5',
    title: '꽃송이가',
    artist: '버스커버스커',
    category: 'MALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=MstEclH6sU0',
    tempo: 'Medium',
    memo: '어쿠스틱 하모니카 및 셔플 리듬 드럼이 포인트.',
    createdAt: '2025-01-05T00:00:00Z'
  },
  {
    id: 's-m6',
    title: '마이썬',
    artist: '김건모',
    category: 'MALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=AOn-UjO-D_Q',
    tempo: 'Medium',
    memo: '독특한 레게풍 리듬의 키보드 반주 조율 필요.',
    createdAt: '2025-01-06T00:00:00Z'
  },
  {
    id: 's-m7',
    title: '한잔해',
    artist: '박군',
    category: 'MALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=53SPlZCHpUI',
    tempo: 'Fast',
    memo: '신나는 트로트 락 템포. 뒷부분 속도 빨라지지 않게 템포 조절.',
    createdAt: '2025-01-07T00:00:00Z'
  },
  {
    id: 's-m8',
    title: '시작',
    artist: '가호',
    category: 'MALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=O0StKlq_5g8',
    tempo: 'Fast',
    memo: '달리는 드럼 비트와 시원한 스트레이트 창법 보컬.',
    createdAt: '2025-01-08T00:00:00Z'
  },
  {
    id: 's-m9',
    title: '라라라',
    artist: 'SG워너비',
    category: 'MALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=pKeT8Z0uBsc',
    tempo: 'Medium',
    memo: '컨트리풍의 어쿠스틱 세션. 코러스와 소풍가는 느낌 연출.',
    createdAt: '2025-01-09T00:00:00Z'
  },
  {
    id: 's-m10',
    title: '아파트',
    artist: '윤수일',
    category: 'MALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=XhlyYf3jWhc',
    tempo: 'Fast',
    memo: '한국의 국민 락 합주곡. "으쌰라 으쌰" 추임새 셋업.',
    createdAt: '2025-01-10T00:00:00Z'
  },
  {
    id: 's-m11',
    title: '일어나',
    artist: '김광석',
    category: 'MALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=HlytXv33nQk',
    tempo: 'Medium',
    memo: '포크 록의 대표 주자. 하모니카 홀더 장착 연주 검토.',
    createdAt: '2025-01-11T00:00:00Z'
  },
  {
    id: 's-m12',
    title: '너를 보내고',
    artist: 'YB',
    category: 'MALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=0kbybQyL-gI',
    tempo: 'Medium',
    memo: '웅장하고 서정적인 한국식 정통 슬로우 모던록.',
    createdAt: '2025-01-12T00:00:00Z'
  },
  {
    id: 's-m13',
    title: '나는 나비',
    artist: 'YB',
    category: 'MALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=zRGeZ2m9DGo',
    tempo: 'Fast',
    memo: '쳐럽밴드 베스트 추천곡. 일렉 베이스와 아웃트로 솔로가 일품.',
    createdAt: '2025-01-13T00:00:00Z'
  },
  {
    id: 's-m14',
    title: '나는 반딧불',
    artist: '중식이',
    category: 'MALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=2f3V2oQfPkw',
    tempo: 'Medium',
    memo: '독특하고 재치있는 가사. 신나면서도 약간의 애수를 담은 편곡.',
    createdAt: '2025-01-14T00:00:00Z'
  },

  // === 여자 보컬 노래 곡목 ===
  {
    id: 's-f1',
    title: '살다보면',
    artist: '권진원',
    category: 'FEMALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=_S6qPZl1F5E',
    tempo: 'Medium',
    memo: '어깨가 들썩이는 포크록. 보조 여보컬 코러스 매칭 필요.',
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 's-f2',
    title: '문어의꿈',
    artist: '안예은',
    category: 'FEMALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=Zf0V2XN6GkI',
    tempo: 'Medium',
    memo: '통통 튀는 피아노 리듬과 보존된 안예은 특유의 국악풍 보컬 컬러 리드.',
    createdAt: '2025-01-16T00:00:00Z'
  },
  {
    id: 's-f3',
    title: '산다는건 다 그런게 아니겠니',
    artist: '여행스케치',
    category: 'FEMALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=I7X1m6K2G20',
    tempo: 'Medium',
    memo: '어쿠스틱 기타가 중심이 되는 따뜻한 캠퍼스 포크 감성 합주.',
    createdAt: '2025-01-17T00:00:00Z'
  },
  {
    id: 's-f4',
    title: '장미',
    artist: '사랑과 평화',
    category: 'FEMALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=g6KjToxHAbA',
    tempo: 'Medium',
    memo: '펑키한 리듬 앤 블루스 멜로디라인 구성의 락 버전 합주.',
    createdAt: '2025-01-18T00:00:00Z'
  },
  {
    id: 's-f5',
    title: '좋은밤 좋은꿈',
    artist: '너드커넥션',
    category: 'FEMALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=33aP3m_8f2I',
    tempo: 'Medium',
    memo: '인디 감성이 듬뿍 담긴 감미로운 모던록. 보컬 톤과 잔잔함 유지.',
    createdAt: '2025-01-19T00:00:00Z'
  },
  {
    id: 's-f6',
    title: '삐에로는 우릴 보고 웃지',
    artist: '김완선',
    category: 'FEMALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=0b7p0H2-j8Y',
    tempo: 'Fast',
    memo: '댄서블한 신스베이스 중심 편곡. 베이스 세션의 돋보이는 핑거링 필요.',
    createdAt: '2025-01-20T00:00:00Z'
  },
  {
    id: 's-f7',
    title: '사람이 꽃보다 아름다워',
    artist: '안치환',
    category: 'FEMALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=9_D3xJvI-sI',
    tempo: 'Fast',
    memo: '선이 굵은 멜로디의 가요 락. 일렉기타 리프 위주 편곡.',
    createdAt: '2025-01-21T00:00:00Z'
  },
  {
    id: 's-f8',
    title: '혼자가 아닌 나',
    artist: '서영은',
    category: 'FEMALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=_H7Q_F88eZ8',
    tempo: 'Medium',
    memo: '희망차고 밝은 모던록 테마. 합창 부르며 엔딩 구상.',
    createdAt: '2025-01-22T00:00:00Z'
  },
  {
    id: 's-f9',
    title: '나성에 가면',
    artist: '심은경',
    category: 'FEMALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=gT8oE7XmR-g',
    tempo: 'Medium',
    memo: '영화 수상한 그녀 수록 버전의 신나는 포코 락 비트.',
    createdAt: '2025-01-23T00:00:00Z'
  },
  {
    id: 's-f10',
    title: '제3한강교',
    artist: '혜은이',
    category: 'FEMALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=VlV3X1kI0oU',
    tempo: 'Medium',
    memo: '추억의 가요 7080 비비드 팝 메들리 구성용.',
    createdAt: '2025-01-24T00:00:00Z'
  },
  {
    id: 's-f11',
    title: '내게 다시',
    artist: '더더',
    category: 'FEMALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=SAn8BicS0Fw',
    tempo: 'Medium',
    memo: '90년대 상큼한 혼성 모던록 밴드의 명곡. 프론트 보컬 가창력 유지.',
    createdAt: '2025-01-25T00:00:00Z'
  },
  {
    id: 's-f12',
    title: '산다는 건',
    artist: '홍진영',
    category: 'FEMALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=Rov29Ym2Mfk',
    tempo: 'Medium',
    memo: '애달픈 트로트 락 멜로디. 슬픈 분위기의 일렉기타 솔로 세팅 가능.',
    createdAt: '2025-01-26T00:00:00Z'
  },
  {
    id: 's-f13',
    title: '사랑은 창밖에 빗물 같아요',
    artist: '양수경',
    category: 'FEMALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=-0uYhXpE6pY',
    tempo: 'Medium',
    memo: '레트로 팝 발라드. 아름다운 피아노 아르페지오가 오프닝.',
    createdAt: '2025-01-27T00:00:00Z'
  },
  {
    id: 's-f14',
    title: '소문의 낙원',
    artist: 'AKMU',
    category: 'FEMALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=d_xVzHn3Wlg',
    tempo: 'Medium',
    memo: '팝 펑크 장르의 독보적 비트. 베이스 세션 리듬 위주.',
    createdAt: '2025-01-28T00:00:00Z'
  },
  {
    id: 's-f15',
    title: '너에게 닿기를',
    artist: '10CM',
    category: 'FEMALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=Zep7T_fK7rA',
    tempo: 'Medium',
    memo: '설레는 어쿠스틱 분위기 메이킹. 사랑스러운 느낌 연출.',
    createdAt: '2025-01-29T00:00:00Z'
  },
  {
    id: 's-f16',
    title: '아름다운 구속',
    artist: '김종서',
    category: 'FEMALE',
    youtubeUrl: 'https://www.youtube.com/watch?v=4Cmsd93L13A',
    tempo: 'Fast',
    memo: '대중적인 정통 팝락. 고음 파트 안정화가 필수.',
    createdAt: '2025-01-30T00:00:00Z'
  },

  // === 혼성 / 듀엣 ===
  {
    id: 's-d1',
    title: '너에게 난 나에게 넌',
    artist: '자전거 탄 풍경',
    category: 'DUET',
    youtubeUrl: 'https://www.youtube.com/watch?v=uKOfgT4v70A',
    tempo: 'Medium',
    memo: '따뜻한 통기타 화음 대중 가요. 남여 메인 듀엣 보컬의 화음 연주.',
    createdAt: '2025-01-31T00:00:00Z'
  },
  {
    id: 's-d2',
    title: '애상',
    artist: '쿨',
    category: 'DUET',
    youtubeUrl: 'https://www.youtube.com/watch?v=UeByjS91K5w',
    tempo: 'Fast',
    memo: '신나는 댄스 비트 락 밴드 가공 버전. 아웃트로가 경쾌함.',
    createdAt: '2025-02-01T00:00:00Z'
  },
  {
    id: 's-d3',
    title: '김밥',
    artist: '더 자두',
    category: 'DUET',
    youtubeUrl: 'https://www.youtube.com/watch?v=bOonXbyfC90',
    tempo: 'Medium',
    memo: '재미난 보컬 호흡 및 재기발랄 기타 스윙 리듬.',
    createdAt: '2025-02-02T00:00:00Z'
  },
  {
    id: 's-d4',
    title: '오 해피',
    artist: '컨츄리꼬꼬',
    category: 'DUET',
    youtubeUrl: 'https://www.youtube.com/watch?v=xID3t009fVs',
    tempo: 'Fast',
    memo: '축제 분위기 오프닝이나 엔딩으로 신나게 활용 가능한 소프라노 전성기 노래.',
    createdAt: '2025-02-03T00:00:00Z'
  }
];

export const INITIAL_GIGS: GigEvent[] = [
  // === 2026년 실제 공연 일정 ===
  {
    id: 'g-2026-01',
    title: '여성일자리 박람회',
    date: '2026-05-20',
    time: '13:30',
    location: '흥국체육관',
    description: '여성일자리 박람회 축하공연',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-f4', 's-m6', 's-m3'] // 5곡 선택됨 (나는 반딧불, 나성에 가면, 장미, 마이썬, 고백)
  },
  {
    id: 'g-2026-02',
    title: '낭만버스킹',
    date: '2026-05-15',
    time: '19:30',
    location: '해양공원 밤빛누리',
    description: '여수밤바다 낭만버스킹',
    status: 'COMPLETED',
    setlistSongIds: [
      's-m14', 's-f9', 's-f4', 's-m6', 's-m9', 's-m3', 's-d4', 's-m7', 's-f10', 's-m4',
      's-m1', 's-f1', 's-d2', 's-f8', 's-m13', 's-f16', 's-m2', 's-f5'
    ] // 18곡 선택됨
  },
  {
    id: 'g-2026-03',
    title: '여수거북선축제',
    date: '2026-05-03',
    time: '14:30',
    location: '이순신광장 주무대',
    description: '여수거북선축제',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-f4', 's-m6', 's-m9'] // 5곡 선택됨
  },
  {
    id: 'g-2026-04',
    title: '국동 프리마켓',
    date: '2026-04-18',
    time: '16:30',
    location: '국동 자치센터 근처',
    description: '국동지구도시재생 문화사업단 프리마켓',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-f4', 's-m6', 's-m9', 's-m3'] // 6곡 선택됨
  },

  // === 2025년 실제 공연 일정 ===
  {
    id: 'g-2025-01',
    title: '대안시민회 송년회',
    date: '2025-11-29',
    time: '17:30',
    location: '디오션 콘도밸라스타홀 3층',
    description: '여수 대안시민회 송년의 밤',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-f4', 's-m6', 's-d4'] // 5곡 선택됨
  },
  {
    id: 'g-2025-02',
    title: '월호동 한마음 축제',
    date: '2025-11-14',
    time: '16:40',
    location: '월호동주민자치센터 다목적실',
    description: '월호동 주민총회 및 월호동 한마음 축제',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-f4', 's-m6', 's-m9', 's-d4'] // 6곡 선택됨
  },
  {
    id: 'g-2025-03',
    title: '2025 시간을 달리는 버스커',
    date: '2025-10-25',
    time: '20:35',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-f4', 's-m6', 's-m9', 's-m3'] // 6곡 선택됨
  },
  {
    id: 'g-2025-04',
    title: '한려동 한마음 축제',
    date: '2025-10-24',
    time: '16:30',
    location: '여수시 한려동 공화남1길 대진마트 앞 사거리',
    description: '한려동 주민총회 및 한려동 한마음 축제',
    status: 'COMPLETED',
    setlistSongIds: ['s-m13', 's-m14', 's-f9', 's-f4', 's-m6', 's-m7'] // 6곡 선택됨
  },
  {
    id: 'g-2025-05',
    title: '2025 시간을 달리는 버스커',
    date: '2025-10-24',
    time: '20:30',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-f4', 's-m6', 's-m9', 's-m3', 's-d4'] // 7곡 선택됨
  },
  {
    id: 'g-2025-06',
    title: '2025 시간을 달리는 버스커',
    date: '2025-10-18',
    time: '20:59',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-m7', 's-f10', 's-m4'] // 5곡 선택됨
  },
  {
    id: 'g-2025-07',
    title: '2025 시간을 달리는 버스커',
    date: '2025-10-11',
    time: '20:30',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-f4', 's-d4', 's-m7', 's-f10'] // 6곡 선택됨
  },
  {
    id: 'g-2025-08',
    title: '2025 시간을 달리는 버스커',
    date: '2025-10-10',
    time: '20:30',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-f4', 's-m6', 's-m9', 's-m3', 's-m4'] // 7곡 선택됨
  },
  {
    id: 'g-2025-09',
    title: '2025 시간을 달리는 버스커',
    date: '2025-09-27',
    time: '20:30',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-f4', 's-m6', 's-d4', 's-f10'] // 6곡 선택됨
  },
  {
    id: 'g-2025-10',
    title: '2025 시간을 달리는 버스커',
    date: '2025-09-26',
    time: '20:40',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-m7', 's-f10', 's-m4'] // 5곡 선택됨
  },
  {
    id: 'g-2025-11',
    title: '외국인 및 다문화가족 한마당',
    date: '2025-09-14',
    time: '11:30',
    location: '여수엑스포 컨벤션센터',
    description: '외국인 및 다문화가족 한마당',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-f4', 's-m6', 's-m9', 's-m3'] // 6곡 선택됨
  },
  {
    id: 'g-2025-12',
    title: '2025 시간을 달리는 버스커',
    date: '2025-09-13',
    time: '20:40',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-f4', 's-d4', 's-m7', 's-m4'] // 6곡 선택됨
  },
  {
    id: 'g-2025-13',
    title: '2025 시간을 달리는 버스커',
    date: '2025-09-12',
    time: '20:40',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-f4', 's-m6', 's-m9', 's-d4'] // 6곡 선택됨
  },
  {
    id: 'g-2025-14',
    title: '2025 시간을 달리는 버스커',
    date: '2025-09-06',
    time: '20:45',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-f4', 's-m6', 's-m3', 's-f10'] // 6곡 선택됨
  },
  {
    id: 'g-2025-15',
    title: '2025 시간을 달리는 버스커',
    date: '2025-08-30',
    time: '20:42',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-f4', 's-m7', 's-f10', 's-m4'] // 6곡 선택됨
  },
  {
    id: 'g-2025-16',
    title: '2025 시간을 달리는 버스커',
    date: '2025-08-29',
    time: '20:40',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-f4', 's-m6', 's-m9', 's-m3', 's-m4'] // 7곡 선택됨
  },
  {
    id: 'g-2025-17',
    title: '2025 시간을 달리는 버스커',
    date: '2025-08-23',
    time: '20:40',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-f4', 's-d4', 's-m7', 's-f10'] // 6곡 선택됨
  },
  {
    id: 'g-2025-18',
    title: '2025 시간을 달리는 버스커',
    date: '2025-08-22',
    time: '20:40',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-f4', 's-m6', 's-m9', 's-m3'] // 6곡 선택됨
  },
  {
    id: 'g-2025-19',
    title: '2025 시간을 달리는 버스커',
    date: '2025-07-19',
    time: '20:35',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-f4', 's-m6', 's-d4', 's-m4'] // 6곡 선택됨
  },
  {
    id: 'g-2025-20',
    title: '2025 시간을 달리는 버스커',
    date: '2025-07-18',
    time: '20:40',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-f4', 's-m7', 's-f10', 's-m4'] // 6곡 선택됨
  },
  {
    id: 'g-2025-21',
    title: '2025 시간을 달리는 버스커',
    date: '2025-07-11',
    time: '20:40',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f4', 's-m6', 's-m9', 's-m3', 's-f10'] // 6곡 선택됨
  },
  {
    id: 'g-2025-22',
    title: '2025 시간을 달리는 버스커',
    date: '2025-07-05',
    time: '20:40',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-m9', 's-m3', 's-d4', 's-m7', 's-m4'] // 6곡 선택됨
  },
  {
    id: 'g-2025-23',
    title: '2025 시간을 달리는 버스커',
    date: '2025-07-04',
    time: '20:30',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-m6', 's-m9', 's-d4', 's-m4'] // 6곡 선택됨
  },
  {
    id: 'g-2025-24',
    title: '청춘 버스킹',
    date: '2025-06-28',
    time: '16:40',
    location: '여수 엑스포역 앞',
    description: '여수 옥수수 축제',
    status: 'COMPLETED',
    setlistSongIds: [
      's-m14', 's-f9', 's-f4', 's-m6', 's-m9',
      's-m3', 's-d4', 's-m7', 's-f10', 's-m4'
    ] // 10곡 선택됨
  },
  {
    id: 'g-2025-25',
    title: '2025 시간을 달리는 버스커',
    date: '2025-06-27',
    time: '20:30',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: [
      's-m14', 's-f9', 's-f4', 's-m6', 's-m9',
      's-m3', 's-d4', 's-m7', 's-f10'
    ] // 9곡 선택됨
  },
  {
    id: 'g-2025-26',
    title: '2025 시간을 달리는 버스커',
    date: '2025-06-20',
    time: '20:30',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-m6', 's-d4', 's-f10', 's-m4'] // 6곡 선택됨
  },
  {
    id: 'g-2025-27',
    title: '2025 시간을 달리는 버스커',
    date: '2025-06-13',
    time: '20:30',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f4', 's-m9', 's-m7', 's-f10', 's-m4'] // 6곡 선택됨
  },
  {
    id: 'g-2025-28',
    title: '2025 시간을 달리는 버스커',
    date: '2025-06-06',
    time: '20:30',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-f4', 's-m3', 's-d4', 's-m7'] // 6곡 선택됨
  },
  {
    id: 'g-2025-29',
    title: '2025 시간을 달리는 버스커',
    date: '2025-05-31',
    time: '20:30',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f4', 's-m6', 's-m9', 's-m3', 's-d4'] // 6곡 선택됨
  },
  {
    id: 'g-2025-30',
    title: '2025 시간을 달리는 버스커',
    date: '2025-05-30',
    time: '20:30',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-m6', 's-m7', 's-f10', 's-m4'] // 6곡 선택됨
  },
  {
    id: 'g-2025-31',
    title: '2025 시간을 달리는 버스커',
    date: '2025-05-10',
    time: '20:30',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-m14', 's-f9', 's-f4', 's-m9', 's-m3', 's-d4'] // 6곡 선택됨
  },
  {
    id: 'g-2025-32',
    title: '2025 시간을 달리는 버스커',
    date: '2025-05-09',
    time: '20:30',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-f9', 's-f4', 's-m6', 's-m9', 's-d4'] // 5곡 선택됨
  },
  {
    id: 'g-2025-33',
    title: '2025 시간을 달리는 버스커',
    date: '2025-05-02',
    time: '20:30',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-f9', 's-f4', 's-m6', 's-m9', 's-m3', 's-d4'] // 6곡 선택됨
  },
  {
    id: 'g-2025-34',
    title: '2025 시간을 달리는 버스커',
    date: '2025-04-26',
    time: '20:30',
    location: '여수 낭만버스',
    description: '관객과 함께하는 무대',
    status: 'COMPLETED',
    setlistSongIds: ['s-f9', 's-f4', 's-m6', 's-m9', 's-m3', 's-d4', 's-m7'] // 7곡 선택됨
  },

  // === 예정된 미래의 대규모 일정 ===

];

export const INITIAL_CHECKLISTS: ChecklistItem[] = [
  // g-2026-upcoming 일정을 위한 준비물
  { id: 'c-1', gigId: 'g-2026-upcoming', category: 'PERSONAL_INSTRUMENT', name: '일렉트릭 기타 & 튜너 & 케이블 2개', isCompleted: true, assignee: '지노' },
  { id: 'c-2', gigId: 'g-2026-upcoming', category: 'PERSONAL_INSTRUMENT', name: '가죽 일렉 베이스 (여분 스트링 포함)', isCompleted: false, assignee: '찬우' },
  { id: 'c-3', gigId: 'g-2026-upcoming', category: 'PERSONAL_INSTRUMENT', name: '개인 드럼 스틱 (5A 스틱 2세트)', isCompleted: true, assignee: '현우' },
  { id: 'c-4', gigId: 'g-2026-upcoming', category: 'PERSONAL_INSTRUMENT', name: '신디사이저 메인 페달, 서스테인 페달', isCompleted: false, assignee: '리나' },
  { id: 'c-5', gigId: 'g-2026-upcoming', category: 'COMMON_EQUIPMENT', name: '공연 모니터링 무선 인이어 이어폰 팩', isCompleted: false, assignee: '민성' },
  { id: 'c-6', gigId: 'g-2026-upcoming', category: 'COMMON_EQUIPMENT', name: '보컬용 마이크 슈어 SM58 2개 및 소독제', isCompleted: false, assignee: '태진' },
  { id: 'c-7', gigId: 'g-2026-upcoming', category: 'STAGE_CLOTHES', name: '레트로 락 스타일 로고 가죽 드레스코드 의상', isCompleted: false, assignee: '전원' },
  { id: 'c-8', gigId: 'g-2026-upcoming', category: 'OTHER', name: '게스트 대기실용 생수 1박스, 에너지바', isCompleted: true, assignee: '영지' },
  { id: 'c-9', gigId: 'g-2026-upcoming', category: 'OTHER', name: '현장 배포용 무료 리플렛 30부', isCompleted: false, assignee: '영지' },

  // g-2026-indie 일정을 위한 준비물
  { id: 'c-10', gigId: 'g-2026-indie', category: 'PERSONAL_INSTRUMENT', name: '어쿠스틱 기타 리버브 이펙터 페달', isCompleted: false, assignee: '지노' },
  { id: 'c-11', gigId: 'g-2026-indie', category: 'COMMON_EQUIPMENT', name: '멀티탭 10m 고출력 1개', isCompleted: false, assignee: '민성' },
  { id: 'c-12', gigId: 'g-2026-indie', category: 'OTHER', name: '야외 공연용 관객 간식 및 홍보 피켓', isCompleted: false, assignee: '수진' }
];
