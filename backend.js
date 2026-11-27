// v6.9 · Firebase backend for 해비티카틱 (본 앱·베타 같은 파일, 경로로 구분) (포켓 노트·어항 일지와 같은 Firebase 프로젝트, 기록은 자기 폴더에): 로그인, Firestore 저장(오프라인에서도 동작).
const V = '10.12.2';
const base = `https://www.gstatic.com/firebasejs/${V}/`;
const $ = s => document.querySelector(s);
const gate = $('#gate');
const cfg = window.POCKET_FIREBASE;
const BETA = location.pathname.includes('/beta/');
const NS = BETA ? 'habit-beta' : 'habit';

if (!cfg || !cfg.apiKey) {
  gate.hidden = false; $('#login').hidden = true; $('#nocfg').hidden = false;
} else {
  start().catch(e => { console.error(e); gate.hidden = false; $('#gerr').textContent = '불러오지 못했습니다. 인터넷 연결을 확인하고 새로고침하세요.'; });
}

async function start() {
  const [{ initializeApp }, A, F] = await Promise.all([
    import(base + 'firebase-app.js'), import(base + 'firebase-auth.js'), import(base + 'firebase-firestore.js')]);
  const app = initializeApp(cfg);
  const auth = A.getAuth(app);
  let fs;
  try { fs = F.initializeFirestore(app, { localCache: F.persistentLocalCache({ tabManager: F.persistentMultipleTabManager() }) }); }
  catch (e) { fs = F.getFirestore(app); }

  /* ---------- v13.15: 숨은 탭은 10분 뒤 서버 연결을 끊어 둠 ----------
     Firebase는 30분 넘게 끊겼다 다시 이어진 실시간 연결을 '처음부터 전부 다시 읽기'로 세어요(기록 400일·할 일 60일치 ≈ 수천 건).
     사물함에 넣어 둔 노트북이 절전·업데이트로 깨어날 때마다 이게 반복돼 하루 읽기 한도(5만)를 새벽에 다 썼어요(11/15·11/26 '저장 안 됨').
     숨은 지 10분이 지나면 연결을 끊고, 화면이 다시 보일 때 이어 붙여요. 아직 안 올린 저장이 있으면 끊지 않고 기다려요. */
  let hideT = null, netOff = false;
  /* v13.20b: 이 기기가 언제 얼마나 읽었나 — 진단 복사용(앱 동작은 안 바꿈). 시간별 읽은 수 hq-rhour(48시간), 연결 사건 hq-rlog(최근 80개). */
  function hh(t) { const d = new Date(t || Date.now()); return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
  function rlog(msg) { try { const L = JSON.parse(localStorage.getItem('hq-rlog') || '[]'); L.push(hh() + ' ' + (NS === 'habit' ? '' : 'β ') + msg + (document.hidden ? ' (숨김)' : '')); localStorage.setItem('hq-rlog', JSON.stringify(L.slice(-80))); } catch (e) {} }
  function rhour(n) { try { const d = new Date(Date.now()), k = (d.getMonth() + 1) + '/' + d.getDate() + ' ' + String(d.getHours()).padStart(2, '0') + '시'; const H = JSON.parse(localStorage.getItem('hq-rhour') || '{}'); H[k] = (H[k] || 0) + n;
    const ks = Object.keys(H); if (ks.length > 48) for (const x of ks.slice(0, ks.length - 48)) delete H[x]; localStorage.setItem('hq-rhour', JSON.stringify(H)); } catch (e) {} }
  window.__hqRlog = () => { try { return { log: JSON.parse(localStorage.getItem('hq-rlog') || '[]'), hour: JSON.parse(localStorage.getItem('hq-rhour') || '{}') }; } catch (e) { return { log: [], hour: {} }; } };
  const goOff = () => {
    hideT = null; if (netOff || !document.hidden) return;
    if ((window.__hqBusy && window.__hqBusy()) || window.HQ_PENDING) { hideT = setTimeout(goOff, 30000); return; }
    netOff = true; rlog('숨긴 지 10분 · 연결 끊음'); F.disableNetwork(fs).catch(() => {});
  };
  const goOn = () => { clearTimeout(hideT); hideT = null; if (netOff) { netOff = false; rlog('화면 보임 · 연결 다시'); F.enableNetwork(fs).catch(() => {}); } };
  document.addEventListener('visibilitychange', () => { if (document.hidden) { clearTimeout(hideT); hideT = setTimeout(goOff, 10 * 60 * 1000); } else goOn(); });
  addEventListener('pageshow', goOn); addEventListener('online', () => { if (!document.hidden) goOn(); });

  /* ---------- 로그인 화면 ---------- */
  let signup = false;
  const msg = $('#gmsg'), err = $('#gerr'), sub = $('#gsubmit'), mode = $('#gmode');
  const KO = {
    'auth/invalid-credential': '이메일이나 비밀번호가 맞지 않습니다.', 'auth/wrong-password': '비밀번호가 맞지 않습니다.',
    'auth/user-not-found': '이 이메일로 만든 계정이 없습니다.', 'auth/email-already-in-use': '이미 계정이 있는 이메일입니다. 로그인하세요.',
    'auth/weak-password': '비밀번호는 6자 이상이어야 합니다.', 'auth/invalid-email': '이메일 형식이 맞지 않습니다.',
    'auth/too-many-requests': '시도가 너무 많습니다. 잠시 뒤 다시 하세요.', 'auth/network-request-failed': '인터넷에 연결되어 있지 않습니다.',
    'auth/operation-not-allowed': 'Firebase 콘솔에서 이메일/비밀번호 로그인이 꺼져 있습니다.', 'auth/admin-restricted-operation': '새 계정 만들기가 꺼져 있습니다.'};
  const say = e => err.textContent = KO[e && e.code] || ('오류: ' + ((e && e.code) || e));
  mode.onclick = () => { signup = !signup; sub.textContent = signup ? '계정 만들기' : '로그인'; mode.textContent = signup ? '이미 계정이 있어요' : '처음이면 계정 만들기';
    msg.textContent = signup ? '이 앱에서 쓸 이메일과 비밀번호를 정하세요.' : '포켓 노트와 같은 이메일·비밀번호로 로그인하세요.'; err.textContent = ''; $('#gpw').autocomplete = signup ? 'new-password' : 'current-password'; };
  $('#greset').onclick = async () => { const em = $('#gemail').value.trim(); if (!em) { err.textContent = '이메일을 먼저 적어 주세요.'; return; }
    try { await A.sendPasswordResetEmail(auth, em); err.textContent = ''; msg.textContent = '비밀번호 재설정 메일을 보냈습니다.'; } catch (e) { say(e); } };
  $('#login').onsubmit = async ev => { ev.preventDefault(); err.textContent = ''; sub.disabled = true;
    const em = $('#gemail').value.trim(), pw = $('#gpw').value;
    try { signup ? await A.createUserWithEmailAndPassword(auth, em, pw) : await A.signInWithEmailAndPassword(auth, em, pw); }
    catch (e) { say(e); } finally { sub.disabled = false; } };

  /* ---------- v6.9: Firestore가 못 받는 모양 바꿔 담기 ----------
     Firestore는 '배열 속 배열'과 빈 이름 칸을 거절해요(설정의 홈 배치 [[id,켜짐,칸]] 같은 것). 그래서 v4.1부터 설정이 서버에 한 번도 못 올라갔어요.
     쓸 때 [[…]] → [{_na:[…]}], '' 칸 → '_e0_' 로 바꾸고, 읽을 때 되돌려요. 이미 바꾼 것을 또 바꿔도 그대로(멱등). */
  const enc = v => {
    if (Array.isArray(v)) return v.map(x => Array.isArray(x) ? { _na: enc(x) } : enc(x));
    if (v && typeof v === 'object') { const o = {}; for (const k in v) { const x = v[k]; if (x === undefined || typeof x === 'function') continue; o[k === '' ? '_e0_' : (/^__.*__$/.test(k) ? '_x' + k : k)] = enc(x); } return o; }
    if (typeof v === 'number' && !isFinite(v)) return null;
    return v;
  };
  const dec = v => {
    if (Array.isArray(v)) return v.map(dec);
    if (v && typeof v === 'object') { const ks = Object.keys(v); if (ks.length === 1 && ks[0] === '_na' && Array.isArray(v._na)) return dec(v._na);
      const o = {}; for (const k of ks) o[k === '_e0_' ? '' : (/^_x__.*__$/.test(k) ? k.slice(2) : k)] = dec(v[k]); return o; }
    return v;
  };
  window.__hqEnc = enc; window.__hqDec = dec;
  /* ---------- 저장소 연결 (아티팩트 db와 같은 모양) ---------- */
  // v13.15: 이 브라우저가 오늘(미국 태평양 날짜 — 무료 한도가 리셋되는 기준) Firestore에서 읽은 문서 수 (본 앱·베타가 같은 값을 더함)
  const rkey = () => 'hq-reads-' + new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(new Date());
  const rcount = n => { if (!(n > 0)) return; rhour(n); try { const k = rkey(); localStorage.setItem(k, String((+localStorage.getItem(k) || 0) + n));
    for (const x of Object.keys(localStorage)) if (x.startsWith('hq-reads-') && x < 'hq-reads-' + new Date(Date.now() - 3 * 864e5).toISOString().slice(0, 10)) localStorage.removeItem(x); } catch (e) {} };
  window.__hqReads = () => { try { return +localStorage.getItem(rkey()) || 0; } catch (e) { return 0; } };
  /* v13.20: 계량기 바로잡기 — 실시간 연결이 30분 넘게 끊겼다(앱을 껐다 켬·탭을 오래 숨김·노트북 잠자기) 다시 이어지면
     Firebase는 '바뀐 것'이 아니라 결과 전부를 읽은 것으로 셈. 예전 계량기는 바뀐 것(docChanges)만 세서 실제의 수십분의 1로 보였어요(11/27 1,027건인데 한도 초과).
     듣는 칸마다 마지막으로 연결돼 있던 시각을 기기에 적어 두고, 다시 이어질 때 그 사이가 30분을 넘으면 결과 전부(size)를 더함. */
  const LIVE = {}, SIZE = {};
  const akey = k => 'hq-alive-' + NS + '-' + k;
  const alive = k => { try { return +localStorage.getItem(akey(k)) || 0; } catch (e) { return 0; } };
  const setAlive = (k, t) => { try { localStorage.setItem(akey(k), String(t || Date.now())); } catch (e) {} };
  let lastTick = Date.now();
  const markAll = t => { for (const k in LIVE) if (LIVE[k]) setAlive(k, t); };
  setInterval(() => { const now = Date.now(), gap = now - lastTick;
    // 기기가 잠들었다 깨어남(타이머가 멈춰 있었음): 그동안 연결도 끊겼으니 잠든 때를 마지막 연결로 적고, 30분 넘었으면 다시 읽기로 셈
    if (gap > 120000) { rlog('잠들었다 깸 ' + Math.round(gap / 60000) + '분' + (gap > 1800000 && !netOff ? ' · 다시 읽기로 셈 ' + Object.keys(LIVE).filter(k => LIVE[k]).reduce((x, k) => x + (SIZE[k] || 0), 0) : '')); for (const k in LIVE) if (LIVE[k]) { setAlive(k, lastTick); if (gap > 1800000 && !netOff) rcount(SIZE[k] || 0); setAlive(k, now); } }
    else if (!netOff && !document.hidden) markAll(now);
    lastTick = now; }, 30000);
  addEventListener('pagehide', () => markAll()); document.addEventListener('visibilitychange', () => { if (document.hidden) markAll(); });
  window.__hqSizes = () => Object.assign({}, SIZE);
  const track = (k, s, size, changed) => { try {
    if (s.metadata && s.metadata.fromCache) { if (LIVE[k]) { LIVE[k] = false; setAlive(k); if (k.startsWith('days')) rlog('연결 끊김'); } return; }
    SIZE[k] = size;
    if (!LIVE[k]) { LIVE[k] = true; const al = alive(k), gap = Date.now() - al; setAlive(k); const n = gap > 1800000 ? size : changed; rcount(n);
      if (n > 20 || k.startsWith('days')) rlog('연결 ' + k + ' ' + (al ? Math.round(gap / 60000) + '분 만' : '처음') + ' · ' + n + '건'); return; }
    rcount(changed); } catch (e) {} };
  const qcount = (s, k) => { try { track(k, s, s.size, s.docChanges ? s.docChanges().length : s.size); } catch (e) {} };
  const wrap = s => ({ id: s.id, exists: s.exists(), data: () => { const d = s.data(); return d == null ? d : dec(d); }, metadata: { fromCache: s.metadata.fromCache, hasPendingWrites: s.metadata.hasPendingWrites } });
  // 기기 사본에 바로 쓰고 서버 확인은 나중에. 오프라인에서도 앱이 기다리지 않게.
  let pending = 0;
  function fastWrite(p) {
    pending++;
    p.catch(e => { console.error(e); if (e && e.code === 'permission-denied') window.__hqStatus && window.__hqStatus('저장 권한 없음 · 보안 규칙 확인'); })
     .finally(() => { pending--; window.HQ_PENDING = pending > 0; });
    window.HQ_PENDING = true;
    return Promise.race([p, new Promise(r => setTimeout(r, 1200))]);
  }
  const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej({ code: 'deadline-exceeded', message: 'timeout' }), ms))]);
  const errOf = e => ({ code: e.code === 'permission-denied' ? 'revoked' : 'unavailable', message: e.message });
  function docApi(path) {
    const r = F.doc(fs, path);
    return {
      path, id: r.id,
      collection: c => colApi(path + '/' + c),
      get: async () => { try { return wrap(await F.getDoc(r)); } catch (e) { return wrap(await F.getDocFromCache(r)); } },
      set: d => fastWrite(F.setDoc(r, enc(d))),
      update: d => fastWrite(F.updateDoc(r, enc(d))),
      // v6.9: 서버 것과 합쳐서 쓰기(트랜잭션). fn(서버 것|null) → 쓸 것(undefined면 안 씀). 다른 기기 변경을 덮어쓰지 않게.
      merge: fn => withTimeout(F.runTransaction(fs, async tx => {
        const s = await tx.get(r); rcount(1); const cur = s.exists() ? dec(s.data()) : null;
        const next = fn(cur); if (next === undefined) return { skip: 1, cur };
        tx.set(r, enc(next)); return { data: next };
      }, { maxAttempts: 4 }), 12000),
      delete: () => fastWrite(F.deleteDoc(r)),
      onSnapshot: (next, error, o) => { const k = 'doc:' + r.id; return F.onSnapshot(r, ...((o && o.meta) ? [{ includeMetadataChanges: true }] : []), s => { track(k, s, 1, s.metadata.hasPendingWrites ? 0 : 1); next(wrap(s)); }, e => error && error(errOf(e))); }
    };
  }
  function colApi(path, cons = [], lab = '') {
    const c = F.collection(fs, path);
    const q = () => F.query(c, ...cons), qk = path.split('/').pop() + lab;
    return {
      path, doc: id => docApi(path + '/' + (id || (Date.now().toString(36) + crypto.getRandomValues(new Uint32Array(2)).join('').slice(0, 12)))),
      orderBy: (f, d) => colApi(path, [...cons, F.orderBy(f, d || 'asc')], lab + '>' + f),
      where: (f, op, v) => colApi(path, [...cons, F.where(f, op, v)], lab + '?' + f + op),
      limit: n => colApi(path, [...cons, F.limit(n)], lab + '#' + n),
      get: async () => { const s = await F.getDocs(q()); rcount(s.size); return { docs: s.docs.map(wrap), size: s.size, empty: s.empty }; },
      onSnapshot: (next, error, o) => F.onSnapshot(q(), ...((o && o.meta) ? [{ includeMetadataChanges: true }] : []), s => { qcount(s, qk); next({ docs: s.docs.map(wrap), size: s.size, empty: s.empty, metadata: { fromCache: s.metadata.fromCache, hasPendingWrites: s.metadata.hasPendingWrites } }); }, e => error && error(errOf(e)))
    };
  }

  let uid = null;
  const root = () => `data/users/${uid}/${NS}`;

  // 백업 전체를 한 번에 읽고, 복원은 한 번에 덮어쓰기
  async function exportAll() {
    const out = { app: 'habit-quest', exportedAt: new Date().toISOString(), game: {}, days: {} };
    for (const id of ['config', 'progress']) { const s = await F.getDoc(F.doc(fs, `${root()}/game/${id}`)).catch(() => null); if (s && s.exists()) out.game[id] = dec(s.data()); }
    const ds = await F.getDocs(F.collection(fs, `${root()}/days`)); rcount(ds.size + 2);
    ds.docs.forEach(d => out.days[d.id] = dec(d.data()));
    out.tasks = {};
    const ts = await F.getDocs(F.collection(fs, `${root()}/tasks`)).catch(() => ({ docs: [] })); rcount(ts.docs.length);
    ts.docs.forEach(d => out.tasks[d.id] = dec(d.data()));
    return out;
  }
  async function importAll(data) {
    if (!data || typeof data !== 'object' || !data.game) throw new Error('해비티카틱 백업 파일이 아니에요');
    const old = await F.getDocs(F.collection(fs, `${root()}/days`));
    let batch = F.writeBatch(fs), n = 0;
    const flush = async () => { if (n) { await batch.commit(); batch = F.writeBatch(fs); n = 0; } };
    for (const d of old.docs) { batch.delete(F.doc(fs, `${root()}/days/${d.id}`)); if (++n >= 400) await flush(); }
    for (const id of ['config', 'progress']) if (data.game[id]) { batch.set(F.doc(fs, `${root()}/game/${id}`), enc(data.game[id])); if (++n >= 400) await flush(); }
    for (const [k, v] of Object.entries(data.days || {})) { batch.set(F.doc(fs, `${root()}/days/${k}`), enc(v)); if (++n >= 400) await flush(); }
    if (data.tasks && typeof data.tasks === 'object') {
      const oldT = await F.getDocs(F.collection(fs, `${root()}/tasks`));
      for (const d of oldT.docs) { batch.delete(F.doc(fs, `${root()}/tasks/${d.id}`)); if (++n >= 400) await flush(); }
      for (const [k, v] of Object.entries(data.tasks)) { batch.set(F.doc(fs, `${root()}/tasks/${k}`), enc(v)); if (++n >= 400) await flush(); }
    }
    await flush();
  }
  // 할 일 여러 개를 한 번에 (틱틱 가져오기)
  async function putTasks(list) {
    let batch = F.writeBatch(fs), n = 0;
    for (const t of list) { batch.set(F.doc(fs, `${root()}/tasks/${t.id}`), enc(JSON.parse(JSON.stringify(t)))); if (++n >= 400) { await fastWrite(batch.commit()); batch = F.writeBatch(fs); n = 0; } }
    if (n) await fastWrite(batch.commit());
  }
  // 베타는 실제 기록의 복사본으로 시작
  async function copyFromLive() {
    if (!BETA) return;
    const src = `data/users/${uid}/habit`;
    const live = { game: {}, days: {}, tasks: {} };
    (await F.getDocs(F.collection(fs, `${src}/tasks`)).catch(() => ({ docs: [] }))).docs.forEach(d => live.tasks[d.id] = d.data());
    for (const id of ['config', 'progress']) { const s = await F.getDoc(F.doc(fs, `${src}/game/${id}`)); if (s.exists()) live.game[id] = s.data(); }
    (await F.getDocs(F.collection(fs, `${src}/days`))).docs.forEach(d => live.days[d.id] = d.data());
    await importAll(live);
  }

  // ---------- v6.8 본 앱 승격: 베타 기록을 본 앱으로 (본 앱 옛 기록은 같은 계정 폴더 habit-bak68에 백업) ----------
  // v6.8.1: 읽기에 실패하면 '없음'으로 여기지 않음(그래서 열 때마다 다시 뜨던 문제). 끝났다는 표시는 앱이 절대 덮어쓰지 않는 따로 문서(game/promo68)에.
  const sGet = r => (F.getDocFromServer ? F.getDocFromServer(r) : F.getDoc(r));
  const sGets = q => (F.getDocsFromServer ? F.getDocsFromServer(q) : F.getDocs(q));
  async function readNS(ns) {   // 실패하면 throw (빈 것으로 여기지 않음)
    const src = `data/users/${uid}/${ns}`, out = { game: {}, days: {}, tasks: {} };
    for (const id of ['config', 'progress']) { const s = await sGet(F.doc(fs, `${src}/game/${id}`)); if (s.exists()) out.game[id] = s.data(); }
    (await sGets(F.collection(fs, `${src}/days`))).docs.forEach(d => out.days[d.id] = d.data());
    (await sGets(F.collection(fs, `${src}/tasks`))).docs.forEach(d => out.tasks[d.id] = d.data());
    return out;
  }
  async function writeNS(ns, data, wipe) {
    const dst = `data/users/${uid}/${ns}`;
    let batch = F.writeBatch(fs), n = 0;
    const flush = async () => { if (n) { await batch.commit(); batch = F.writeBatch(fs); n = 0; } };
    const add = async () => { if (++n >= 150) await flush(); };
    if (wipe) for (const c of ['days', 'tasks']) { const old = await sGets(F.collection(fs, `${dst}/${c}`)); for (const d of old.docs) if (!(data[c] && d.id in data[c])) { batch.delete(F.doc(fs, `${dst}/${c}/${d.id}`)); await add(); } }
    for (const c of ['days', 'tasks']) for (const [k, v] of Object.entries(data[c] || {})) { batch.set(F.doc(fs, `${dst}/${c}/${k}`), enc(v)); await add(); }
    for (const id of ['progress', 'config']) { if (data.game[id]) batch.set(F.doc(fs, `${dst}/game/${id}`), enc(data.game[id])); else if (wipe) batch.delete(F.doc(fs, `${dst}/game/${id}`)); await add(); }  // config는 맨 끝
    await flush();
  }
  const isNew = c => !!(c && (c.mig67ds || c.mig62 || c.mig57 || c.moved68 || c.keepOld68 || (+c.v || 0) >= 8));
  const promoRef = () => F.doc(fs, `${root()}/game/promo68`);
  async function promoMark(rec) {
    let hist = [];
    try { const s = await sGet(promoRef()); if (s.exists()) hist = s.data().hist || []; } catch (e) {}
    hist.push({ at: new Date().toISOString(), ...rec });
    await F.setDoc(promoRef(), { done: 1, hist: hist.slice(-20) });
  }
  async function promote68() {
    if (BETA) return;
    // 1) 이미 끝났나 (기기 사본에 있어도 끝난 것으로)
    try { const c = await F.getDoc(promoRef()); if (c.exists()) return; } catch (e) {}
    let m, betaCfg;
    try {
      const mainCfg = await sGet(F.doc(fs, `${root()}/game/config`));
      m = mainCfg.exists() ? mainCfg.data() : null;
      if (m && isNew(m)) { promoMark({ choice: 'already' }).catch(() => {}); return; }   // 예전에 옮긴 것 → 표시만 남김
      betaCfg = await sGet(F.doc(fs, `data/users/${uid}/habit-beta/game/config`));
    } catch (e) { console.warn('promote68: 서버를 못 읽어서 이번엔 건너뜀', e); return; }   // 못 읽으면 아무것도 안 함
    if (!betaCfg.exists()) return;
    gate.hidden = false; $('#login').hidden = true; const box = $('#nocfg'); box.hidden = false;
    box.innerHTML = '<h1><img src="icons/icon-192.png" alt="">해비티카틱</h1><p>본 앱이 새 버전(v6.8)이 됐어요. 기록을 확인하는 중…</p>';
    let main, beta;
    try { main = m ? await readNS('habit') : null; beta = await readNS('habit-beta'); }
    catch (e) { console.warn(e); gate.hidden = true; return; }
    if (!beta.game.config) { gate.hidden = true; return; }
    let diff = [];
    if (main) { const lim = new Date(Date.now() - 45 * 864e5).toISOString().slice(0, 10); const ids = d => new Set(((d && d.entries) || []).map(e => e && e.id).filter(Boolean)); diff = Object.keys(main.days).filter(k => { if (k < lim) return false; const b = ids(beta.days[k]); return [...ids(main.days[k])].some(i => !b.has(i)); }).sort(); }
    const nd = Object.keys(beta.days).length, nt = Object.keys(beta.tasks).length;
    const choice = await new Promise(res => {
      box.innerHTML = `<h1><img src="icons/icon-192.png" alt="">해비티카틱 v6.8</h1>
        <p><b>베타에서 쓰던 기록을 본 앱으로 옮길까요?</b></p>
        <p style="font-size:13px">베타 기록: 날짜 ${nd}일 · 할 일 ${nt}개. 옮기면 지금 본 앱 기록은 지우지 않고 같은 계정의 백업 칸(habit-bak68)에 통째로 남겨요(나중에 계정·백업에서 되돌릴 수 있어요).</p>
        ${diff.length ? `<p style="font-size:13px">⚠ 최근 45일 중 <b>본 앱에만 적힌 기록이 있는 날 ${diff.length}일</b>: ${diff.slice(-12).map(k => k.slice(5).replace('-', '/')).join(', ')}${diff.length > 12 ? ' …' : ''} — 이 날들은 백업에 남아요. 옮긴 뒤 필요한 것만 다시 적어 주세요.</p>` : ''}
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:10px"><button class="btn primary" id="p68b">베타 기록으로 옮기기 (권장)</button><button class="btn ghost" id="p68o">본 앱 옛 기록 그대로 새 버전으로</button></div>
        <p class="err" id="p68e"></p>`;
      $('#p68b').onclick = () => res('beta'); $('#p68o').onclick = () => res('old');
    });
    if (choice === 'old') { await F.setDoc(F.doc(fs, `${root()}/game/config`), { keepOld68: 1 }, { merge: true }).catch(() => {}); await promoMark({ choice: 'old' }).catch(() => {}); gate.hidden = true; return; }
    box.querySelector('p').textContent = '옮기는 중이에요… 창을 닫지 마세요.';
    try {
      const had = await sGet(F.doc(fs, `data/users/${uid}/habit-bak68/game/meta`)), bk = had.exists() ? 'habit-bak68-' + Date.now() : 'habit-bak68'; // 첫 백업은 절대 덮어쓰지 않음
      if (main) { await writeNS(bk, main, true); await F.setDoc(F.doc(fs, `data/users/${uid}/${bk}/game/meta`), { at: new Date().toISOString(), from: 'habit', days: Object.keys(main.days).length, tasks: Object.keys(main.tasks).length }); }
      beta.game.config = { ...beta.game.config, moved68: { at: new Date().toISOString(), bak: main ? bk : '' } };
      await writeNS('habit', beta, true);
      await promoMark({ choice: 'beta', bak: main ? bk : '', days: nd, tasks: nt });
      try { localStorage.removeItem('hq-snap'); localStorage.removeItem('hq-run'); } catch (e) {}
      gate.hidden = true;
    } catch (e) { console.error(e); const er = $('#p68e'); if (er) er.textContent = '옮기지 못했어요: ' + (e.code || e.message) + ' · 새로고침해서 다시 해 보세요. 본 앱 기록은 백업에 있어요.'; throw e; }
  }
  async function promoInfo() { if (BETA) return null; try { const s = await F.getDoc(promoRef()); return s.exists() ? s.data() : null; } catch (e) { return null; } }
  // 옮기기 전 본 앱 기록으로 되돌리기 (지금 기록은 habit-bak68b에 남김)
  async function restoreBak68() {
    if (BETA) throw new Error('본 앱에서만 돼요');
    const meta = await F.getDoc(F.doc(fs, `data/users/${uid}/habit-bak68/game/meta`));
    if (!meta.exists()) throw new Error('백업이 없어요');
    const cur = await readNS('habit'), bak = await readNS('habit-bak68');
    await writeNS('habit-bak68b', cur, true);
    bak.game.config = { ...(bak.game.config || {}), keepOld68: 1 };
    await writeNS('habit', bak, true);
    await promoMark({ choice: 'restore' }).catch(() => {});
    try { localStorage.removeItem('hq-snap'); } catch (e) {}
  }
  async function bak68Info() { if (BETA) return null; const m = await F.getDoc(F.doc(fs, `data/users/${uid}/habit-bak68/game/meta`)).catch(() => null); const d = m && m.exists() ? m.data() : null; if (d) d.promo = await promoInfo(); return d; }

  let resolved = false;
  A.onAuthStateChanged(auth, async user => {
    if (user) {
      gate.hidden = true;
      if (resolved) { if (user.uid !== uid) location.reload(); return; }
      resolved = true; uid = user.uid;
      if (BETA) { try { const has = await F.getDoc(F.doc(fs, `${root()}/game/config`)); if (!has.exists()) { gate.hidden = false; $('#login').hidden = true; $('#nocfg').hidden = false; $('#nocfg p').textContent = '베타용으로 실제 기록을 복사하는 중이에요…'; await copyFromLive(); gate.hidden = true; } } catch (e) { console.error(e); gate.hidden = true; } }
      if (!BETA) { try { await promote68(); } catch (e) { console.error(e); return; } }
      window.__hqResolve({
        db: { doc: p => docApi(`${root()}/${p}`), collection: p => colApi(`${root()}/${p}`) },
        user: { id: async () => uid, isOwner: () => true, canEdit: () => true, can: () => true },
        account: { email: user.email },
        exportAll, importAll, copyFromLive, putTasks, restoreBak68, bak68Info, promoInfo,
        logout: async () => { await A.signOut(auth); try { await F.terminate(fs); await F.clearIndexedDbPersistence(fs); } catch (e) {} location.reload(); }
      });
    } else {
      if (resolved) { location.reload(); return; }
      gate.hidden = false; $('#login').hidden = false; $('#nocfg').hidden = true;
    }
  });
}
