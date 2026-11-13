/* ---- v9.0 미니멀 2: 홈 '나' 카드(아바타·기분·영역 막대·아침 에너지)를 전투 카드에 합침 ---- */
{
  const IDS90=['heroAv','moodName','dayLabel','areaBars','energy','equipped'];
  const PH90={};
  // 원래 자리에 표지(주석)를 남겨 두고 노드를 옮김 → 합치기를 끄면 그대로 되돌릴 수 있음
  const ph90=id=>{const n=$(id);if(!n)return null;if(!PH90[id]){const c=document.createComment('p90-'+id);n.before(c);PH90[id]=c}return PH90[id]};
  const back90=()=>{IDS90.forEach(id=>{const p=PH90[id],n=$(id);if(p&&n&&p.nextSibling!==n)p.after(n)})};
  const hp90=t=>{try{return Math.max(1,Math.round(taskBase(t).xp||0))}catch(e){return 1}};
  function merge90(box){
    const day=today(),ov=overallOf(day),L=levelOf(P.xp);
    const me=box.querySelector('.hero2'),ar=box.querySelector('.arena2');
    if(!me||!ar)return;
    me.className='hero2 me90';me.innerHTML='';
    me.appendChild($('heroAv'));
    const info=document.createElement('div');info.className='mi90';
    info.innerHTML=`<div class="mm90"></div><div class="track hp90" role="img" aria-label="HP ${ov}/100"><div class="fill hp ${ov<35?'low':''}" style="width:${ov}%"></div></div><div class="tiny num ml90"><span>HP ${ov}</span><span>💰${P.gold.toLocaleString()}</span><span>Lv.${L.lv}</span></div>`;
    info.querySelector('.mm90').appendChild($('moodName'));
    info.querySelector('.ml90').appendChild($('equipped'));
    me.appendChild(info);
    const ft=document.createElement('div');ft.className='ft90';
    ft.appendChild($('areaBars'));ft.appendChild($('energy'));
    ar.after(ft);
    const row=box.parentElement.querySelector('.ptitle .row');
    if(row&&$('dayLabel')&&$('dayLabel').parentElement!==row)row.prepend($('dayLabel'));
    // 쫄따구 HP = 그 할 일을 끝냈을 때 보스에게 가는 XP
    const ms=[...box.querySelectorAll('.mini[data-ctask]:not(.dead)')];
    const xs=ms.map(m=>TASKS[m.dataset.ctask]?hp90(TASKS[m.dataset.ctask]):0),mx=Math.max(1,...xs);
    ms.forEach((m,i)=>{if(!xs[i]||m.querySelector('.mh90'))return;
      const b=document.createElement('i');b.className='mh90';b.style.width=Math.max(18,Math.round(xs[i]/mx*100))+'%';m.appendChild(b);
      m.title=(m.title||'')+' · HP '+xs[i]});
  }
  const _rb=renderBattle;
  renderBattle=function(){
    const box=$('battleBox'),hb=box&&box.closest('.hblock');
    IDS90.forEach(ph90);
    if(!box||!hb||hb.hidden){document.body.classList.remove('m90');back90();return _rb.apply(this,arguments)}
    back90(); // 다시 그리기 전에 노드를 창고로(박스를 비우면 같이 사라지므로)
    const r=_rb.apply(this,arguments);
    try{merge90(box);document.body.classList.add('m90')}catch(e){console.error(e);document.body.classList.remove('m90');back90()}
    return r;
  };
}
