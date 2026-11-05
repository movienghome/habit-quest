/* ================= v5: 할 일 · 반복 · 빠른 추가 ================= */
let TASKS={};
const tSets={open:new Set(),recent:new Set()};
const tDirty=new Set();
let tasksReady=false;
const EFFORTS=[['quick','⚡ 퀵','10분 안'],['mid','🕓 보통','30분쯤'],['heavy','🧱 무거움','1시간 넘게']];
const PRIOS=[[0,'없음',''],[1,'낮음','!'],[3,'중간','!!'],[5,'높음','!!!']];
const pmark=p=>p?`<span class="pmark p${p}" aria-label="중요도 ${PRIOS.find(x=>x[0]===p)?.[1]||''}">${PRIOS.find(x=>x[0]===p)?.[2]||''}</span>`:'';
const gtx=n=>{n=Math.round(+n||0);return (n>0?'+':n<0?'−':'')+'🪙'+Math.abs(n)};
const hm=m=>pad(Math.floor(((m%1440)+1440)%1440/60))+':'+pad(((m%60)+60)%60);
const toMin=s=>{if(!s)return null;const[h,m]=String(s).split(':').map(Number);return h*60+(m||0)};
const durTxt=m=>!m?'':m<60?m+'분':(m%60?Math.floor(m/60)+'시간 '+(m%60)+'분':m/60+'시간');
function nowHour(){const d=new Date();let h=d.getHours()+d.getMinutes()/60;if(h<(C.dayStart||0))h+=24;return h}
function listOfTask(t){return C.lists.find(l=>l.id===t.list)||null}
function listName(id){const l=C.lists.find(x=>x.id===id);return l?l.name:'받은함'}
function areaOfTask(t){const a=t.aid&&C.actions.find(x=>x.id===t.aid);return t.area||tagArea(t)||(a&&a.area)||null}
function effortOf(t){
  if(t.effort)return t.effort;
  const tg=(t.tags||[]).join(' ');
  if(/퀵|quick/i.test(tg))return 'quick';if(/heavy|무거/i.test(tg))return 'heavy';if(/30m|30분/i.test(tg))return 'mid';
  if(t.dur)return t.dur<=10?'quick':t.dur<=45?'mid':'heavy';
  return 'mid';
}
function taskBase(t){
  if(t.aid){const a=C.actions.find(x=>x.id===t.aid);if(a&&a.type==='good'){const v=pickVariant(a);return{xp:+((v&&v.xp!=null&&v.xp!=='')?v.xp:a.xp)||0,gold:Math.abs(+a.gold||0),cond:Math.abs(+a.cond||0)}}}
  if(t.rid){const r=(C.routines||[]).find(x=>x.id===t.rid);if(r)return{xp:+r.xp||0,gold:+r.gold||0,cond:4}}
  if(t.brave){const s=C.courageSizes.find(x=>x.id===({quick:'s',mid:'m',heavy:'l'})[effortOf(t)])||C.courageSizes[0];return{xp:+s.xp||0,gold:+s.gold||0,cond:4,brave:s}}
  const X=C.taskXP||{};const ef=effortOf(t);const xp=(+X[ef]||10)+(+((X.prio||{})[t.prio||0])||0);
  return{xp,gold:Math.max(1,Math.round(xp/3)),cond:ef==='quick'?2:ef==='heavy'?6:4};
}
/* ---- 반복 규칙 ---- */
// rep={f:'d'|'w'|'m'|'y'|'x', i:1, wd:[0..6], md:[1..31], nth:[n,wd], after:1(완료한 날 기준), n:주N회, until:'YYYY-MM-DD'}
const WDK=['일','월','화','수','목','금','토'];
function dowOf(k){return new Date(toUTC(k)).getUTCDay()}
function daysInMonth(y,m){return new Date(Date.UTC(y,m,0)).getUTCDate()}
function ymd(y,m,d){return y+'-'+pad(m)+'-'+pad(d)}
function nthWd(y,m,n,wd){ // n: 1~4, -1=마지막
  if(n>0){const first=new Date(Date.UTC(y,m-1,1)).getUTCDay();const d=1+((wd-first+7)%7)+(n-1)*7;return d<=daysInMonth(y,m)?d:null}
  const dim=daysInMonth(y,m),last=new Date(Date.UTC(y,m-1,dim)).getUTCDay();return dim-((last-wd+7)%7);
}
function nextDue(rep,from){
  if(!rep||!rep.f)return null;
  const i=Math.max(1,+rep.i||1);let k=from;
  const ok=x=>!rep.until||x<=rep.until;
  if(rep.f==='d'){const r=addDays(from,i);return ok(r)?r:null}
  if(rep.f==='x'){const ws=weekStart(from);return addDays(ws,13)}
  if(rep.f==='w'){
    const wd=(rep.wd&&rep.wd.length)?rep.wd:[dowOf(from)];
    const ws0=weekStart(from);
    for(let s=1;s<=7*i*2+7;s++){const c=addDays(from,s);const wk=Math.round(diffDays(weekStart(c),ws0)/7);if(wk%i!==0)continue;if(wd.includes(dowOf(c)))return ok(c)?c:null}
    return null;
  }
  if(rep.f==='m'){
    const [y,m,d]=from.split('-').map(Number);
    for(let s=0;s<=24;s++){
      const mm0=m-1+s;const yy=y+Math.floor(mm0/12),mm=mm0%12+1;
      if(s>0&&(s%i)!==0)continue;
      let cands=[];
      if(rep.nth&&rep.nth.length===2){const dd=nthWd(yy,mm,+rep.nth[0],+rep.nth[1]);if(dd)cands=[dd]}
      else{const mds=(rep.md&&rep.md.length)?rep.md:[d];cands=mds.map(x=>x===-1?daysInMonth(yy,mm):Math.min(+x,daysInMonth(yy,mm)))}
      cands.sort((a,b)=>a-b);for(const dd of cands){const c=ymd(yy,mm,dd);if(c>from)return ok(c)?c:null}
    }
    return null;
  }
  if(rep.f==='y'){const [y,m,d]=from.split('-').map(Number);const c=ymd(y+i,m,Math.min(d,daysInMonth(y+i,m)));return ok(c)?c:null}
  return null;
}
function firstDue(rep,from){ // 오늘 포함 첫 날
  if(!rep||!rep.f||rep.f==='d'||rep.f==='y')return from;
  if(rep.f==='x')return addDays(weekStart(from),6);
  const y=addDays(from,-1);const r={...rep,i:1};return nextDue(r,y)||from;
}
function repLabel(rep){
  if(!rep||!rep.f)return '';
  const i=Math.max(1,+rep.i||1),aft=rep.after?' (완료 후)':'';
  if(rep.f==='d')return (i===1?'매일':i+'일마다')+aft;
  if(rep.f==='x')return `주 ${rep.n||3}회`;
  if(rep.f==='w'){const wd=(rep.wd||[]).slice().sort((a,b)=>((a+6)%7)-((b+6)%7));const s=wd.join(',');
    const nm=s==='1,2,3,4,5'?'평일':s==='6,0'||s==='0,6'?'주말':wd.length===7?'매일':wd.map(x=>WDK[x]).join('·');
    return (i===1?'매주':i===2?'격주':i+'주마다')+(wd.length?' '+nm:'')+aft}
  if(rep.f==='m'){if(rep.nth&&rep.nth.length===2)return (i===1?'매월':i+'개월마다')+` ${rep.nth[0]===-1?'마지막':rep.nth[0]+'째'} ${WDK[rep.nth[1]]}요일`+aft;
    return (i===1?'매월':i+'개월마다')+((rep.md&&rep.md.length)?' '+rep.md.map(x=>x===-1?'말일':x+'일').join('·'):'')+aft}
  if(rep.f==='y')return (i===1?'매년':i+'년마다')+aft;
  return '';
}
function parseRRule(s){
  if(!s)return null;const o={};String(s).split(';').forEach(p=>{const[k,v]=p.split('=');o[k]=v});
  const map={DAILY:'d',WEEKLY:'w',MONTHLY:'m',YEARLY:'y'};const f=map[o.FREQ];if(!f)return null;
  const rep={f,i:+o.INTERVAL||1};
  const DM={SU:0,MO:1,TU:2,WE:3,TH:4,FR:5,SA:6};
  if(o.BYDAY){const ds=o.BYDAY.split(',');const nth=ds[0].match(/^(-?\d)([A-Z]{2})$/);
    if(nth&&f==='m')rep.nth=[+nth[1],DM[nth[2]]];else rep.wd=ds.map(x=>DM[x.slice(-2)]).filter(x=>x!=null)}
  if(o.BYMONTHDAY)rep.md=o.BYMONTHDAY.split(',').map(Number);
  if(o.UNTIL)rep.until=o.UNTIL.slice(0,4)+'-'+o.UNTIL.slice(4,6)+'-'+o.UNTIL.slice(6,8);
  return rep;
}
/* ---- 자연어 빠른 추가 ---- */
const WDNAME={'일':0,'월':1,'화':2,'수':3,'목':4,'금':5,'토':6};
function parseQuick(raw,{baseDate}={}){
  let s=' '+raw+' ';const out={tags:[]};const today0=baseDate||dateKey();
  const cut=re=>{const m=s.match(re);if(m){s=s.replace(m[0],' ');return m}return null};
  let m;
  // 태그·중요도·목록·용기
  s=s.replace(/(^|\s)#([^\s#]+)/g,(_,a,b)=>{out.tags.push(b);return ' '});
  if(m=cut(/(^|\s)!(높음|중간|낮음|1|2|3)(?=\s)/)){out.prio={'높음':5,'3':5,'중간':3,'2':3,'낮음':1,'1':1}[m[2]]}
  else if(m=cut(/(^|\s)(!{1,3})(?=\s)/)){out.prio=[0,1,3,5][m[2].length]}
  if(m=cut(/(^|\s)[\^~]([^\s]+)/)){const q=m[2].toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');const l=C.lists.find(x=>x.name.toLowerCase().replace(/[^\p{L}\p{N}]/gu,'').includes(q));if(l)out.list=l.id;else out.listName=m[2]}
  if(cut(/(^|\s)⚡\s*/)||out.tags.includes('용기')){out.brave=1;out.tags=out.tags.filter(x=>x!=='용기')}
  // 반복
  if(m=cut(/(^|\s)주\s?(\d)\s?(회|번)(?=\s)/))out.rep={f:'x',n:+m[2],i:1};
  else if(m=cut(/(^|\s)(매일|날마다)(?=\s)/))out.rep={f:'d',i:1};
  else if(m=cut(/(^|\s)(\d+)일\s?마다(?=\s)/))out.rep={f:'d',i:+m[2],after:1};
  else if(m=cut(/(^|\s)평일(마다)?(?=\s)/))out.rep={f:'w',i:1,wd:[1,2,3,4,5]};
  else if(m=cut(/(^|\s)(매\s?주말|주말마다)(?=\s)/))out.rep={f:'w',i:1,wd:[6,0]};
  else if(m=cut(/(^|\s)(매주|격주)\s?((?:[월화수목금토일](?:요일)?[,·\s]?)+)?(?=\s)/)){const wd=m[3]?[...m[3].replace(/요일/g,'').matchAll(/[월화수목금토일]/g)].map(x=>WDNAME[x[0]]):[];out.rep={f:'w',i:m[2]==='격주'?2:1,wd}}
  else if(m=cut(/(^|\s)(매월|매달)\s?(\d{1,2}일|말일)?(?=\s)/)){out.rep={f:'m',i:1};if(m[3])out.rep.md=[m[3]==='말일'?-1:parseInt(m[3])]}
  else if(m=cut(/(^|\s)매년(?=\s)/))out.rep={f:'y',i:1};
  // 날짜
  let due=null;
  if(m=cut(/(^|\s)(오늘|내일|모레|글피)(?=\s|$)/))due=addDays(today0,{'오늘':0,'내일':1,'모레':2,'글피':3}[m[2]]);
  else if(m=cut(/(^|\s)(\d+)\s?일\s?(뒤|후)(?=\s)/))due=addDays(today0,+m[2]);
  else if(m=cut(/(^|\s)(이번\s?주|다음\s?주|담주)?\s?([월화수목금토일])요일(?=\s)/)){
    const wd=WDNAME[m[3]],ws=weekStart(today0),off=(wd+6)%7;
    if(m[2]&&/다음|담/.test(m[2]))due=addDays(ws,7+off);else if(m[2])due=addDays(ws,off);
    else{due=addDays(ws,off);if(due<today0)due=addDays(due,7)}}
  else if(m=cut(/(^|\s)(다음\s?주|담주)(?=\s)/))due=addDays(weekStart(today0),7);
  else if(m=cut(/(^|\s)(이번\s?)?주말(?=\s)/)){due=addDays(weekStart(today0),5);if(due<today0)due=addDays(due,7)}
  else if(m=cut(/(^|\s)(\d{1,2})\s?월\s?(\d{1,2})\s?일(?=\s)/)||cut(/(^|\s)(\d{1,2})\/(\d{1,2})(?=\s)/)){
    let y=+today0.slice(0,4);let c=ymd(y,+m[2],+m[3]);if(c<today0)c=ymd(y+1,+m[2],+m[3]);due=c}
  else if(m=cut(/(^|\s)(\d{1,2})일(?=\s)/)){const[y,mo]=today0.split('-').map(Number);let c=ymd(y,mo,+m[2]);if(c<today0){const n=mo===12?[y+1,1]:[y,mo+1];c=ymd(n[0],n[1],+m[2])}due=c}
  // 시간
  let time=null;
  if(m=cut(/(^|\s)(오전|오후|아침|낮|저녁|밤|새벽)?\s?(\d{1,2})\s?시\s?(반|(\d{1,2})\s?분)?(?=\s|$)/)){
    let h=+m[3];const mi=m[4]==='반'?30:(m[5]?+m[5]:0);const ap=m[2]||'';
    if(/오후|저녁|밤/.test(ap)&&h<12)h+=12;else if(/낮/.test(ap)&&h<7)h+=12;else if(!ap&&h>=1&&h<=7)h+=12;else if(/오전|새벽|아침/.test(ap)&&h===12)h=0;
    time=pad(h%24)+':'+pad(mi)}
  else if(m=cut(/(^|\s)(\d{1,2}):(\d{2})(?=\s)/))time=pad(+m[2])+':'+m[3];
  // 걸리는 시간
  if(m=cut(/(^|\s)(\d+)\s?시간\s?(\d+)\s?분(동안)?(?=\s)/))out.dur=+m[2]*60+(+m[3]);
  else if(m=cut(/(^|\s)(\d+(?:\.\d)?)\s?시간(동안)?(?=\s)/))out.dur=Math.round(+m[2]*60);
  else if(m=cut(/(^|\s)(\d+)\s?분(동안)?(?=\s)/))out.dur=+m[2];
  if(due)out.due=due;if(time){out.time=time;if(!out.due)out.due=today0}
  if(out.rep&&!out.due)out.due=firstDue(out.rep,today0);
  if(out.rep&&out.rep.f==='x')out.due=addDays(weekStart(out.due||today0),6);
  out.title=s.replace(/\s+/g,' ').trim();
  return out;
}
function parseChips(p){
  const c=[];
  if(p.due)c.push('📅 '+dueLabel(p.due)+(p.time?' '+p.time:''));
  if(p.dur)c.push('⏱ '+durTxt(p.dur));
  if(p.rep)c.push('🔁 '+repLabel(p.rep));
  if(p.prio)c.push(PRIOS.find(x=>x[0]===p.prio)[2]+' '+PRIOS.find(x=>x[0]===p.prio)[1]);
  if(p.list)c.push('📂 '+listName(p.list));else if(p.listName)c.push('📂 새 목록 '+p.listName);
  if(p.brave)c.push('⚡ 용기');
  p.tags.forEach(t=>c.push('#'+t));
  return c.map(x=>`<span>${esc(x)}</span>`).join('');
}
function dueLabel(k){
  if(!k)return '';const d=diffDays(k,dateKey());
  if(d===0)return '오늘';if(d===1)return '내일';if(d===2)return '모레';if(d===-1)return '어제';
  if(d<0)return `${-d}일 지남`;
  if(d<7)return wdOf(k)+'요일';
  return fmtD(k)+' ('+wdOf(k)+')';
}
/* ---- 저장 ---- */
function saveTask(t){if(!t)return;TASKS[t.id]=t;tDirty.add(t.id);save('t:'+t.id)}
function deleteTask(id){delete TASKS[id];tSets.open.delete(id);tSets.recent.delete(id);
  if(mode==='db'&&db){db.doc('tasks/'+id).delete().catch(()=>{})}else save('local')}
function newTask(p){
  const t={id:'t'+uid()+uid().slice(0,3),title:p.title||'새 할 일',note:p.note||'',list:p.list||'inbox',tags:p.tags||[],prio:p.prio||0,due:p.due||null,time:p.time||null,dur:p.dur||null,rep:p.rep||null,status:0,created:dateKey(),order:Date.now(),subs:p.subs||[]};
  ['aid','rid','brave','area','effort','reframe','sec','ttid','hist','marble','deadline','checks'].forEach(k=>{if(p[k]!=null&&p[k]!=='')t[k]=p[k]});
  return t;
}
function addTaskFrom(raw,{list,due}={}){
  const p=parseQuick(raw);if(!p.title){toast('할 일 이름을 적어주세요');return null}
  if(p.listName&&!p.list){const l={id:'l'+uid(),name:p.listName,area:'life',folder:''};C.lists.push(l);save('config');p.list=l.id}
  if(!p.list)p.list=list||'inbox';if(!p.due&&due)p.due=due;
  const a=C.actions.find(x=>x.name===p.title&&x.type==='good');if(a)p.aid=a.id;
  const t=newTask(p);saveTask(t);render();
  toast(`'${t.title}' 추가${t.due?' · '+dueLabel(t.due)+(t.time?' '+t.time:''):''}${t.rep?' · '+repLabel(t.rep):''}`);
  return t;
}
function openTasks(){return Object.values(TASKS).filter(t=>t.status===0)}
