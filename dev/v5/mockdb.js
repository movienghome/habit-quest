// 가짜 Firestore (테스트용): doc/collection/where/orderBy/limit/onSnapshot
(function(){
  const store=new Map();const subs=new Set();
  const clone=o=>o==null?o:JSON.parse(JSON.stringify(o));
  window.__store=store;
  function notify(){for(const f of [...subs])try{f()}catch(e){console.error(e)}}
  function docApi(path){return{path,id:path.split('/').pop(),
    set:async d=>{store.set(path,clone(d));setTimeout(notify,5)},
    update:async d=>{store.set(path,{...(store.get(path)||{}),...clone(d)});setTimeout(notify,5)},
    delete:async()=>{store.delete(path);setTimeout(notify,5)},
    get:async()=>({id:path.split('/').pop(),exists:store.has(path),data:()=>clone(store.get(path))}),
    onSnapshot:(next)=>{const f=()=>next({id:path.split('/').pop(),exists:store.has(path),data:()=>clone(store.get(path))});subs.add(f);setTimeout(f,10);return()=>subs.delete(f)},
    collection:c=>colApi(path+'/'+c)}}
  function colApi(path,cons=[]){
    const run=()=>{let docs=[...store.entries()].filter(([k])=>k.startsWith(path+'/')&&!k.slice(path.length+1).includes('/')).map(([k,v])=>({id:k.split('/').pop(),v}));
      for(const c of cons){if(c[0]==='where'){const[_,f,op,val]=c;docs=docs.filter(d=>{const x=d.v[f];if(x===undefined)return false;return op==='=='?x===val:op==='>='?x>=val:op==='<='?x<=val:true})}
        if(c[0]==='orderBy'){const[_,f,dir]=c;docs.sort((a,b)=>(a.v[f]>b.v[f]?1:-1)*(dir==='desc'?-1:1))}if(c[0]==='limit')docs=docs.slice(0,c[1])}
      return{docs:docs.map(d=>({id:d.id,exists:true,data:()=>clone(d.v)})),size:docs.length,empty:!docs.length,metadata:{}}};
    return{path,doc:id=>docApi(path+'/'+id),where:(f,op,v)=>colApi(path,[...cons,['where',f,op,v]]),orderBy:(f,d)=>colApi(path,[...cons,['orderBy',f,d]]),limit:n=>colApi(path,[...cons,['limit',n]]),
      get:async()=>run(),onSnapshot:(next)=>{const f=()=>next(run());const st=window.__staleT;if(st&&path.endsWith('/tasks')&&!st.done){setTimeout(()=>{const r=run();r.docs=r.docs.filter(d=>!st.hide.includes(d.id));r.metadata={fromCache:true};next(r)},12);setTimeout(()=>{subs.add(f);f()},st.ms||600);return()=>subs.delete(f)}subs.add(f);setTimeout(f,15);return()=>subs.delete(f)}}}
  window.__mockApi={db:{doc:p=>docApi('u/'+p),collection:p=>colApi('u/'+p)},account:{email:'test@example.com'},
    exportAll:async()=>({}),importAll:async()=>{},putTasks:async ts=>{ts.forEach(t=>store.set('u/tasks/'+t.id,clone(t)));setTimeout(notify,5)},logout:async()=>{}};
  window.__seed=(o)=>{for(const k in o)store.set('u/'+k,clone(o[k]))};
})();
