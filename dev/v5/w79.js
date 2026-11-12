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

/* ---- B12: 메모 안의 목록 — `- [ ]` 체크박스 · `-`·`+` 점 목록 · ↗ 묶인 할 일로 · 순서 바꾸기 ----
   메모 글(t.note)이 그대로 원본. 목록 줄이 있으면 평소엔 보기 모습(.nv79), 눌러서 고치면 글 칸. */
var LI79=/^(\s*)([-+*])\s+(?:\[([ xX])\]\s*)?(.*)$/;
function nLines79(v){return String(v||'').split('\n')}
function nHas79(v){return nLines79(v).some(l=>LI79.test(l))}
function nHtml79(v){return nLines79(v).map((l,i)=>{const m=LI79.exec(l);
  if(m){const ind=Math.min(4,Math.floor(m[1].replace(/\t/g,'  ').length/2)),cb=m[3]!=null,dn=cb&&m[3]!==' ';
    return `<div class="ni79${dn?' dn':''}" style="margin-left:${ind*14}px" data-i="${i}">${cb?`<button type="button" class="nc79" data-n79="tog" aria-pressed="${dn}" aria-label="${dn?'체크 풀기':'체크하기'}">${dn?'☑':'☐'}</button>`:'<span class="nb79" aria-hidden="true">•</span>'}<span class="nt79">${esc(m[4])||'&nbsp;'}</span><span class="na79"><button type="button" data-n79="up" aria-label="위로" title="위로">↑</button><button type="button" data-n79="dn" aria-label="아래로" title="아래로">↓</button>${cb?'<button type="button" data-n79="pro" aria-label="묶인 할 일로" title="묶인 할 일로 (점수 따로)">↗</button>':''}</span></div>`}
  return l.trim()?`<div class="np79" data-i="${i}">${esc(l)}</div>`:'<div class="ns79"></div>'}).join('')}
function note79(sc,t){const ta=$('tsNote');if(!ta)return;let pv=sc.querySelector('.nv79');const show=nHas79(ta.value)&&!o78(t).nedit;
  if(!pv){ta.insertAdjacentHTML('afterend','<div class="nv79" tabindex="0" role="group" aria-label="메모 — 눌러서 고치기"></div>');pv=ta.nextElementSibling}
  hide78(ta,show);hide78(pv,!show);if(show)pv.innerHTML=nHtml79(ta.value)}
drawTaskSheet=(function(prev){return function(){const r=prev.apply(this,arguments);try{const sc=$('sheetC'),t=TASKS[(sheetCtx||{}).task];if(sc&&t&&$('tsTitle'))note79(sc,t)}catch(e){console.error(e)}return r}})(drawTaskSheet);
addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;const pv=T.closest('#sheetC .nv79');if(!pv)return;const t=TASKS[(sheetCtx||{}).task],ta=$('tsNote'),sc=$('sheetC');if(!t||!ta)return;
  const b=T.closest('[data-n79]');
  if(!b){e.preventDefault();e.stopPropagation();o78(t).nedit=1;note79(sc,t);ta.focus();const n=ta.value.length;try{ta.setSelectionRange(n,n)}catch(x){}return}
  e.preventDefault();e.stopPropagation();const row=b.closest('[data-i]'),i=row?+row.dataset.i:-1,act=b.dataset.n79,L=nLines79(ta.value);if(i<0||i>=L.length)return;
  if(act==='tog')L[i]=L[i].replace(/\[( |x|X)\]/,(m,c)=>c===' '?'[x]':'[ ]');
  else if(act==='up'||act==='dn'){const j=i+(act==='up'?-1:1);if(j<0||j>=L.length||!LI79.test(L[j]))return;[L[i],L[j]]=[L[j],L[i]]}
  else if(act==='pro'){const m=LI79.exec(L[i]),ti=m&&m[4].trim();if(!ti)return;L.splice(i,1);ta.value=L.join('\n');const tt=tsRead();if(!tt)return;
    const k=newTask({title:ti,list:tt.list,tags:[...(tt.tags||[])]});k.parent=tt.id;if(m[3]&&m[3]!==' '){k.status=2;k.doneAt=dateKey()}saveTask(k);o78(tt).kids=1;tsCommit(true,false);render();toast(`'${ti}'를 묶인 할 일로 바꿨어요`);return}
  ta.value=L.join('\n');try{tsCommit(false)}catch(x){console.error(x)}pv.innerHTML=nHtml79(ta.value)},true);
addEventListener('focusout',e=>{const ta=e.target;if(!ta||ta.id!=='tsNote')return;const t=TASKS[(sheetCtx||{}).task];if(!t)return;
  setTimeout(()=>{const sc=$('sheetC'),n=$('tsNote');if(!sc||!n||document.activeElement===n)return;o78(t).nedit=0;note79(sc,t)},0)},true);
addEventListener('keydown',e=>{const ta=e.target;if(!ta||ta.id!=='tsNote'||e.key!=='Enter'||e.isComposing||e.keyCode===229||e.shiftKey||e.ctrlKey||e.metaKey||e.altKey)return;
  const v=ta.value,p=ta.selectionStart;if(p!==ta.selectionEnd)return;const ls=v.lastIndexOf('\n',p-1)+1;let le=v.indexOf('\n',p);if(le<0)le=v.length;if(p!==le)return;   // 줄 끝에서만
  const m=LI79.exec(v.slice(ls,le));if(!m)return;e.preventDefault();e.stopPropagation();
  if(!m[4].trim()){ta.value=v.slice(0,ls)+v.slice(le);ta.setSelectionRange(ls,ls);return}   // 빈 항목에서 Enter = 목록 끝내기
  const ins='\n'+m[1]+m[2]+' '+(m[3]!=null?'[ ] ':'');ta.value=v.slice(0,p)+ins+v.slice(p);const q=p+ins.length;ta.setSelectionRange(q,q);ta.dispatchEvent(new Event('input',{bubbles:true}))},true);

/* ---- B13: 묶인 할 일 순서 끌기 (k.ord79 — 목록의 묶음 줄·상세가 같은 순서) ---- */
kidsOf=(function(prev){return function(id){const a=prev.apply(this,arguments);if(a.some(k=>k.ord79!=null))a.sort((x,y)=>(x.ord79==null?1e6:x.ord79)-(y.ord79==null?1e6:y.ord79));return a}})(kidsOf);
function kids79(sc,t){const kb=sc.querySelector('.kids56.box71');if(!kb||kb.classList.contains('hid78')||kb.classList.contains('fold78')||kb.dataset.g79)return;
  const form=kb.querySelector('form.krow');if(!form)return;kb.dataset.g79='1';
  let rows=[...kb.querySelectorAll('.krow:not(form)')];if(!rows.length)return;
  const idOf=r=>{const b=r.querySelector('[data-x56open]');return b?b.dataset.x56open:''};
  const ix=new Map(rows.map((r,i)=>[r,i])),ord=r=>{const k=TASKS[idOf(r)];return k&&k.ord79!=null?k.ord79:1e6};
  rows.sort((a,b)=>((a.classList.contains('on')?1:0)-(b.classList.contains('on')?1:0))||(ord(a)-ord(b))||(ix.get(a)-ix.get(b)));rows.forEach(r=>form.before(r));
  rows.forEach(r=>{r.classList.add('g79');r.insertAdjacentHTML('afterbegin','<button type="button" class="gr79" data-g79="1" aria-label="순서 바꾸기 (끌기)" title="끌어서 순서 바꾸기">⋮⋮</button>')});
  kb.classList.add('g79')}
drawTaskSheet=(function(prev){return function(){const r=prev.apply(this,arguments);try{const sc=$('sheetC'),t=TASKS[(sheetCtx||{}).task];if(sc&&t&&$('tsTitle'))kids79(sc,t)}catch(e){console.error(e)}return r}})(drawTaskSheet);
var KD79=null;
addEventListener('pointerdown',e=>{const g=e.target&&e.target.closest&&e.target.closest('#sheetC .kids56 .gr79');if(!g||(e.button&&e.button>0))return;e.preventDefault();
  KD79={row:g.closest('.krow'),y:e.clientY,id:e.pointerId,on:false,last:null};try{g.setPointerCapture(e.pointerId)}catch(x){}},true);
addEventListener('pointermove',e=>{const d=KD79;if(!d||e.pointerId!==d.id)return;
  if(!d.on){if(Math.abs(e.clientY-d.y)<5)return;d.on=true;d.row.classList.add('drag79')}
  e.preventDefault();const kb=d.row.parentElement;if(!kb)return;
  if(d.last!=null&&Math.abs(e.clientY-d.last)<10)return;
  const rows=[...kb.querySelectorAll('.krow.g79')];const o=rows.find(r=>r!==d.row&&e.clientY>=r.getBoundingClientRect().top&&e.clientY<=r.getBoundingClientRect().bottom);
  if(!o||(o.classList.contains('on')!==d.row.classList.contains('on')))return;   // 끝낸 것과 안 끝낸 것은 서로 안 넘나듦
  if(d.row.compareDocumentPosition(o)&Node.DOCUMENT_POSITION_PRECEDING)o.before(d.row);else o.after(d.row);d.last=e.clientY},true);
function kdEnd79(){const d=KD79;KD79=null;if(!d)return;d.row.classList.remove('drag79');if(!d.on)return;
  const kb=d.row.parentElement;if(!kb)return;[...kb.querySelectorAll('.krow.g79')].forEach((r,i)=>{const b=r.querySelector('[data-x56open]'),k=b&&TASKS[b.dataset.x56open];if(k&&k.ord79!==i){k.ord79=i;saveTask(k)}});
  try{render()}catch(x){}}
addEventListener('pointerup',kdEnd79,true);addEventListener('pointercancel',kdEnd79,true);

/* ---- B5: 할 일 추가 + '한 일' 기록 = 한 입력칸(홈 오늘·할 일 화면) ----
   입력칸 옆 ✓ 한 일 단추 / Ctrl+Enter = 빠른 기록의 '✓ 했어요'와 같은 길(습관 이름이면 그 습관, 아니면 그냥 한 일). 기호(#태그 !! 등)는 떼고 이름만.
   종류(용기·나쁜·행복)·크기를 바꾸려면 알림의 ✎ 또는 접어 둔 '빠른 기록' 칸. 빠른 기록 칸은 한 번만 접어 줌(C.mig79q). */
function fin79(inp){const v=(inp.value||'').trim();if(!v){inp.focus();toast('무엇을 했는지 적어주세요');return}
  let name=v;try{const p=parseQuick(v);if(p&&p.title&&p.title.trim())name=p.title.trim()}catch(e){}
  const q=$('qName'),f=$('quickForm'),dn=f&&f.querySelector('button[value="done"]');if(!q||!f||!dn)return;
  q.value=name;try{$('qType').value='good';$('qSize').value='m'}catch(e){}
  f.requestSubmit(dn);
  inp.value='';const pid={htAdd:'htParse',tAdd:'tParse'}[inp.id];if(pid&&$(pid))$(pid).innerHTML='';inp.focus()}
function fin79ui(){document.querySelectorAll('form.tadd .in').forEach(w=>{const i=w.querySelector('input#htAdd,input#tAdd');if(!i||w.querySelector('[data-fin79]'))return;
  const b=document.createElement('button');b.type='button';b.className='btn ghost sm fin79';b.dataset.fin79='1';b.textContent='✓';b.title='✓ 이미 한 일로 기록 (Ctrl+Enter) — 할 일 목록에는 안 남아요';b.setAttribute('aria-label','이미 한 일로 기록');
  const sub=w.querySelector('button[type=submit]');sub?sub.before(b):w.appendChild(b);
  if(!/Ctrl\+Enter/.test(i.title||''))i.title=(i.title?i.title+' · ':'')+'Ctrl+Enter = 이미 한 일로 기록'})}
render=(function(prev){return function(){const x=prev.apply(this,arguments);try{fin79ui()}catch(e){console.error(e)}return x}})(render);
addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('[data-fin79]');if(!b)return;e.preventDefault();e.stopPropagation();const i=b.closest('form.tadd');const inp=i&&i.querySelector('input');if(inp)fin79(inp)},true);
addEventListener('keydown',e=>{const T=e.target;if(!T||e.isComposing||e.keyCode===229||e.key!=='Enter'||!(e.ctrlKey||e.metaKey)||!T.id||!/^(htAdd|tAdd)$/.test(T.id))return;e.preventDefault();e.stopPropagation();fin79(T)},true);
render=(function(prev){return function(){try{if(!C.mig79q){C.mig79q=1;C.ui.collapsed=C.ui.collapsed||{};C.ui.collapsed.quick=true;save('config')}}catch(e){console.error(e)}return prev.apply(this,arguments)}})(render);

/* ---- B6: 사이드바 — 할 일 목록 사이드바 접기/펴기(C.sbOff79) · 왼쪽 메뉴(PC 레일) 끌어서 순서(C.navOrd79) ----
   접으면 위쪽 칩 줄(#tChips: 스마트 목록 칩 + 목록 고르기)이 대신 보여요. 할 일 사이드바의 스마트 목록·목록은 이미 꾹 눌러 끌기로 순서가 바뀜(v5). */
function sb79ui(){const lay=document.querySelector('[data-view="tasks"] .tlayout');if(!lay)return;
  if(!$('sb79')){const h=$('tTitle');if(h)h.insertAdjacentHTML('beforebegin','<button type="button" class="ib sb79" id="sb79" aria-label="목록 사이드바 접기·펴기"></button>')}
  lay.classList.toggle('sb79off',!!C.sbOff79);const b=$('sb79');if(b){b.textContent=C.sbOff79?'☰':'«';b.setAttribute('aria-pressed',String(!C.sbOff79));b.title=C.sbOff79?'목록 사이드바 펴기':'목록 사이드바 접기 (위쪽 칩·목록 고르기로 바꿔요)'}
  document.querySelectorAll('#tSide [data-tsel][data-drag^="row:"]').forEach(x=>{if(!x.title&&!/^(l:|#)/.test(x.dataset.tsel))x.title='꾹 눌러 끌면 순서를 바꿀 수 있어요'})}
render=(function(prev){return function(){const x=prev.apply(this,arguments);try{sb79ui()}catch(e){console.error(e)}return x}})(render);
addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('#sb79');if(!b)return;e.preventDefault();e.stopPropagation();C.sbOff79=C.sbOff79?0:1;save('config');sb79ui()},true);
function navKey79(a){return (a.getAttribute('href')||'').slice(1)}
function navAs79(sd){return [...sd.querySelectorAll(':scope>a[href^="#"]')].filter(a=>navKey79(a)!=='more')}
function navSort79(){const sd=$('side');if(!sd)return;const o=Array.isArray(C.navOrd79)?C.navOrd79:[],sep=sd.querySelector(':scope>.sep');if(!o.length||!sep)return;
  const as=navAs79(sd),idx=a=>{const i=o.indexOf(navKey79(a));return i<0?1e6:i},pos=new Map(as.map((a,i)=>[a,i]));
  as.slice().sort((a,b)=>(idx(a)-idx(b))||(pos.get(a)-pos.get(b))).forEach(a=>sep.before(a))}
renderNav=(function(prev){return function(){const r=prev.apply(this,arguments);try{navSort79()}catch(e){console.error(e)}return r}})(renderNav);
var ND79=null;
addEventListener('dragstart',e=>{if(e.target&&e.target.closest&&e.target.closest('#side>a'))e.preventDefault()},true);
addEventListener('pointerdown',e=>{const a=e.target&&e.target.closest&&e.target.closest('#side>a[href^="#"]');if(!a||e.pointerType!=='mouse'||e.button>0||navKey79(a)==='more')return;ND79={a,y:e.clientY,id:e.pointerId,on:false,last:null,sup:false}},true);
addEventListener('pointermove',e=>{const d=ND79;if(!d||e.pointerId!==d.id)return;
  if(!d.on){if(Math.abs(e.clientY-d.y)<6)return;d.on=true;d.a.classList.add('drag79')}
  e.preventDefault();if(d.last!=null&&Math.abs(e.clientY-d.last)<8)return;
  const sd=$('side'),o=navAs79(sd).find(a=>a!==d.a&&e.clientY>=a.getBoundingClientRect().top&&e.clientY<=a.getBoundingClientRect().bottom);if(!o)return;
  if(d.a.compareDocumentPosition(o)&Node.DOCUMENT_POSITION_PRECEDING)o.before(d.a);else o.after(d.a);d.last=e.clientY},true);
function ndEnd79(){const d=ND79;if(!d)return;d.a.classList.remove('drag79');if(!d.on){ND79=null;return}d.sup=true;const sd=$('side');if(sd){C.navOrd79=navAs79(sd).map(navKey79);save('config')}setTimeout(()=>{if(ND79===d)ND79=null},300)}
addEventListener('pointerup',ndEnd79,true);addEventListener('pointercancel',ndEnd79,true);
addEventListener('click',e=>{if(ND79&&ND79.sup&&e.target&&e.target.closest&&e.target.closest('#side')){e.preventDefault();e.stopPropagation();ND79=null}},true);
