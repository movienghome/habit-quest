// 가짜 Firestore (테스트용): doc/collection/where/orderBy/limit/onSnapshot · v6.9: 진짜처럼 '배열 속 배열'·빈 칸 이름 거절, enc/dec, merge(트랜잭션)
// 두 기기 시험: window.__relay = (path, data|null) => {}  (쓸 때마다 불림) · window.__remote(path, data|null) 로 다른 기기 쓰기를 받음
(function(){
  const store=new Map();const subs=new Set();
  const clone=o=>o==null?o:JSON.parse(JSON.stringify(o));
  window.__store=store;
  const enc=v=>{if(Array.isArray(v))return v.map(x=>Array.isArray(x)?{_na:enc(x)}:enc(x));if(v&&typeof v==='object'){const o={};for(const k in v){const x=v[k];if(x===undefined||typeof x==='function')continue;o[k===''?'_e0_':(/^__.*__$/.test(k)?'_x'+k:k)]=enc(x)}return o}if(typeof v==='number'&&!isFinite(v))return null;return v};
  const dec=v=>{if(Array.isArray(v))return v.map(dec);if(v&&typeof v==='object'){const ks=Object.keys(v);if(ks.length===1&&ks[0]==='_na'&&Array.isArray(v._na))return dec(v._na);const o={};for(const k of ks)o[k==='_e0_'?'':(/^_x__.*__$/.test(k)?k.slice(2):k)]=dec(v[k]);return o}return v};
  // Firestore처럼 검사 (어기면 바로 throw)
  function check(v,inArr,path){
    if(Array.isArray(v)){if(inArr)throw Object.assign(new Error('Nested arrays are not supported ('+path+')'),{code:'invalid-argument'});v.forEach(x=>check(x,true,path));return}
    if(v&&typeof v==='object'){for(const k in v){if(k==='')throw Object.assign(new Error('Document fields must not be empty ('+path+')'),{code:'invalid-argument'});if(v[k]===undefined)throw Object.assign(new Error('Unsupported field value: undefined'),{code:'invalid-argument'});check(v[k],false,path)}}
  }
  window.__writes=[];
  function put(path,d,silent){if(d==null)store.delete(path);else store.set(path,clone(d));if(!silent){window.__writes.push(path);if(window.__relay)try{window.__relay(path,d==null?null:clone(d))}catch(e){}}setTimeout(notify,5)}
  window.__remote=(path,d)=>put(path,d,true);
  function notify(){for(const f of [...subs])try{f()}catch(e){console.error(e)}}
  const snapOf=path=>({id:path.split('/').pop(),exists:store.has(path),data:()=>store.has(path)?dec(clone(store.get(path))):undefined,metadata:{}});
  function docApi(path){return{path,id:path.split('/').pop(),
    set:async d=>{const x=enc(d);check(x,false,path);put(path,x)},
    update:async d=>{const x={...(store.get(path)||{}),...enc(d)};check(x,false,path);put(path,x)},
    delete:async()=>{put(path,null)},
    merge:async fn=>{if(window.__offline)throw Object.assign(new Error('offline'),{code:'unavailable'});const cur=store.has(path)?dec(clone(store.get(path))):null;const next=fn(cur);if(next===undefined)return{skip:1,cur};const x=enc(clone(next));check(x,false,path);put(path,x);return{data:next}},
    get:async()=>snapOf(path),
    onSnapshot:(next)=>{let last;const f=()=>{const s=snapOf(path),k=JSON.stringify(store.get(path)??null);if(k===last)return;last=k;next(s)};subs.add(f);setTimeout(f,10);return()=>subs.delete(f)},
    collection:c=>colApi(path+'/'+c)}}
  function colApi(path,cons=[]){
    const run=()=>{let docs=[...store.entries()].filter(([k])=>k.startsWith(path+'/')&&!k.slice(path.length+1).includes('/')).map(([k,v])=>({id:k.split('/').pop(),v:dec(clone(v))}));
      for(const c of cons){if(c[0]==='where'){const[_,f,op,val]=c;docs=docs.filter(d=>{const x=d.v[f];if(x===undefined)return false;return op==='=='?x===val:op==='>='?x>=val:op==='<='?x<=val:true})}
        if(c[0]==='orderBy'){const[_,f,dir]=c;docs.sort((a,b)=>(a.v[f]>b.v[f]?1:-1)*(dir==='desc'?-1:1))}if(c[0]==='limit')docs=docs.slice(0,c[1])}
      return{docs:docs.map(d=>({id:d.id,exists:true,data:()=>clone(d.v)})),size:docs.length,empty:!docs.length,metadata:{}}};
    return{path,doc:id=>docApi(path+'/'+id),where:(f,op,v)=>colApi(path,[...cons,['where',f,op,v]]),orderBy:(f,d)=>colApi(path,[...cons,['orderBy',f,d]]),limit:n=>colApi(path,[...cons,['limit',n]]),
      get:async()=>run(),onSnapshot:(next)=>{let last;const f=()=>{const r=run(),k=JSON.stringify(r.docs.map(d=>[d.id,d.data()]));if(k===last)return;last=k;next(r)};const st=window.__staleT;if(st&&path.endsWith('/tasks')&&!st.done){setTimeout(()=>{const r=run();r.docs=r.docs.filter(d=>!st.hide.includes(d.id));r.metadata={fromCache:true};next(r)},12);setTimeout(()=>{subs.add(f);f()},st.ms||600);return()=>subs.delete(f)}subs.add(f);setTimeout(f,15);return()=>subs.delete(f)}}}
  window.__mockApi={db:{doc:p=>docApi('u/'+p),collection:p=>colApi('u/'+p)},account:{email:'test@example.com'},
    exportAll:async()=>({}),importAll:async()=>{},putTasks:async ts=>{ts.forEach(t=>put('u/tasks/'+t.id,enc(clone(t))))},logout:async()=>{}};
  window.__seed=(o)=>{for(const k in o)store.set('u/'+k,enc(clone(o[k])))};
})();
