/* ================= v7.9: B 둘째 조각 + J10 =================
   맨 끝 모듈(w78 뒤, route();boot(); 앞).
   J10) 캘린더 거르기 이름 → '보일 것 / 숨길 것'(창 제목·단추 설명에 지금 모드를 글자로).
   B18) 타임테이블 날짜 칸을 한 줄로.
   B19) 상세에서 연 '묶인 할 일'·'체크리스트'를 다시 접기. */

/* ---- J10 ---- */
function fName79(){const f=flt77(),n=[];
  f.kinds.forEach(k=>{const e=(typeof KIND77!=='undefined'?KIND77:[]).find(x=>x[0]===k);n.push(e?e[1]:k)});
  f.lists.forEach(i=>n.push(listName(i)));
  f.areas.forEach(i=>{const a=C.areas.find(x=>x.id===i);n.push(a?a.name:i)});
  f.tags.forEach(t=>n.push('#'+t));return n}
function fMode79(){if(!fOn77())return '';const n=fName79(),s=n.length>3?n.slice(0,3).join('·')+' 외 '+(n.length-3):n.join('·');return flt77().inv?s+' 숨기는 중':s+'만 보는 중'}
calFilterSheet=(function(prev){return function(){const r=prev.apply(this,arguments);try{const n=$('f77n'),m=fMode79();if(n&&m)n.innerHTML='<b>'+esc(m)+'</b> · '+n.innerHTML}catch(e){console.error(e)}return r}})(calFilterSheet);
renderCal=(function(prev){return function(){const r=prev.apply(this,arguments);try{const b=$('calFilterBtn');if(b){const m=fMode79(),t=m?'보일 것 / 숨길 것 — '+m:'보일 것 / 숨길 것 (캘린더에 보일 일 고르기)';b.title=t;b.setAttribute('aria-label',t)}}catch(e){console.error(e)}return r}})(renderCal);

/* ---- B19: 열린 묶인 할 일·체크리스트 접기 ---- */
function ts79(){const sc=$('sheetC'),t=TASKS[(sheetCtx||{}).task];if(!sc||!t||!$('tsTitle'))return;const op=o78(t);
  const kb=sc.querySelector('.kids56.box71');
  if(kb&&!kb.classList.contains('hid78')&&!kb.querySelector('.kt78,.cl79')){const hd=kb.firstElementChild;if(hd)hd.insertAdjacentHTML('beforeend',' <button type="button" class="cl79" data-c79="kids" title="접기 (＋ 칩으로 돌아가요)">▴ 접기</button>')}
  const cb=sc.querySelector('.box71.ck71');
  if(cb&&!cb.classList.contains('hid78')&&!cb.querySelector('.kt78,.cl79')){const hd=cb.firstElementChild,subs=t.subs||[];
    if(hd&&!subs.length)hd.insertAdjacentHTML('beforeend',' <button type="button" class="cl79" data-c79="ck" title="접기 (＋ 칩으로 돌아가요)">▴ 접기</button>');
    else if(hd){const fold=!!op.ckf,dn=subs.filter(s=>s.d).length;cb.classList.toggle('fold78',fold);hd.classList.add('kh78');
      hd.innerHTML='<button type="button" class="kt78" data-c79="ckt" aria-expanded="'+!fold+'">☑ 체크리스트 <b>'+dn+'/'+subs.length+'</b> <span class="tiny muted">'+(fold?'▸ 펼치기':'▾ 접기')+'</span></button>'}}}
drawTaskSheet=(function(prev){return function(){const r=prev.apply(this,arguments);try{ts79()}catch(e){console.error(e)}return r}})(drawTaskSheet);
addEventListener('click',e=>{const T=e.target;if(T&&T.closest&&T.closest('[data-a78]'))setTimeout(()=>{try{ts79()}catch(x){console.error(x)}},0);   // ＋ 칩으로 연 직후엔 접기 단추를 달아 줌(w78 핸들러 뒤)
  const b=T&&T.closest&&T.closest('[data-c79]');if(!b)return;e.preventDefault();e.stopPropagation();const t=TASKS[(sheetCtx||{}).task];if(!t)return;
  const op=o78(t),k=b.dataset.c79;if(k==='kids')op.kids=0;else if(k==='ck')op.ck=0;else if(k==='ckt')op.ckf=op.ckf?0:1;
  const sc=$('sheetC'),y=sc.scrollTop;try{tsRead()}catch(x){}drawTaskSheet();sc.scrollTop=y},true);
