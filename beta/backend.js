// Firebase backend for 해비티카틱 (포켓 노트·어항 일지와 같은 Firebase 프로젝트, 기록은 자기 폴더에): 로그인, Firestore 저장(오프라인에서도 동작).
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
      onSnapshot: (next, error) => F.onSnapshot(r, s => next(wrap(s)), e => error && error(errOf(e)))
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
      onSnapshot: (next, error) => F.onSnapshot(q(), s => next({ docs: s.docs.map(wrap), size: s.size, empty: s.empty, metadata: { fromCache: s.metadata.fromCache, hasPendingWrites: s.metadata.hasPendingWrites } }), e => error && error(errOf(e)))
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

  let resolved = false;
  A.onAuthStateChanged(auth, async user => {
    if (user) {
      gate.hidden = true;
      if (resolved) { if (user.uid !== uid) location.reload(); return; }
      resolved = true; uid = user.uid;
      if (BETA) { try { const has = await F.getDoc(F.doc(fs, `${root()}/game/config`)); if (!has.exists()) { gate.hidden = false; $('#login').hidden = true; $('#nocfg').hidden = false; $('#nocfg p').textContent = '베타용으로 실제 기록을 복사하는 중이에요…'; await copyFromLive(); gate.hidden = true; } } catch (e) { console.error(e); gate.hidden = true; } }
      window.__hqResolve({
        db: { doc: p => docApi(`${root()}/${p}`), collection: p => colApi(`${root()}/${p}`) },
        user: { id: async () => uid, isOwner: () => true, canEdit: () => true, can: () => true },
        account: { email: user.email },
        exportAll, importAll, copyFromLive, putTasks,
        logout: async () => { await A.signOut(auth); try { await F.terminate(fs); await F.clearIndexedDbPersistence(fs); } catch (e) {} location.reload(); }
      });
    } else {
      if (resolved) { location.reload(); return; }
      gate.hidden = false; $('#login').hidden = false; $('#nocfg').hidden = true;
    }
  });
}
