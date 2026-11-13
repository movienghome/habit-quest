/* ---- v9.2 보스 마무리: ① 쫄따구 HP 막대(칸+숫자)·보스 바로 아래로 ② 도전 보스(다음 보스 불러내기) ③ 주간 보스 HP 자동 조정 ---- */
{
  const CHAL_MAX91=3;
  const wk91=()=>weekStart(dateKey());

  /* ③-1 주별 HP 고정: 자동 조정이 이미 지난 주의 처치·남은 HP를 바꾸지 않게(C.bhp91={주시작:HP}, 지난 주만 적용) */
  const _ws91=weekState;
  weekState=function(k){
    const s=_ws91.apply(this,arguments);
    try{
      const w=weekStart(k),r=C.bhp91&&C.bhp91[w];
      if(r>0&&w<wk91()&&r!==s.hp){s.hp=r;s.left=Math.max(0,r-(s.dmg-s.heal));s.dead=s.dmg-s.heal>=r}
    }catch(e){console.error(e)}
    return s;
  };

  /* ③-2 매주 첫 화면에서 한 번: 지난 4주(4일 넘게 기록한 주만) 평균 데미지의 80% → 주 후반(금·토)에 쓰러지는 HP.
     한 번에 ±30%까지만, 5% 미만 차이는 그대로. C.bauto91off면 안 함. */
  let ADJ91=0,TRY91='';
  function adj91(){
    if(ADJ91||C.bauto91off)return;
    if(typeof ready==='undefined'||!ready||mode==='none')return;
    const w=wk91();
    const sig=w+':'+Object.keys(DAYS).length; // 기록이 모자라 건너뛴 뒤 날짜 기록이 더 들어오면(느린 연결) 다시 봄
    if((C.bauto91&&C.bauto91.w===w)||TRY91===sig)return;
    ADJ91=1;
    try{
      const cur=Math.max(50,+C.weekly.bossHp||400),xs=[];
      for(let i=1;i<=4;i++){
        const pw=addDays(w,-7*i),dd=weekKeys(pw).filter(k=>DAYS[k]&&hasData(DAYS[k])).length;
        if(dd>=4){const s=weekState(pw);xs.push(Math.max(0,s.dmg-s.heal))}
      }
      if(xs.length<2){TRY91=sig;return}
      const avg=xs.reduce((a,b)=>a+b,0)/xs.length;
      let want=Math.round(avg*.8/10)*10;
      want=clamp(want,Math.round(cur*.7),Math.round(cur*1.3));
      want=clamp(want,150,5000);
      if(!(avg>0)||Math.abs(want-cur)/cur<.05){C.bauto91={w,keep:1,avg:Math.round(avg),n:xs.length};save('config');return}
      C.bhp91=C.bhp91||{};
      for(let i=1;i<=26;i++){const pw=addDays(w,-7*i);if(C.bhp91[pw]==null)C.bhp91[pw]=cur}
      C.weekly.bossHp=want;
      C.bauto91={w,from:cur,to:want,avg:Math.round(avg),n:xs.length};
      save('config');
      setTimeout(()=>toastAct(`👾 이번 주 보스 HP를 ${cur} → ${want}로 맞췄어요 (지난 ${xs.length}주 평균 데미지 ${Math.round(avg)})`,'되돌리기',()=>{
        C.weekly.bossHp=cur;C.bauto91={w,undo:1,avg:Math.round(avg),n:xs.length};save('config');render()},7000),600);
    }catch(e){console.error(e)}finally{ADJ91=0}
  }
  render=(function(prev){return function(){try{adj91()}catch(e){console.error(e)}return prev.apply(this,arguments)}})(render);

  /* ② 도전 보스: 주간 보스를 쓰러뜨린 뒤 '불러내기'를 누르면 시작 시점의 순데미지(base)부터 새로 셈.
     C.chal91={w:주시작,list:[{n,c,base,hp}]} — 지난 주 것은 무시. 상태는 전부 순데미지에서 계산(되돌려도 맞음). 보상 없음. */
  const CH91=()=>{const c=C.chal91,w=wk91();return c&&c.w===w&&Array.isArray(c.list)?c:{w,list:[]}};
  function chalState91(){
    const ws=weekState(dateKey()),net=ws.dmg-ws.heal;
    const list=CH91().list.map(b=>{const d=Math.max(0,Math.min(b.hp,net-b.base));return {...b,dealt:d,left:b.hp-d,dead:net-b.base>=b.hp}});
    return {ws,net,list,cur:list.length?list[list.length-1]:null};
  }
  const canSummon91=S=>S.ws.dead&&S.list.length<CHAL_MAX91&&(!S.cur||S.cur.dead);
  function pick91(i){
    const nm=bossOf(dateKey()).name;let idx=BOSSES.findIndex(b=>b[0]===nm);if(idx<0)idx=0;
    return BOSSES[(idx+2+i)%BOSSES.length]; // 이번 주(+0)·다음 주(+1) 보스는 피함
  }
  function summon91(){
    const S=chalState91();if(!canSummon91(S))return;
    const i=S.list.length,b=pick91(i),hp=Math.max(100,Math.round(S.ws.hp*(.6+.2*i)/10)*10);
    C.chal91={w:CH91().w,list:[...S.list.map(x=>({n:x.n,c:x.c,base:x.base,hp:x.hp})),{n:b[0],c:b[1],base:S.net,hp}]};
    save('config');render();toast(`👾 ${b[0]} 등장! 지금부터 얻는 XP가 데미지예요 (HP ${hp})`);
  }
  // 처치 알림: 화면을 연 시점에 이미 쓰러진 건 알리지 않고, 그 뒤 새로 쓰러뜨릴 때만
  const SEEN91=new Set();let INIT91=0;
  function kill91(S){
    const w=CH91().w;
    S.list.forEach((b,i)=>{const key=w+':'+i;
      if(!b.dead){SEEN91.delete(key);return}
      if(SEEN91.has(key))return;SEEN91.add(key);
      if(INIT91)setTimeout(()=>{try{popup('도전 보스','⚔️',`<b>${esc(b.n)}</b>을(를) 쓰러뜨렸어요<br>도전 ${i+1}번째 · 보상은 없지만 이번 주 기록에 남아요`,'도전 보스')}catch(e){}},500)});
    INIT91=1;
  }
  function chalSheet91(S){
    const b=S.cur;sheetCtx={boss91:1};
    openSheet(`<div class="sh"><h3>👾 도전 보스</h3><button class="x" data-sheet="close" aria-label="닫기">×</button></div>
    <div class="mob65 boss"><div class="pic">${bossSVG(b.c,b.dead,b.n)}</div><div>
      <p style="margin:0"><b>${esc(b.n)}</b> ${b.dead?'<span class="qtag">처치!</span>':''}</p>
      <div class="track" style="margin:6px 0 2px"><div class="fill" style="width:${Math.round(b.left/b.hp*100)}%;background:var(--bad)"></div></div>
      <span class="tiny num muted">HP ${b.left}/${b.hp} · 도전 ${S.list.length}/${CHAL_MAX91}</span>
      <p class="small" style="margin:8px 0 2px">이번 주 보스를 쓰러뜨린 뒤 불러낸 보스예요. 불러낸 뒤에 얻은 XP가 그대로 데미지가 되고, 나쁜 행동은 보스를 회복시켜요.</p>
      <p class="tiny" style="margin:0">보상은 없고, 이번 주 동안만 남아요.</p></div></div>
    <p style="margin:10px 0 0"><button class="btn ghost sm" data-w91="weekly">이번 주 보스 보기</button></p>`);
  }
  const _bs91=bossSheet65;
  bossSheet65=function(){
    const S=chalState91();
    if(S.cur){chalSheet91(S);return}
    const r=_bs91.apply(this,arguments);
    try{ // 보스 규칙 안에 자동 조정 켜기·끄기
      const kv=document.querySelector('#sheetC details.br68 .kv');
      if(kv&&!document.querySelector('#sheetC .a91')){
        const a=C.bauto91||{};
        const note=a.to?`이번 주 자동 조정: ${a.from} → ${a.to} (지난 ${a.n}주 평균 데미지 ${a.avg} 기준)`:a.undo?'이번 주 자동 조정은 되돌렸어요.':a.n?`이번 주는 그대로예요 (지난 ${a.n}주 평균 데미지 ${a.avg}).`:'4일 넘게 기록한 주가 2주 이상 쌓이면 맞춰요.';
        kv.insertAdjacentHTML('afterend',`<label class="tiny a91" style="display:flex;gap:6px;align-items:center;margin:8px 0 0"><input type="checkbox" data-a91 ${C.bauto91off?'':'checked'}> 매주 첫날 지난 기록을 보고 HP를 자동으로 맞추기</label><p class="tiny muted" style="margin:2px 0 0">${note}</p>`);
      }
    }catch(e){console.error(e)}
    return r;
  };

  /* ① 쫄따구: 막대(칸 + 테두리) + 숫자. 색에만 기대지 않게 길이·숫자·테두리 */
  const hpOf91=t=>{try{return Math.max(1,Math.round(taskBase(t).xp||0))}catch(e){return 1}};
  function minis91(box){
    const ms=[...box.querySelectorAll('.mini')];
    const hs=ms.map(m=>{const t=!m.classList.contains('dead')&&m.dataset.ctask&&TASKS[m.dataset.ctask];return t?hpOf91(t):0});
    const mx=Math.max(1,...hs);
    ms.forEach((m,i)=>{
      m.querySelectorAll('.mh90,.hb91').forEach(n=>n.remove());
      const h=hs[i],el=document.createElement('span');el.className='hb91'+(h?'':' none');
      el.innerHTML=h?`<span class="bar91"><i style="width:${Math.max(18,Math.round(h/mx*100))}%"></i></span><span class="num91">${h}</span>`:'<span class="bar91"></span><span class="num91">0</span>';
      m.appendChild(el);
    });
  }

  /* 보스 칸·줄 배치: 아레나 → (도전 줄) → 쫄따구 → 영역 막대 */
  function arena91(box,S){
    const ar=box.querySelector('.arena2'),bo=box.querySelector('.boss2');
    if(!ar||!bo)return;
    box.querySelectorAll('.cb91').forEach(n=>n.remove());
    const cur=S.cur;
    if(cur){
      bo.classList.toggle('dead',cur.dead);bo.classList.add('c91');bo.removeAttribute('data-info');
      bo.innerHTML=`${bossSVG(cur.c,cur.dead,cur.n)}<b class="small">${esc(cur.n)}</b><span class="tiny c91tag">도전 ${S.list.length}${cur.dead?' · 처치!':''}</span><div class="track"><div class="fill" style="width:${Math.round(cur.left/cur.hp*100)}%;background:var(--bad)"></div></div><span class="tiny muted num">${cur.left}/${cur.hp}</span>`;
    }
    let row='';
    if(S.ws.dead){
      const chip=`<button type="button" class="chip91" data-info="boss">✓ 이번 주 보스 처치</button>`;
      if(canSummon91(S))row=chip+`<button type="button" class="btn sm sum91" data-sum91="1">👾 다음 보스 불러내기</button>`;
      else if(S.list.length>=CHAL_MAX91&&S.cur&&S.cur.dead)row=chip+`<span class="tiny muted">도전 보스 ${CHAL_MAX91}마리를 모두 쓰러뜨렸어요</span>`;
      else row=chip;
    }
    let after=ar;
    if(row){const d=document.createElement('div');d.className='cb91';d.innerHTML=row;ar.after(d);after=d}
    const mn=box.querySelector('.minions'),ft=box.querySelector('.ft90');
    if(mn){after.after(mn);after=mn}
    if(ft)after.after(ft);
  }

  const _rb91=renderBattle;
  renderBattle=function(){
    const r=_rb91.apply(this,arguments);
    try{
      const box=$('battleBox');
      if(box&&box.querySelector('.arena2')){const S=chalState91();kill91(S);arena91(box,S);minis91(box)}
    }catch(e){console.error(e)}
    return r;
  };

  window.addEventListener('click',e=>{
    const t=e.target;if(!t||!t.closest)return;
    const s=t.closest('[data-sum91]');
    if(s){e.preventDefault();e.stopPropagation();summon91();return}
    const w=t.closest('[data-w91]');
    if(w){e.preventDefault();e.stopPropagation();closeSheet();_bs91()}
  },true);
  window.addEventListener('change',e=>{
    const i=e.target&&e.target.closest&&e.target.closest('[data-a91]');if(!i)return;
    e.stopPropagation();C.bauto91off=i.checked?0:1;save('config');toast(i.checked?'보스 HP를 매주 자동으로 맞춰요':'보스 HP 자동 조정을 껐어요');
  },true);
}
