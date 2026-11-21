/* GCHE2 · Nube: inicio de sesión con Google y base de datos de Firebase.
   Cada médico solo ve sus propios datos: usuarios/{uid}/{colección}/{documento}. */
const cfg = window.GCHE2_FIREBASE;
const V = '13.4.0', B = `https://www.gstatic.com/firebasejs/${V}/`;
const avisa = () => dispatchEvent(new CustomEvent('nube'));

if (!cfg) {
  window.NUBE = { on: false };
  avisa();
} else {
  window.NUBE = { on: true, ready: false, user: null, error: null };
  try {
    const [A, U, D] = await Promise.all([
      import(B + 'firebase-app.js'),
      import(B + 'firebase-auth.js'),
      import(B + 'firebase-firestore.js')
    ]);
    const app = A.initializeApp(cfg);
    const auth = U.getAuth(app);
    auth.languageCode = 'es';
    let db;
    try {
      db = D.initializeFirestore(app, { localCache: D.persistentLocalCache({ tabManager: D.persistentMultipleTabManager() }) });
    } catch (e) {
      db = D.getFirestore(app);
    }
    const limpio = o => JSON.parse(JSON.stringify(o));
    let subs = [];
    const N = window.NUBE;
    N.signIn = async () => {
      const p = new U.GoogleAuthProvider();
      p.setCustomParameters({ prompt: 'select_account' });
      try { await U.signInWithPopup(auth, p); }
      catch (e) {
        if (/popup-blocked|operation-not-supported/.test(e.code || '')) await U.signInWithRedirect(auth, p);
        else throw e;
      }
    };
    N.signOut = () => U.signOut(auth);
    N.put = (col, o) => D.setDoc(D.doc(db, 'usuarios', N.user.uid, col, o.id), limpio(o));
    N.del = (col, id) => D.deleteDoc(D.doc(db, 'usuarios', N.user.uid, col, id));
    N.watch = (cols, cb) => {
      subs.forEach(f => f()); subs = [];
      cols.forEach(col => {
        subs.push(D.onSnapshot(D.collection(db, 'usuarios', N.user.uid, col), { includeMetadataChanges: true }, snap => {
          const m = {};
          snap.forEach(d => { m[d.id] = d.data(); });
          cb(col, m, snap.metadata.hasPendingWrites, snap.metadata.fromCache);
        }, err => cb(col, null, false, false, err)));
      });
    };
    U.getRedirectResult(auth).catch(e => { N.error = e.code || String(e); avisa(); });
    U.onAuthStateChanged(auth, u => {
      subs.forEach(f => f()); subs = [];
      N.user = u ? { uid: u.uid, nombre: u.displayName || '', correo: u.email || '', foto: u.photoURL || '' } : null;
      N.ready = true;
      avisa();
    });
  } catch (e) {
    window.NUBE.error = navigator.onLine ? 'No se pudo cargar Firebase: ' + (e.message || e) : 'sin-conexion';
    window.NUBE.ready = true;
    avisa();
  }
}
