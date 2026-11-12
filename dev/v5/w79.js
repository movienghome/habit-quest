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

/* ---- B17·B11: 상세 칩 줄 = 쓴 것만 + '＋ 더' · 순서·고정은 펼친 채 끌어서 ----
   C.chipOrd79 = 칩 키 순서(+ '|' = 여기부터는 값이 있을 때만 보임). 끌어서 '|' 앞으로 옮기면 고정, 뒤로 옮기면 숨김 구역.
   기본: 날짜·목록·중요도·영역 고정(영역 칩은 이번엔 그대로) / 카드·태그·크기·용기·타이머·문구·관리는 값 있을 때만. */
var CH79D=['when','list','prio','area','|','card','tags','size','brave','timer','rf','care'];
function ch79ord(){const o=Array.isArray(C.chipOrd79)?C.chipOrd79:[],r=[];o.forEach(k=>{if(typeof k==='string'&&(CH79D.includes(k))&&!r.includes(k))r.push(k)});CH79D.forEach(k=>{if(!r.includes(k))r.push(k)});return r}
function ch79key(e){return e.dataset.k79||e.dataset.x56panel||(e.dataset.t71==='brave'?'brave':(e.dataset.c77t!=null?'care':''))}
function ch79valued(e,k){return k==='care'?e.getAttribute('aria-pressed')==='true':!e.classList.contains('off')}
function chips79(sc,t){const ch=sc.querySelector('.tchips');if(!ch||ch.classList.contains('c79'))return;ch.classList.add('c79');
  const items=[...ch.children].filter(e=>ch79key(e));items.forEach(e=>{e.dataset.k79=ch79key(e)});
  const by={};items.forEach(e=>{by[e.dataset.k79]=e});
  const div=document.createElement('span');div.className='div79';div.textContent='┆ 여기부터는 쓸 때만 보여요';div.setAttribute('aria-hidden','true');
  const seq=[];ch79ord().forEach(k=>{if(k==='|')seq.push(div);else if(by[k]){seq.push(by[k]);delete by[k]}});Object.keys(by).forEach(k=>seq.push(by[k]));
  seq.forEach(e=>ch.appendChild(e));
  ch.insertAdjacentHTML('beforeend','<button type="button" class="tch off more79" data-ch79="more"></button>');
  vis79(sc,t)}
function vis79(sc,t){const ch=sc.querySelector('.tchips.c79');if(!ch)return;const open=!!o78(t).chips;let past=false,n=0;
  [...ch.children].forEach(e=>{if(e.classList.contains('div79')){past=true;hide78(e,!open);return}
    const k=e.dataset.k79;if(!k)return;
    const show=open||!past||ch79valued(e,k)||(k!=='care'&&e.getAttribute('aria-pressed')==='true');hide78(e,!show);if(!show)n++});
  ch.classList.toggle('e79',open);
  const mb=ch.querySelector('.more79');if(mb){mb.textContent=open?'－ 접기':'＋ 더 '+n;mb.title=open?'접기 (칩을 끌어서 순서·고정을 바꿀 수 있어요)':'안 쓴 칩 '+n+'개 보기 · 펼쳐서 끌면 순서·고정을 바꿀 수 있어요';mb.setAttribute('aria-expanded',String(open));hide78(mb,!open&&!n)}}
function chSave79(ch){C.chipOrd79=[...ch.children].map(e=>e.classList.contains('div79')?'|':e.dataset.k79).filter(Boolean);save('config')}
drawTaskSheet=(function(prev){return function(){const r=prev.apply(this,arguments);try{const sc=$('sheetC'),t=TASKS[(sheetCtx||{}).task];if(sc&&t&&$('tsTitle'))chips79(sc,t)}catch(e){console.error(e)}return r}})(drawTaskSheet);
var DR79=null;
addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('[data-ch79]');if(DR79&&DR79.sup&&e.target&&e.target.closest&&e.target.closest('#sheetC .tchips')){e.preventDefault();e.stopPropagation();DR79=null;return}
  if(!b)return;e.preventDefault();e.stopPropagation();const t=TASKS[(sheetCtx||{}).task],sc=$('sheetC');if(!t||!sc)return;const op=o78(t);op.chips=op.chips?0:1;vis79(sc,t)},true);
addEventListener('pointerdown',e=>{const c=e.target&&e.target.closest&&e.target.closest('#sheetC .tchips.e79 [data-k79]');if(!c||(e.button&&e.button>0))return;
  DR79={c,x:e.clientX,y:e.clientY,on:false,id:e.pointerId,sup:false}},true);
addEventListener('pointermove',e=>{const d=DR79;if(!d||e.pointerId!==d.id)return;
  if(!d.on){if(Math.hypot(e.clientX-d.x,e.clientY-d.y)<6)return;d.on=true;d.c.classList.add('drag79')}
  e.preventDefault();const ch=d.c.parentElement;if(!ch)return;
  const el=document.elementFromPoint(e.clientX,e.clientY),o=el&&el.closest&&el.closest('.tchips.e79 > *');
  if(!o||o===d.c||o.parentElement!==ch||(!o.dataset.k79&&!o.classList.contains('div79')))return;
  // 놓을 자리: 가리킨 칩이 앞에 있으면 그 앞, 뒤에 있으면 그 뒤. 자리를 바꾼 직후엔 14px 넘게 움직일 때까지 가만히(줄이 다시 흐르며 번갈아 뒤바뀌는 것 방지)
  if(d.last&&Math.hypot(e.clientX-d.last[0],e.clientY-d.last[1])<14)return;
  if(d.c.compareDocumentPosition(o)&Node.DOCUMENT_POSITION_PRECEDING)o.before(d.c);else o.after(d.c);d.last=[e.clientX,e.clientY]},true);
function drEnd79(){const d=DR79;if(!d)return;d.c.classList.remove('drag79');if(d.on){d.sup=true;const ch=d.c.parentElement;if(ch)chSave79(ch);setTimeout(()=>{if(DR79===d)DR79=null},250)}else DR79=null}
addEventListener('pointerup',drEnd79,true);addEventListener('pointercancel',drEnd79,true);
