function showSection(id) {
  document.querySelectorAll('.page-section').forEach(function(s) { s.classList.remove('active'); });
  var el = document.getElementById(id);
  if (el) el.classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(function(a) { a.classList.remove('active'); });
  var navLink = document.querySelector('.nav-links a[data-section="' + id + '"]');
  if (navLink) navLink.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('mobilePanel').classList.remove('open');
  document.getElementById('mobileOverlay').classList.remove('open');
}

document.querySelectorAll('[data-section]').forEach(function(el) {
  el.addEventListener('click', function(e) {
    e.preventDefault();
    showSection(this.dataset.section);
  });
});

document.getElementById('mobileToggle').addEventListener('click', function() {
  document.getElementById('mobilePanel').classList.toggle('open');
  document.getElementById('mobileOverlay').classList.toggle('open');
});
document.getElementById('mobileOverlay').addEventListener('click', function() {
  document.getElementById('mobilePanel').classList.remove('open');
  document.getElementById('mobileOverlay').classList.remove('open');
});

// QUIZ
document.getElementById('teenQuizForm').addEventListener('submit', function(e) {
  e.preventDefault();
  var age = this.elements['teenAge'].value;
  var skin = this.elements['teenSkin'].value;
  var hair = this.elements['teenHair'].value;
  var goal = this.elements['teenGoal'].value;
  if (!age || !skin || !hair || !goal) { alert('الرجاء الإجابة على جميع الأسئلة'); return; }
  var tips = [];
  if (age === '10-13') tips.push('🌸 عمرك 10-13: ركزي على بناء عادات صحية بسيطة. روتينك خفيف: غسول + مرطب + واقي شمس.');
  else if (age === '14-17') tips.push('🌺 عمرك 14-17: ركزي على فهم تغيرات جسمك وبناء ثقتك بنفسك.');
  else tips.push('💫 عمرك 18-25: طوري استقلاليتك واستثمري في نفسك.');
  if (skin === 'oily') tips.push('🧴 دهنية: غسول جل + نياسيناميد + مرطب خفيف.');
  else if (skin === 'dry') tips.push('🧴 جافة: غسول كريمي + هيالورونيك + مرطب غني.');
  else if (skin === 'combo') tips.push('🧴 مختلطة: غسول لطيف + مرطب خفيف.');
  else tips.push('🧴 عادية: غسول لطيف + مرطب + واقي شمس.');
  if (hair === 'dry') tips.push('💇‍♀️ جاف: ماسك زيت جوز الهند أسبوعياً.');
  else if (hair === 'oily') tips.push('💇‍♀️ دهني: شامبو خفيف 3 مرات - بلسم للأطراف فقط.');
  else if (hair === 'loss') tips.push('💇‍♀️ تساقط: حديد + بروتين + خففي الربطات.');
  else tips.push('💇‍♀️ شعرك بخير - حافظي عليه.');
  if (goal === 'self') tips.push('🎯 راجعي قسم "افهمي نفسك"');
  else if (goal === 'think') tips.push('🎯 راجعي قسم "مهارات التفكير"');
  else if (goal === 'talk') tips.push('🎯 راجعي قسم "فن الكلام"');
  else if (goal === 'hair') tips.push('🎯 راجعي قسم "شعرك"');
  else if (goal === 'skin') tips.push('🎯 راجعي قسم "بشرتك"');
  else if (goal === 'health') tips.push('🎯 راجعي قسم "التوعية الصحية"');
  else if (goal === 'money') tips.push('🎯 راجعي قسم "الحياة المالية"');
  else tips.push('🎯 راجعي قسم "الدراسة والتفوق"');
  document.getElementById('quizResult').style.display = 'block';
  document.getElementById('quizResult').innerHTML = '<h3>🌺 نصائحك</h3>' + tips.map(function(t) { return '<p>' + t + '</p>'; }).join('');
  document.getElementById('quizResult').scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// SITUATIONS
var situations = {
  '1': {
    title: 'صديقتي تجاهلتني فجأة',
    understand: 'يمكن صديقتك تمر بضغوط أو مشكلة ما شاركتك فيها. أو يمكن سويتي شي بدون قصد زعلها. أحياناً الصداقات تتغير - وهذي سنة الحياة.',
    mistakes: '🚫 تترجينها - 🚫 تتجاهلينها بالمثل - 🚫 تفتعلين مشكلة - 🚫 تترددين عندها دايم',
    steps: '١. خذي مسافة وهدوء لكم يومين\n٢. اسأليها بهدوء: "أنتِ بخير؟ أحس في شي غلط"\n٣. إذا ما ردّت - أعطيها مساحتها\n٤. ركزي على صديقاتك الثانية وحياتك\n٥. تذكري: الصداقة ما تكون من طرف واحد',
    plan: 'هذا الأسبوع: ركزي على نفسك وصديقاتك الثانية. الأسبوع الجاي: جربي تكلمينها مرة. بعدها: إذا ما تغير شي - تقبلي إن بعض الصداقات تنتهي.'
  },
  '2': {
    title: 'رسبت في اختبار درست له كثير',
    understand: 'الفشل مو نهاية العالم. يمكن طريقة مذاكرتك مو مناسبة لك. يمكن كنتي قلقة يوم الامتحان. يمكن المنهج كبير. المهم: هذي فرصة تتعلمين وتتطورين.',
    mistakes: '🚫 تيأسين وتقولين "أنا غبية" - 🚫 تستسلمين - 🚫 تتجاهلين المشكلة - 🚫 تقارنين نفسك',
    steps: '١. نفس عميق - الفشل مو نهاية\n٢. حللي: ليه جبت هالدرجة؟ ما فهمت؟ ما ذاكرت كفاية؟ متشتتة؟\n٣. كلمي معلمتك - اسأليها عن أخطائك\n٤. غيّري طريقة مذاكرتك - جربي البومودورو والخرائط الذهنية\n٥. جربي اختبارات سابقة قبل الامتحان الجاي',
    plan: 'هالأسبوع: كلمي معلمتك - حددي أخطائك. الأسبوع الجاي: طبّقي طريقة مذاكرة جديدة. بعد شهر: راح تشوفين الفرق.'
  },
  '3': {
    title: 'أتعرض للتنمر في المدرسة',
    understand: 'التنمر مو غلطتك أبداً. المتنمر عنده مشاكله الخاصة - واختارك عشان قوتك مو ضعفك. لكن لازم توقفين الموقف.',
    mistakes: '🚫 تردين بالمثل - 🚫 تسكتين - 🚫 تخلينه يأثر على ثقتك - 🚫 تفكرين إنك تستحقين',
    steps: '١. قولي لأمك فوراً - لا تسكتين\n٢. قولي لمعلمتك أو مرشدة المدرسة\n٣. كوني مع مجموعة - المتنمر يستهدف اللي لحالهم\n٤. تجاهلي كلامه - المتنمر يبغى رد فعل\n٥. اشتغلي على ثقتك - التنمر يقول عنه مو عنك',
    plan: 'هاليوم: قولي لأمك. بكرة: قولي لمعلمتك. هذا الأسبوع: كوني مع صديقاتك. ودايم ذكري نفسك: أنتِ قوية وجميلة.'
  },
  '4': {
    title: 'أشعر بالوحدة وما عندي صديقات',
    understand: 'الوحدة شعور صعب - لكن كثير بنات يحسون بهالشي. يمكن انتقائية - يمكن خجولة - يمكن ما لاقيتي الدائرة الصح. صدقيني - في بنات كثير يبون صديقة زيك.',
    mistakes: '🚫 تخلين الوحدة تعرفك - 🚫 تصادقين أي أحد عشان مو لحالك - 🚫 تقعدين بالبيت دايم',
    steps: '١. ابدئي بابتسامة و"صباح الخير" لزملائك\n٢. انضمي لنشاط مدرسي: جماعة - نادي - رياضة\n٣. تكلمي مع البنات عن الدراسة - سهل يبدا حوار\n٤. كوني صديقة لنفسك أولاً - الصداقة الحقيقية تجي بالوقت\n٥. استثمري وقت فراغك في هواية أو تطوير نفسك',
    plan: 'هالأسبوع: سلمي على ٣ بنات جدد. الأسبوع الجاي: انضمي لنشاط. بعد شهر: راح يكون عندك معارف وأصدقاء.'
  },
  '5': {
    title: 'أخطأت وأشعر بالندم الشديد',
    understand: 'كل بنت تخطي. الندم دليل إن ضميرك حي - وهذا شي جميل. المهم: تتعلمين من الخطأ - وتتجاوزينه. الخطأ مو نهاية العالم.',
    mistakes: '🚫 تجلدين نفسك - 🚫 تكررين الغلط - 🚫 تعاندين - 🚫 تخلين الخطأ يعرف هويتك',
    steps: '١. اعترفي بالغلط - لنفسك ولللي زعلانين منهم\n٢. اعتذري بصدق (إذا احتاج)\n٣. اسألي: "وش أتعلمت من هالموقف؟"\n٤. سامحي نفسك - أنتِ إنسانة\n٥. قرري: "مرة ثانية راح أسوي كذا بدال كذا"',
    plan: 'هاليوم: اعتذري إذا في أحد زعلان. اسألي نفسك: "وش أتعلمت؟". اكتبي الدرس بورقة. بعدين - سامحي نفسك وامشي.'
  },
  '6': {
    title: 'لا أعرف ماذا أريد في حياتي',
    understand: 'عادي جداً. كثير بنات في عمرك ما يعرفون. الحياة مو سباق - والبعض يكتشف شغفه متأخر. المهم إنك تبدأين تبحثين.',
    mistakes: '🚫 تضغطين على نفسك - 🚫 تخلين الضغط يوقفك - 🚫 تقارنين نفسك باللي يعرفون',
    steps: '١. جربي كل شي مرة: هوايات - تطوع - دورات\n٢. اسألي نفسك: "وش الشي اللي يسعدني؟"\n٣. اكتبي ١٠ أشياء تحبينها (حتى لو بسيطة)\n٤. استشيري أشخاص تثقين فيهم\n٥. تذكري: الرحلة أهم من الوجهة',
    plan: 'هالأسبوع: جربي شي جديد. هذا الشهر: جرّبي ٣ أشياء مختلفة. هالثلاث شهور: راح تكتشفين جزء من شغفك.'
  },
  '7': {
    title: 'أهلي يقارنوني دايم بغيري',
    understand: 'المقارنة مؤلمة - خصوصاً من أهلك. غالباً الأهل يقارنون عشان يحفزونك - لكن الطريقة غلط. هم يحبونك - بس ما يعرفون إن المقارنة تألم.',
    mistakes: '🚫 تغضبين وتنفعلين - 🚫 تنسحبين - 🚫 تحسين إنك ناقصة - 🚫 تقارنين نفسك بعد',
    steps: '١. اختاري وقت هادئ - تكلمي مع أمك أو أبوك\n٢. قولي: "أنا أحس بحزن لما تقارنوني - هذا يضعف ثقتي"\n٣. اشرحي: "أحتاج تدعموني أنا كشخص - مو تقارنوني"\n٤. حاولي تفهمين وجهة نظرهم\n٥. ذكري نفسك: قيمتك مو من مقارنة - من شخصيتك',
    plan: 'هالأسبوع: تكلمي مع أهلك بهدوء. كل ما سمعتي مقارنة: نفس عميق. ذكري نفسك: أنتِ فريدة.'
  },
  '8': {
    title: 'أخاف من المستقبل وما أعرف وش أسوي',
    understand: 'الخوف من المستقبل طبيعي جداً في عمرك. المستقبل مجهول - والمجهول يخوف. لكن اليقين الوحيد: إنك كبيرة وتتعلمين وتتطورين.',
    mistakes: '🚫 تخلين الخوف يوقفك - 🚫 تخططين بقلق - 🚫 تتجاهلين تسألين',
    steps: '١. خديها خطوة خطوة: اليوم = اليوم\n٢. اسألي ناجحين في مجالات مختلفة\n٣. ابدئي بمهارة صغيرة - أي شي\n٤. تذكري: معظم الناس وصلوا بالصدفة والتجربة\n٥. ثقي إن الله يكتب لك الخير',
    plan: 'هالشهر: جرّبي مهارة أو تطوع. اختاري مجالين يثيرون اهتمامك وابحثي فيهم. بعد ٦ شهور: راح يكون عندك فكرة أوضح.'
  }
};

function showSituation(id) {
  if (!id) { document.getElementById('situationResult').style.display = 'none'; return; }
  var s = situations[id];
  if (!s) return;
  var html = '<h3>📚 ' + s.title + '</h3>';
  html += '<hr style="border:1px solid var(--gold-light);margin:1rem 0">';
  html += '<p><strong>🔍 فهم المشكلة:</strong><br>' + s.understand + '</p>';
  html += '<p><strong>🚫 الأخطاء الشائعة:</strong><br>' + s.mistakes.replace(/\n/g, '<br>') + '</p>';
  html += '<p><strong>✅ خطوات عملية:</strong><br>' + s.steps.replace(/\n/g, '<br>') + '</p>';
  html += '<p><strong>📅 خطة قصيرة:</strong><br>' + s.plan + '</p>';
  html += '<p class="counselor-name">— ركن الصبايا 💕</p>';
  document.getElementById('situationResult').style.display = 'block';
  document.getElementById('situationResult').innerHTML = html;
}

// SMART COUNSELOR - 30 DAY PLAN
document.getElementById('smartForm').addEventListener('submit', function(e) {
  e.preventDefault();
  var age = this.elements['smartAge'].value;
  var problem = this.elements['smartProblem'].value;
  var goal = this.elements['smartGoal'].value;
  if (!age || !problem || !goal) { alert('الرجاء الإجابة على جميع الأسئلة'); return; }

  var plan = [];
  var ageLabel = '';
  if (age === '10-13') ageLabel = '10-13 سنة';
  else if (age === '14-17') ageLabel = '14-17 سنة';
  else ageLabel = '18-25 سنة';

  plan.push('🌸 مرحباً بكِ! خطتك المخصصة لمدة 30 يوم لعمر ' + ageLabel);

  if (problem === 'confidence') plan.push('🧩 تركيزك على الثقة: راح نركز على بناء ثقتك بنفسك خطوة بخطوة.');
  else if (problem === 'study') plan.push('🧩 تركيزك على الدراسة: راح نركز على طرق المذاكرة الفعالة وتنظيم الوقت.');
  else if (problem === 'friends') plan.push('🧩 تركيزك على الصداقات: راح نركز على بناء صداقات صحية وتجنب السامة.');
  else if (problem === 'anxiety') plan.push('🧩 تركيزك على القلق: راح نركز على تمارين الاسترخاء والتفكير الإيجابي.');
  else if (problem === 'future') plan.push('🧩 تركيزك على المستقبل: راح نركز على اكتشاف الميول المهنية.');
  else if (problem === 'family') plan.push('🧩 تركيزك على العلاقة مع الأهل: راح نركز على التواصل الفعال.');
  else plan.push('🧩 تركيزك على تقبل الجسم: راح نركز على الصحة والعناية بالنفس.');

  if (goal === 'grades') plan.push('🎯 هدفك: تحسين الدرجات - ركز على 📚');
  else if (goal === 'confidence') plan.push('🎯 هدفك: الثقة - ركز على 🌱');
  else if (goal === 'friends') plan.push('🎯 هدفك: الصداقات - ركز على 👯');
  else if (goal === 'skill') plan.push('🎯 هدفك: مهارة جديدة - ركز على 🎨');
  else if (goal === 'health') plan.push('🎯 هدفك: الصحة - ركز على 💪');
  else plan.push('🎯 هدفك: القرب من الله - ركز على 🕌');

  plan.push(''); plan.push('📅 **الأسبوع الأول: الوعي**');
  var week1 = [];
  if (problem === 'confidence') { week1.push('اليوم 1-2: اكتبي 5 صفات حلوة فيك'); week1.push('اليوم 3-4: حددي موقف نجحت فيه'); week1.push('اليوم 5: اسألي أمك عن أقوى شي فيك'); week1.push('اليوم 6-7: كرري "أنا قوية وقدها" كل صباح'); }
  else if (problem === 'study') { week1.push('اليوم 1-2: نظمي جدول أسبوعي'); week1.push('اليوم 3-4: طبقي بومودورو 25/5'); week1.push('اليوم 5-6: لخصي درس بالخرائط الذهنية'); week1.push('اليوم 7: راجعي اللي ذاكرتيه'); }
  else if (problem === 'anxiety') { week1.push('اليوم 1-2: تمرين تنفس 4-4-4 (10 مرات)'); week1.push('اليوم 3-4: اكتبي مخاوفك بورقة'); week1.push('اليوم 5-6: تأمل 5 دقائق'); week1.push('اليوم 7: شوفي وش تعلمتي من القلق'); }
  else { week1.push('اليوم 1-2: اكتبي ٣ أهداف بسيطة'); week1.push('اليوم 3-4: خذي خطوة صغيرة نحو هدف'); week1.push('اليوم 5-6: اسألي شخص ناجح'); week1.push('اليوم 7: احتفلي بإنجازات الأسبوع'); }
  plan = plan.concat(week1);

  plan.push(''); plan.push('📅 **الأسبوع الثاني: التطبيق**');
  plan.push('اليوم 8-9: طبقي اللي تعلمتيه في الأسبوع الأول');
  plan.push('اليوم 10-11: جربي شي جديد - خارج منطقة الراحة');
  plan.push('اليوم 12-13: قرري عادة جديدة تبين تبنينها');
  plan.push('اليوم 14: قيّمي أسبوعك - وش نجح وش لأ');

  plan.push(''); plan.push('📅 **الأسبوع الثالث: التعمق**');
  plan.push('اليوم 15-16: اقرأي أو شاهدي محتوى يطورك');
  plan.push('اليوم 17-18: طبقي على أرض الواقع');
  plan.push('اليوم 19-20: شاركي صديقة رحلتك');
  plan.push('اليوم 21: يوم راحة وتأمل');

  plan.push(''); plan.push('📅 **الأسبوع الرابع: التثبيت**');
  plan.push('اليوم 22-23: استمري على العادات الجديدة');
  plan.push('اليوم 24-25: علمي غيرك اللي تعلمتيه');
  plan.push('اليوم 26-27: خططي للشهر الجاي');
  plan.push('اليوم 28-29: احتفلي بتقدمك');
  plan.push('اليوم 30: اكتبي: "أنا فخورة بنفسي لأني..." 🎉');

  plan.push(''); plan.push('🌟 **ذكرى نفسك:** التغيير يحتاج وقت. لا تضغطي على نفسك. كل خطوة صغيرة تحسب لك. أنتِ في رحلة - واستمتعي فيها! 💕');

  document.getElementById('smartResult').style.display = 'block';
  document.getElementById('smartResult').innerHTML = '<h3>🤖 خطتك لمدة 30 يوم</h3>' + plan.map(function(t) { return '<p>' + t + '</p>'; }).join('');
  document.getElementById('smartResult').scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// COUNSELOR
var counselorResponses = {
  'study': '📚 للدراسة: جربي تقنية البومودورو (25 د تركيز + 5 د راحة). اختبر نفسك باستمرار. وإذا تحسين صعوبة - اطلبي المساعدة.\n\n"Success comes from consistent effort." — Dr. Barbara Oakley',
  'friends': '👯 للصداقات: الصداقة الحقيقية تكون من طرفين. إذا في صديقة تستغلك أو تنتقدك دايم - فكري تبعدين بهدوء. أنتِ تستحقين صديقات يرفعونك.\n\n"الصداقة الحقيقية مو في العدد - في الجودة."',
  'family': '💛 للأهل: اختاري وقت مناسب للكلام. تكلمي بهدوء. ابدئي بـ "أنا أحتاج..." مو "أنتم دايم...". أهلك يحبونك - حتى لو ما عبروا دايماً بالطريقة اللي تبينها.\n\n"الفهم يحتاج صبر من الطرفين."',
  'confidence': '💪 للثقة: اكتبي إنجازاتك اليومية. وقفي مقارنة نفسك. جربي شي جديد. تكلمي بثقة حتى لو تحسين خوف - مع الوقت تصير حقيقية.\n\n"Confidence is \'I will be okay even if I fail\'." — Marie Forleo',
  'mental': '🧠 للقلق: تمارين التنفس 4-4-4 تهديك. اكتبي مخاوفك. ركزي على اللي تقدرين تتحكمين فيه. وإذا القلق مستمر - اطلبي المساعدة.\n\n"Your mental health is a priority." — Dr. Thema Bryant',
  'bullying': '🛑 للتنمر: مو غلطتك. تكلمي فوراً مع أمك أو معلمتك. لا تردين بالمثل. احفظي الأدلة. التنمر يقول عن المتنمر مو عنك. أنتِ قوية وجميلة.',
  'digital': '🔐 للأمان الرقمي: كلمة سر قوية لكل حساب. فعّلي المصادقة الثنائية. لا تشاركي معلوماتك الشخصية. أي شي يضايقك - قولي لأمك فوراً.',
  'career': '💼 للمستقبل: اكتشفي ميولك. جربي تطوع أو دورات في المجال اللي يثير اهتمامك. تكلمي مع ناجحين في المجال. خذي وقتك في الاختيار.\n\n"Choose a job you love."',
  'other': '💝 شكراً لمشاركتك. كل مشكلة لها حل. أول خطوة إنك تتكلمين عنها. لا تتحملين لوحدك. نحن هنا 24 ساعة 💕'
};

function askCounselor() {
  var age = document.getElementById('counselorAge').value;
  var topic = document.getElementById('counselorTopic').value;
  var question = document.getElementById('counselorQuestion').value.trim();
  if (!age || !topic || !question) { alert('الرجاء تعبئة جميع الحقول'); return; }

  var response = counselorResponses[topic] || counselorResponses['other'];
  var ageAdvice = '';
  if (age === '10-13') ageAdvice = '🌸 عمرك 10-13: خذي الأمور ببساطة - التغيرات اللي تمرين فيها طبيعية.';
  else if (age === '14-17') ageAdvice = '🌺 عمرك 14-17: هذي مرحلة بناء الثقة - ركزي على تطوير نفسك.';
  else ageAdvice = '💫 عمرك 18-25: مرحلة الاستقلالية - ثقي بقراراتك واختاري طريقك.';

  var html = '<h3>💬 رد المرشدة</h3>';
  html += '<p><strong>سؤالك:</strong> ' + question + '</p>';
  html += '<hr style="border:1px solid var(--gold-light);margin:1rem 0">';
  html += '<p>' + ageAdvice + '</p>';
  html += '<p>' + response.replace(/\n/g, '<br>') + '</p>';
  html += '<p class="counselor-name">— نوف العتيبي + فريق ركن الصبايا 💕</p>';

  document.getElementById('counselorResult').style.display = 'block';
  document.getElementById('counselorResult').innerHTML = html;
  document.getElementById('counselorResult').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function fillCounselor(age, topic, question) {
  document.getElementById('counselorAge').value = age;
  document.getElementById('counselorTopic').value = topic;
  document.getElementById('counselorQuestion').value = question;
  window.scrollTo({ top: document.getElementById('counselorQuestion').offsetTop - 200, behavior: 'smooth' });
}
