// Firebase backend for 해비티카틱 (본 앱·베타 같은 파일, 경로로 구분) (포켓 노트·어항 일지와 같은 Firebase 프로젝트, 기록은 자기 폴더에): 로그인, Firestore 저장(오프라인에서도 동작).
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

  /* ---------- 저장소 연결 (아티팩트 db와 같은 모양) ---------- */
  const wrap = s => ({ id: s.id, exists: s.exists(), data: () => s.data(), metadata: { fromCache: s.metadata.fromCache, hasPendingWrites: s.metadata.hasPendingWrites } });
  // 기기 사본에 바로 쓰고 서버 확인은 나중에. 오프라인에서도 앱이 기다리지 않게.
  let pending = 0;
  function fastWrite(p) {
    pending++;
    p.catch(e => { console.error(e); if (e && e.code === 'permission-denied') window.__hqStatus && window.__hqStatus('저장 권한 없음 · 보안 규칙 확인'); })
     .finally(() => { pending--; window.HQ_PENDING = pending > 0; });
    window.HQ_PENDING = true;
    return Promise.race([p, new Promise(r => setTimeout(r, 1200))]);
  }
  const errOf = e => ({ code: e.code === 'permission-denied' ? 'revoked' : 'unavailable', message: e.message });
  function docApi(path) {
    const r = F.doc(fs, path);
    return {
      path, id: r.id,
      collection: c => colApi(path + '/' + c),
      get: async () => { try { return wrap(await F.getDoc(r)); } catch (e) { return wrap(await F.getDocFromCache(r)); } },
      set: d => fastWrite(F.setDoc(r, d)),
      update: d => fastWrite(F.updateDoc(r, d)),
      delete: () => fastWrite(F.deleteDoc(r)),
      onSnapshot: (next, error, o) => (o && o.meta) ? F.onSnapshot(r, { includeMetadataChanges: true }, s => next(wrap(s)), e => error && error(errOf(e))) : F.onSnapshot(r, s => next(wrap(s)), e => error && error(errOf(e)))
    };
  }
  function colApi(path, cons = []) {
    const c = F.collection(fs, path);
    const q = () => F.query(c, ...cons);
    return {
      path, doc: id => docApi(path + '/' + (id || (Date.now().toString(36) + crypto.getRandomValues(new Uint32Array(2)).join('').slice(0, 12)))),
      orderBy: (f, d) => colApi(path, [...cons, F.orderBy(f, d || 'asc')]),
      where: (f, op, v) => colApi(path, [...cons, F.where(f, op, v)]),
      limit: n => colApi(path, [...cons, F.limit(n)]),
      get: async () => { const s = await F.getDocs(q()); return { docs: s.docs.map(wrap), size: s.size, empty: s.empty }; },
      onSnapshot: (next, error, o) => F.onSnapshot(q(), ...((o && o.meta) ? [{ includeMetadataChanges: true }] : []), s => next({ docs: s.docs.map(wrap), size: s.size, empty: s.empty, metadata: { fromCache: s.metadata.fromCache, hasPendingWrites: s.metadata.hasPendingWrites } }), e => error && error(errOf(e)))
    };
  }

  let uid = null;
  const root = () => `data/users/${uid}/${NS}`;

  // 백업 전체를 한 번에 읽고, 복원은 한 번에 덮어쓰기
  async function exportAll() {
    const out = { app: 'habit-quest', exportedAt: new Date().toISOString(), game: {}, days: {} };
    for (const id of ['config', 'progress']) { const s = await F.getDoc(F.doc(fs, `${root()}/game/${id}`)).catch(() => null); if (s && s.exists()) out.game[id] = s.data(); }
    const ds = await F.getDocs(F.collection(fs, `${root()}/days`));
    ds.docs.forEach(d => out.days[d.id] = d.data());
    out.tasks = {};
    const ts = await F.getDocs(F.collection(fs, `${root()}/tasks`)).catch(() => ({ docs: [] }));
    ts.docs.forEach(d => out.tasks[d.id] = d.data());
    return out;
  }
  async function importAll(data) {
    if (!data || typeof data !== 'object' || !data.game) throw new Error('해비티카틱 백업 파일이 아니에요');
    const old = await F.getDocs(F.collection(fs, `${root()}/days`));
    let batch = F.writeBatch(fs), n = 0;
    const flush = async () => { if (n) { await batch.commit(); batch = F.writeBatch(fs); n = 0; } };
    for (const d of old.docs) { batch.delete(F.doc(fs, `${root()}/days/${d.id}`)); if (++n >= 400) await flush(); }
    for (const id of ['config', 'progress']) if (data.game[id]) { batch.set(F.doc(fs, `${root()}/game/${id}`), data.game[id]); if (++n >= 400) await flush(); }
    for (const [k, v] of Object.entries(data.days || {})) { batch.set(F.doc(fs, `${root()}/days/${k}`), v); if (++n >= 400) await flush(); }
    if (data.tasks && typeof data.tasks === 'object') {
      const oldT = await F.getDocs(F.collection(fs, `${root()}/tasks`));
      for (const d of oldT.docs) { batch.delete(F.doc(fs, `${root()}/tasks/${d.id}`)); if (++n >= 400) await flush(); }
      for (const [k, v] of Object.entries(data.tasks)) { batch.set(F.doc(fs, `${root()}/tasks/${k}`), v); if (++n >= 400) await flush(); }
    }
    await flush();
  }
  // 할 일 여러 개를 한 번에 (틱틱 가져오기)
  async function putTasks(list) {
    let batch = F.writeBatch(fs), n = 0;
    for (const t of list) { batch.set(F.doc(fs, `${root()}/tasks/${t.id}`), JSON.parse(JSON.stringify(t))); if (++n >= 400) { await fastWrite(batch.commit()); batch = F.writeBatch(fs); n = 0; } }
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
    for (const c of ['days', 'tasks']) for (const [k, v] of Object.entries(data[c] || {})) { batch.set(F.doc(fs, `${dst}/${c}/${k}`), v); await add(); }
    for (const id of ['progress', 'config']) { if (data.game[id]) batch.set(F.doc(fs, `${dst}/game/${id}`), data.game[id]); else if (wipe) batch.delete(F.doc(fs, `${dst}/game/${id}`)); await add(); }  // config는 맨 끝
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
