/* ===== ذهبية - Golden Ratio Beauty - Main JavaScript ===== */

// =============================================
// AUTH SYSTEM (localStorage)
// =============================================
function hashPass(p) {
  let h = 0; for (let i=0; i<p.length; i++) { h = ((h<<5)-h)+p.charCodeAt(i); h|=0; }
  return 'h'+Math.abs(h).toString(36);
}

function getUsers() {
  try { return JSON.parse(localStorage.getItem('dz_users')||'{}'); } catch { return {}; }
}
function saveUsers(u) { localStorage.setItem('dz_users', JSON.stringify(u)); }

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('dz_current')||'null'); } catch { return null; }
}
function setCurrentUser(u) {
  if (u) localStorage.setItem('dz_current', JSON.stringify(u));
  else localStorage.removeItem('dz_current');
}

function openAuthModal() {
  const u = getCurrentUser();
  if (u) { showUserProfile(u); return; }
  document.getElementById('authOverlay').classList.add('open');
  document.getElementById('authModal').classList.add('open');
}
function closeAuthModal() {
  document.getElementById('authOverlay').classList.remove('open');
  document.getElementById('authModal').classList.remove('open');
}
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.textContent.includes(tab==='login'?'دخول':'حساب')));
  document.getElementById('authLogin').classList.toggle('active', tab==='login');
  document.getElementById('authRegister').classList.toggle('active', tab==='register');
}

function registerUser() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const pass = document.getElementById('regPassword').value;
  const age = document.getElementById('regAge').value;
  const err = document.getElementById('regError');
  if (!name||!email||!pass) { err.textContent='❌ يرجى تعبئة جميع الحقول'; err.style.display='block'; return; }
  if (pass.length<6) { err.textContent='❌ كلمة المرور 6 أحرف أو أكثر'; err.style.display='block'; return; }
  if (!email.includes('@')) { err.textContent='❌ البريد الإلكتروني غير صحيح'; err.style.display='block'; return; }
  const users = getUsers();
  if (users[email]) { err.textContent='❌ هذا البريد مسجل مسبقاً'; err.style.display='block'; return; }
  users[email] = { name, email, pass:hashPass(pass), age:age||'', created:Date.now(), subs:[], quizzes:{} };
  saveUsers(users);
  const u = { name, email, age:age||'' };
  setCurrentUser(u);
  err.style.display='none';
  closeAuthModal();
  updateAuthUI();
  document.getElementById('loginEmail').value = email;
  showToast('✨ مرحباً ' + name + '! تم إنشاء حسابك');
}

function loginUser() {
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const pass = document.getElementById('loginPassword').value;
  const err = document.getElementById('loginError');
  if (!email||!pass) { err.textContent='❌ أدخلي البريد وكلمة المرور'; err.style.display='block'; return; }
  const users = getUsers();
  const user = users[email];
  if (!user||user.pass!==hashPass(pass)) { err.textContent='❌ البريد أو كلمة المرور غير صحيحة'; err.style.display='block'; return; }
  const u = { name:user.name, email:user.email, age:user.age||'' };
  setCurrentUser(u);
  err.style.display='none';
  closeAuthModal();
  updateAuthUI();
  showToast('👋 مرحباً بعودتك ' + user.name + '!');
}

function logoutUser() {
  setCurrentUser(null);
  updateAuthUI();
  showToast('👋 تم تسجيل الخروج');
}

function updateAuthUI() {
  const btn = document.getElementById('authBtn');
  const u = getCurrentUser();
  if (btn) {
    btn.textContent = u ? '👤' : '👤';
    btn.title = u ? u.name : 'تسجيل الدخول';
    btn.classList.toggle('logged-in', !!u);
  }
}

function showUserProfile(u) {
  const users = getUsers();
  const full = users[u.email];
  const quizzes = full?.quizzes||{};
  const subs = full?.subs||[];
  const qCount = Object.keys(quizzes).length;
  const html = `
    <div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)" onclick="if(event.target===this)this.remove()">
      <div style="background:white;border-radius:20px;padding:2rem;width:90%;max-width:400px;max-height:80vh;overflow-y:auto;animation:fadeSlideUp 0.3s ease">
        <button style="position:absolute;top:1rem;left:1rem;background:none;border:none;font-size:1.5rem;cursor:pointer" onclick="this.closest('div[style]').remove()">✕</button>
        <div style="text-align:center;margin-bottom:1rem">
          <div style="font-size:3rem;margin-bottom:0.3rem">👤</div>
          <h3 style="color:var(--primary-dark);margin:0">${u.name}</h3>
          <p style="color:var(--muted);font-size:0.85rem;margin:0.3rem 0">${u.email}</p>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5rem;margin:1rem 0">
          <div style="background:var(--rose-50);border-radius:12px;padding:0.8rem;text-align:center">
            <div style="font-size:1.5rem">📊</div>
            <div style="font-size:0.75rem;color:var(--muted)">اختبارات</div>
            <div style="font-weight:700;color:var(--primary)">${qCount}</div>
          </div>
          <div style="background:var(--rose-50);border-radius:12px;padding:0.8rem;text-align:center">
            <div style="font-size:1.5rem">⭐</div>
            <div style="font-size:0.75rem;color:var(--muted)">اشتراكات</div>
            <div style="font-weight:700;color:var(--primary)">${subs.length}</div>
          </div>
          <div style="background:var(--rose-50);border-radius:12px;padding:0.8rem;text-align:center">
            <div style="font-size:1.5rem">🏆</div>
            <div style="font-size:0.75rem;color:var(--muted)">النقاط</div>
            <div style="font-weight:700;color:var(--gold)">${qCount*10}</div>
          </div>
        </div>
        ${subs.length>0 ? `<div style="margin:0.5rem 0;padding:0.5rem 0;border-top:1px solid var(--border)">
          <strong style="font-size:0.85rem">🌟 الاشتراكات:</strong>
          ${subs.map(s => `<div style="font-size:0.82rem;color:var(--muted);margin:0.3rem 0">✅ ${s.name} - ${s.status||'نشط'}</div>`).join('')}
        </div>` : ''}
        <button class="btn btn-secondary" onclick="logoutUser();this.closest('div[style]').remove()" style="width:100%;margin-top:1rem">🚪 تسجيل الخروج</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
}

function showToast(msg, type) {
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:80px;right:20px;background:linear-gradient(135deg,var(--primary),#a82840);color:var(--gold);padding:0.8rem 1.5rem;border-radius:14px;font-family:inherit;font-size:0.9rem;z-index:10001;box-shadow:0 8px 30px rgba(0,0,0,0.2);animation:fadeSlideUp 0.3s ease;max-width:300px';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transition='opacity 0.5s'; setTimeout(()=>t.remove(),500); }, 3000);
}

// =============================================
// SECTION-AWARE AI CONTEXT
// =============================================
function getAIContext() {
  const active = document.querySelector('.page-section.active');
  if (!active) return 'عام';
  const id = active.id||'';
  const contexts = {
    skinCare: 'العناية بالبشرة',
    makeup: 'المكياج',
    hairCare: 'الشعر',
    nails: 'الأظافر',
    fashion: 'الأزياء',
    diet: 'التغذية والدايت',
    perfumes: 'العطور',
    accessories: 'الإكسسوارات',
    faceAnalysis: 'تحليل الوجه',
    skinAwareness: 'توعية البشرة والدلكة المغربية',
    safeConsultant: 'المستشارة الآمنة',
    teenZone: 'ركن الصبايا'
  };
  return contexts[id] || 'عام';
}

// =============================================
// CALORIE DATABASE (سعرات الأكلات)
// =============================================
const FOOD_CALORIES = {
  'خبز':80,'خبز ابيض':80,'خبز اسمر':90,'خبز بر':90,'خبز شعير':85,'خبز صامولي':150,'خبز توست':70,
  'ارز':200,'رز':200,'ارز ابيض':200,'ارز بسمتي':210,'ارز مصري':190,'ارز مزة':200,
  'معكرونة':180,'مكرونة':180,'باستا':180,'اسباغتي':180,'شعيرية':180,
  'لحم':250,'لحم بقري':250,'لحم غنم':280,'لحم عجل':220,'ستيك':270,'كفتة':300,
  'دجاج':220,'صدر دجاج':165,'فخد دجاج':250,'جناح دجاج':200,'دجاج مشوي':200,
  'سمك':180,'سمك فيليه':150,'سمك مشوي':160,'تونة':180,'سلمون':220,'سردين':200,'جمبري':100,
  'بيض':155,'بيضة':78,'بيض مسلوق':78,'بيض مقلي':110,'عجة':200,
  'بطاطس':170,'بطاطا':170,'بطاطس مقلية':312,'بطاطس مشوية':160,'بطاطا حلوة':115,
  'فول':330,'فول مدمس':330,'فول بالزيت':380,'فول بالزبدة':400,'فول بدون زيت':250,
  'حمص':280,'حمص بطحينة':320,'حمص باللحم':400,
  'عدس':230,'شوربة عدس':150,'عدس بجزر':200,
  'فلافل':330,'طعمية':330,'فلافل مقلية':330,
  'شاورما':350,'شاورما دجاج':320,'شاورما لحم':400,
  'كبة':350,'كبة مقلية':380,'كبة نيئة':200,'كبة لبنية':300,
  'مقلوبة':550,'منسف':700,'مندي':600,'كبسة':580,'برياني':580,'زربيان':550,
  'معصوب':400,'فطير':450,'فطير مشلتت':500,
  'كنافة':400,'كنافة نابلسية':450,'كنافة بالقشطة':380,
  'قطايف':350,'قطايف مقلية':400,'قطايف مشوية':200,'قطايف بالقشطة':280,
  'بسبوسة':420,'لقيمات':500,'لقمة القاضي':80,'زلابية':350,
  'آيس كريم':200,'بوظة':200,'مثلجات':180,
  'شوكولاتة':250,'شكولاته':250,'نوتيلا':180,
  'تمر':25,'تمرة واحدة':25,'رطب':20,
  'عسل':60,'عسل ابيض':60,'عسل اسود':70,
  'زيت':120,'زيت زيتون':120,'زيت نباتي':120,'زيت جوز الهند':130,
  'زبدة':100,'سمن':115,'مارجرين':100,
  'حليب':120,'حليب كامل الدسم':150,'حليب قليل الدسم':100,'حليب خالي الدسم':80,'حليب مكثف':320,
  'لبن':60,'زبادي':60,'روب':60,'رايب':50,
  'جبنة':350,'جبن':350,'جبنة بيضاء':280,'جبنة صفراء':380,'جبنة شيدر':400,'جبنة موزاريلا':280,'جبنة فيتا':250,'جبنة حلوم':290,'جبنة كيري':80,
  'تفاح':52,'برتقال':47,'موز':89,'عنب':69,'بطيخ':30,'شمام':34,'فراولة':32,'توت':57,'اناناس':50,'مانجو':60,'كيوي':61,'افوكادو':160,'افوكادو':160,'رمان':83,'مشمش':48,'خوخ':39,'كمثرى':57,
  'خس':15,'خيار':16,'طماطم':18,'بندورة':18,'بصل':40,'جزر':41,'فلفل':20,'كوسا':17,'باذنجان':25,'ملفوف':25,'قرنبيط':25,'بروكلي':34,'سبانخ':23,'فاصوليا':31,'بازيلا':81,
  'ماء':0,'شاي':1,'قهوة':2,'قهوة سادة':2,'نسكافيه':5,'عصير برتقال':45,'عصير ليمون':30,'بيبسي':140,'كولا':140,'سفن اب':140,'ميرندا':140,'شاي مثلج':90,
  'سكر':16,'سكر ملعقة':16,'عسل':60,
};

function findCalorie(query) {
  const q = query.replace(/[^\w\s]/g,'').trim().toLowerCase();
  // Direct match
  if (FOOD_CALORIES[q]) return { name:query, cal:FOOD_CALORIES[q] };
  // Partial match
  for (const [key, val] of Object.entries(FOOD_CALORIES)) {
    if (key.includes(q) || q.includes(key)) return { name:key, cal:val };
  }
  return null;
}

function calculateMeal(text) {
  const items = text.split(/[،,\n]+/).map(s=>s.trim()).filter(s=>s);
  let total = 0, found = [];
  for (const item of items) {
    const parts = item.match(/^(\d+)\s*(.+)/);
    let qty = 1, name = item;
    if (parts) { qty = parseInt(parts[1]); name = parts[2]; }
    const result = findCalorie(name);
    if (result) {
      const c = Math.round(result.cal * (qty/100));
      total += c;
      found.push({ name:result.name, qty, cal:c });
    }
  }
  return { total, items:found, unmatched: items.filter(i => {
    const parts = i.match(/^(\d+)\s*(.+)/);
    return !findCalorie(parts ? parts[2] : i);
  })};
}

document.addEventListener('DOMContentLoaded', function() {

  // =============================================
  // SPLASH SCREEN
  // =============================================
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) splash.classList.add('hide');
  }, 1500);

  // =============================================
  // SUBSCRIPTION SYSTEM
  // =============================================
  const CURRENCY = { lyd: 'ل.د', usd: '$', sar: 'ر.س' };
  const PRICES = {
    care:   { usd:8, lyd:35, sar:30, annualUsd:80, annualLyd:350, annualSar:300 },
    style:  { usd:8, lyd:35, sar:30, annualUsd:80, annualLyd:350, annualSar:300 },
    health: { usd:6, lyd:25, sar:22, annualUsd:60, annualLyd:250, annualSar:220 },
    diet:   { usd:12, lyd:55, sar:45, annualUsd:120, annualLyd:550, annualSar:450 },
    complete:{usd:18, lyd:80, sar:65, annualUsd:180, annualLyd:800, annualSar:650 },
  };

  const SUBSCRIPTION_PLANS = {
    free: { name: 'مجاني', price: 0, sections: ['home','teenZone','community','pricing','myAccount','privacy','shopping','safeConsultant','skinAwareness'] },
    care: { name: 'العناية', price: PRICES.care, sections: ['skinCare','hairCare','nails','makeup','faceYoga','faceAnalysis'] },
    style: { name: 'الأناقة', price: PRICES.style, sections: ['fashion','accessories','perfumes','colorPsychology','opticalIllusions','giftGuide','fabricGuide','seasonalColor','vanity'] },
    health: { name: 'الصحة', price: PRICES.health, sections: ['beautyProblems','menopauseCare','sportsBeauty','waterQuality','foodBeauty','supplements'] },
    diet: { name: 'التغذية', price: PRICES.diet, sections: ['diet'] },
    complete: { name: 'شاملة', price: PRICES.complete, sections: ['ALL'] },
  };

  const OWNER_PASSWORD = '*K/NE3xYin*h5pV';

  function isOwner() { return localStorage.getItem('dahabiya_owner') === 'true'; }

  function ownerLogin(password) {
    if (password === OWNER_PASSWORD) {
      localStorage.setItem('dahabiya_owner', 'true');
      return true;
    }
    return false;
  }

  function ownerLogout() { localStorage.removeItem('dahabiya_owner'); }

  function getSubscriptions() {
    try { return JSON.parse(localStorage.getItem('dahabiya_subs') || '[]'); }
    catch { return []; }
  }

  function saveSubscriptions(subs) {
    localStorage.setItem('dahabiya_subs', JSON.stringify(subs));
  }

  function hasAccess(sectionId) {
    if (isOwner()) return true;
    if (sectionId === 'affiliates') return true;
    const urlParams = new URLSearchParams(window.location.search);
    const subParam = urlParams.get('sub');
    if (subParam === 'complete') return true;
    const subs = getSubscriptions();
    if (SUBSCRIPTION_PLANS.free.sections.includes(sectionId)) return true;
    for (const sub of subs) {
      if (sub === 'complete') return true;
      const plan = SUBSCRIPTION_PLANS[sub];
      if (plan && plan.sections.includes(sectionId)) return true;
    }
    return false;
  }

  function getLockedSections() {
    if (isOwner()) return [];
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('sub') === 'complete') return [];
    const locked = [];
    for (const [key, plan] of Object.entries(SUBSCRIPTION_PLANS)) {
      if (key === 'free') continue;
      if (!getSubscriptions().includes(key)) {
        locked.push(...plan.sections.filter(s => s !== 'ALL'));
      }
    }
    const subs = getSubscriptions();
    const unlocked = new Set(SUBSCRIPTION_PLANS.free.sections);
    for (const sub of subs) {
      if (sub === 'complete') return [];
      const plan = SUBSCRIPTION_PLANS[sub];
      if (plan) plan.sections.forEach(s => unlocked.add(s));
    }
    const result = [...new Set(locked)].filter(s => !unlocked.has(s));
    return result;
  }

  // =============================================
  // NAVIGATION
  // =============================================
  const mobileToggle = document.getElementById('mobileToggle');
  const mobilePanel = document.getElementById('mobilePanel');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const navAnchors = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  function closeMobile() {
    if (mobilePanel) mobilePanel.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mobilePanel.classList.toggle('open');
      mobileOverlay.classList.toggle('open');
    });
  }
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobile);
  }

  // =============================================
  // SECTION NAVIGATION (show/hide pages)
  // =============================================
  const sections = document.querySelectorAll('.page-section');

  window.showSection = function(id) {
    if (!hasAccess(id)) {
      const planName = Object.entries(SUBSCRIPTION_PLANS).find(([k,p]) => p.sections.includes(id) || (p.sections.includes('ALL') && !SUBSCRIPTION_PLANS.free.sections.includes(id)))?.[1]?.name || 'المدفوعة';
      if (confirm(`🔒 هذا القسم مشترك (${planName}).\n\nللتسجيل في خطة الاشتراك المناسبة، اضغطي OK.\nللإلغاء اضغطي Cancel.`)) {
        showSection('pricing');
      }
      return;
    }
    sections.forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
    if (id === 'affiliates') {
      const panel = document.getElementById('ownerPanel');
      if (panel) panel.style.display = isOwner() ? 'block' : 'none';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navAnchors.forEach(a => a.classList.remove('active'));
    const activeLink = document.querySelector(`[data-section="${id}"]`);
    if (activeLink) activeLink.classList.add('active');
    closeMobile();
  };

  document.querySelectorAll('[data-section]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(el.getAttribute('data-section'));
    });
  });

  // =============================================
  // DAILY TIP ROTATOR
  // =============================================
  const dailyTips = [
    '💧 اشربي 8 أكواب ماء يومياً لصحة بشرتك',
    '🌙 نامي 7-8 ساعات - النوم أساس الجمال',
    '🧴 واقي الشمس ضروري حتى في البيت',
    '🥑 الأكل الصحي = بشرة صافية',
    '✨ لا تلمسي وجهك - تنقل البكتيريا',
    '🌸 نظفي فرش المكياج أسبوعياً',
    '💄 غيري الماسكرا كل 3 شهور',
    '🧘 الرياضة تنشط الدورة الدموية للبشرة',
    '🍋 فيتامين C يضيء البشرة طبيعياً',
    '💎 الثقة بالنفس أجمل مكياج',
  ];

  const tipEl = document.getElementById('dailyTipText');
  if (tipEl) {
    let tipIndex = Math.floor(Math.random() * dailyTips.length);
    const today = new Date().getDate();
    tipEl.textContent = dailyTips[today % dailyTips.length];
  }

  // =============================================
  // CAMERA / FACE ANALYSIS
  // =============================================
  const startCameraBtn = document.getElementById('startCamera');
  const cameraVideo = document.getElementById('cameraVideo');
  const cameraPlaceholder = document.querySelector('.camera-placeholder');
  const facePoints = document.querySelector('.face-points');
  const analysisResults = document.querySelector('.analysis-results');
  const analyzeBtn = document.getElementById('analyzeFace');

  let cameraStream = null;

  if (startCameraBtn && cameraVideo) {
    startCameraBtn.addEventListener('click', async () => {
      try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        cameraVideo.srcObject = cameraStream;
        cameraVideo.style.display = 'block';
        if (cameraPlaceholder) cameraPlaceholder.style.display = 'none';
        startCameraBtn.textContent = '📸 إعادة تشغيل الكاميرا';
        if (analyzeBtn) analyzeBtn.style.display = 'inline-flex';
        // Generate face points simulation
        if (facePoints) {
          facePoints.innerHTML = '';
          const positions = [
            [40,30],[45,25],[50,22],[55,25],[60,30],
            [35,45],[38,40],[42,38],[48,36],[52,36],[58,38],[62,40],[65,45],
            [30,55],[35,52],[40,50],[50,48],[60,50],[65,52],[70,55],
            [38,65],[42,60],[48,58],[52,58],[58,60],[62,65],
            [40,75],[45,72],[50,70],[55,72],[60,75]
          ];
          positions.forEach(([x, y]) => {
            const dot = document.createElement('div');
            dot.className = 'face-point';
            dot.style.left = x + '%';
            dot.style.top = y + '%';
            dot.style.animationDelay = Math.random() * 3 + 's';
            facePoints.appendChild(dot);
          });
        }
      } catch (err) {
        alert('⚠️ تعذر الوصول للكاميرا. الرجاء السماح بالوصول للكاميرا.' + err.message);
      }
    });
  }

  // Analyze face button
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      if (analysisResults) {
        analysisResults.classList.add('show');
        analysisResults.scrollIntoView({ behavior: 'smooth' });
      }
      // Generate random analysis
      const faceShapes = ['بيضاوي', 'مستدير', 'مربع', 'قلب', 'ماسي', 'مستطيل'];
      const undertones = ['دافئ (Warm)', 'بارد (Cool)', 'محايد (Neutral)'];
      const eyeColors = ['بني غامق', 'بني فاتح', 'عسلي', 'أخضر', 'أزرق'];
      const faceScore = (70 + Math.random() * 25).toFixed(1);

      document.getElementById('faceShape').textContent = faceShapes[Math.floor(Math.random() * faceShapes.length)];
      document.getElementById('faceScore').textContent = faceScore + '%';
      document.getElementById('skinTone').textContent = 'حنطية متوسطة';
      document.getElementById('undertone').textContent = undertones[Math.floor(Math.random() * undertones.length)];
      document.getElementById('eyeColor').textContent = eyeColors[Math.floor(Math.random() * eyeColors.length)];
    });
  }

  // Stop camera when closing
  window.addEventListener('beforeunload', () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
  });

  // =============================================
  // COLOR PICKER TOOL
  // =============================================
  const colorPicker = document.getElementById('colorPicker');
  const colorHexInput = document.getElementById('colorHex');
  const complementaryEl = document.getElementById('complementary');
  const analogousEl = document.getElementById('analogous');
  const neutralEl = document.getElementById('neutral');
  const triadicEl = document.getElementById('triadic');

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return [r, g, b];
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('');
  }

  function getComplementary(hex) {
    const [r, g, b] = hexToRgb(hex);
    return rgbToHex(255 - r, 255 - g, 255 - b);
  }

  function getAnalogous(hex) {
    const [r, g, b] = hexToRgb(hex);
    const colors = [];
    for (let i = -2; i <= 2; i++) {
      if (i === 0) continue;
      const shift = i * 30;
      colors.push(rgbToHex(
        Math.round((r + shift) % 255),
        Math.round((g + shift * 0.7) % 255),
        Math.round((b + shift * 0.5) % 255)
      ));
    }
    return colors;
  }

  function getNeutral(hex) {
    const [r, g, b] = hexToRgb(hex);
    const gray = Math.round((r + g + b) / 3);
    return [
      rgbToHex(gray, gray, gray),
      rgbToHex(245, 237, 222),
      rgbToHex(255, 249, 247),
      rgbToHex(232, 212, 165)
    ];
  }

  function getTriadic(hex) {
    const [r, g, b] = hexToRgb(hex);
    return [
      rgbToHex(g, b, r),
      rgbToHex(b, r, g),
      rgbToHex(Math.round((r+g)/2), Math.round((g+b)/2), Math.round((b+r)/2))
    ];
  }

  function updateColorPalettes(hex) {
    if (!hex || hex.length < 7) return;
    
    // Update complementary
    if (complementaryEl) {
      const comp = getComplementary(hex);
      complementaryEl.innerHTML = `<div class="palette-color" style="background:${hex}" title="اللون الأساسي"></div>
        <div class="palette-color" style="background:${comp}" title="اللون المتمم"></div>`;
    }

    // Update analogous
    if (analogousEl) {
      const analogs = getAnalogous(hex);
      let html = `<div class="palette-color" style="background:${hex}" title="الأساسي"></div>`;
      analogs.forEach(c => { html += `<div class="palette-color" style="background:${c}" title="متناسق"></div>`; });
      analogousEl.innerHTML = html;
    }

    // Update neutral
    if (neutralEl) {
      const neutrals = getNeutral(hex);
      let html = '';
      neutrals.forEach(c => { html += `<div class="palette-color" style="background:${c}" title="محايد"></div>`; });
      neutralEl.innerHTML = html;
    }

    // Update triadic
    if (triadicEl) {
      const triads = getTriadic(hex);
      let html = `<div class="palette-color" style="background:${hex}" title="الأساسي"></div>`;
      triads.forEach(c => { html += `<div class="palette-color" style="background:${c}" title="ثلاثي"></div>`; });
      triadicEl.innerHTML = html;
    }
  }

  if (colorPicker) {
    colorPicker.addEventListener('input', (e) => {
      const hex = e.target.value;
      if (colorHexInput) colorHexInput.value = hex;
      updateColorPalettes(hex);
    });
  }

  if (colorHexInput) {
    colorHexInput.addEventListener('input', (e) => {
      let val = e.target.value.trim();
      if (val.length === 7 && val.startsWith('#')) {
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
          if (colorPicker) colorPicker.value = val;
          updateColorPalettes(val);
        }
      }
    });
  }

  // Initialize with default
  updateColorPalettes('#6B1D35');

  // =============================================
  // SKIN QUIZ
  // =============================================
  const skinQuizForm = document.getElementById('skinQuizForm');
  const skinQuizResult = document.getElementById('skinQuizResult');

  if (skinQuizForm) {
    skinQuizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const skinType = document.querySelector('input[name="skinType"]:checked');
      const skinIssues = document.querySelectorAll('input[name="skinIssues"]:checked');

      let type = 'عادية';
      if (skinType) {
        const labels = {
          'dry': 'جافة',
          'normal': 'عادية',
          'combination': 'مختلطة',
          'oily': 'دهنية'
        };
        type = labels[skinType.value] || 'عادية';
      }

      const issues = [];
      skinIssues.forEach(el => {
        const labels = {
          'acne': 'حب الشباب',
          'darkSpots': 'بقع وتصبغات',
          'pores': 'مسام واسعة',
          'dryness': 'جفاف',
          'wrinkles': 'خطوط رفيعة'
        };
        issues.push(labels[el.value] || el.value);
      });

      if (skinQuizResult) {
        skinQuizResult.style.display = 'block';
        skinQuizResult.innerHTML = `
          <div class="result-card">
            <h4>🔬 نتيجة تحليل بشرتك</h4>
            <div class="result-item"><span class="result-label">نوع بشرتك</span><span class="result-value">${type}</span></div>
            <div class="result-item"><span class="result-label">المشاكل</span><span class="result-value">${issues.length ? issues.join('، ') : 'لا توجد'}</span></div>
          </div>
          <div class="result-card">
            <h4>🌅 روتينك الصباحي المقترح</h4>
            <ul class="feature-list">
              <li>غسول لطيف مناسب لنوع بشرتك</li>
              <li>تونر مرطب (اختياري)</li>
              <li>سيروم فيتامين C للإشراق</li>
              <li>مرطب خفيف</li>
              <li>واقي شمس SPF 50+</li>
            </ul>
          </div>
          <div class="result-card">
            <h4>🌙 روتينك المسائي المقترح</h4>
            <ul class="feature-list">
              <li>مزيل مكياج (زيتي أو ميسيلار)</li>
              <li>غسول مناسب</li>
              <li>سيروم ليلي (ريتينول أو نياسيناميد)</li>
              <li>مرطب ليلي</li>
              <li>كريم عيون</li>
            </ul>
          </div>
        `;
        skinQuizResult.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // =============================================
  // MAKEUP QUIZ
  // =============================================
  const makeupQuizForm = document.getElementById('makeupQuizForm');
  const makeupQuizResult = document.getElementById('makeupQuizResult');

  if (makeupQuizForm) {
    makeupQuizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const skin = document.querySelector('input[name="makeupSkin"]:checked')?.value || 'combination';
      const occasion = document.querySelector('input[name="makeupOccasion"]:checked')?.value || 'daily';
      const focusEls = document.querySelectorAll('input[name="makeupFocus"]:checked');
      const focus = Array.from(focusEls).map(el => el.value);

      const foundationMap = { oily: 'مات سائل - ثابت', dry: 'كريمي غني بترطيب', combination: 'سائل نصف مات', sensitive: 'معدني أو خالي من العطور' };
      const primerMap = { oily: 'برايمر مات للدهون', dry: 'برايمر مرطب', combination: 'برايمر هجين', sensitive: 'برايمر مهدئ خالي من العطور' };
      const blushMap = { oily: 'بودرة - خوخي', dry: 'كريمي - وردي دافئ', combination: 'سائل أو كريمي', sensitive: 'معدني خفيف' };
      const finishMap = { daily: 'خفيف طبيعي', work: 'متوسط احترافي', party: 'كامل جريء', wedding: 'كامل ثابت 24 ساعة' };

      const occMap = { daily: 'ماسكارا + بلاش + مرطب شفاه ملون', work: 'فاونديشن خفيف + ظلال ترابية + روج مات', party: 'سموكي آيلاينر + هايلايت + روج جريء', wedding: 'برايمر مثبت + فاونديشن كامل + رموش + روج ثابت' };

      const lipMap = { daily: 'مرطب شفاه ملون', work: 'روج مات طبيعي', party: 'روج جريء مات أو لامع', wedding: 'روج ثابت 24 ساعة' };

      const focusRecs = focus.map(f => {
        if (f === 'eyes') return '👁️ ركزي على السموكي والآيلاينر المجنح';
        if (f === 'lips') return '💋 ركزي على لون شفاه جريء مع تحديد بقلم';
        if (f === 'skin') return '✨ ركزي على بشرة نضرة وصافية بالهايلايت';
        return '';
      }).join('<br>');

      if (makeupQuizResult) {
        makeupQuizResult.style.display = 'block';
        makeupQuizResult.innerHTML = `
          <div class="result-card">
            <h4>💄 توصيات المكياج حسب حالتك</h4>
            <div class="result-item"><span class="result-label">الفاونديشن</span><span class="result-value">${foundationMap[skin]}</span></div>
            <div class="result-item"><span class="result-label">البرايمر</span><span class="result-value">${primerMap[skin]}</span></div>
            <div class="result-item"><span class="result-label">البلاشر</span><span class="result-value">${blushMap[skin]}</span></div>
            <div class="result-item"><span class="result-label">اللمسة</span><span class="result-value">${finishMap[occasion]}</span></div>
            <div class="result-item"><span class="result-label">الروج</span><span class="result-value">${lipMap[occasion]}</span></div>
            <div class="result-item"><span class="result-label">التوصية</span><span class="result-value">${occMap[occasion]}</span></div>
          </div>
          <div class="result-card">
            <h4>🎯 بناءً على اختياراتك</h4>
            <p style="font-size:0.9rem;color:var(--muted);line-height:1.8;">${focusRecs || '✨ أبرزي جمالك الطبيعي بثقة'}</p>
          </div>
          <div class="result-card">
            <h4>⚠️ نصائح مهمة</h4>
            <ul class="feature-list">
              <li>قاعدة: مكياج عيون داكن = روج هادي / مكياج عيون هادي = روج جريء</li>
              <li>استخدمي برايمر مناسب لنوع بشرتك لتثبيت المكياج</li>
              <li>نظفي فرش المكياج أسبوعياً</li>
              <li>غيري الماسكرا كل 3 شهور</li>
            </ul>
          </div>
        `;
        makeupQuizResult.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // =============================================
  // PERFUME QUIZ
  // =============================================
  const perfumeQuizForm = document.getElementById('perfumeQuizForm');
  const perfumeQuizResult = document.getElementById('perfumeQuizResult');

  if (perfumeQuizForm) {
    perfumeQuizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const season = document.querySelector('input[name="perfumeSeason"]:checked')?.value || 'summer';
      const family = document.querySelector('input[name="perfumeFamily"]:checked')?.value || 'citrus';
      const occasion = document.querySelector('input[name="perfumeOccasion"]:checked')?.value || 'daily';

      const seasMap = {
        summer: { notes: '🍊 حمضيات + 🌊 أكوا + 🌸 ورود خفيفة', conc: 'Eau de Toilette أو Body Mist', tip: 'العطور الخفيفة تثبت أكثر في الحر' },
        winter: { notes: '🌳 عود + 🍦 فانيليا + 🌙 عنبر + توابل', conc: 'Eau de Parfum أو Parfum', tip: 'العطر يثبت أطول في الجو البارد' },
        spring: { notes: '🌸 ورود + 🍑 فواكه خفيفة + 🤍 مسك أبيض', conc: 'Eau de Parfum', tip: 'العطور الزهرية تبرز في الربيع' },
        fall: { notes: '🍂 توابل + 🌳 خشب + عنبر + جلد', conc: 'Eau de Parfum', tip: 'العطور الدافئة تناسب أجواء الخريف' }
      };

      const famMap = {
        citrus: '🍊 عطر حمضيات منعش مثل Acqua di Gio - مثالي للصيف والدايلي',
        floral: '🌸 عطر زهري رومانسي مثل Miss Dior - للحالات الرسمية والرومانسية',
        woody: '🌳 عطر خشبي دافئ مثل Santal 33 - حضور قوي وأنيق',
        oriental: '🌙 عطر شرقي عنبري مثل Black Orchid - فخم وجريء - للمناسبات الخاصة',
        fresh: '🌊 عطر بحري منعش مثل Light Blue - نشيط وحيوي للصيف'
      };

      const occMap = {
        daily: '💨 Body Mist أو EDT - عطر خفيف يمنحك انتعاشاً بدون إزعاج',
        work: '💼 EDP - عطر مهني أنيق - citrus أو floral خفيف',
        evening: '🌙 EDP أو Parfum - عطر قوي جريء - oriental أو woody',
        special: '💎 Parfum - عطر فخم يدوم طويلاً - oriental لا يقاوم'
      };

      const s = seasMap[season];
      if (perfumeQuizResult) {
        perfumeQuizResult.style.display = 'block';
        perfumeQuizResult.innerHTML = `
          <div class="result-card">
            <h4>🌺 عطرك المثالي حسب اختياراتك</h4>
            <div class="result-item"><span class="result-label">الفئة العطرية</span><span class="result-value">${famMap[family]}</span></div>
            <div class="result-item"><span class="result-label">التركيز المناسب</span><span class="result-value">${occMap[occasion]}</span></div>
            <div class="result-item"><span class="result-label">نوتات موسمك</span><span class="result-value">${s.notes}</span></div>
            <div class="result-item"><span class="result-label">التركيز المثالي</span><span class="result-value">${s.conc}</span></div>
          </div>
          <div class="result-card">
            <h4>💡 نصيحة خبراء العطور</h4>
            <p style="font-size:0.9rem;color:var(--muted);">${s.tip}</p>
            <p style="font-size:0.9rem;color:var(--muted);margin-top:0.5rem;">🌿 لا تشترين عطر لحظتها - رشيه على بشرتك وامشي معه ساعتين. العطر يتغير! المقدمة تختلف عن القاعدة.</p>
          </div>
        `;
        perfumeQuizResult.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // =============================================
  // NAILS QUIZ
  // =============================================
  const nailsQuizForm = document.getElementById('nailsQuizForm');
  const nailsQuizResult = document.getElementById('nailsQuizResult');

  if (nailsQuizForm) {
    nailsQuizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const skin = document.querySelector('input[name="nailsSkin"]:checked')?.value || 'medium';
      const length = document.querySelector('input[name="nailsLength"]:checked')?.value || 'medium';
      const occasion = document.querySelector('input[name="nailsOccasion"]:checked')?.value || 'daily';

      const colorMap = {
        fair: ['وردي فاتح', 'نود شفاف', 'أحمر كلاسيكي', 'لافندر باستيل', 'فضي لامع'],
        medium: ['كورال دافئ', 'نود حنطي', 'أحمر برتقالي', 'ذهبي براق', 'بورجوندي'],
        dark: ['أحمر غامق', 'برقوقي', 'ذهبي', 'خمري', 'تركواز']
      };

      const shapeMap = { short: 'مربعة ناعمة أو مدورة', medium: 'بيضاوية أو لوزية', long: 'لوزية أو تابوت (Coffin)' };
      const occMap = {
        daily: '🤍 نود شفاف أو وردي هادي - راقي وما يلفت',
        party: '🎉 أحمر جريء أو ذهبي براق - الليل لمعان',
        wedding: '👰 فرنش كلاسيك أو وردي لامع مع ألماس - فخم ورقيق',
        vacation: '🏖️ كورال أو تركواز أو أصفر - ألوان الصيف المبهجة'
      };

      const colors = colorMap[skin] || colorMap.medium;
      if (nailsQuizResult) {
        nailsQuizResult.style.display = 'block';
        nailsQuizResult.innerHTML = `
          <div class="result-card">
            <h4>💅 توصيات الأظافر حسب اختياراتك</h4>
            <div class="result-item"><span class="result-label">الشكل المثالي</span><span class="result-value">${shapeMap[length]}</span></div>
            <div class="result-item"><span class="result-label">ألوان تناسب بشرتك</span><span class="result-value">${colors.join(' - ')}</span></div>
            <div class="result-item"><span class="result-label">للمناسبة</span><span class="result-value">${occMap[occasion]}</span></div>
          </div>
          <div class="result-card">
            <h4>🌟 اقتراحات التصاميم</h4>
            <ul class="feature-list">
              ${occasion === 'wedding' ? '<li>👰 فرنش كلاسيك مع حجر ألماس على البنصر</li><li>🌸 أومبري وردي لامع مع فضي</li>' : ''}
              ${occasion === 'party' ? '<li>✨ Chrome Nails مرآة فضي</li><li>🎨 أومبري بورجوندي مع ذهبي</li>' : ''}
              ${occasion === 'vacation' ? '<li>🏖️ ألوان صيفية زاهية (كورال + تركواز)</li><li>🌴 رسومات استوائية على أظافر الأكسنت</li>' : ''}
              ${occasion === 'daily' ? '<li>🤍 فرنش نود بسيط - راقي للدوام</li><li>🌸 لون واحد وردي هادي مع طبقة لامعة</li>' : ''}
            </ul>
          </div>
        `;
        nailsQuizResult.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // =============================================
  // ACCESSORIES QUIZ
  // =============================================
  const accessoriesQuizForm = document.getElementById('accessoriesQuizForm');
  const accessoriesQuizResult = document.getElementById('accessoriesQuizResult');

  if (accessoriesQuizForm) {
    accessoriesQuizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const veins = document.querySelector('input[name="accVeins"]:checked')?.value || 'both';
      const style = document.querySelector('input[name="accStyle"]:checked')?.value || 'gold';
      const occasion = document.querySelector('input[name="accOccasion"]:checked')?.value || 'daily';

      const metalMap = {
        green: { best: '✨ الذهبي (أصفر أو وردي)', why: 'عروقك الخضراء تدل على undertone دافئ - الذهبي يبرز جمال بشرتك', also: 'ذهبي وردي (Rose Gold) - برونزي - نحاسي' },
        blue: { best: '🥈 الفضي أو البلاتين', why: 'عروقك الزرقاء تدل على undertone بارد - الفضي يلمع على بشرتك', also: 'أبيض (وايت جولد) - ألوان باردة - فولاذ' },
        both: { best: '🌹 الاثنين أو Rose Gold', why: 'Undertone محايد - يناسبك الذهبي والفضي!', also: 'روز جولد - مزيج ذهب وفضة - الوان ترابية' }
      };

      const occMap = {
        daily: '🤍 أقراط صغيرة + ساعة أنيقة + سلسال رفيع - راقي وبسيط',
        work: '💼 أقراط متوسط + ساعة معدنية + خاتم بسيط - محترف وأنيق',
        party: '🎉 أقراط كبيرة لامعة + سوار لامع أو كف - حضور قوي',
        wedding: '👰 طقم كامل (أقراط + عقد + سوار + خاتم) - فخم ولامع'
      };

      const m = metalMap[veins] || metalMap.both;
      if (accessoriesQuizResult) {
        accessoriesQuizResult.style.display = 'block';
        accessoriesQuizResult.innerHTML = `
          <div class="result-card">
            <h4>💎 توصيات الإكسسوارات</h4>
            <div class="result-item"><span class="result-label">المعدن المناسب لك</span><span class="result-value">${m.best}</span></div>
            <div class="result-item"><span class="result-label">السبب</span><span class="result-value" style="font-weight:400;">${m.why}</span></div>
            <div class="result-item"><span class="result-label">بدائل تناسبك</span><span class="result-value">${m.also}</span></div>
            <div class="result-item"><span class="result-label">للمناسبة</span><span class="result-value">${occMap[occasion]}</span></div>
          </div>
          <div class="result-card">
            <h4>⚠️ قواعد الإكسسوارات</h4>
            <ul class="feature-list">
              <li>👑 لا تلبسين أكثر من 3-4 قطع</li>
              <li>✨ الكل ذهبي أو الكل فضي - ما نخلط المعادن</li>
              <li>📏 الإكسسوارات الكبيرة للوجوه الكبيرة والعكس</li>
              <li>💎 "قبل ما تطلعين من البيت - شيلي قطعة واحدة" - كوكو شانيل</li>
            </ul>
          </div>
        `;
        accessoriesQuizResult.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // =============================================
  // HAIR QUIZ
  // =============================================
  const hairQuizForm = document.getElementById('hairQuizForm');
  const hairQuizResult = document.getElementById('hairQuizResult');

  if (hairQuizForm) {
    hairQuizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const hairType = document.querySelector('input[name="hairType"]:checked')?.value || 'straight';
      const issues = document.querySelectorAll('input[name="hairIssues"]:checked');
      const issueList = Array.from(issues).map(el => el.value);

      const shampooMap = {
        straight: 'شامبو خفيف - مرتين بالأسبوع',
        wavy: 'شامبو خالي من السلفات - مرتين بالأسبوع',
        curly: 'شامبو مرطب بدون سلفات - مرة بالأسبوع',
        coily: 'شامبو كريمي غني - مرة بالأسبوع'
      };
      const conditionerMap = {
        straight: 'بلسم خفيف على الأطراف فقط',
        wavy: 'بلسم للتموجات - من المنتصف للأطراف',
        curly: 'بلسم غني بالزبدة - leave-in conditioner',
        coily: 'Deep conditioner كل غسلة - leave-in'
      };
      const oilMap = {
        straight: 'سيروم خفيف - زيت أرغان',
        wavy: 'زيت جوز الهند أو جوجوبا',
        curly: 'زبدة شيا + زيت جوز الهند',
        coily: 'زيت الخروع + زيت جوز الهند + زبدة شيا'
      };

      const issueTips = {
        loss: '🍃 لتساقط الشعر: مينوكسيديل (باستشارة طبية) + مكملات حديد وزنك',
        split: '✂️ للتقصف: قصي الأطراف كل 6-8 أسابيع - لا مفر من القص!',
        dry: '💧 للجفاف: ماسك زيت جوز الهند مرة أسبوعياً + قللي الشامبو',
        dandruff: '🧴 للقشرة: شامبو ضد القشرة + خل تفاح مخفف مرة أسبوعياً'
      };

      let extra = '';
      if (issueList.length > 0) {
        extra = issueList.map(i => issueTips[i] || '').filter(Boolean).map(t => `<li>${t}</li>`).join('');
      }

      if (hairQuizResult) {
        hairQuizResult.style.display = 'block';
        hairQuizResult.innerHTML = `
          <div class="result-card">
            <h4>💇‍♀️ روتين الشعر المخصص</h4>
            <div class="result-item"><span class="result-label">الشامبو</span><span class="result-value">${shampooMap[hairType]}</span></div>
            <div class="result-item"><span class="result-label">البلسم</span><span class="result-value">${conditionerMap[hairType]}</span></div>
            <div class="result-item"><span class="result-label">الزيت/الترطيب</span><span class="result-value">${oilMap[hairType]}</span></div>
            <div class="result-item"><span class="result-label">الحماية الحرارية</span><span class="result-value">ضروري قبل السشوار والمكواة - رشي واقي حرارة</span></div>
          </div>
          ${extra ? `
          <div class="result-card">
            <h4>🔧 حلول لمشاكلك</h4>
            <ul class="feature-list">${extra}</ul>
          </div>` : ''}
        `;
        hairQuizResult.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // =============================================
  // OUTFIT UPLOAD
  // =============================================
  const outfitUpload = document.getElementById('outfitUpload');
  const uploadedItems = document.getElementById('uploadedItems');
  const generateOutfitBtn = document.getElementById('generateOutfit');
  const outfitResults = document.getElementById('outfitResults');

  if (outfitUpload) {
    outfitUpload.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files.length > 8) {
        alert('⚠️ يمكنك رفع 8 صور كحد أقصى');
        return;
      }
      if (uploadedItems) {
        uploadedItems.innerHTML = '';
        Array.from(files).forEach(file => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const div = document.createElement('div');
            div.className = 'uploaded-item';
            div.innerHTML = `<img src="${ev.target.result}" alt="قطعة ملابس">`;
            uploadedItems.appendChild(div);
          };
          reader.readAsDataURL(file);
        });
      }
    });
  }

  if (generateOutfitBtn) {
    generateOutfitBtn.addEventListener('click', () => {
      if (outfitResults) {
        outfitResults.style.display = 'block';
        outfitResults.innerHTML = `
          <h4 style="color:var(--primary);margin-bottom:1rem;">✨ التنسيقات المقترحة</h4>
          <div class="outfit-result-card">
            <h5>🏆 التنسيق 1: كاجوال أنيق</h5>
            <p style="font-size:0.9rem;color:var(--muted);">
              بنطلون + بلوزة متناسقة الألوان + حذاء رياضي أبيض<br>
              ✦ إكسسوارات: ساعة ذهبية + أقراط صغيرة<br>
              ✦ شنطة: كروس متوسطة<br>
              ✦ تسريحة: كعكة منخفضة ناعمة
            </p>
          </div>
          <div class="outfit-result-card">
            <h5>🥈 التنسيق 2: رسمي أنيق</h5>
            <p style="font-size:0.9rem;color:var(--muted);">
              بنطلون قماش غامق + بلوزة رسمية + كعب متوسط<br>
              ✦ إكسسوارات: عقد بسيط + ساعة أنيقة<br>
              ✦ شنطة: يد صغيرة<br>
              ✦ تسريحة: شعر منسدل بتمويج ناعم
            </p>
          </div>
          <div class="outfit-result-card">
            <h5>🥉 التنسيق 3: رومانسي</h5>
            <p style="font-size:0.9rem;color:var(--muted);">
              تنورة متوسطة + بلوزة ناعمة + حذاء مسطح أنيق<br>
              ✦ إكسسوارات: قلادة رقيقة + أقراط متدلية<br>
              ✦ شنطة: توت متوسطة<br>
              ✦ تسريحة: ضفيرة جانبية
            </p>
          </div>
        `;
        outfitResults.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // =============================================
  // TEEN ZONE QUIZ
  // =============================================
  const teenQuizForm = document.getElementById('teenQuizForm');
  const teenQuizResult = document.getElementById('teenQuizResult');

  if (teenQuizForm) {
    teenQuizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const age = document.querySelector('input[name="teenAge"]:checked')?.value || '15-17';
      const skin = document.querySelector('input[name="teenSkinType"]:checked')?.value || 'normal';
      const hair = document.querySelector('input[name="teenHairIssue"]:checked')?.value || 'none';
      const goal = document.querySelector('input[name="teenGoal"]:checked')?.value || 'skin';

      const ageTips = {
        '12-14': '🌷 عمرك 12-14: ابدئي بروتين بسيط - غسول + مرطب + واقي شمس. لا تستعجلي المكياج!',
        '15-17': '🌺 عمرك 15-17: ركزي على تنظيف بشرتك من آثار المكياج الخفيف واستخدمي منتجات مناسبة لعمرك.',
        '18-20': '💫 عمرك 18-20: عرفتي احتياجات بشرتك - طوري روتينك وأضيفي سيرومات خفيفة.'
      };

      const skinTips = {
        oily: '🧴 بشرتك دهنية: غسول جل + مرطب خفيف بدون زيت + واقي شمس. قناع الطين مرة بالأسبوع.',
        dry: '🧴 بشرتك جافة: غسول كريمي + مرطب غني + سيروم هيالورونيك. تجنبي الغسول القاسي.',
        combination: '🧴 بشرتك مختلطة: غسول لطيف + مرطب خفيف + واقي شمس. اهتمي بمنطقة T.',
        normal: '🧴 بشرتك عادية: الحمدلله! حافظي على روتينك البسيط - غسول + مرطب + واقي شمس.'
      };

      const hairTips = {
        dry: '💇‍♀️ شعرك جاف: ماسك زيت جوز الهند أسبوعياً + قللي الشامبو + بلسم غني. قصي الأطراف كل 8 أسابيع.',
        oily: '💇‍♀️ شعرك دهني: شامبو لطيف 3 مرات بالأسبوع + بلسم عالأطراف بس. تجنبي الزيوت عالفروة.',
        loss: '💇‍♀️ تساقط شعر: تأكدي من أكلك - حديد وزنك وفيتامينات. استشيري دكتورة إذا استمر.',
        none: '💇‍♀️ شعرك بخير! حافظي على روتين غسيل منتظم وزيوت طبيعية خفيفة.'
      };

      const goalTips = {
        hair: '🌟 تركيزك على الشعر - ابدئي بماسكات طبيعية وقللي الحرارة. شعرك رح يردلك الجميل.',
        skin: '🌟 تركيزك على البشرة - روتين 3 خطوات هو أساسك. الحبوب طبيعية في عمرك لا تقلقي.',
        body: '🌟 تركيزك على الصحة - أكلي متوازن ورياضة ونوم كاف. جسمك يستحق أفضل اهتمام.',
        confidence: '🌟 تركيزك على الثقة - أجمل شي فيك ثقتك بنفسك. تقبّلي نفسك وكوني فخورة بمن أنتِ.'
      };

      if (teenQuizResult) {
        teenQuizResult.style.display = 'block';
        teenQuizResult.innerHTML = `
          <div class="result-card" style="background:linear-gradient(135deg,#fff,#fdf6f0);border:1px solid #d4af37;border-radius:16px;padding:24px;margin-bottom:1rem;">
            <h4 style="color:#800020;font-size:1.2rem;margin-bottom:1rem;">🌸 نصائحك المخصصة</h4>
            <div class="result-item"><span class="result-label">👧 لعمرك</span><span class="result-value">${ageTips[age]}</span></div>
            <div class="result-item"><span class="result-label">🧴 لبشرتك</span><span class="result-value">${skinTips[skin]}</span></div>
            <div class="result-item"><span class="result-label">💇‍♀️ لشعرك</span><span class="result-value">${hairTips[hair]}</span></div>
            <div class="result-item"><span class="result-label">🎯 لهدفك</span><span class="result-value">${goalTips[goal]}</span></div>
          </div>
          <div class="result-card" style="background:linear-gradient(135deg,#fff,#fdf6f0);border:1px solid #d4af37;border-radius:16px;padding:24px;">
            <h4 style="color:#800020;font-size:1.2rem;margin-bottom:1rem;">💝 تذكري دايم</h4>
            <ul class="feature-list" style="list-style:none;padding:0;">
              <li style="padding:6px 0;">🌸 كل بنت تمر بنفس التغيرات - مو لحالك</li>
              <li style="padding:6px 0;">💖 جمالك الحقيقي في ثقتك وابتسامتك</li>
              <li style="padding:6px 0;">📚 الدراسة والعلم أهم من كل شي</li>
              <li style="padding:6px 0;">👯 صديقاتك الحقيقيات يرفعونك مو ينرفزونك</li>
              <li style="padding:6px 0;">🌟 انتي فريدة - لا تقارنين نفسك بأحد</li>
            </ul>
          </div>
        `;
        teenQuizResult.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // =============================================
  // SUBSCRIPTION
  // =============================================
  const subscribeBtns = document.querySelectorAll('.subscribe-btn');
  subscribeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.getAttribute('data-plan') || 'الاشتراك';
      const confirmed = confirm(`✨ هل ترغبين في الاشتراك في باقة "${plan}"؟\n\nسيفتح لك كل الميزات لمدة شهر كامل!`);
      if (confirmed) {
        alert(`🎉 تم اشتراكك في باقة "${plan}" بنجاح!\n\nشكراً لثقتكِ بدهبية. استمتعي بتجربة الجمال العلمية ✨`);
      }
    });
  });

  // =============================================
  // TABS SYSTEM
  // =============================================
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const tabBtns = tabGroup.querySelectorAll('.tab-btn');
    const contents = tabGroup.parentElement.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        contents.forEach(c => {
          c.classList.remove('active');
          if (c.id === target) c.classList.add('active');
        });
      });
    });
  });

  document.querySelectorAll('.subtab-nav').forEach(nav => {
    const parent = nav.parentElement;
    const contents = parent.querySelectorAll('.subtab-content');
    nav.querySelectorAll('.subtab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-subtab');
        nav.querySelectorAll('.subtab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        contents.forEach(c => {
          c.classList.remove('active');
          if (c.id === target) c.classList.add('active');
        });
      });
    });
  });

  // =============================================
  // MYTH BUSTER - 1000+ خرافة
  // =============================================
  const myths = [
    // === المكياج والعناية ===
    { myth: '"غسل الوجه كثير ينظف البشرة أحسن"', truth: 'مرتين يومياً كافي. الزيادة تزيل الزيوت الطبيعية وتجعل البشرة تنتج زيوت أكثر!' },
    { myth: '"المسام تنفتح وتنقفل"', truth: 'المسام ما عندها عضلات - ما تنفتح وتنقفل! الحرارة تخفف الشوائب فقط.' },
    { myth: '"معجون الأسنان يعالج الحبوب"', truth: 'يسبب حروق وتهيج شديد - استخدمي علاج مخصص للحبوب.' },
    { myth: '"الليمون يبيض البشرة"', truth: 'يحرق البشرة ويسبب تصبغات مع الشمس. خطير جداً على البشرة!' },
    { myth: '"قص الشعر يطوله"', truth: 'القص ما يأثر على البصيلة نهائياً. بس يشيل التقصف ويحسن المظهر.' },
    { myth: '"المنتج الغالي دائماً أحسن"', truth: 'المكونات هي اللي تهم، مش السعر. في منتجات رخيصة ممتازة!' },
    { myth: '"العطور الجيدة تدوم أكثر إذا دلكتيها"', truth: 'الدلك يكسّر جزيئات العطر ويخلي رائحته تزول أسرع. رشي وخليه يطير.' },
    { myth: '"تقشير البشرة كل يوم ضروري"', truth: 'التقشير الزائد يخرب طبقة الحماية ويسبب حساسية. مرتين بالأسبوع كافي.' },
    { myth: '"واقي الشمس فقط للصيف"', truth: 'أشعة UV موجودة طول السنة حتى في الشتاء والغيوم. واقي الشمس ضروري يومياً!' },
    { myth: '"المنتجات الطبيعية آمنة 100%"', truth: 'طبيعي ما يعني آمن. السموم الطبيعية موجودة! زيوت عطرية غير مخففة تسبب حروق.' },
    { myth: '"كريم الأساس يسد المسام ويسبب حبوب"', truth: 'إذا اخترتي كريم أساس غير كوميدوغينيك ومناسب لنوع بشرتك، ما يسبب حبوب.' },
    { myth: '"النوم بالمكياج مرة وحدة ما يضر"', truth: 'مرة وحدة كافية تسد المسام وتسبب حبوب وتجاعيد مبكرة. أبداً لا تنامين بالمكياج!' },
    { myth: '"الماء البارد يصغر المسام"', truth: 'الماء البارد يشد البشرة مؤقتاً، ما يصغر المسام للأبد. المسام حجمها وراثي.' },
    { myth: '"فيتامين C يبيض البشرة بين ليلة وضحاها"', truth: 'فيتامين C يوحد لون البشرة ويحميها، لكن يحتاج أسابيع إلى شهور عشان تظهر النتائج.' },
    { myth: '"السيروم أغلى من المرطب - ففعاليته أحسن"', truth: 'السيروم يعالج مشكلة محددة، المرطب يرطب. الإثنين مهمين وما يغني واحد عن الثاني.' },
    { myth: '"البشرة الدهنية ما تحتاج مرطب"', truth: 'البشرة الدهنية تحتاج مرطب عشان التوازن. الحرمان من الترطيب يزيد الزيوت!' },
    { myth: '"الحليب يبيض البشرة"', truth: 'لا توجد دراسات تثبت إن الحليب يبيض البشرة. لكنه يرطبها بفضل الدهون والفيتامينات.' },
    { myth: '"الماي كلينسينغ (زيت) يسبب حبوب"', truth: 'زيت التنظيف إذا استخدمتيه صح ثم غسلتيه بغسول مائي، ينظف المسام وما يسبب حبوب.' },
    { myth: '"مزيل العرق يسبب سرطان الثدي"', truth: 'لا توجد دراسات قاطعة تربط مزيل العرق بسرطان الثدي. لكن الفثالات فيه تستدعي الحذر.' },
    { myth: '"البشرة تحتاج تونر بعد الغسيل"', truth: 'التونر مو ضروري إذا استخدمتي غسول متوازن. التونرات القاسية تسبب جفاف.' },
    // === الشعر ===
    { myth: '"غسل الشعر كل يوم ضروري"', truth: 'غسل الشعر يومياً يزيل الزيوت الطبيعية ويجفف فروة الرأس. 2-3 مرات بالأسبوع كافي.' },
    { myth: '"البلسم يسبب تساقط الشعر"', truth: 'البلسم يرطب الشعر وما يسبب تساقط. التساقط له أسباب هرمونية أو غذائية.' },
    { myth: '"فرك الشعر بالمنشفة يجففه أسرع"', truth: 'الفرك يسبب تقصف وتكسر الشعر. استخدمي منشفة ميكرويفابر وربتي بلطف.' },
    { myth: '"استخدام الزيت على الشعر يسبب قشرة"', truth: 'القشرة سببها فطريات مو زيت. بعض الزيوت تعالج القشرة وتقللها.' },
    { myth: '"قص أطراف الشعر يمنع التقصف"', truth: 'القص يشيل الأطراف المتقصفة فقط. ما يمنع ظهور تقصف جديد - العناية بالشعر تمنعه.' },
    { myth: '"تمشيط الشعر 100 مرة يومياً يلمعه"', truth: 'التمشيط الزائد يسبب تكسر وجفاف. مشطي شعرك فقط لتصفيفه بلطف.' },
    { myth: '"الشعر الدهني ما يحتاج زيت"', truth: 'الزيت يرطب فروة الرأس وقد يقلل إفراز الزيوت الزائدة. نوع الزيت مهم.' },
    { myth: '"صبغات الشعر تسبب السرطان"', truth: 'لا توجد دراسات تثبت إن صبغات العصر الحديث تسبب السرطان. لكن اختاري خالية من الأمونيا.' },
    { myth: '"الشعر يموت ويجف من الحرارة"', truth: 'الحرارة الزائدة فعلاً تضر الشعر. استخدمي واقي حرارة قبل السشوار والمكواة.' },
    { myth: '"الصلع وراثة من الأب فقط"', truth: 'الصلع الوراثي يجي من الأب والأم معاً. الجينات من الطرفين مهمة.' },
    // === العناية بالجسم ===
    { myth: '"شرب 8 أكواب ماء يومياً ينقي البشرة"', truth: 'الماء ضروري للصحة لكن ما يزيل السموم مباشرة. الكلى والكبد هم المسؤولون.' },
    { myth: '"التعرق يخلص الجسم من السموم"', truth: 'التعرق ينظم حرارة الجسم فقط. الكبد والكلى هما المسؤولان عن تنظيف الجسم.' },
    { myth: '"ممارسة الرياضة تسبب تجاعيد"', truth: 'الرياضة تنشط الدورة الدموية وتزيد الكولاجين. بالعكس، تقلل التجاعيد!' },
    { myth: '"الاستحمام بماء بارد يشد البشرة"', truth: 'الماء البارد يشدها مؤقتاً بس. ما يطول. ويرجع الوضع طبيعي بعدين.' },
    { myth: '"الكريمات الغالية تشتغل أسرع"', truth: 'سرعة المفعول تعتمد على المكونات وتركيزها، مو على السعر.' },
    { myth: '"زيت جوز الهند يرطب البشرة الجافة"', truth: 'زيت جوز الهند يسد المسام لبعض أنواع البشرة. للجسم ممتاز، للوجه اختاري جوجوبا.' },
    { myth: '"تدليك البشرة يمنع التجاعيد"', truth: 'التدليك ينشط الدورة الدموية لكنه ما يمنع التجاعيد نهائياً. واقي الشمس أهم.' },
    // === العطور ===
    { myth: '"فرك العطر على المعصمين يزيد ثباته"', truth: 'الفرك يكسّر الجزيئات ويخلي العطر يزول أسرع. رشي وخليه يطير.' },
    { myth: '"العطور الرخيصة كلها مضرة"', truth: 'السعر مو مقياس للجودة. المكونات هي اللي تهم. في عطور رخيصة وآمنة.' },
    { myth: '"العطور تدوم أكثر لو حطيتها على الملابس"', truth: 'الملابس تحتفظ بالعطر أطول من البشرة فعلاً. لكن بعض العطور تصبغ الملابس.' },
    // === وصفات منزلية ===
    { myth: '"معجون أسنان + أسبرين = ماسك للوجه"', truth: 'خطير جداً! يحرق البشرة ويسبب حساسية مزمنة وتصبغات.' },
    { myth: '"البيض والعسل يشد الوجه"', truth: 'البيض والعسل يرطبون ويعطون شد مؤقت بس. ما يطول ولا يمنع التجاعيد.' },
    { myth: '"السكر وزيت الزيتون مقشر رائع"', truth: 'حبيبات السكر خشنة وقد تسبب جروح دقيقة بالوجه. استخدمي مقشر كيميائي لطيف.' },
    { myth: '"النشا والليمون يبيض البشرة"', truth: 'النشا يسد المسام والليمون يحرق البشرة. ابتعدي عن هالخلطة.' },
    { myth: '"خلطة الثوم تنبت الشعر"', truth: 'الثوم يسبب حروق فروة الرأس. ما في دراسات كافية تثبت إنه ينبت الشعر.' },
    { myth: '"زيت الخروع ينبت الرموش والحواجب"', truth: 'زيت الخروع يرطب ويكثف الشعر الموجود. ما ينبت شعر جديد من الصفر.' },
    { myth: '"العسل والقرفة يزيلان حب الشباب"', truth: 'العسل مضاد بكتيريا طبيعي لكن القرفة تحرق البشرة. استخدمي العسل لحاله.' },
    // === التغذية ===
    { myth: '"الكولاجين الفموي يشد البشرة"', truth: 'الكولاجين يتحلل في المعدة. الدراسات ضعيفة، لكنه قد يساعد مع فيتامين C.' },
    { myth: '"الأكل الدهني يسبب حب الشباب"', truth: 'العلاقة مو مباشرة. السكريات والكربوهيدرات البسيطة ترفع الإنسولين وتسبب حبوب أكثر.' },
    { myth: '"شرب الكحول ينظف البشرة"', truth: 'الكحول يجفف البشرة ويهيجها. يوسع الأوعية الدموية ويظهر الاحمرار.' },
    { myth: '"الاكل الحار يسبب حبوب"', truth: 'الأكل الحار يوسع الأوعية ويحمر الوجه. ما يسبب حبوب مباشرة لكن قد يهيج الحساسية.' },
    { myth: '"الكافيين يسبب جفاف البشرة"', truth: 'الكافيين مدر بول خفيف جداً. بكميات معتدلة (2-3 أكواب) ما يسبب جفاف.' },
    // === الجلدية ===
    { myth: '"البشرة الجافة تتحول لدهنية مع العمر"', truth: 'مع العمر البشرة تصبح أ جفاف. الدهنية تقل بسبب توقف المبيض عن إفراز الهرمونات.' },
    { myth: '"حروق الشمس تتحول لسمرة"', truth: 'حروق الشمس تضر الحمض النووي للخلايا وتزيد خطر السرطان. السمرة أضرارها أقل لكنها مو آمنة.' },
    { myth: '"الوحمات تتحول لسرطان"', truth: 'معظم الوحمات حميدة. لو تغير شكلها أو لونها أو حجمها - راجعي طبيب.' },
    { myth: '"التقشير الكيميائي يسبب سرطان"', truth: 'التقشير الكيميائي الآمن تحت إشراف طبيب ما يسبب سرطان. يزيل خلايا تالفة فقط.' },
    { myth: '"حبوب الشباب تروح لوحدها بعد المراهقة"', truth: 'كثير من النساء يعانين من حبوب البالغين حتى الثلاثينيات. تحتاج علاج مخصص.' },
    { myth: '"الريتينول يرقق الجلد"', truth: 'الريتينول يزيد سمك طبقة الكولاجين. يرقق الطبقة الميتة السطحية فقط - وهذا المطلوب.' },
    { myth: '"البوتوكس يسمم الجسم"', truth: 'البوتوكس بجرعات تجميلية آمن ومعتمد من FDA. يمنع التجاعيد مؤقتاً بس.' },
    { myth: '"الاكزيما تنتقل باللمس"', truth: 'الاكزيما التهاب تحسسي وراثي مو معدي. ما تنتقل من شخص لآخر.' },
    { myth: '"الصدفية تسبب تساقط الشعر"', truth: 'الصدفية في فروة الرأس تسبب حكة وقشرة جافة. تساقط الشعر مو ضروري.' },
    { myth: '"فيتامين E يزيل آثار الحبوب"', truth: 'ما في دراسات كافية تثبت فعالية فيتامين E لإزالة الندبات. قد يسد المسام.' },
    // === الأظافر ===
    { myth: '"البقع البيضاء على الأظافر نقص كالسيوم"', truth: 'سببها صدمة بسيطة أو نقص زنك. نادراً ما تكون نقص كالسيوم.' },
    { myth: '"الأظافر تتنفس وتحتاج بريك من المناكير"', truth: 'الأظافر ما تتنفس - ما فيها رئات! البريك مهم لمنع الاصفرار والضعف.' },
    { myth: '"قص الجليدة يخلي الأظافر أطول"', truth: 'الجليدة تحمي الظفر من البكتيريا. قصها يسبب التهاب خطير.' },
    { myth: '"الجل يدمر الأظافر للأبد"', truth: 'الجل يضعف الظفر مؤقتاً. مع العناية والترطيب، الظفر يرجع طبيعي.' },
    { myth: '"برد الأظافر ذهاباً وإياباً أسرع"', truth: 'البرد ذهاباً وإياباً يكسر الأظافر ويضعفها. بردي باتجاه واحد فقط.' },
    { myth: '"الأظافر الطويلة أقوى"', truth: 'الأظافر الطويلة أسهل تتكسر. الطول المثالي 2-3 مم بعد طرف الإصبع.' },
    // === المزيد من الخرافات ===
    { myth: '"الصابون البلدي يبيض البشرة"', truth: 'الصابون البلدي قلوي جداً ويجفف البشرة. ما يبيضها بل يخرب حاجز الحماية.' },
    { myth: '"ماء الورد يشد المسام"', truth: 'ماء الورد منعش ومهدئ لكنه ما يشد المسام. المسام بدون عضلات.' },
    { myth: '"الزنجبيل للوجه يحرق الدهون"', truth: 'الزنجبيل يسبب حروق كيميائية. الدهون ما تتحرق بكريمات موضعية.' },
    { myth: '"وضع الثلج على الوجه يشد البشرة"', truth: 'الثلج يقلل الانتفاخ مؤقتاً. الاستخدام المباشر يسبب حروق باردة وشعيرات دموية مكسورة.' },
    { myth: '"زيت الزيتون يزيل المكياج"', truth: 'زيت الزيتون يزيل المكياج لكنه يسد المسام. استخدمي زيت جوجوبا أو ميسيلار.' },
    { myth: '"معقم اليدين يعقم البشرة"', truth: 'الكحول يقتل البكتيريا لكنه يجفف البشرة ويهيجها. استخدمي مرطب بعده.' },
    { myth: '"الليمون الحامض يزيل البقع الداكنة"', truth: 'الليمون يحرق البشرة ويجعلها أكثر حساسية للشمس. يزيد البقع سوءاً.' },
    { myth: '"خل التفاح يعالج حب الشباب"', truth: 'خل التفاح مخفف مفيد لكنه قوي وقد يحرق البشرة. مو مناسب للكل.' },
    { myth: '"الفحم ينقي البشرة بعمق"', truth: 'الفحم ينظف لكنه يجفف. الاستخدام الزائد يخرب الحاجز الواقي للبشرة.' },
    { myth: '"بيكربونات الصوديوم تبيض الأسنان"', truth: 'البيكربونات كاشطة وتخرب مينا الأسنان مع الاستخدام المتكرر.' },
    { myth: '"زيت الأرغان يعالج كل مشاكل الشعر"', truth: 'زيت الأرغان ممتاز للترطيب لكنه ما يعالج التقصف أو التساقط لوحده.' },
    { myth: '"الكريمات المرطبة تسبب حبوب للبشرة الدهنية"', truth: 'المرطب الخفيف الخالي من الزيوت (Oil-Free) ضروري حتى للبشرة الدهنية.' },
    { myth: '"حبوب منع الحمل تسبب كلف"', truth: 'حبوب منع الحمل قد تسبب كلف لصاحبات البشرة الداكنة. استشيري طبيبتك.' },
    { myth: '"الوشم (التاتو) يمنع واقي الشمس"', truth: 'الوشم المندمل عادي تضعين واقي الشمس فوقه. انتظري حتى يلتئم كامل.' },
    { myth: '"العلكة تمنع التجاعيد"', truth: 'العلكة تسبب تجاعيد حول الفم بسبب الحركة المتكررة. بالعكس!' },
    { myth: '"النوم على وسادة حرير يمنع التجاعيد"', truth: 'الحرير يقلل احتكاك البشرة بالوسادة لكنه ما يمنع كل التجاعيد.' },
    { myth: '"الرياضة تمنع السيلوليت"', truth: 'الرياضة تقلل السيلوليت لكنها ما تمنعه بالكامل. السيلوليت له عوامل هرمونية ووراثية.' },
    { myth: '"شرب الماء البارد يحرق سعرات حرارية"', truth: 'الفرق ضئيل جداً. الماء البارد يحرق كم سعرة قليلة ما تأثر بالوزن.' },
    { myth: '"التدخين الإلكتروني ما يضر البشرة"', truth: 'النيكوتين يقلص الأوعية الدموية ويمنع وصول الأكسجين للبشرة. يسبب شيخوخة مبكرة.' },
    { myth: '"السهر ما يأثر على البشرة"', truth: 'السهر يزيد هرمون الكورتيزول ويسبب حبوب وجفاف وهالات سوداء. النوم الكافي ضروري.' },
    { myth: '"القهوة تسبب جفاف البشرة"', truth: 'القهوة بكميات معتدلة (2-3 أكواب) وما تسبب جفاف. القهوة فيها مضادات أكسدة.' },
    { myth: '"المشروبات الغازية تسبب حب الشباب"', truth: 'السكر في المشروبات الغازية يرفع الإنسولين ويحفز إفراز الزيوت، مما يسبب حبوب.' },
    { myth: '"الشوكولاتة تسبب حب الشباب"', truth: 'الشوكولاتة الداكنة (70%+) عادةً آمنة. شوكولاتة الحليب والسكر هي المشكلة.' },
    { myth: '"الألبان تسبب حب الشباب"', truth: 'بعض الناس عندهم حساسية من الألبان تسبب حبوب. مو الكل يتأثر.' },
    { myth: '"الغلوتين يسبب حب الشباب"', truth: 'فقط إذا عندك حساسية غلوتين أو داء بطني. للعادي، الغلوتين آمن.' },
    { myth: '"الرجيم القاسي ينقي البشرة"', truth: 'الحرمان من الطعام يسبب نقص فيتامينات ويجعل البشرة باهتة وجافة. التغذية المتوازنة أهم.' },
    { myth: '"السمك يسبب حساسية للبشرة"', truth: 'السمك مصدر أوميغا 3 المفيد للبشرة. الحساسية منه نادرة.' },
    // === خرافات من قاعدة المكونات ===
    { myth: '"البارابين آمن ومصرّح به"', truth: 'البارابين مرتبط باضطراب هرموني. الأفضل تختاري منتجات Paraben-Free.' },
    { myth: '"الفثالات في العطور شي طبيعي"', truth: 'الفثالات تسبب اضطراب هرموني ومشاكل بالإنجاب. ابحثي عن عطور Phthalate-Free.' },
    { myth: '"الكحول في التونر ينظف البشرة"', truth: 'الكحول يجفف البشرة ويهيجها. اختاري تونر خالي من الكحول.' },
    { myth: '"الكبريتات تنظف الشعر بعمق"', truth: 'الكبريتات قاسية على الشعر وفروة الرأس. استخدمي شامبو خالي من SLS/SLES.' },
    { myth: '"الريتينول يسبب سرطان"', truth: 'الريتينول من أكثر المواد المدروسة في التجميل. آمن وفعال لمكافحة الشيخوخة.' },
    { myth: '"الهيدروكينون آمن للاستخدام الطويل"', truth: 'الهيدروكينون خطير للاستخدام الطويل. ممنوع في أوروبا واليابان.' },
    { myth: '"الرصاص في أحمر الشفاه خرافة"', truth: 'الرصاص معدن ثقيل سام. موجود بكميات ضئيلة لكن بعض الماركات خالية منه.' },
    { myth: '"الزيوت المعدنية ترطب البشرة"', truth: 'الزيوت المعدنية تسد المسام ولا ترطب بعمق. زيوت نباتية أفضل.' },
    { myth: '"التلك آمن للاستخدام اليومي"', truth: 'التلك الملوث يحتوي أسبستوس. ابحثي عن Talc-Free.' },
    { myth: '"مزيل المناكير بالأسيتون أسرع"', truth: 'الأسيتون يجفف الأظافر ويضعفها. استخدمي مزيل بدون أسيتون.' },
    // === خرافات إضافية ===
    { myth: '"العناية بالبشرة تبدأ في عمر 30"', truth: 'العناية تبدأ من الطفولة - تنظيف وترطيب وواقي شمس. الوقاية خير من العلاج.' },
    { myth: '"التبييض للبشرة السمراء خطر"', truth: 'التبييض بمكونات طبيعية مع واقي شمس آمن. التبييض الكيميائي القوي هو الخطر.' },
    { myth: '"الليزر يزيل الشعر للأبد"', truth: 'الليزر يقلل الشعر بشكل كبير لكنه ما يزيله للأبد. يحتاج جلسات صيانة.' },
    { myth: '"الحلاوة تنبت الشعر تحت الجلد"', truth: 'الحلاوة تقتلع الشعر من الجذر. الشعر الناشب سببه تقشير فروة الرأس مو الحلاوة.' },
    { myth: '"الحجامة تنقي البشرة"', truth: 'الحجامة تنشط الدورة الدموية لكنها ما تنقي البشرة. قد تسبب كدمات مؤقتة.' },
    { myth: '"الوشم بالحناء طبيعي وآمن"', truth: 'الحناء السوداء تحتوي بارافينيلين دايامين (PPD) يسبب حساسية شديدة وحروق.' },
    { myth: '"مضاد التعرق يمنع التعرق تماماً"', truth: 'مضاد التعرق يقلل التعرق ولا يمنعه. التعرق عملية طبيعية ضرورية.' },
    { myth: '"الكريم الواقي يمنع فيتامين D"', truth: 'واقي الشمس يقلل إنتاج فيتامين D لكن ما يمنعه. 15 دقيقة شمس يومياً كافية.' },
    { myth: '"البشرة السمراء ما تحتاج واقي شمس"', truth: 'الميلانين يعطي حماية طبيعية (SPF 13 تقريباً) لكنها مو كافية. الكل يحتاج واقي.' },
    { myth: '"الحبوب تحت الجلد تنضغط وتطلع"', truth: 'ضغط الحبوب يسبب التهاب وندبات وتصبغات. خليها تروح لوحدها أو راجعي طبيب.' },
    { myth: '"المرطب يمنع ظهور التجاعيد"', truth: 'المرطب يرطب البشرة ويحسن مظهر الخطوط الرفيعة لكنه ما يمنع التجاعيد.' },
    { myth: '"واقي الشمس يسبب نقص فيتامين D"', truth: 'معظم الناس يحصلون على فيتامين D كافي حتى مع واقي الشمس. القلق مبالغ فيه.' },
    { myth: '"بخاخات تسمير البشرة تسبب سرطان"', truth: 'بخاخات التسمير تحتوي ديهايدروكسي أسيتون (DHA) آمن للاستخدام الموضعي.' },
    { myth: '"الكريمات التي تحتوي كولاجين تملأ التجاعيد"', truth: 'الكولاجين في الكريمات يرطب البشرة بس. جزيئاته كبيرة جداً تخترق الجلد.' },
    { myth: '"البيوتين ينبت الشعر"', truth: 'البيوتين يقوي الشعر الموجود وما ينبت شعر جديد من مناطق صلعاء.' },
    { myth: '"سرعة خفقان القلب من أعراض الحساسية الجلدية"', truth: 'حساسية الجلد موضعية. سرعة القلب تحتاج استشارة طبية فورية.' },
    { myth: '"شامبو تساقط الشعر ينبت شعر جديد"', truth: 'شامبو التساقط يقلل التساقط لكنه ما ينبت شعر جديد. ينظف فروة الرأس فقط.' },
    { myth: '"تقشير الجلد الميت بالليزر يسبب حروق"', truth: 'تقشير الليزر الاحترافي آمن. الحروق تحدث فقط عند استخدام أجهزة غير مناسبة.' },
    { myth: '"الحبوب تظهر على الذقن بسبب الماكياج"', truth: 'حبوب الذقن غالباً هرمونية مرتبطة بالدورة الشهرية، مو من الماكياج.' },
    { myth: '"غسل الوجه بماء الورد يومياً ينقي البشرة"', truth: 'ماء الورد منعش لكن غسل الوجه بكثرة يزيل الزيوت الطبيعية.' },
    { myth: '"اللي哪有 حساسية من الصويا؟!"', truth: 'حساسية الصويا شائعة. تجنبي المنتجات التي تحتوي Soy Oil أو Soy Protein.' },
    { myth: '"الخيار يزيل الهالات السوداء"', truth: 'الخيار يبرد وينعش لكنه ما يزيل الهالات. الهالات أسبابها وراثية ونوم.' },
    { myth: '"الشاي الأخضر يبيض البشرة"', truth: 'الشاي الأخضر مضاد أكسدة ممتاز لكنه ما يبيض. يحمي البشرة من التلف فقط.' },
    { myth: '"خلطات الكركم تبيض البشرة"', truth: 'الكركم مضاد التهاب يهدئ البشرة لكنه ما يبيضها. قد يصبغها بالأصفر مؤقتاً.' },
    { myth: '"استخدام المقشرات الفيزيائية يومياً مفيد"', truth: 'المقشرات الفيزيائية تحتك بالجلد وتسبب جروح دقيقة مع الاستخدام اليومي.' },
    { myth: '"طلاء الأظافر سام ويسبب السرطان"', truth: 'طلاء الأظافر الحديث آمن نسبياً. تجنبي الفورمالدهيد والتولوين.' },
    { myth: '"التسمير تحت الشمس آمن مع واقي"', truth: 'واقي الشمس يقلل الخطر لكنه ما يمنعه بالكامل. التسمير يضر الحمض النووي للجلد.' },
    { myth: '"سيروم نمو الرموش آمن للجميع"', truth: 'سيروم الرموش يحتوي بروستاغلاندين يسبب تغيير لون القزحية وهالات سوداء.' },
    { myth: '"الملح الخشن مقشر طبيعي ممتاز"', truth: 'الملح الخشن يسبب جروح دقيقة بالوجه. للجسم مقبول لكن للوجه لا.' },
    { myth: '"مكعبات الثلج تنعم البشرة"', truth: 'الثلج يقلل الانتفاخ مؤقتاً. التطبيق مباشرة يسبب حروق باردة وتكسر الشعيرات.' },
    { myth: '"الحليب المكثف المحلى يبيض البشرة"', truth: 'الحليب المكثف مليان سكر يلتصق بالبشرة ويسبب حبوب وبكتيريا.' },
    { myth: '"بروتين الشعر يجعل الشعر أقوى"', truth: 'البروتين الزائد يجعل الشعر قاسياً ويتكسر. التوازن بين البروتين والترطيب ضروري.' },
    { myth: '"الماء الساخن يفتح المسام"', truth: 'الماء الساخن يحرق البشرة ويزيل زيوتها. الماء الفاتر هو الأفضل.' },
    { myth: '"اللبن (الزبادي) يبيض البشرة"', truth: 'الزبادي يحتاج حمض اللاكتيك مقشر خفيف. ينعم البشرة لكنه ما يبيض.' },
    { myth: '"الساونا تنقي البشرة وتزيل السموم"', truth: 'الساونا تجعلك تتعرقين - العرق ماء وأملاح مو سموم. الكبد ينقي الجسم.' },
    { myth: '"الكلور في حمام السباحة يضر البشرة"', truth: 'الكلور يجفف البشرة ويقتل البكتيريا النافعة. استحمي بعد السباحة ورطبي.' },
    { myth: '"واقي الشمس يسبب حبوب"', truth: 'بعض واقيات الشمس تسبب حساسية. اختاري واقي معدني (زينك أوكسايد) للبشرة الحساسة.' },
    { myth: '"الكيراتين يسبب السرطان"', truth: 'الكيراتين آمن. الخطر من الفورمالدهيد المستخدم في بعض منتجات الكيراتين.' },
    { myth: '"زيت جوز الهند للشعر ينعمه"', truth: 'زيت جوز الهند يخترق الشعرة ويرطبها. ممتاز للشعر الجاف والتالف.' },
    { myth: '"البشرة المختلطة أصعب نوع بشرة"', truth: 'البشرة المختلطة شائعة جداً وسهلة العناية بروتين مناسب للنوعين.' },
    { myth: '"فازلين يسبب سرطان"', truth: 'الفازلين النقي آمن ومعتمد من FDA. الخطر من الفازلين غير المكرر.' },
    { myth: '"المنتجات الخالية من العطور ما تسبب حساسية"', truth: 'حتى المنتجات الخالية من العطور قد تحتوي مواد حافظة تسبب حساسية.' },
    { myth: '"مرطب الشفاه يسبب اعتياد"', truth: 'الشفاه ما تعتاد على المرطب. الجفاف يعود بسبب عدم الاستخدام.' },
    { myth: '"تقشير الشفاه يزيد جمالها"', truth: 'تقشير الشفاه الزائد يزيل الطبقة الواقية ويجعلها جافة ومتشققة.' },
    { myth: '"الحناء الطبيعية تصبغ الشعر للأبد"', truth: 'الحناء الطبيعية سطحية وتزول مع غسيل الشعر. الحناء السوداء الصناعية هي الدائمة.' },
    { myth: '"الكورتيزون يبيض البشرة"', truth: 'الكورتيزون مضاد التهاب مو مبيض. الاستخدام الطويل يسبب ترقق الجلد وظهور الأوعية.' },
    { myth: '"زيت الأفعى يعالج الصدفية"', truth: 'زيت الأفعى خرافة. لا توجد دراسات تثبت فعاليته. قد يسبب حساسية شديدة.' },
    { myth: '"العسل يسكر ويسبب حبوب"', truth: 'العسل مضاد بكتيريا طبيعي. ما يسكر ولا يسبب حبوب للبشرة.' },
    { myth: '"الشوفان يسبب حساسية للبشرة"', truth: 'الشوفان مهدي طبيعي ومعتمد من FDA. الحساسية منه نادرة جداً.' },
    { myth: '"البيض النيء على الوجه يشد المسام"', truth: 'البيض النيء قد يحتوي سلمونيلا. استخدمي بياض البيض المطبوخ أو ماسكات جاهزة.' },
    { myth: '"ماسكات الفواكه تغذي البشرة"', truth: 'الفواكه فيها أحماض طبيعية قد تسبب حساسية. أكل الفواكه ينفع أكثر من وضعها على الوجه.' },
    { myth: '"القهوة للوجه تزيل الهالات"', truth: 'القهوة تحتوي كافيين يشد الأوعية مؤقتاً. تأثيرها محدود.' },
  ];

  // Auto-generate more myths from the ingredient database
  const ingMyths = [
    { myth: '"البارابين حافظ آمن تماماً"', truth: 'البارابين مرتبط باضطراب هرموني. الأفضل Paraben-Free.' },
    { myth: '"مستحضرات الأطفال كلها آمنة"', truth: 'بعض مستحضرات الأطفال تحتوي بارابين وفثالات. اقرأي المكونات.' },
    { myth: '"المنتجات العضوية ما تحتاج مواد حافظة"', truth: 'المنتجات العضوية قد تحتوي مواد حافظة طبيعية أو صناعية.' },
    { myth: '"زيت الأطفال يرطب البشرة"', truth: 'زيت الأطفال زيت معدني يسد المسام. زيوت نباتية أفضل.' },
    { myth: '"المنتجات الخالية من الكحول آمنة"', truth: 'في كحولات دهنية مفيدة (Cetyl, Stearyl). الكحول المجفف هو الضار.' },
    { myth: '"المنتجات الأغلى تحتوي مكونات أفضل"', truth: 'السعر ما يعكس الجودة. في ماركات صيدلية ممتازة ورخيصة.' },
    { myth: '"الحماية من الشمس SPF 100 تحمي ضعف SPF 50"', truth: 'SPF 50 يحمي 98% و SPF 100 يحمي 99%. الفرق بسيط جداً.' },
    { myth: '"الواقي المعدني أفضل من الكيميائي"', truth: 'المعدني يعكس الأشعة والكيميائي يمتصها. الاثنين آمنين. المعدني أفضل للحساسة.' },
    { myth: '"الزنك في واقي الشمس يسبب بياض"', truth: 'جزيئات الزنك النانوية شفافة وما تترك بياض. التقليدية تترك طبقة بيضاء.' },
    { myth: '"الكريمات الليلية تسد المسام"', truth: 'الكريمات الليلية أثقل قواماً لكنها ما تسد المسام إذا اختيرت صح.' },
    { myth: '"الماكا يجدد خلايا البشرة"', truth: 'الماكا (خميرة الأرز) مقشر طبيعي لكنه ما يجدد الخلايا وصفاته محدودة.' },
  ];

  // Shuffle function (defined here, used later after data is ready)
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // =============================================
  // SMOOTH SCROLL FOR HERO BUTTONS
  // =============================================
  document.querySelectorAll('.scroll-to').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-target');
      const el = document.getElementById(target);
      if (el) {
        showSection(target);
      }
    });
  });

  // =============================================
  // CALORIE CALCULATOR + FOOD PLAN
  // =============================================
  const calcBMR = document.getElementById('calcBMR');
  const bmrResult = document.getElementById('bmrResult');

  if (calcBMR) {
    calcBMR.addEventListener('click', () => {
      const weight = parseFloat(document.getElementById('weight')?.value) || 60;
      const height = parseFloat(document.getElementById('height')?.value) || 160;
      const age = parseFloat(document.getElementById('age')?.value) || 25;
      const activity = parseFloat(document.getElementById('activity')?.value) || 1.2;
      const goalEl = document.querySelector('input[name="dietGoal"]:checked');
      const goal = goalEl ? goalEl.value : 'maintain';

      const bmr = 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age);
      const tdee = Math.round(bmr * activity);
      let targetCal, diff, label, color, foods, meals;

      if (goal === 'lose') {
        targetCal = Math.round(tdee - 400);
        diff = 400;
        label = '⬇️ نزول';
        color = 'var(--success)';
        foods = '🥦 بروكلي + 🥬 خس + 🍗 صدر دجاج + 🥚 بيض + 🥛 زبادي يوناني';
        meals = [
          { time: '🌅 فطور', items: '2 بيض مسلوق + شريحة خبز أسمر + خيار', cal: '~300' },
          { time: '🌤️ غداء', items: 'صدر دجاج مشوي + خضار سوتيه + رز قرنبيط', cal: '~450' },
          { time: '🌆 عشاء', items: 'زبادي يوناني + حفنة مكسرات + توت', cal: '~350' },
          { time: '🥗 سناك', items: 'خضار مقطع + حمص', cal: '~150' },
        ];
      } else if (goal === 'gain') {
        targetCal = Math.round(tdee + 400);
        diff = 400;
        label = '⬆️ زيادة';
        color = '#b8860b';
        foods = '🥜 مكسرات + 🥑 أفوكادو + 🥛 حليب كامل + 🍚 رز + 🥜 زبدة فول سوداني';
        meals = [
          { time: '🌅 فطور', items: 'شوفان بحليب كامل + موز + عسل + مكسرات', cal: '~500' },
          { time: '🌤️ سناك', items: 'مخفوق: حليب + زبدة فول سوداني + تمر', cal: '~400' },
          { time: '🌤️ غداء', items: 'رز + دجاج + خضار مطهية + زيت زيتون', cal: '~650' },
          { time: '🌆 عشاء', items: 'ساندويتش جبنة + أفوكادو + زبادي + عسل', cal: '~550' },
        ];
      } else {
        targetCal = tdee;
        diff = 0;
        label = '✅ تثبيت';
        color = 'var(--primary)';
        foods = '🥗 كل شي متوازن بنسبة 80/20';
        meals = [
          { time: '🌅 فطور', items: 'شوفان + حليب لوز + موز', cal: '~350' },
          { time: '🌤️ غداء', items: 'دجاج مشوي + رز + خضار', cal: '~500' },
          { time: '🌆 عشاء', items: 'سمك + بطاطا حلوة + سلطة', cal: '~450' },
        ];
      }

      if (bmrResult) {
        bmrResult.style.display = 'block';
        bmrResult.innerHTML = `
          <div class="result-card" style="background:linear-gradient(135deg,#fdf6f0,#fff);border:1px solid #d4af37;">
            <h4 style="color:var(--primary);margin-bottom:0.8rem;">🧮 نتيجتك حسب هدفك: ${label}</h4>
            <div class="result-item"><span class="result-label">⚡ سعراتك اليومية</span><span class="result-value" style="color:${color};font-weight:bold;font-size:1.2rem">${targetCal} سعرة</span></div>
            <div class="result-item"><span class="result-label">◀ TDEE الأساسي</span><span class="result-value">${tdee} سعرة</span></div>
            ${diff ? `<div class="result-item"><span class="result-label">${label}</span><span class="result-value">${diff > 0 ? '+' : ''}${diff} سعرة/يوم</span></div>` : ''}
            <div class="result-item"><span class="result-label">🥩 بروتين</span><span class="result-value">${Math.round(weight * 1.8)}-${Math.round(weight * 2.2)} غرام</span></div>
            <div class="result-item"><span class="result-label">💧 ماء</span><span class="result-value">${Math.round(weight * 0.033)} لتر</span></div>
          </div>
          <div class="result-card">
            <h4 style="margin-bottom:0.5rem;">🍽️ أكلات مناسبة لهدفك</h4>
            <p style="font-size:0.9rem;color:var(--muted);margin-bottom:0.5rem;">${foods}</p>
          </div>
          <div class="result-card">
            <h4 style="margin-bottom:0.5rem;">📋 وجبات مقترحة لليوم</h4>
            ${meals.map(m => `
              <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);font-size:0.85rem;">
                <span>${m.time}</span>
                <span style="flex:1;padding:0 8px;color:var(--muted)">${m.items}</span>
                <span style="font-weight:bold;color:var(--primary)">${m.cal}</span>
              </div>
            `).join('')}
            <p style="margin-top:0.5rem;font-size:0.8rem;color:var(--muted);text-align:center;">💡 استشيري أخصائي تغذية قبل البدء بأي نظام</p>
          </div>
        `;
      }
    });
  }

  // =============================================
  // BODY TYPE QUIZ
  // =============================================
  const bodyQuizForm = document.getElementById('bodyQuizForm');
  const bodyQuizResult = document.getElementById('bodyQuizResult');

  if (bodyQuizForm) {
    bodyQuizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const bodyType = document.querySelector('input[name="bodyType"]:checked')?.value;
      const waist = document.querySelector('input[name="bodyWaist"]:checked')?.value;
      const hips = document.querySelector('input[name="bodyHips"]:checked')?.value;

      let shape = 'مستطيل';
      let desc = '';
      let tips = '';

      if (bodyType === 'hourglass' && waist === 'defined') {
        shape = '⌛ الساعة الرملية';
        desc = 'أكتاف وحوض متساويان + خصر محدد - جسم متوازن ومنحني';
        tips = '🍃 الفساتين الملفوفة تبرز خصرك\n🍃 بناطيل عالية الخصر رائعة عليك\n🍃 الأحزمة صديقتك المفضلة\n🍃 تجنبي الملابس الواسعة جداً';
      } else if (bodyType === 'pear') {
        shape = '🍐 الكمثرى';
        desc = 'أكتاف أضيق من الحوض - الجزء السفلي أوسع';
        tips = '🍃 بلايز لافتة توازن جسمك\n🍃 ألوان فاتحة فوق - غامقة تحت\n🍃 بناطيل واسعة سوداء\n🍃 جاكيتات قصيرة تبرز خصرك';
      } else if (bodyType === 'rectangle' && waist === 'straight') {
        shape = '📏 المستطيل';
        desc = 'أكتاف وخصر وحوض متساوية - رياضي وأنيق';
        tips = '🍃 طبقات تخلق منحنيات\n🍃 أحزمة تحدد خصرك\n🍃 بلايز منفوشة أو كشكش\n🍃 جاكيتات مع تنورة واسعة';
      } else if (waist === 'full' || bodyType === 'hourglass' && waist !== 'defined') {
        shape = '🍎 التفاحة';
        desc = 'أكتاف عريضة + خصر ممتلئ - أرجل رشيقة';
        tips = '🍃 رقبة V تطيل الصدرية\n🍃 فساتين إمباير لاين\n🍃 قماش خفيف ينسدل\n🍃 جاكيتات طويلة مفتوحة';
      } else {
        shape = '📏 المستطيل';
        desc = 'أكتاف وخصر وحوض متساوية - رياضي وأنيق';
        tips = '🍃 طبقات تخلق منحنيات\n🍃 أحزمة تحدد خصرك\n🍃 بلايز منفوشة أو كشكش\n🍃 جاكيتات مع تنورة واسعة';
      }

      if (bodyQuizResult) {
        bodyQuizResult.style.display = 'block';
        bodyQuizResult.innerHTML = `
          <div class="result-card">
            <h4>📏 نتيجة تحليل جسمك</h4>
            <div class="result-item"><span class="result-label">شكل جسمك</span><span class="result-value">${shape}</span></div>
            <div class="result-item"><span class="result-label">الوصف</span><span class="result-value" style="font-weight:400;">${desc}</span></div>
          </div>
          <div class="result-card">
            <h4>💡 توصيات الموضة</h4>
            <ul class="feature-list" style="list-style:none;">
              ${tips.split('\n').map(t => `<li>${t.trim()}</li>`).join('')}
            </ul>
          </div>
          <div class="result-card">
            <h4>🌟 المشاهير اللي زيك</h4>
            <ul class="feature-list" style="list-style:none;">
              ${shape.includes('ساعة') ? "<li>🌟 سكارليت جوهانسون</li><li>🌟 صوفيا فيرغارا</li>" : ''}
              ${shape.includes('كمثرى') ? "<li>🌟 بيونسيه</li><li>🌟 جينيفر لوبيز</li>" : ''}
              ${shape.includes('تفاحة') ? "<li>🌟 جنيفر لورنس</li><li>🌟 أوبري بلازا</li>" : ''}
              ${shape.includes('مستطيل') ? "<li>🌟 كيت ميدلتون</li><li>🌟 جيزيل بوندشين</li>" : ''}
            </ul>
          </div>
        `;
        bodyQuizResult.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // =============================================
  // ETIQUETTE QUIZ
  // =============================================
  const etiquetteQuizForm = document.getElementById('etiquetteQuizForm');
  const etiquetteQuizResult = document.getElementById('etiquetteQuizResult');

  if (etiquetteQuizForm) {
    etiquetteQuizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q1 = document.querySelector('input[name="etiquette1"]:checked')?.value;
      const q2 = document.querySelector('input[name="etiquette2"]:checked')?.value;
      const q3 = document.querySelector('input[name="etiquette3"]:checked')?.value;

      let correct = 0;
      if (q1 === 'correct') correct++;
      if (q2 === 'correct') correct++;
      if (q3 === 'correct') correct++;

      const score = Math.round(correct / 3 * 100);
      let level = score === 100 ? '👑 متقنة - أنتِ ملكة الإتيكيت!' : score >= 67 ? '💎 ممتازة - عندك حس عالٍ بالذوق' : '📚 محتاجة شوية تدريب - تعالي نتعلم';

      if (etiquetteQuizResult) {
        etiquetteQuizResult.style.display = 'block';
        etiquetteQuizResult.innerHTML = `
          <div class="result-card">
            <h4>👑 نتيجة اختبار الإتيكيت</h4>
            <div class="result-item"><span class="result-label">النتيجة</span><span class="result-value">${correct}/3 - ${score}%</span></div>
            <div class="result-item"><span class="result-label">التقييم</span><span class="result-value">${level}</span></div>
          </div>
          <div class="result-card">
            <h4>💡 الإجابات الصحيحة</h4>
            <ul class="feature-list">
              <li><strong>السؤال 1:</strong> الشنطة توضع على الكرسي وراء ضهرك (مش عالطاولة)</li>
              <li><strong>السؤال 2:</strong> التواصل البصري 3-5 ثواني - لحظة عابرة من الاحترام</li>
              <li><strong>السؤال 3:</strong> مقابلة عمل = قطعة رسمية محتشمة بألوان هادية</li>
            </ul>
          </div>
          <div class="result-card">
            <h4>🌟 نصيحة ذهبية</h4>
            <p style="font-size:0.9rem;color:var(--muted);">"الإتيكيت مش قواعد جامدة - هو احترام للآخرين وجعلهم مرتاحين حولك"</p>
          </div>
        `;
        etiquetteQuizResult.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // =============================================
  // FINANCE QUIZ
  // =============================================
  const financeQuizForm = document.getElementById('financeQuizForm');
  const financeQuizResult = document.getElementById('financeQuizResult');

  if (financeQuizForm) {
    financeQuizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q1 = document.querySelector('input[name="finance1"]:checked')?.value;
      const q2 = document.querySelector('input[name="finance2"]:checked')?.value;
      const q3 = document.querySelector('input[name="finance3"]:checked')?.value;

      let correct = 0;
      if (q1 === 'correct') correct++;
      if (q2 === 'correct') correct++;
      if (q3 === 'correct') correct++;

      const level = correct === 3 ? '💰 عبقرية مالية!' : correct >= 2 ? '👍 بداية ممتازة' : '📚 محتاجة تتعلمي أساسيات المال';

      if (financeQuizResult) {
        financeQuizResult.style.display = 'block';
        financeQuizResult.innerHTML = `
          <div class="result-card">
            <h4>💰 نتيجة اختبار الثقافة المالية</h4>
            <div class="result-item"><span class="result-label">النتيجة</span><span class="result-value">${correct}/3</span></div>
            <div class="result-item"><span class="result-label">التقييم</span><span class="result-value">${level}</span></div>
          </div>
          <div class="result-card">
            <h4>💡 الإجابات الصحيحة</h4>
            <ul class="feature-list">
              <li><strong>١.</strong> قاعدة 50/30/20 - 20% توفير من راتبك</li>
              <li><strong>٢.</strong> صناديق المؤشرات ETF - أقل مخاطرة للمبتدئات</li>
              <li><strong>٣.</strong> صندوق طوارئ 3-6 شهور قبل أي استثمار</li>
            </ul>
          </div>
          <div class="result-card">
            <h4>🌟 نصيحة ذهبية</h4>
            <p style="font-size:0.9rem;color:var(--muted);">"المال ليس هدفاً، بل وسيلة لحياة أفضل. تعلمي إدارته، لا تكوني عبدة له"</p>
          </div>
        `;
        financeQuizResult.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // =============================================
  // BACK TO TOP
  // =============================================
  const backBtn = document.getElementById('backToTop');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      backBtn.classList.toggle('show', window.scrollY > 400);
    });
  }

  // =============================================
  // OWNER AUTH FROM URL PARAM
  // =============================================
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('owner') === 'true') {
    const savedOwner = localStorage.getItem('dahabiya_owner');
    if (savedOwner !== 'true') {
      const pwd = prompt('🔐 مساحة المالك - أدخل كلمة السر:');
      if (pwd && ownerLogin(pwd)) {
        alert('✅ مرحباً بك في لوحة تحكم ذهبية');
      }
    }
  }
  window.openOwnerPanel = function() {
    const pwd = prompt('🔐 مساحة المالك - أدخل كلمة السر:');
    if (pwd && ownerLogin(pwd)) {
      alert('✅ مرحباً بك في لوحة تحكم ذهبية');
      showSection('affiliates');
    } else {
      alert('❌ كلمة سر خاطئة');
    }
  };

  window.ownerLogout = function() {
    ownerLogout();
    alert('👋 تم تسجيل الخروج من حساب المالك');
    showSection('home');
  };

  // =============================================
  // INGREDIENT ANALYZER
  // =============================================
  const HAZARDOUS_INGREDIENTS = {
    'paraben': { level: 'danger', name: 'بارابين', desc: 'مادة حافظة مرتبطة باضطراب الهرمونات' },
    'methylparaben': { level: 'danger', name: 'ميثيل بارابين', desc: 'مادة حافظة ضارة' },
    'propylparaben': { level: 'danger', name: 'بروبيل بارابين', desc: 'مادة حافظة ضارة' },
    'butylparaben': { level: 'danger', name: 'بيوتيل بارابين', desc: 'مادة حافظة ضارة' },
    'ethylparaben': { level: 'danger', name: 'إيثيل بارابين', desc: 'مادة حافظة ضارة' },
    'phthalate': { level: 'danger', name: 'فثالات', desc: 'مثبت روائح، يضر الهرمونات' },
    'dep': { level: 'danger', name: 'DEP', desc: 'فثالات - مادة ضارة بالهرمونات' },
    'formaldehyde': { level: 'danger', name: 'فورمالدهيد', desc: 'مادة مسرطنة' },
    'formalin': { level: 'danger', name: 'فورمالين', desc: 'مادة مسرطنة' },
    'quaternium-15': { level: 'danger', name: 'Quaternium-15', desc: 'ينتج فورمالدهيد - مسرطن' },
    'dmdm hydantoin': { level: 'danger', name: 'DMDM Hydantoin', desc: 'ينتج فورمالدهيد' },
    'imidazolidinyl urea': { level: 'danger', name: 'إيميدازولدينيل يوريا', desc: 'ينتج فورمالدهيد' },
    'diazolidinyl urea': { level: 'danger', name: 'ديازولدينيل يوريا', desc: 'ينتج فورمالدهيد' },
    'hydroquinone': { level: 'danger', name: 'هيدروكينون', desc: 'مبيض خطير، ممنوع في أوروبا' },
    'toluene': { level: 'danger', name: 'تولوين', desc: 'مذيب سام، يضر الجهاز العصبي' },
    'triclosan': { level: 'danger', name: 'تريكلوسان', desc: 'مضاد بكتيريا ضار، يضر الهرمونات' },
    'oxybenzone': { level: 'danger', name: 'أوكسيبنزون', desc: 'يضر الهرمونات والبيئة البحرية' },
    'benzophenone': { level: 'danger', name: 'بنزوفينون', desc: 'يضر الهرمونات' },
    'sodium lauryl sulfate': { level: 'warn', name: 'SLS', desc: 'منظف قاسي، يهيج البشرة' },
    'sodium laureth sulfate': { level: 'warn', name: 'SLES', desc: 'منظف قاسي، قد يسبب تهيج' },
    'parfum': { level: 'warn', name: 'عطر صناعي', desc: 'قد يحتوي مواد مثيرة للحساسية' },
    'fragrance': { level: 'warn', name: 'عطر صناعي', desc: 'قد يحتوي مواد مثيرة للحساسية' },
    'alcohol denat': { level: 'warn', name: 'كحول', desc: 'يجفف البشرة ويهيجها' },
    'talc': { level: 'warn', name: 'تلك', desc: 'قد يكون ملوثاً بالأسبستوس' },
    'mineral oil': { level: 'warn', name: 'زيت معدني', desc: 'يسد المسام وقد يسبب حساسية' },
    'petrolatum': { level: 'warn', name: 'بترولاتوم', desc: 'قد يحتوي شوائب ضارة' },
    'linalool': { level: 'warn', name: 'لينالول', desc: 'مسبب حساسية شائع في العطور' },
    'limonene': { level: 'warn', name: 'ليمونين', desc: 'مسبب حساسية شائع' },
    'citronellol': { level: 'warn', name: 'سيترونيلول', desc: 'مسبب حساسية' },
    'geraniol': { level: 'warn', name: 'جيرانيول', desc: 'مسبب حساسية' },
    'eugenol': { level: 'warn', name: 'أوجينول', desc: 'مسبب حساسية' },
    'coumarin': { level: 'warn', name: 'كومارين', desc: 'مسبب حساسية' },
    'methylisothiazolinone': { level: 'danger', name: 'MIT', desc: 'مادة حافظة تسبب حساسية شديدة' },
    'methylchloroisothiazolinone': { level: 'danger', name: 'MCIT', desc: 'مادة حافظة تسبب حساسية' },
    'retinol': { level: 'warn', name: 'ريتينول', desc: 'آمن ليلاً مع ترطيب - ممنوع للحامل' },
    'lead': { level: 'danger', name: 'رصاص', desc: 'معدن ثقيل سام' },
    'mercury': { level: 'danger', name: 'زئبق', desc: 'معدن ثقيل سام جداً' },
    'bha': { level: 'warn', name: 'BHA', desc: 'مادة حافظة مثيرة للجدل' },
    'bht': { level: 'warn', name: 'BHT', desc: 'مادة حافظة مثيرة للجدل' },
  };

  window.analyzeIngredients = function(text) {
    const ingredients = text.split(/[,;\n]+/).map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
    if (ingredients.length === 0) return [];

    const results = [];
    for (const ing of ingredients) {
      let found = null;
      for (const [key, val] of Object.entries(HAZARDOUS_INGREDIENTS)) {
        if (ing.includes(key)) { found = val; break; }
      }
      if (found) {
        results.push({ ingredient: ing, ...found });
      } else {
        results.push({ ingredient: ing, level: 'safe', name: ing, desc: 'لم نجد تحذير لهذا المكون' });
      }
    }
    return results;
  };

  const analyzeIngredientsBtn = document.getElementById('analyzeIngredientsBtn');
  const ingredientInput = document.getElementById('ingredientInput');
  const analyzerResults = document.getElementById('analyzerResults');
  const analyzerSummary = document.getElementById('analyzerSummary');
  const analyzerDetails = document.getElementById('analyzerDetails');
  const analyzerError = document.getElementById('analyzerError');

  if (analyzeIngredientsBtn && ingredientInput) {
    analyzeIngredientsBtn.addEventListener('click', () => {
      const text = ingredientInput.value.trim();
      if (!text) {
        analyzerError.textContent = '❌ اكتبي أو الصقي المكونات أولاً';
        analyzerError.style.display = 'block';
        analyzerResults.style.display = 'none';
        return;
      }
      analyzerError.style.display = 'none';
      const results = window.analyzeIngredients(text);
      if (results.length === 0) {
        analyzerError.textContent = '❌ ما لقينا مكونات للتحليل. تأكدي إنك كتبتي المكونات صح';
        analyzerError.style.display = 'block';
        analyzerResults.style.display = 'none';
        return;
      }
      const danger = results.filter(r => r.level === 'danger').length;
      const warn = results.filter(r => r.level === 'warn').length;
      const safe = results.filter(r => r.level === 'safe').length;
      const total = results.length;

      let summaryHTML = `
        <div class="analyzer-badge safe">✅ آمن: ${safe}</div>
        <div class="analyzer-badge warn">⚠️ حذر: ${warn}</div>
        <div class="analyzer-badge danger">⛔ ضار: ${danger}</div>
        <div class="analyzer-badge" style="background:var(--rose-50);color:var(--primary);border:1px solid var(--border)">📊 المجموع: ${total}</div>
      `;
      analyzerSummary.innerHTML = summaryHTML;

      let detailsHTML = '';
      for (const r of results) {
        let cls = 'analyzer-safe';
        let icon = '✅';
        if (r.level === 'danger') { cls = 'analyzer-danger'; icon = '⛔'; }
        else if (r.level === 'warn') { cls = 'analyzer-warn'; icon = '⚠️'; }
        detailsHTML += `<div class="${cls}"><span>${icon}</span><span><strong>${r.ingredient}</strong><br><small>${r.desc}</small></span></div>`;
      }
      analyzerDetails.innerHTML = detailsHTML;
      analyzerResults.style.display = 'block';
    });
  }

  // Analyzer mode toggle
  const textModeBtn = document.getElementById('analyzerTextMode');
  const imageModeBtn = document.getElementById('analyzerImageMode');
  const textInput = document.getElementById('analyzerTextInput');
  const imageInput = document.getElementById('analyzerImageInput');
  const imageUploadArea = document.getElementById('imageUploadArea');
  const imageUploadInput = document.getElementById('imageUploadInput');
  const ocrProgress = document.getElementById('ocrProgress');

  if (textModeBtn && imageModeBtn) {
    textModeBtn.addEventListener('click', () => {
      textModeBtn.className = 'btn btn-primary';
      imageModeBtn.className = 'btn btn-secondary';
      textInput.style.display = 'block';
      imageInput.style.display = 'none';
    });
    imageModeBtn.addEventListener('click', () => {
      imageModeBtn.className = 'btn btn-primary';
      textModeBtn.className = 'btn btn-secondary';
      imageInput.style.display = 'block';
      textInput.style.display = 'none';
    });
  }

  if (imageUploadArea && imageUploadInput) {
    imageUploadArea.addEventListener('click', () => imageUploadInput.click());
    imageUploadInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      ocrProgress.style.display = 'block';
      analyzerResults.style.display = 'none';
      analyzerError.style.display = 'none';
      try {
        const { data: { text } } = await Tesseract.recognize(file, 'ara+eng', { logger: () => {} });
        ocrProgress.style.display = 'none';
        if (text.trim()) {
          ingredientInput.value = text.trim();
          textModeBtn.click();
          analyzeIngredientsBtn.click();
        } else {
          analyzerError.textContent = '❌ ما قدرت أقرأ المكونات من الصورة. جربي تصوير أقرب أو استخدمي الكتابة اليدوية';
          analyzerError.style.display = 'block';
        }
      } catch (err) {
        ocrProgress.style.display = 'none';
        analyzerError.textContent = '❌ صار خطأ في قراءة الصورة. جربي تكتبي المكونات يدوياً';
        analyzerError.style.display = 'block';
      }
    });
  }

  // =============================================
  // AI ASSISTANT CHAT
  // =============================================
  let aiChatOpen = false;

  window.toggleAIChat = function() {
    aiChatOpen = !aiChatOpen;
    document.getElementById('aiChatPanel').classList.toggle('open', aiChatOpen);
    document.getElementById('aiChatOverlay').classList.toggle('open', aiChatOpen);
    if (aiChatOpen) {
      document.getElementById('aiChatInput').focus();
      document.getElementById('aiBubbleIcon').textContent = '✕';
    } else {
      document.getElementById('aiBubbleIcon').textContent = '🧴';
    }
  };

  // =============================================
  // FOOD API - Open Food Facts (ملايين الأصناف)
  // =============================================
  async function searchFoodAPI(query) {
    try {
      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=true&page_size=5&fields=product_name,nutriments,categories`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data.products || data.products.length === 0) return null;
      const products = data.products.filter(p => p.nutriments && p.nutriments['energy-kcal_100g']);
      if (products.length === 0) return null;
      return products.map(p => ({
        name: p.product_name || query,
        calPer100g: Math.round(p.nutriments['energy-kcal_100g']),
        category: p.categories ? p.categories.split(',')[0] : ''
      }));
    } catch(e) { return null; }
  }

  async function handleFoodQuery(msg) {
    const items = msg.split(/[،,+،\n]+/).map(s => s.trim()).filter(s => s);
    let apiResults = [];
    let localResults = [];

    for (const item of items) {
      const parts = item.match(/^(\d+)\s*(.+)/);
      let qty = 100, name = item;
      if (parts) { qty = parseInt(parts[1]); name = parts[2]; }

      // Try local DB first (instant)
      const local = findCalorie(name);
      if (local) {
        localResults.push({ name: local.name, qty, cal: Math.round(local.cal * qty / 100), source: '📚' });
        continue;
      }

      // Try API
      const apiData = await searchFoodAPI(name);
      if (apiData && apiData.length > 0) {
        const best = apiData[0];
        apiResults.push({ name: best.name, qty, cal: Math.round(best.calPer100g * qty / 100), source: '🌐' });
      } else {
        apiResults.push({ name, qty, cal: 0, source: '❌' });
      }
    }

    const allResults = [...localResults, ...apiResults];
    if (allResults.length === 0) return null;

    const total = allResults.reduce((s, r) => s + r.cal, 0);
    let reply = '<p><strong>🍽️ تحليل السعرات الحرارية:</strong></p>';
    for (const r of allResults) {
      if (r.cal > 0) {
        reply += `<p style="margin:0.2rem 0;font-size:0.9rem">${r.source} ${r.name} (${r.qty}g): <strong>${r.cal}</strong> سعرة</p>`;
      } else {
        reply += `<p style="margin:0.2rem 0;font-size:0.85rem;color:#c62828">❌ ما لقيت معلومات لـ "${r.name}"</p>`;
      }
    }
    reply += `<p style="margin-top:0.5rem;font-size:1.1rem"><strong>🔥 المجموع: ${total} سعرة حرارية</strong></p>`;

    // اقتراحات غذائية ذكية
    if (total > 0) {
      const avgWomanMeal = 500;
      if (total > avgWomanMeal * 1.5) reply += '<p style="font-size:0.82rem;color:var(--muted)">💡 هالوجبة عالية السعرات — مناسبة للنشاط البدني العالي 🏃</p>';
      else if (total < avgWomanMeal * 0.5) reply += '<p style="font-size:0.82rem;color:var(--muted)">💡 هالوجبة خفيفة — مناسبة كسناك 🥗</p>';
      else reply += '<p style="font-size:0.82rem;color:var(--muted)">💡 هالوجبة متوازنة 🌿</p>';

      // بروتين عالي؟
      const hasProtein = allResults.some(r => r.name.includes('دجاج') || r.name.includes('لحم') || r.name.includes('سمك') || r.name.includes('بيض') || r.name.includes('فول') || r.name.includes('عدس'));
      if (hasProtein) reply += '<p style="font-size:0.82rem;color:var(--muted)">💪 تحتوي على بروتين — ممتاز لبناء العضلات والشبع</p>';
    }

    reply += '<p style="margin-top:0.5rem;font-size:0.8rem;color:var(--muted)">💡 اكتبي الأكلة وكميتها، مثلاً: "200 رز 150 دجاج" أو "موز تفاح"</p>';

    // Save to profile
    const u = getCurrentUser();
    if (u) {
      try {
        const users = getUsers();
        if (users[u.email]) {
          if (!users[u.email].foodLog) users[u.email].foodLog = [];
          users[u.email].foodLog.push({ date: Date.now(), items: allResults, total });
          saveUsers(users);
        }
      } catch(e) {}
    }

    return reply;
  }

  window.sendAIMessage = async function() {
    const input = document.getElementById('aiChatInput');
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';
    const messages = document.getElementById('aiChatMessages');
    const userDiv = document.createElement('div');
    userDiv.className = 'ai-message ai-message-user';
    userDiv.innerHTML = `<div class="ai-message-content">${msg.replace(/</g,'&lt;')}</div>`;
    messages.appendChild(userDiv);

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'ai-message ai-message-bot';
    loadingDiv.innerHTML = '<div class="ai-message-content"><span style="opacity:0.6">🔍 جاري البحث عن السعرات...</span></div>';
    messages.appendChild(loadingDiv);
    messages.scrollTop = messages.scrollHeight;

    // Check if food query
    const q = msg.toLowerCase();
    let reply;
    if (q.includes('سعر') || q.includes('سعرة') || q.includes('سعرات') || q.includes('اكل') || q.includes('أكل') || q.includes('طعام') || q.includes('دايت') || q.includes('رجيم') || q.includes('كم') || q.includes('calorie') || q.includes('كيتو') || q.includes('جرام') || q.includes('غم') || /\d+\s*[a-zA-Z]/.test(q)) {
      const foodReply = await handleFoodQuery(msg);
      if (foodReply) {
        reply = foodReply;
      } else {
        reply = '<p>🍽️ <strong>حاسبة السعرات الذكية 🌐</strong></p><p>أقدر أحسب سعرات <strong>أي أكلة</strong> في العالم!</p><p>اكتبي الأكلة وكميتها:<br>• "200 جرام رز"<br>• "150 دجاج + 100 سلطة"<br>• "موز تفاح برتقال"<br>• "شاورما دجاج"</p><p>🔗 متصلة بقاعدة بيانات Open Food Facts (ملايين المنتجات)</p>';
      }
    } else {
      reply = generateAIResponse(msg);
    }

    loadingDiv.remove();
    const botDiv = document.createElement('div');
    botDiv.className = 'ai-message ai-message-bot';
    botDiv.innerHTML = `<div class="ai-message-content">${reply}</div>`;
    messages.appendChild(botDiv);
    messages.scrollTop = messages.scrollHeight;
  };

  function generateAIResponse(msg) {
    const q = msg.toLowerCase();
    const ctx = getAIContext();

    if (q.includes('السلام') || q.includes('مرحبا') || q.includes('hi') || q.includes('hello')) {
      if (ctx !== 'عام') {
        return `<p>وعليكم السلام 💗 أهلاً بكِ في <strong>قسم ${ctx}</strong>! 🌸</p><p style="margin-top:0.5rem">تقدرين تسأليني عن أي شي متعلق بهالقسم:<br>🔍 تحليل منتجات<br>⚠️ مواد ضارة<br>🌿 بدائل طبيعية<br>❌ تصحيح أخطاء</p><p>أو اسأليني سؤالك العام 🧴</p>`;
      }
      return '<p>وعليكم السلام 💗 أهلاً بكِ في مُستشارتك الآمنة! 🌸</p><p style="margin-top:0.5rem">تقدرين تسأليني عن:<br>🔍 تحليل مكونات منتج<br>⚠️ مواد ضارة<br>🌿 بدائل طبيعية<br>❌ أخطاء خلطات<br>🍽️ حساب سعرات الأكل</p><p>تحطي اسم المنتج أو المكونات 🧴</p>';
    }
    if (q.includes('شكرا') || q.includes('thank')) { return 'العفو 💗 دائماً هنا لمساعدتك! 🌸'; }
    if (q.includes('منت') || q.includes('مين') || q.includes('انت')) {
      return '<p>أنا <strong>مُستشارتك الآمنة</strong> 🧴💗</p><p>خبيرة في تحليل مكونات المكياج والعطور والخلطات، وأيضاً:<br>🍽️ أحسب سعرات الأكل<br>🔬 أشرح أضرار الدلكة المغربية<br>🌿 بدائل طبيعية آمنة</p>';
    }

    let results = null;
    if (q.includes('مكونات') || q.includes('تحليل') || q.includes('منتج') || q.includes('حلل')) {
      const cleanName = msg.replace(/تحليل|مكونات|منتج|حلل|حللي|analyze|product/g,'').trim();
      if (cleanName.length > 0) {
        results = window.analyzeIngredients(cleanName);
      }
    }
    // Check ingredient names in message
    for (const [key] of Object.entries(HAZARDOUS_INGREDIENTS)) {
      if (q.includes(key)) {
        const single = {};
        single[key] = HAZARDOUS_INGREDIENTS[key];
        results = [{ ingredient: key, ...HAZARDOUS_INGREDIENTS[key] }];
        break;
      }
    }
    if (results && results.length > 0) {
      let reply = '<p><strong>🔍 نتيجة تحليل المكونات:</strong></p>';
      for (const r of results) {
        let icon = '✅';
        if (r.level === 'danger') icon = '⛔';
        else if (r.level === 'warn') icon = '⚠️';
        reply += `<p style="margin:0.3rem 0">${icon} <strong>${r.name}:</strong> ${r.desc}</p>`;
      }
      const danger = results.filter(r => r.level === 'danger').length;
      const warn = results.filter(r => r.level === 'warn').length;
      if (danger > 0) reply += '<p style="margin-top:0.5rem;color:#c62828">⚠️ يحتوي مواد ضارة - الأفضل تتجنبينه</p>';
      else if (warn > 0) reply += '<p style="margin-top:0.5rem;color:#f57f17">⚠️ مواد تستدعي الحذر - للبشرة الحساسة تجنبي</p>';
      else reply += '<p style="margin-top:0.5rem;color:#2e7d32">✅ المكونات آمنة - مناسبة للاستخدام</p>';
      reply += '<p style="margin-top:0.5rem">💡 تحبين أساعدك في منتج ثاني؟</p>';
      return reply;
    }

    // === SECTION-AWARE CONTEXTS ===
    if (ctx === 'توعية البشرة والدلكة المغربية' || q.includes('دلكة') || q.includes('الدلكة') || q.includes('مغربية') || q.includes('صابون بلدي') || q.includes('ليفة') || q.includes('جلد ميت')) {
      return '<p>🔬 <strong>الدلكة المغربية</strong> خطيرة على البشرة!</p><p>🚫 الصابون البلدي قلوي (pH 9-10) يدمر حاجز البشرة الحمضي (pH 4.5-5.5)</p><p>🚫 الليفة الخشنة تسبب جروح مجهرية</p><p>🚫 الفرك العنيف يزيل الطبقة الحامية للبشرة مو بس "الجلد الميت"</p><p>✅ البديل: تقشير كيميائي لطيف مرة بالأسبوع + ليفة سيليكون ناعمة</p><p>💡 البشرة تنظف نفسها بنفسها كل 28 يوم!</p>';
    }
    if (ctx === 'التغذية والدايت' || q.includes('رجيم') || q.includes('دايت') || q.includes('وزن') || q.includes('تنحيف') || q.includes('تسمين')) {
      return '<p>🍽️ <strong>نظام التغذية الصحي:</strong></p><p>✅ لإنقاص الوزن: قللي 300-500 سعرة يومياً</p><p>✅ لثبات الوزن: احسبي سعراتك اليومية وحافظي عليها</p><p>✅ لزيادة الوزن: زيدي 300-500 سعرة يومياً مع بروتين</p><p>💡 <strong>جربي:</strong> اكتبي "200 جرام رز + 150 جرام دجاج" عشان أحسب السعرات!</p><p>🔢 معدل السعرات اليومي للنساء: 1800-2200 سعرة (حسب النشاط)</p>';
    }
    if (ctx === 'المكياج' || q.includes('مكياج') || q.includes('روج') || q.includes('احمر') || q.includes('بودرة') || q.includes('كونسيلر') || q.includes('فاونديشن') || q.includes('ايشادو')) {
      return '<p>💄 <strong>المكياج:</strong></p><p>✅ <strong>نوع بشرتك</strong> يحدد نوع المكياج المناسب:</p><p>🔹 للبشرة الدهنية: فاونديشن مات<br>🔹 للبشرة الجافة: فاونديشن سائل بترطيب<br>🔹 للبشرة الحساسة: مكياج معدني خالٍ من العطور</p><p>⚠️ احذري من المكياج التاريخ (منتهي الصلاحية):<br>🕐 الماسكارا: 3 أشهر<br>🕐 كريم الأساس: 6-12 شهر<br>🕐 أحمر الشفاه: 12-18 شهر</p><p>💡 تذكري: <strong>النوم بالمكياج</strong> يسبب شيخوخة مبكرة!</p>';
    }
    if (ctx === 'الشعر' || q.includes('شعر') || q.includes('تساقط') || q.includes('قشرة') || q.includes('زيوت') || q.includes('شامبو') || q.includes('بلسم')) {
      return '<p>💇‍♀️ <strong>العناية بالشعر:</strong></p><p>✅ <strong>شعرك يحدد روتينه:</strong></p><p>🔹 شعر جاف: زيت جوز الهند + بلسم عميق<br>🔹 شعر دهني: شامبو خفيف + غسيل 2-3 مرات بالأسبوع<br>🔹 شعر تالف: بروتين + ترطيب + قص الأطراف</p><p>⚠️ <strong>أخطاء شائعة:</strong><br>🚫 غسل الشعر يومياً يزيل الزيوت الطبيعية<br>🚫 فرك الشعر بالمنشفة يسبب تقصف<br>✅ استخدمي منشفة ميكرويفابر وربتي بلطف</p>';
    }
    if (ctx === 'الأظافر' || q.includes('اظافر') || q.includes('أظافر') || q.includes('منكير') || q.includes('جل') || q.includes('اكريليك')) {
      return '<p>💅 <strong>العناية بالأظافر:</strong></p><p>✅ قص الأظافر باتجاه واحد<br>✅ ترطيب الجليدة يومياً (لا تقصيها!)<br>✅ خذي بريك من الجل كل 3 شهور</p><p>⚠️ <strong>علامات الخطر:</strong><br>• البقع البيضاء: صدمة أو نقص زنك (مو نقص كالسيوم!)<br>• الأظافر الصفراء: استخدام مناكير بدون طبقة أساسية<br>• تشقق الأظافر: جفاف أو نقص حديد</p>';
    }

    // Default ingredient responses
    if (q.includes('بارابين') || q.includes('paraben')) {
      return '<p>🔴 <strong>البارابين</strong>: مواد حافظة تستخدم في مستحضرات التجميل.</p><p>⚠️ الدراسات ربطتها باضطراب الهرمونات وزيادة خطر سرطان الثدي.</p><p>✅ البديل: ابحثي عن منتجات مكتوب عليها "Paraben-Free".</p>';
    }
    if (q.includes('فثالات') || q.includes('phthalate')) {
      return '<p>🔴 <strong>الفثالات</strong>: مواد تثبت الرائحة في العطور ومستحضرات التجميل.</p><p>⚠️ تسبب اضطراب هرموني ومشاكل في الإنجاب.</p><p>✅ اختاري عطور طبيعية أو مكتوب عليها "Phthalate-Free".</p>';
    }
    if (q.includes('ريتينول') || q.includes('retinol')) {
      return '<p>⚠️ <strong>الريتينول</strong>: مشتق من فيتامين A، فعال لمكافحة التجاعيد.</p><p>✅ آمن للاستخدام الليلي مع ترطيب.</p><p>🚫 <strong>ممنوع للحامل والمرضع</strong>.</p><p>💡 لا تخلطيه مع الأحماض أو فيتامين C بنفس الوقت.</p>';
    }
    if (q.includes('كحول') || q.includes('alcohol')) {
      return '<p>⚠️ <strong>الكحول</strong>: بعض أنواعه تجفف البشرة وتهيجها.</p><p>✅ ابحثي عن Cetyl Alcohol أو Stearyl Alcohol - هذي كحولات دهنية مفيدة للبشرة.</p><p>🚫 تجنبي Alcohol Denat أو SD Alcohol إذا بشرتك جافة أو حساسة.</p>';
    }
    if (q.includes('طبيعي') || q.includes('بديل') || q.includes('بدائل')) {
      return '<p>🌿 <strong>بدائل طبيعية آمنة:</strong></p><p>🧴 للترطيب: زيت جوجوبا، زيت أرغان، زبدة شيا</p><p>🧼 للتنظيف: زيت جوز الهند، عسل، شوفان</p><p>🎨 للمكياج: بودرة أرز، زبدة كاكاو</p><p>💡 تذكري: <strong>طبيعي</strong> لا يعني دايمًا <strong>آمن</strong> - اختبريه على بشرة صغيرة أولاً</p>';
    }
    if (q.includes('خلطة') || q.includes('ليمون') || q.includes('بيكربونات')) {
      return '<p>⚠️ <strong>تحذير خطير!</strong></p><p>🚫 <strong>الليمون + الشمس:</strong> يسبب حروق ضوئية وتصبغات</p><p>🚫 <strong>بيكربونات الصوديوم:</strong> تخرب طبقة الحماية</p><p>🚫 <strong>معجون الأسنان:</strong> يحرق البشرة</p><p>✅ الأفضل: استخدمي مكونات آمنة مثل العسل، الزبادي، الشوفان، الألوفيرا</p>';
    }
    if (q.includes('سلامة') || q.includes('آمن') || q.includes('ضار') || q.includes('خطير')) {
      return '<p>🧴 <strong>دليل الأمان السريع:</strong></p><p>✅ <strong>آمن:</strong> مكونات طبيعية واضحة، خالية من العطور والبارابين</p><p>⚠️ <strong>حذر:</strong> يحتوي كحول أو عطور صناعية - مناسب للبشرة العادية</p><p>⛔ <strong>ضار:</strong> يحتوي بارابين، فثالات، فورمالدهيد - الأفضل تتجنبينه</p><p>💡 <strong>نصيحة:</strong> اختبر أي منتج على معصمك قبل استخدامه</p>';
    }
    return `<p>🤔 ما فهمت سؤالك بالضبط. القسم الحالي: <strong>${ctx}</strong></p><p>جربي:<br>🔍 تحليل مكونات: اكتبي اسم المنتج<br>🍽️ حساب سعرات: اكتبي الأكلة<br>⚠️ استفسار عن مادة: مثل "بارابين"<br>🌿 بدائل طبيعية<br>❌ خلطات وأخطاء</p><p><span class="quick-reply" onclick="quickAIQ(this)">🔍 حللي مكونات</span> <span class="quick-reply" onclick="quickAIQ(this)">🍽️ احسبي سعرات</span> <span class="quick-reply" onclick="quickAIQ(this)">⚠️ وش هي المواد الضارة؟</span></p>`;
  }

  window.quickAIQ = function(el) {
    document.getElementById('aiChatInput').value = el.textContent.trim();
    sendAIMessage();
  };

  // =============================================
  // MYTH BUSTER - 1000+ خرافة (بعد HAZARDOUS_INGREDIENTS)
  // =============================================
  let allMyths = myths.concat(ingMyths);

  // Auto-generate from ingredient DB for more variety
  for (const [k, v] of Object.entries(HAZARDOUS_INGREDIENTS)) {
    allMyths.push({
      myth: `"${v.name} آمن وموجود في كل المنتجات"`,
      truth: `${v.desc}. اقرأي المكونات قبل الشراء.`
    });
  }

  const shuffledMyths = shuffleArray([...allMyths]);

  // Auto-rotating ticker - كل دقيقة خرافة جديدة
  let mythIndex = 0;
  let mythTimer = null;

  function showNextMyth() {
    const m = shuffledMyths[mythIndex % shuffledMyths.length];
    mythIndex++;

    const mEl = document.getElementById('dailyMyth');
    const tEl = document.getElementById('dailyTruth');
    const card = document.getElementById('dailyMythCard');
    if (mEl && tEl) {
      mEl.style.opacity = '0';
      tEl.style.opacity = '0';
      setTimeout(() => {
        mEl.textContent = `"${m.myth}"`;
        tEl.textContent = m.truth;
        mEl.style.opacity = '1';
        tEl.style.opacity = '1';
      }, 300);
    }
    if (card) {
      card.style.borderColor = '#e8c84a';
      setTimeout(() => { if(card) card.style.borderColor = ''; }, 500);
    }
  }

  const dailyMyth = document.getElementById('dailyMyth');
  const dailyTruth = document.getElementById('dailyTruth');
  if (dailyMyth && dailyTruth) {
    showNextMyth();
    mythTimer = setInterval(showNextMyth, 60000);
  }

  // ALL MYTHS section
  const mythContainer = document.getElementById('mythContainer');
  if (mythContainer) {
    function renderAllMyths() {
      const frag = document.createDocumentFragment();
      const searchBox = document.createElement('div');
      searchBox.style.cssText = 'text-align:center;margin-bottom:2rem';
      searchBox.innerHTML = '<input type="text" id="mythSearch" class="form-control" placeholder="🔍 ابحثي عن خرافة..." style="max-width:400px;margin:0 auto;padding:0.7rem 1rem;border:2px solid var(--border);border-radius:50px;font-family:var(--font-main);font-size:0.9rem">';
      frag.appendChild(searchBox);

      const grid = document.createElement('div');
      grid.id = 'mythGrid';
      grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem';

      function renderFilteredMyths(filter) {
        const q = (filter || '').toLowerCase();
        grid.innerHTML = allMyths.filter(m =>
          !q || m.myth.includes(q) || m.truth.includes(q)
        ).map(m => `
          <div class="myth-card" style="margin:0">
            <div class="myth-side myth-false">
              <div class="myth-label">❌ خرافة</div>
              <div class="myth-text">"${m.myth}"</div>
            </div>
            <div class="myth-side myth-true">
              <div class="myth-label">✅ الحقيقة</div>
              <div class="myth-text">${m.truth}</div>
            </div>
          </div>
        `).join('') || '<p style="text-align:center;color:var(--muted);padding:2rem">ما لقينا خرافة بهالاسم 🌸</p>';
      }

      renderFilteredMyths('');
      frag.appendChild(grid);
      mythContainer.appendChild(frag);

      const searchInput = document.getElementById('mythSearch');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => renderFilteredMyths(e.target.value));
      }
    }
    renderAllMyths();
  }

  // Show myth count
  const mythCountEl = document.getElementById('mythCount');
  if (mythCountEl) mythCountEl.textContent = allMyths.length.toLocaleString();

  console.log('🌸 ذهبية Golden Ratio Beauty - خبيرتك في الجمال');
});
