/* ================= v7.8: B 묶음 첫 조각 — 할 일 상세 줄이기(공간) · 입력칸 =================
   맨 끝 모듈(w77 뒤, route();boot(); 앞).
   1) 상세 머리: '할 일' 글자 자리에 제목(한 줄 줄임) · 🎯 집중·📄 복사는 ⋯ 메뉴로.
   2) 📅 날짜 칸: 날짜 + 빠른 날짜만 기본. 시간·반복·마감일·여러 날·중간 점검은 값이 있거나 '＋'를 눌렀을 때만(B15).
   3) 📂 목록·⚑ 중요도 칩 = 누르면 바로 고르는 메뉴(펼침 칸 없음, B15).
   4) '📝 메모' 머리 없앰(B12 일부) · 묶인 할 일·체크리스트는 비었으면 '＋' 칩 한 줄, 묶인 할 일은 기본 접힘(B13).
   5) 아래 버튼 세 줄 → 두 줄: [😶 막힐 때 ▾][미루기 ▾][⋯] / [⏱][☑ 끝냄][닫기] (B14 · B10의 '바로 고르기').
   6) 입력칸: Shift+Enter = ⋯ 자세히(B3) · 안내 글에 기호(B4) · 3단 화면에서 제목 줄 도구가 두 줄로 꺾이던 것. */

var O78={id:null,open:{}};
function o78(t){if(!t)return {};if(O78.id!==t.id)O78={id:t.id,open:{}};return O78.open}
function hide78(el,on){if(el)el.classList.toggle('hid78',on!==false)}
var WHEN78=[['time','＋ 시간'],['rep','＋ 반복'],['dl','＋ 마감일'],['end','＋ 여러 날'],['ck','＋ 점검일']];

function ts78(){const sc=$('sheetC'),t=TASKS[(sheetCtx||{}).task],ti=$('tsTitle');if(!sc||!t||!ti)return;const op=o78(t);
  /* 1) 머리 */
  const sh=sc.querySelector('.sh'),h3=sh&&sh.querySelector('h3');
  if(h3&&h3.textContent.trim()==='할 일'&&!sh.contains(ti)){h3.replaceWith(ti);sh.classList.add('h78')}
  const top=sc.querySelector('.ts71top');
  if(top){top.querySelectorAll('[data-t71="focus"],[data-t71="copy"]').forEach(b=>hide78(b));hide78(top,![...top.children].some(c=>!c.classList.contains('hid78')))}
  /* 2) 날짜 칸 */
  const w=sc.querySelector('.tpanel[data-p="when"]');
  if(w&&!w.querySelector('.p78')){
    const cl=(id,s)=>{const e=$(id);return e&&w.contains(e)?e.closest(s):null};
    const rows={time:cl('tsTime','.f'),rep:cl('tsRepSel','.row'),dl:cl('tsDl','label'),end:w.querySelector('label.e71'),ck:w.querySelector('.cks')};
    const has={time:!!(t.time||t.dur),rep:!!(t.rep&&t.rep.f),dl:!!t.deadline,end:!!t.end71,ck:!!((t.checks||[]).length)};
    const q=w.querySelector('[data-tsdue]'),qr=q&&q.closest('.row'),dd=w.querySelector('.duedl');
    if(qr){const lb=qr.querySelector('span.small');if(lb)lb.remove();qr.classList.add('q78');if(dd)dd.after(qr)}
    const adds=[];WHEN78.forEach(([k,l])=>{const r=rows[k];if(!r)return;if(has[k]||op['w_'+k])return;hide78(r);adds.push(`<button type="button" class="chipbtn a78" data-p78="${k}">${l}</button>`)});
    w.insertAdjacentHTML('beforeend',`<div class="row p78"${adds.length?'':' hidden'}>${adds.join('')}</div>`);
    w.classList.add('w78')}
  /* 4) 메모 머리 · 묶인 할 일 · 체크리스트 */
  const note=$('tsNote');
  if(note){const p=note.previousElementSibling;if(p&&p.classList.contains('sec71'))p.remove();if(!note.dataset.n78){note.dataset.n78=1;note.placeholder='메모'}}
  if(note&&!sc.querySelector('.add78')){const adds=[];
    const kb=sc.querySelector('.kids56.box71'),kf=kb&&kb.querySelector('form[data-x56kadd]');
    if(kb&&kf){const ks=kb.querySelectorAll('.krow:not(form)'),n=ks.length,dn=kb.querySelectorAll('.krow.on:not(form)').length,hd=kb.firstElementChild;
      if(!n&&!op.kids){hide78(kb);adds.push(`<button type="button" class="chipbtn a78" data-a78="kids" title="이 할 일 밑에 따로 끝내는 할 일을 묶어요(각자 점수)">＋ 묶인 할 일</button>`)}
      else if(n){const fold=!op.kids;kb.classList.toggle('fold78',fold);
        if(hd){hd.classList.add('kh78');hd.innerHTML=`<button type="button" class="kt78" data-k78="1" aria-expanded="${!fold}">📦 묶인 할 일 <b>${dn}/${n}</b> <span class="tiny muted">${fold?'▸ 펼치기':'▾ 접기'}</span></button>`}}}
    const cb=sc.querySelector('.box71.ck71');
    if(cb&&!(t.subs||[]).length&&!op.ck){hide78(cb);adds.push(`<button type="button" class="chipbtn a78" data-a78="ck" title="점수 없는 간단한 체크 항목">＋ 체크리스트</button>`)}
    note.insertAdjacentHTML('afterend',`<div class="row add78"${adds.length?'':' hidden'}>${adds.join('')}</div>`)}
  /* 5) 아래 버튼 줄 */
  const ft=sc.querySelector('.foot71');
  if(ft&&!ft.querySelector('[data-m78]')){const av=ft.querySelector('.av65row'),del=ft.querySelector('[data-tsact="del"]'),drop=ft.querySelector('[data-tsact="drop"]'),pp=ft.querySelector('[data-x57pp="open"]');
    const g=(pp||del||drop||{}).parentElement;
    if(g&&g!==ft){[av,del,drop].forEach(x=>hide78(x));g.classList.add('l78');ft.classList.add('f78');
      if(av)g.insertAdjacentHTML('afterbegin',`<button type="button" class="btn ghost sm" data-m78="stuck" aria-haspopup="menu" title="하기 싫거나 막힐 때: 10분만 · 첫 조각만 · 왜 피하는지">😶 막힐 때 ▾</button>`);
      g.insertAdjacentHTML('beforeend',`<button type="button" class="btn ghost sm" data-m78="more" aria-haspopup="menu" aria-label="더 보기: 집중 · 복사 · 안 하기 · 삭제" title="집중 · 복사 · 안 하기 · 삭제">⋯</button>`);
      const tm=ft.querySelector('[data-tsact="timer"]');if(tm&&/타이머/.test(tm.textContent)){tm.title='타이머';tm.setAttribute('aria-label','타이머');tm.classList.add('tm78')}}}
}
drawTaskSheet=(function(prev){return function(){const r=prev.apply(this,arguments);try{ts78()}catch(e){console.error(e)}return r}})(drawTaskSheet);

function split78(t){const sc=$('sheetC'),ft=sc&&sc.querySelector('.foot71');if(!ft||!t)return;let b=ft.querySelector('.sp78');
  if(!b){ft.insertAdjacentHTML('afterbegin',`<div class="row sp78"><input id="sp78i" maxlength="80" placeholder="✂ 10분 안에 끝낼 첫 조각 (예: 파일만 열기)" autocomplete="off" enterkeyhint="done" aria-label="첫 조각 이름"><button type="button" class="btn sm" data-sp78="go">오늘로</button><button type="button" class="x" data-sp78="x" aria-label="닫기">×</button></div>`);b=ft.querySelector('.sp78')}
  setTimeout(()=>{const i=$('sp78i');if(i)i.focus()},30)}
function splitGo78(){const i=$('sp78i'),t=TASKS[(sheetCtx||{}).task],v=i&&i.value.trim();if(!t||!v){if(i)i.focus();return}try{tsRead();saveTask(t)}catch(e){}split65(t,v)}

addEventListener('click',e=>{const T=e.target;if(!T||!T.closest)return;let b;const t=TASKS[(sheetCtx||{}).task];
  // 날짜 칸 ＋
  if((b=T.closest('[data-p78]'))){e.preventDefault();e.stopPropagation();if(!t)return;const k=b.dataset.p78,op=o78(t),w=b.closest('.tpanel');op['w_'+k]=1;
    const cl=(id,s)=>{const x=$(id);return x?x.closest(s):null};
    const r={time:cl('tsTime','.f'),rep:cl('tsRepSel','.row'),dl:cl('tsDl','label'),end:w&&w.querySelector('label.e71'),ck:w&&w.querySelector('.cks')}[k];
    hide78(r,false);const row=b.parentElement;b.remove();if(row&&!row.children.length)row.hidden=true;
    if(k==='ck'){const a=r&&r.querySelector('[data-tsck="add"]');if(a)a.click();return}
    const f=r&&r.querySelector('input,select');if(f)try{f.focus();if(f.showPicker&&f.type==='date')f.showPicker()}catch(x){}return}
  // 묶인 할 일·체크리스트 ＋
  if((b=T.closest('[data-a78]'))){e.preventDefault();e.stopPropagation();if(!t)return;const k=b.dataset.a78,sc=$('sheetC');o78(t)[k]=1;
    const box=sc.querySelector(k==='kids'?'.kids56.box71':'.box71.ck71');hide78(box,false);const row=b.parentElement;b.remove();if(row&&!row.children.length)row.hidden=true;
    const f=$(k==='kids'?'x56KNew':'tsSubNew');if(f)f.focus();return}
  if((b=T.closest('[data-k78]'))){e.preventDefault();e.stopPropagation();if(!t)return;const op=o78(t);op.kids=op.kids?0:1;const y=$('sheetC').scrollTop;try{tsRead()}catch(x){}drawTaskSheet();$('sheetC').scrollTop=y;return}
  // 첫 조각
  if((b=T.closest('[data-sp78]'))){e.preventDefault();e.stopPropagation();if(b.dataset.sp78==='go')splitGo78();else{const r=b.closest('.sp78');if(r)r.remove()}return}
  // 아래 줄 메뉴
  if((b=T.closest('[data-m78]'))){e.preventDefault();e.stopPropagation();if(!t)return;const sc=$('sheetC'),r=b.getBoundingClientRect(),go=sel=>()=>{const x=sc.querySelector(sel);if(x)x.click()};
    if(b.dataset.m78==='stuck'){const it=[];if(sc.querySelector('[data-x65t="strike"]'))it.push({l:'☠ 삼진아웃 정리 (세 번 미룬 일)',f:go('[data-x65t="strike"]')},'-');
      it.push({l:'🌱 10분만 해보기 <small class="muted">타이머 10분 · 지나면 멈춰도 돼요</small>',f:go('[data-x65t="taste"]')},
        {l:'✂ 첫 조각만 떼기 <small class="muted">10분짜리 하나를 오늘로</small>',f:()=>split78(t)},
        {l:'😶 자꾸 피하게 돼요 <small class="muted">왜 그런지부터 · 꼭 해야 하나?</small>',f:go('[data-x65t="avoid"]')});
      menu61(r.left,r.top-8,'',it);const m=$('m61');if(m){const mr=m.getBoundingClientRect();if(mr.top>r.top-mr.height)m.style.top=Math.max(8,r.top-mr.height-6)+'px'}return}
    const fo=sc.querySelector('[data-t71="focus"]'),cp=sc.querySelector('[data-t71="copy"]'),dr=sc.querySelector('.foot71 [data-tsact="drop"]'),dl=sc.querySelector('.foot71 [data-tsact="del"]'),it=[];
    if(fo)it.push({l:(fo.getAttribute('aria-pressed')==='true'?'🎯 집중에서 빼기':'🎯 집중에 넣기'),f:()=>fo.click()});
    if(cp)it.push({l:'📄 복사 (같은 할 일 하나 더)',f:()=>cp.click()});
    if(it.length&&(dr||dl))it.push('-');
    if(dr)it.push({l:esc(dr.textContent.trim())+(dr.title?` <small class="muted">${esc(dr.title.slice(0,30))}</small>`:''),f:()=>dr.click()});
    if(dl)it.push({l:'🗑 삭제',bad:1,keep:1,f:btn=>{dl.click();if(ui.delArm&&btn)btn.textContent='🗑 한 번 더 누르면 지워요';else closeMenu61()}});   // 삭제는 두 번 눌러야(3초 안) — 메뉴를 연 채로
    menu61(r.left,r.top-8,'',it);const m=$('m61');if(m){const mr=m.getBoundingClientRect();if(mr.top>r.top-mr.height)m.style.top=Math.max(8,r.top-mr.height-6)+'px'}return}
  // 3) 목록·중요도 칩 = 바로 고르기
  if((b=T.closest('#sheetC .tchips [data-x56panel="list"],#sheetC .tchips [data-x56panel="prio"]'))){if(!t)return;e.preventDefault();e.stopPropagation();const r=b.getBoundingClientRect(),id=t.id;
    const set=f=>{try{tsRead()}catch(x){}const x=TASKS[id];if(!x)return;f(x);if(ui.tsPanel==='list'||ui.tsPanel==='prio')ui.tsPanel='';tsCommit(true,false)};
    if(b.dataset.x56panel==='list'){const cur=listOk(t.list)?t.list:'inbox',ord=(typeof listOrder74==='function'?listOrder74():[]),ix=i=>{const n=ord.indexOf(i);return n<0?999:n};
      const ids=['inbox',...C.lists.filter(l=>l.id!=='inbox').map(l=>l.id)].sort((a,c)=>ix(a)-ix(c));
      menu61(r.left,r.bottom+4,'📂 목록',ids.map(i=>({l:(cur===i?'● ':'○ ')+esc(listName(i)),f:()=>set(x=>{x.list=i})})))}
    else{const cur=t.prio||0;menu61(r.left,r.bottom+4,'⚑ 중요도',[[5,'!!! 높음'],[3,'!! 중간'],[1,'! 낮음'],[0,'— 없음']].map(([p,l])=>({l:(cur===p?'● ':'○ ')+l,f:()=>set(x=>{if(p)x.prio=p;else delete x.prio})})))}
    return}
},true);
addEventListener('keydown',e=>{const T=e.target;if(!T||e.isComposing||e.keyCode===229)return;
  if(T.id==='sp78i'){if(e.key==='Enter'){e.preventDefault();e.stopPropagation();splitGo78()}else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();const r=T.closest('.sp78');if(r)r.remove()}return}
  // 6) 입력칸 Shift+Enter = ⋯ 자세히 (추가하면서 상세 열기)
  if(e.key==='Enter'&&e.shiftKey&&T.tagName==='INPUT'&&T.closest){const f=T.closest('form.tadd'),b=f&&f.querySelector('[data-tadd71]');if(b){e.preventDefault();e.stopPropagation();b.click()}}
},true);
addEventListener('change',e=>{if(e.target&&e.target.id==='sp78i')e.stopPropagation()},true);

/* 입력칸 안내 글: 알아듣는 기호를 다 적기(B4). 🧽 관리 목록에서는 v7.7 안내 그대로 */
var PH78='할 일 추가 · 내일 3시 30분 #태그 !!중요 ^목록 @영역 *구슬 %관리';
function ph78(){document.querySelectorAll('form.tadd input').forEach(i=>{if(i.dataset.ph78||i.dataset.ph77)return;if(!/^할 일 추가/.test(i.placeholder||''))return;i.dataset.ph78=1;i.placeholder=PH78;
  i.title='알아듣는 말·기호: 내일·금요일·17~20일 · 3시 30분·11시부터 2시간 · 9일 마감 · 매주·주에 3번 · #태그 · ! !! !!! 중요도 · ^목록 · @영역 · *구슬 · %관리(%14 = 14일마다) · Shift+Enter = 자세히 열기'})}
render=(function(prev){return function(){const x=prev.apply(this,arguments);try{ph78()}catch(e){console.error(e)}return x}})(render);

F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['할 일 상세 줄이기','할 일을 눌러 연 상세 화면','날짜 칸은 날짜만(시간·반복·마감은 ＋), 목록·중요도 칩은 바로 고르기, 묶인 할 일·체크리스트는 ＋ 칩, 아래 버튼은 😶 막힐 때 · 미루기 · ⋯',()=>{location.hash='tasks'},'상세 미니멀 간단 날짜 마감 반복 목록 드롭다운 막힐 때 삭제 복사 집중'],
  ['Shift+Enter = 자세히','할 일 입력칸','적고 Shift+Enter를 누르면 추가하면서 상세가 열려요(마우스 없이)',()=>{location.hash='tasks'},'단축키 쉬프트 엔터 자세히 상세']])}})(F67);
