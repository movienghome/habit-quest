/* v12.9 (w127): 폰에서도 보이는 진입로 — ① 캘린더 바 🧽 단추 → '🧽 관리 · 📌 주 N회' 시트(관리 골라 놓기·빼기, 주 N회 날 정하기·빼기를 글자·✕로 보이게)
   ② 주 N회 카드(🔁 이번 주 창)에 '📌 정한 날 ✕' 줄. 폰 독(body.tt84)은 서랍(#calTray)을 숨기므로 이 시트가 그 대신이에요. */
{
const wsK=()=>{try{return wsNow120()}catch(e){return weekStart(midKey68())}};
const wkAll=()=>openTasks().filter(t=>wx91(t));
function unplan127(id,k,after){const t=TASKS[id];if(!t||!t.sl91||t.sl91[k]===undefined)return;
  const had=t.sl91[k],hl=t.sd119&&t.sd119[k];delete t.sl91[k];if(t.sd119)delete t.sd119[k];if(!Object.keys(t.sl91).length)delete t.sl91;saveTask(t);
  toastAct(`${t.title} · ${fmtD(k)} 계획을 뺐어요`,'되돌리기',()=>{t.sl91=t.sl91||{};t.sl91[k]=had;if(hl){t.sd119=t.sd119||{};t.sd119[k]=hl}saveTask(t);render();if(after)after()});if(after)after()}
function plan127(id,k){const t=TASKS[id];if(!t||!wx91(t))return;t.sl91=t.sl91||{};if(t.sl91[k]===undefined){t.sl91[k]='';saveTask(t)}}
function deck127(){
  const td=midKey68(),ws=wsK(),days=[...Array(7)].map((_,i)=>addDays(ws,i));
  const care=careAll76().sort((a,b)=>String(a.due||'9').localeCompare(String(b.due||'9'))||(a.order||0)-(b.order||0)),wk=wkAll();
  const crow=t=>{const on=plOn126(t);return `<div class="d127row"><div class="d127t"><b>🧽 ${esc(t.title)}</b><small class="muted">${on?esc(fmtD(t.cs126.d)+(t.cs126.m?' '+t.cs126.m:'')+' 에 놓았어요'):esc(when76(t,td)||'날짜 없음')}</small></div>
      <div class="d127b"><button type="button" class="btn sm" data-d127p="${esc(t.id)}">📅 ${on?'다시 놓기':'놓기'}</button>${on?`<button type="button" class="btn sm ghost" data-d127u="${esc(t.id)}" aria-label="${esc(t.title)} 놓은 자리 빼기">✕ 빼기</button>`:''}</div></div>`};
  const wrow=t=>{const N=(+(t.rep&&t.rep.n)||0);return `<div class="d127row col"><div class="d127t"><b>🔁 ${esc(t.title)}</b><small class="muted">이번 주 ${wkCnt91(t,ws)}${N?'/'+N:''}회 · 날을 눌러 정하고, 다시 누르면 빼요</small></div>
      <div class="d127d">${days.map(k=>{const pl=t.sl91&&t.sl91[k]!==undefined,past=k<td&&!pl;
        return `<button type="button" class="chipbtn d127day" data-d127w="${esc(t.id)}|${esc(k)}" aria-pressed="${pl}"${past?' disabled':''} aria-label="${esc(fmtD(k)+'('+wdOf(k)+') '+(pl?'계획함 — 누르면 뺌':'계획 안 함 — 누르면 넣음'))}"><span>${wdOf(k)}</span><small>${esc(k.slice(8))}</small><b>${pl?'📌✕':'＋'}</b></button>`}).join('')}</div></div>`};
  sheetCtx={deck127:1};
  openSheet(`<div class="sh"><h3>🧽 관리 · 📌 주 N회 놓기</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <p class="small muted" style="margin:0 0 8px">관리는 <b>📅 놓기</b>로 날짜·시각을, 주 N회는 <b>요일 단추</b>로 날을 정해요. <b>✕</b>를 누르면 빼요. 시각은 시간표에서 꾹 눌러 끌어 놓아도 돼요.</p>
    <h4 class="d127h">🧽 관리 <small class="muted">${care.length}개</small></h4>${care.length?care.slice(0,60).map(crow).join(''):'<div class="empty tiny">아직 관리로 옮긴 할 일이 없어요.</div>'}
    <h4 class="d127h">🔁 주 N회 <small class="muted">${esc(fmtD(ws))}(월) ~ ${esc(fmtD(addDays(ws,6)))}(일)</small></h4>${wk.length?wk.map(wrow).join(''):'<div class="empty tiny">주 N회 할 일이 없어요.</div>'}`)}
window.deck127=deck127;
window.wkSection127=function(){const td=midKey68(),ws=wsK(),days=[...Array(7)].map((_,i)=>addDays(ws,i)),wk=wkAll();
  const wrow=t=>{const N=(+(t.rep&&t.rep.n)||0);return `<div class="d127row col"><div class="d127t"><b>🔁 ${esc(t.title)}</b><small class="muted">이번 주 ${wkCnt91(t,ws)}${N?'/'+N:''}회 · 날을 눌러 정하고, 다시 누르면 빼요</small></div>
      <div class="d127d">${days.map(k=>{const pl=t.sl91&&t.sl91[k]!==undefined,past=k<td&&!pl;
        return `<button type="button" class="chipbtn d127day" data-d127w="${esc(t.id)}|${esc(k)}" aria-pressed="${pl}"${past?' disabled':''} aria-label="${esc(fmtD(k)+'('+wdOf(k)+') '+(pl?'계획함 — 누르면 뺌':'계획 안 함 — 누르면 넣음'))}"><span>${wdOf(k)}</span><small>${esc(k.slice(8))}</small><b>${pl?'📌✕':'＋'}</b></button>`}).join('')}</div></div>`};
  return `<h4 class="d127h">🔁 주 N회 <small class="muted">${esc(fmtD(ws))}(월) ~ ${esc(fmtD(addDays(ws,6)))}(일)</small></h4>${wk.length?wk.map(wrow).join(''):'<div class="empty tiny">주 N회 할 일이 없어요.</div>'}`};
function redraw127(){(window.deck128||deck127)()}
function keepY(f){const sc=$('sheetC'),y=sc?sc.scrollTop:0;f();const s2=$('sheetC');if(s2)s2.scrollTop=y}
document.addEventListener('click',e=>{const T=e.target;if(!T.closest)return;let b;
  if((b=T.closest('[data-deck127]'))){e.preventDefault();e.stopPropagation();redraw127();return}
  if((b=T.closest('[data-d127p]'))){e.preventDefault();e.stopPropagation();plSheet126(b.dataset.d127p);return}
  if((b=T.closest('[data-d127u]'))){e.preventDefault();e.stopPropagation();const t=TASKS[b.dataset.d127u];if(!t)return;const sn=snap126(t);unplace126(t);render();
    toastAct(`${t.title} · 놓은 자리를 뺐어요`,'되돌리기',()=>{try{restore126(t,sn)}catch(_){}render();redraw127()});keepY(redraw127);return}
  if((b=T.closest('[data-d127w]'))){e.preventDefault();e.stopPropagation();const [id,k]=b.dataset.d127w.split('|'),t=TASKS[id];if(!t)return;
    if(t.sl91&&t.sl91[k]!==undefined)unplan127(id,k,()=>{render();keepY(redraw127)});else{plan127(id,k);render();keepY(redraw127)}return}
  if((b=T.closest('[data-pl127]'))){e.preventDefault();e.stopPropagation();const [id,k]=b.dataset.pl127.split('|');
    unplan127(id,k,()=>{const row=b.closest('.pl127');b.remove();if(row&&!row.querySelector('[data-pl127]'))row.remove();render()});return}
},true);
/* 캘린더 바에 보이는 🧽 단추 (폰 독 안의 바에도) */
function bar127(){document.querySelectorAll('.calbar2').forEach(bar=>{if(bar.querySelector('[data-deck127]'))return;const a=bar.querySelector('#calPlanBtn')||bar.querySelector('#calMealBtn');
  const b=document.createElement('button');b.type='button';b.className='ib deck127b';b.setAttribute('data-deck127','1');b.setAttribute('aria-label','관리·주 N회 놓기');b.title='관리 고르기 · 주 N회 날 정하기·빼기';b.innerHTML='🧽<small>관리</small>';
  if(a)a.before(b);else bar.appendChild(b)})}
render=(function(prev){return function(){const r=prev.apply(this,arguments);try{bar127()}catch(e){console.error(e)}return r}})(render);
try{bar127()}catch(e){}
/* 🔁 이번 주 창: 정한 날을 글자와 ✕로 */
card121=(function(prev){return function(g,ws,td){const h=prev.apply(this,arguments);try{const t=g.t,pl=Object.keys(t.sl91||{}).filter(k=>weekStart(k)===ws&&k>=td&&!dayCnt99(t,k).n).sort();
  const row=pl.length?`<div class="pl127"><span class="tiny muted">📌 정한 날 — ✕로 빼요</span>${pl.map(k=>`<button type="button" class="chipbtn" data-pl127="${esc(t.id)}|${esc(k)}" aria-label="${esc(fmtD(k)+'('+wdOf(k)+') 계획 빼기')}">📌 ${esc(wdOf(k))} ${esc(fmtD(k))}${t.sl91[k]?' '+esc(t.sl91[k]):''} ✕</button>`).join('')}</div>`:'';
  return row?h.replace('<div class="st121">',row+'<div class="st121">'):h}catch(e){console.error(e);return h}}})(card121);
F67=(function(prev){return function(){return prev.apply(this,arguments).concat([
  ['🧽 관리·주 N회 놓기 시트','캘린더·시간표 위쪽 🧽 관리 단추','관리 목록(📅 놓기·✕ 빼기)과 주 N회 요일 단추(눌러 정하고 다시 누르면 빼요)가 한 시트에 있어요. 폰 시간표(독)에서도 같은 단추로 열려요.'],
  ['⚲ 고른 것 보이기 합쳐서 보기','캘린더 위 깔때기 → 보이기','목록·영역·태그·종류를 여러 줄 고르면 하나라도 맞는 것이 보여요(관리 포함). 〈겹치는 것만〉을 켜면 예전처럼 둘 다 맞는 것만 보여요.']])}})(F67);
}
