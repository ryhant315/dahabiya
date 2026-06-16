/* ===== ذهبية - Golden Ratio Beauty - Main JavaScript ===== */

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
    free: { name: 'مجاني', price: 0, sections: ['home','teenZone','community','pricing','myAccount','privacy','shopping'] },
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
    result.push('affiliates');
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
      if (id === 'affiliates') {
        alert('🔒 متجر ذهبية مخصص لمالكة الموقع فقط');
        return;
      }
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

  // =============================================
  // MYTH BUSTER ROTATION
  // =============================================
  const myths = [
    { myth: '"غسل الوجه كثير ينظف البشرة أحسن" ❌', truth: 'مرتين يومياً كافي - الزيادة تزيل الزيوت الطبيعية وتجعل البشرة تنتج زيوت أكثر!' },
    { myth: '"المسام تنفتح وتنقفل" ❌', truth: 'المسام ما عندها عضلات - ما تنفتح وتنقفل! الحرارة تخفف الشوائب فقط.' },
    { myth: '"معجون الأسنان يعالج الحبوب" ❌', truth: 'يسبب حروق وتهيج شديد - استخدمي علاج مخصص للحبوب.' },
    { myth: '"الليمون يبيض البشرة" ❌', truth: 'يحرق البشرة ويسبب تصبغات مع الشمس - خطير جداً!' },
    { myth: '"قص الشعر يطوله" ❌', truth: 'القص ما يأثر على البصيلة - بس يشيل التقصف و يحسن المظهر.' },
    { myth: '"المنتج الغالي دائماً أحسن" ❌', truth: 'المكونات هي اللي تهم مش السعر - في منتجات رخيصة ممتازة!' },
  ];

  const mythContainer = document.getElementById('mythContainer');
  if (mythContainer) {
    function renderMyths() {
      mythContainer.innerHTML = myths.map(m => `
        <div class="myth-card">
          <div class="myth-side myth-false">
            <div class="myth-label">❌ خرافة</div>
            <div class="myth-text">${m.myth}</div>
          </div>
          <div class="myth-side myth-true">
            <div class="myth-label">✅ الحقيقة العلمية</div>
            <div class="myth-text">${m.truth}</div>
          </div>
        </div>
      `).join('');
    }
    renderMyths();
  }

  // =============================================
  // DAILY WISDOM SECTION
  // =============================================
  const dailyMyth = document.getElementById('dailyMyth');
  const dailyTruth = document.getElementById('dailyTruth');
  if (dailyMyth && dailyTruth) {
    const todayMyth = myths[new Date().getDay() % myths.length];
    dailyMyth.textContent = todayMyth.myth;
    dailyTruth.textContent = todayMyth.truth;
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

  console.log('🌸 ذهبية Golden Ratio Beauty - خبيرتك في الجمال');
});
