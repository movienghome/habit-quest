/* ---- v8.1 (w81.js): 사용자 요청 3건(11/12 밤) ----
   A″1) 상세 칩 줄 순서·구역(C.chipOrd79)이 다른 할 일에서 흐트러짐 → chSave79(w79)가 그 할 일에 없는 칩 자리를 보존.
   A″2) 용기 라벨이 어떤 할 일엔 있고 어떤 건 없음 → 카드로 이어진 할 일은 카드(a.brave)의 용기를 읽기 칩으로(w71 drawTaskSheet 감쌈 안, data-k79="brave").
   A″3) 캘린더 '보일 것 / 숨길 것' → '거르기' 글자 전부 되돌림(v5h·v5s·w72·w77·w79).
   이 모듈: 카드 용기 칩 누르면 카드 편집. */
addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('#sheetC .tchips [data-k79="brave"][data-aedit]');if(!b)return;
  e.preventDefault();e.stopPropagation();try{openActionEditor(b.dataset.aedit)}catch(x){console.error(x)}},true);
