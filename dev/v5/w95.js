/* ---- v9.6 (w95.js): 카드 편집 창 더 줄이기 (사용자 11/13 밤: 칸이 값에 비해 너무 크고, '더 설정'은 한 단계 낭비) ----
   ae94(w94)가 만든 DOM을 한 번 더 다듬음(openActionEditor 맨 바깥 감싸개). 이벤트는 그대로 data-ae 위임.
   ① 종류·영역·용기·구슬·타이머·크기·금액 = **한 줄 칩**(select 자체를 칩 모양으로 — 누르면 바로 고름, '⚙ 더 설정' 접힘 없앰)
      값이 기본(없음·자동·안 적음)인 칩은 흐리게+점선. 타이머 방식 칩은 목표 시간이 있을 때만.
   ② 점수 칸 셋 = 낮은 한 줄(이모지·이름·숫자 한 칸 안)
   ③ 세부 옵션·설명·반복·이어진 곳 = 큰 상자 넷 대신 **칩 한 줄 → 누른 것 하나만 아래에 펼침**(O95, 카드가 바뀌면 초기화) */
{
  const O95={id:null,k:null};
  const q1=(r,s)=>r.querySelector(s);
  const pre95=(sel,f)=>{if(!sel)return;[...sel.options].forEach(o=>{const t=f(o.value,o.textContent.trim());if(t!=null)o.textContent=t})};
  function chipSel(sel,cls,isDef,f){
    if(!sel)return null;pre95(sel,f);
    sel.classList.add('c95');if(cls)sel.classList.add(cls);
    sel.classList.toggle('def95',isDef(sel.value));
    const lb=sel.closest('label');if(lb){sel.setAttribute('aria-label',(lb.firstChild&&lb.firstChild.nodeType===3?lb.firstChild.nodeValue:'').trim())}
    return sel}
  function ae95(id){
    const sc=$('sheetC');if(!sc||!sc.classList.contains('ae94')||q1(sc,'.r95'))return;
    const a=C.actions.find(x=>x.id===id);if(!a)return;
    if(O95.id!==id){O95.id=id;O95.k=null}
    const idr=q1(sc,'.ae94id'),dMore=q1(sc,'details.ae94d[data-k94="more"]');
    // ① 칩 줄
    const row=document.createElement('div');row.className='r95';
    const tp=chipSel(q1(sc,'[data-ae="type"]'),'k95',()=>false,(v,t)=>v==='good'?'▲ 좋은 행동':v==='bad'?'▼ 나쁜 행동':null);
    const ar=chipSel(q1(sc,'[data-ae="area"]'),'',()=>false,(v,t)=>/^🧭/.test(t)?null:'🧭 '+t);
    const br=chipSel(q1(sc,'[data-aebrave]'),'',v=>!v,(v,t)=>v?'⚔️ '+t.replace(/\s*·\s*용기\s*/,' +'):'⚔️ 용기');
    const mb=chipSel(q1(sc,'[data-ae="marble"]'),'',v=>!v,(v,t)=>v?'🔮 '+t.replace(/^.*?·\s*/,''):'🔮 구슬');
    const du=q1(sc,'[data-ae="dur"]');let duC=null;
    if(du){duC=document.createElement('label');duC.className='c95 du95'+(+du.value?'':' def95');
      duC.appendChild(document.createTextNode('⏱'));du.placeholder='—';du.setAttribute('aria-label','목표 시간(분)');du.inputMode='numeric';
      duC.appendChild(du);duC.appendChild(document.createTextNode('분'))}
    const tm=+(du&&du.value)?chipSel(q1(sc,'[data-ae="tmode"]'),'',()=>false,(v,t)=>t.replace(/\s*\(.*\)\s*$/,'')):null;
    const ef=chipSel(q1(sc,'[data-ae="effort"]'),'',v=>!v,(v,t)=>v?t:'📦 크기 자동');
    const mo=chipSel(q1(sc,'[data-ae="money"]'),'',v=>!v,(v,t)=>v?'₩ '+t:'₩ 금액 안 적음');
    [tp,ar,br,mb,duC,tm,ef,mo].filter(Boolean).forEach(n=>row.appendChild(n));
    if(idr)idr.replaceWith(row);else sc.querySelector('.sh').after(row);
    if(dMore)dMore.remove();
    // ② 점수 칸
    const trio=q1(sc,'.ae94sc');
    if(trio){trio.classList.add('sc95');
      trio.querySelectorAll('label.s94').forEach(lb=>{const t=lb.firstChild;if(t&&t.nodeType===3)t.nodeValue=t.nodeValue.replace(/\s*\+\s*$/,'').replace(/\s*−\s*$/,' −')});
      const pr=q1(sc,'.ae94pre'),inf=q1(sc,'details.ae94i');
      if(pr){const t=pr.firstChild;if(t&&t.nodeType===3&&/빠르게/.test(t.nodeValue))t.nodeValue='';
        const s=[...pr.children].find(c=>!c.matches('button')&&/빠르게/.test(c.textContent));if(s)s.textContent='채우기';pr.classList.add('pre95');
        if(inf){inf.classList.add('i95');inf.querySelector('summary').textContent='ⓘ';pr.appendChild(inf)}}}
    // ③ 아래 칸들 = 칩 한 줄 + 하나만 펼침
    const ds=[...sc.querySelectorAll(':scope > details.ae94d')];
    if(ds.length){
      const tabs=document.createElement('div');tabs.className='t95';tabs.setAttribute('role','tablist');
      const box=document.createElement('div');box.className='p95';
      ds.forEach(d=>{const k=d.dataset.k94,s=d.querySelector(':scope > summary');
        const b=document.createElement('button');b.type='button';b.className='chipbtn';b.dataset.t95=k;b.innerHTML=s.innerHTML;
        b.setAttribute('aria-pressed',O95.k===k?'true':'false');tabs.appendChild(b);
        const body=d.querySelector(':scope > .ae94b');body.dataset.p95=k;body.hidden=O95.k!==k;box.appendChild(body)});
      ds[0].before(tabs);tabs.after(box);ds.forEach(d=>d.remove())}
    sc.classList.add('ae95');
  }
  openActionEditor=(function(prev){return function(id){const r=prev.apply(this,arguments);try{ae95(id)}catch(e){console.error(e)}return r}})(openActionEditor);
  document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#sheetC [data-t95]');if(!b)return;
    const k=b.dataset.t95;O95.k=O95.k===k?null:k;const sc=$('sheetC');
    sc.querySelectorAll('[data-t95]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.t95===O95.k?'true':'false'));
    sc.querySelectorAll('[data-p95]').forEach(x=>x.hidden=x.dataset.p95!==O95.k);
    const open=O95.k&&sc.querySelector(`[data-p95="${O95.k}"]`);if(open)setTimeout(()=>{try{open.scrollIntoView({block:'nearest',behavior:'smooth'})}catch(x){}},30)});
  // 칩 select는 고르는 즉시 기본값 흐림 표시 갱신(창이 다시 그려지지 않는 칸 대비)
  document.addEventListener('change',e=>{const t=e.target;if(t&&t.matches&&t.matches('#sheetC .r95 select.c95')&&!t.classList.contains('k95'))t.classList.toggle('def95',!t.value);
    if(t&&t.matches&&t.matches('#sheetC .du95 input'))t.parentElement.classList.toggle('def95',!+t.value)},true);
}
