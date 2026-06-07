/* 24Snack Production Manual — single-file app (no build, no server)
   Data: window.INGREDIENTS, window.PACKAGING, window.TEMPLATES, window.PRODUCTS
   Prices editable; overrides stored in localStorage; all costs/nutrition computed live. */
(function () {
  "use strict";

  // ---------------- i18n ----------------
  const STR = {
    brandTitle: { en: "24Snack Production Manual", ar: "دليل إنتاج 24Snack" },
    brandSub: { en: "Official Master Manual — v1.0", ar: "الدليل الرئيسي المعتمد — الإصدار 1.0" },
    navProducts: { en: "Products", ar: "المنتجات" },
    navCommon: { en: "Hygiene & Setup", ar: "النظافة والتجهيز" },
    navPrices: { en: "Price Editor", ar: "محرر الأسعار" },
    footNote: { en: "All nutrition values and costs are calculated from the ingredient database. Estimated recipes are marked and require an R&D test batch before production.", ar: "جميع القيم الغذائية والتكاليف محسوبة من قاعدة بيانات المكونات. الوصفات التقديرية مُعلَّمة وتتطلب دفعة تجريبية قبل الإنتاج." },
    searchPh: { en: "Search products…", ar: "ابحث عن منتج…" },
    allCats: { en: "All categories", ar: "كل الفئات" },
    allStatus: { en: "All statuses", ar: "كل الحالات" },
    documented: { en: "Documented", ar: "موثّق" },
    estimated: { en: "ESTIMATED — R&D required", ar: "تقديري — يتطلب تجربة" },
    estBanner: { en: "⚠ ESTIMATED RECIPE: developed from name + macros only. Run an R&D test batch and verify nutrition before production.", ar: "⚠ وصفة تقديرية: طُوّرت من الاسم والقيم الغذائية فقط. نفّذ دفعة تجريبية وتحقق من القيم قبل الإنتاج." },
    back: { en: "← All products", ar: "→ كل المنتجات" },
    printCard: { en: "🖨 Production Card", ar: "🖨 بطاقة الإنتاج" },
    printPage: { en: "🖨 Print full SOP", ar: "🖨 طباعة الدليل كاملاً" },
    s1: { en: "1. Product Information", ar: "1. معلومات المنتج" },
    s2: { en: "2. Ingredients", ar: "2. المكونات" },
    s3: { en: "3. Nutrition Analysis (calculated)", ar: "3. التحليل الغذائي (محسوب)" },
    s4: { en: "4. Costing Analysis (calculated)", ar: "4. تحليل التكلفة (محسوب)" },
    s5: { en: "5. Production SOP", ar: "5. إجراءات الإنتاج المعيارية" },
    s6: { en: "6. Quality Control", ar: "6. مراقبة الجودة" },
    s7: { en: "7. Portioning Guide", ar: "7. دليل التقسيم" },
    s8: { en: "8. Packaging Guide", ar: "8. دليل التعبئة" },
    s9: { en: "9. Storage & Shelf Life", ar: "9. التخزين ومدة الصلاحية" },
    s12: { en: "10. Verification Notes & Sources", ar: "10. ملاحظات التحقق والمصادر" },
    prodName: { en: "Product name", ar: "اسم المنتج" },
    category: { en: "Category", ar: "الفئة" },
    desc: { en: "Description", ar: "الوصف" },
    portion: { en: "Target portion", ar: "الحصة المستهدفة" },
    pieceW: { en: "Finished piece weight", ar: "وزن القطعة الجاهزة" },
    batchYield: { en: "Yield per batch", ar: "إنتاج الدفعة" },
    pcsBatch: { en: "Pieces per batch", ar: "عدد القطع بالدفعة" },
    servSize: { en: "Serving size", ar: "حجم الحصة" },
    price: { en: "Sale price (source)", ar: "سعر البيع (من المصدر)" },
    ingredient: { en: "Ingredient", ar: "المكوّن" },
    qty: { en: "Qty (g)", ar: "الكمية (جم)" },
    specs: { en: "Specification / prep", ar: "المواصفة / التحضير" },
    subs: { en: "Approved substitute", ar: "البديل المعتمد" },
    scaleLbl: { en: "Scale batch ×", ar: "تغيير حجم الدفعة ×" },
    rawTotal: { en: "Raw batch total", ar: "إجمالي الدفعة النيئة" },
    nutriHow: { en: "Method: values computed from the ingredient nutrition database (per-100g standard reference values), summed per batch, divided by pieces / serving / finished weight. Cooked weight loss is reflected in the finished batch yield. Erythritol carbs excluded (sugar alcohol).", ar: "الطريقة: تُحسب القيم من قاعدة بيانات المكونات (قيم مرجعية لكل 100 جم)، تُجمع للدفعة ثم تُقسم على القطع / الحصة / الوزن الجاهز. فقد الطهي محسوب ضمن وزن الدفعة الجاهزة. كربوهيدرات الإريثريتول مستبعدة (كحول سكري)." },
    perServing: { en: "Per serving", ar: "لكل حصة" },
    perPiece: { en: "Per piece", ar: "لكل قطعة" },
    per100: { en: "Per 100 g", ar: "لكل 100 جم" },
    target: { en: "Source target (per serving)", ar: "الهدف من المصدر (لكل حصة)" },
    kcal: { en: "Calories", ar: "سعرات" },
    protein: { en: "Protein (g)", ar: "بروتين (جم)" },
    carbs: { en: "Carbs (g)", ar: "كربوهيدرات (جم)" },
    fat: { en: "Fat (g)", ar: "دهون (جم)" },
    fiber: { en: "Fiber (g)", ar: "ألياف (جم)" },
    sugar: { en: "Sugar (g)", ar: "سكر (جم)" },
    deviation: { en: "Deviation vs target", ar: "الانحراف عن الهدف" },
    item: { en: "Item", ar: "البند" },
    unitPrice: { en: "Price (AED/kg)", ar: "السعر (درهم/كجم)" },
    cost: { en: "Cost (AED)", ar: "التكلفة (درهم)" },
    ingCost: { en: "Total ingredient cost", ar: "إجمالي تكلفة المكونات" },
    packCost: { en: "Packaging cost", ar: "تكلفة التعبئة" },
    batchCost: { en: "Total production cost / batch", ar: "إجمالي تكلفة الإنتاج / دفعة" },
    costPiece: { en: "Cost per piece", ar: "التكلفة لكل قطعة" },
    costServing: { en: "Cost per serving", ar: "التكلفة لكل حصة" },
    costKg: { en: "Cost per kg (finished, yield-adjusted)", ar: "التكلفة لكل كجم (جاهز، بعد احتساب الفاقد)" },
    margin: { en: "Margin vs sale price (per serving)", ar: "الهامش مقابل سعر البيع (للحصة)" },
    costNote: { en: "Ingredient prices are UAE market ESTIMATES (editable in Price Editor — totals recalculate automatically). Labor, utilities, and delivery are not included.", ar: "أسعار المكونات تقديرات سوق الإمارات (قابلة للتعديل في محرر الأسعار — تُعاد الحسابات تلقائياً). لا تشمل العمالة والمرافق والتوصيل." },
    preTitle: { en: "Pre-production", ar: "قبل الإنتاج" },
    equip: { en: "Equipment", ar: "المعدات" },
    tools: { en: "Tools", ar: "الأدوات" },
    hygiene: { en: "Hygiene requirements", ar: "اشتراطات النظافة" },
    preCheck: { en: "Pre-production checklist", ar: "قائمة التحقق قبل الإنتاج" },
    steps: { en: "Production steps", ar: "خطوات الإنتاج" },
    qcBefore: { en: "Before production", ar: "قبل الإنتاج" },
    qcDuring: { en: "During production", ar: "أثناء الإنتاج" },
    qcFinished: { en: "Finished product standard", ar: "مواصفات المنتج النهائي" },
    appearance: { en: "Appearance", ar: "المظهر" },
    color: { en: "Color", ar: "اللون" },
    texture: { en: "Texture", ar: "القوام" },
    weight: { en: "Weight", ar: "الوزن" },
    dims: { en: "Dimensions", ar: "الأبعاد" },
    defects: { en: "Common defects", ar: "العيوب الشائعة" },
    failRule: { en: "Failed batch rule", ar: "قاعدة رفض الدفعة" },
    portMethod: { en: "Portioning method", ar: "طريقة التقسيم" },
    portCheck: { en: "Portion control checkpoint", ar: "نقطة ضبط الحصص" },
    packMaterials: { en: "Packaging materials", ar: "مواد التعبئة" },
    packProc: { en: "Packaging procedure", ar: "إجراء التعبئة" },
    labeling: { en: "Labeling rule", ar: "قاعدة الملصقات" },
    stTemp: { en: "Storage temperature", ar: "حرارة التخزين" },
    stCond: { en: "Storage conditions", ar: "ظروف التخزين" },
    stShelf: { en: "Shelf life", ar: "مدة الصلاحية" },
    stExpiry: { en: "Expiry rule", ar: "قاعدة تاريخ الانتهاء" },
    stHandle: { en: "Handling", ar: "التداول" },
    cardIngs: { en: "Ingredients", ar: "المكونات" },
    cardBatch: { en: "Batch size", ar: "حجم الدفعة" },
    cardYield: { en: "Yield", ar: "الإنتاج" },
    cardEquip: { en: "Equipment needed", ar: "المعدات المطلوبة" },
    cardSteps: { en: "Quick production steps", ar: "خطوات الإنتاج السريعة" },
    cardTemps: { en: "Temperatures", ar: "درجات الحرارة" },
    cardTimes: { en: "Timings", ar: "الأوقات" },
    cardPortion: { en: "Portion size", ar: "حجم الحصة" },
    cardPack: { en: "Packaging", ar: "التعبئة" },
    cardQC: { en: "Quality checkpoints", ar: "نقاط فحص الجودة" },
    pcs: { en: "pcs", ar: "قطعة" },
    priceEditTitle: { en: "Ingredient & Packaging Price Editor", ar: "محرر أسعار المكونات والتعبئة" },
    priceEditNote: { en: "Edit any price and press Enter or click Save. All product costs across the manual recalculate automatically. Values are saved in this browser only.", ar: "عدّل أي سعر واضغط Enter أو زر الحفظ. تُعاد حسابات تكاليف كل المنتجات تلقائياً. تُحفظ القيم في هذا المتصفح فقط." },
    saveAll: { en: "💾 Save all changes", ar: "💾 حفظ كل التغييرات" },
    resetAll: { en: "↺ Reset to defaults", ar: "↺ استرجاع الافتراضي" },
    exportPrices: { en: "⬇ Export prices (CSV)", ar: "⬇ تصدير الأسعار (CSV)" },
    saved: { en: "Saved ✓", ar: "تم الحفظ ✓" },
    defaultP: { en: "Default", ar: "الافتراضي" },
    current: { en: "Current", ar: "الحالي" },
    packagingHdr: { en: "Packaging (AED per piece)", ar: "التعبئة (درهم للقطعة)" },
    ingredientsHdr: { en: "Ingredients (AED per kg)", ar: "المكونات (درهم لكل كجم)" },
    commonTitle: { en: "Common Hygiene & Setup (applies to every product)", ar: "النظافة والتجهيز المشترك (يطبق على كل المنتجات)" },
    estChip: { en: "EST", ar: "تقديري" },
    docChip: { en: "OK", ar: "موثّق" }
  };

  // ---------------- state ----------------
  const LS_KEY = "snack24_prices_v1";
  const LS_LANG = "snack24_lang";
  let lang = localStorage.getItem(LS_LANG) || "en";
  let overrides = {};
  try { overrides = JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch (e) { overrides = {}; }
  if (typeof overrides !== "object" || overrides === null) overrides = {};

  const ING = window.INGREDIENTS, PACK = window.PACKAGING, TPL = window.TEMPLATES;
  const PRODUCTS = (window.PRODUCTS || []).slice().sort((a, b) => a.id.localeCompare(b.id));

  const t = (k) => (STR[k] ? STR[k][lang] : k);
  const L = (obj) => (obj ? (obj[lang] != null ? obj[lang] : obj.en) : "");
  const ingPrice = (key) => (overrides["ing:" + key] != null ? overrides["ing:" + key] : ING[key].priceAEDperKg);
  const packPrice = (key) => (overrides["pack:" + key] != null ? overrides["pack:" + key] : PACK[key].priceAED);
  // Western digits in both languages — staff scales/thermometers show 0-9, not ٠-٩
  const fmt = (n, d) => Number(n).toLocaleString("en-US", { minimumFractionDigits: d == null ? 1 : d, maximumFractionDigits: d == null ? 1 : d });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---------------- calculations ----------------
  function batchNutrition(p, scale) {
    const s = scale || 1;
    const tot = { kcal: 0, p: 0, c: 0, f: 0, fb: 0, sg: 0, rawG: 0 };
    p.ingredients.forEach((it) => {
      const n = ING[it.key].per100g, q = it.qtyG * s;
      tot.kcal += (q * n.kcal) / 100; tot.p += (q * n.p) / 100; tot.c += (q * n.c) / 100;
      tot.f += (q * n.f) / 100; tot.fb += (q * (n.fb || 0)) / 100; tot.sg += (q * (n.sg || 0)) / 100;
      tot.rawG += q;
    });
    return tot;
  }
  function nutritionViews(p) {
    const b = batchNutrition(p, 1);
    const per = (div) => ({ kcal: b.kcal / div, p: b.p / div, c: b.c / div, f: b.f / div, fb: b.fb / div, sg: b.sg / div });
    return {
      batch: b,
      piece: per(p.pieces),
      serving: per(p.pieces / p.servingPieces),
      per100: per(p.batchYieldG / 100)
    };
  }
  function costView(p, scale) {
    const s = scale || 1;
    const rows = p.ingredients.map((it) => ({
      key: it.key, qtyG: it.qtyG * s, price: ingPrice(it.key),
      cost: (it.qtyG * s / 1000) * ingPrice(it.key)
    }));
    const ingCost = rows.reduce((a, r) => a + r.cost, 0);
    const packRows = (p.packaging || []).map((pk) => ({
      key: pk.key, qty: pk.qty * s, price: packPrice(pk.key), cost: pk.qty * s * packPrice(pk.key)
    }));
    const packCost = packRows.reduce((a, r) => a + r.cost, 0);
    const total = ingCost + packCost;
    return {
      rows, packRows, ingCost, packCost, total,
      perPiece: total / (p.pieces * s),
      perServing: total / ((p.pieces * s) / p.servingPieces),
      perKg: total / ((p.batchYieldG * s) / 1000)
    };
  }

  // ---------------- router ----------------
  function route() {
    const h = location.hash || "#/";
    document.querySelectorAll(".nav-link").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === h));
    const app = document.getElementById("app");
    if (h.startsWith("#/p/")) renderProduct(app, h.slice(4));
    else if (h.startsWith("#/card/")) renderCard(app, h.slice(7));
    else if (h === "#/prices") renderPrices(app);
    else if (h === "#/common") renderCommon(app);
    else renderCatalog(app);
    window.scrollTo(0, 0);
  }

  // ---------------- catalog ----------------
  let filterText = "", filterCat = "", filterStatus = "";
  function renderCatalog(app) {
    const cats = Object.keys(TPL.categories);
    app.innerHTML =
      '<div class="toolbar no-print">' +
      '<input type="search" id="q" placeholder="' + esc(t("searchPh")) + '" value="' + esc(filterText) + '">' +
      '<select id="fcat"><option value="">' + esc(t("allCats")) + "</option>" +
      cats.map((c) => '<option value="' + c + '"' + (filterCat === c ? " selected" : "") + ">" + esc(L(TPL.categories[c].label)) + "</option>").join("") +
      "</select>" +
      '<select id="fst"><option value="">' + esc(t("allStatus")) + "</option>" +
      '<option value="documented"' + (filterStatus === "documented" ? " selected" : "") + ">" + esc(t("documented")) + "</option>" +
      '<option value="estimated"' + (filterStatus === "estimated" ? " selected" : "") + ">" + esc(t("estimated")) + "</option>" +
      "</select></div>" +
      '<div class="grid" id="grid"></div>';
    const grid = document.getElementById("grid");
    const draw = () => {
      const q = filterText.trim().toLowerCase();
      grid.innerHTML = PRODUCTS.filter((p) => {
        if (filterCat && p.category !== filterCat) return false;
        if (filterStatus && p.status !== filterStatus) return false;
        if (q && !(p.name.en.toLowerCase().includes(q) || p.name.ar.includes(filterText.trim()) || p.id.toLowerCase().includes(q))) return false;
        return true;
      }).map((p) => {
        const n = nutritionViews(p).serving;
        return '<a class="pcard" href="#/p/' + p.id + '">' +
          '<div class="badges"><span class="badge id">' + p.id + "</span>" +
          '<span class="badge ' + (p.status === "estimated" ? "est" : "doc") + '">' + esc(p.status === "estimated" ? t("estChip") : t("docChip")) + "</span></div>" +
          "<h3>" + esc(L(p.name)) + "</h3>" +
          '<span class="cat">' + esc(L(TPL.categories[p.category].label)) + "</span>" +
          '<div class="macro-row"><span><b>' + fmt(n.kcal, 0) + "</b> kcal</span><span><b>" + fmt(n.p, 0) + "g</b> P</span><span><b>" + fmt(n.c, 0) + "g</b> C</span><span><b>" + fmt(n.f, 0) + "g</b> F</span></div>" +
          "</a>";
      }).join("");
    };
    draw();
    document.getElementById("q").addEventListener("input", (e) => { filterText = e.target.value; draw(); });
    document.getElementById("fcat").addEventListener("change", (e) => { filterCat = e.target.value; draw(); });
    document.getElementById("fst").addEventListener("change", (e) => { filterStatus = e.target.value; draw(); });
  }

  // ---------------- product page ----------------
  function macroTable(p) {
    const v = nutritionViews(p);
    const tm = p.targetMacros;
    const tmKcal = tm ? tm.kcal : null;
    const row = (label, n) =>
      "<tr><th>" + esc(label) + '</th><td class="num">' + fmt(n.kcal, 0) + '</td><td class="num">' + fmt(n.p) + '</td><td class="num">' + fmt(n.c) + '</td><td class="num">' + fmt(n.f) + '</td><td class="num">' + fmt(n.fb) + '</td><td class="num">' + fmt(n.sg) + "</td></tr>";
    let dev = "";
    if (tm) {
      const s = v.serving;
      const d = (a, b) => (b ? ((a - b) >= 0 ? "+" : "") + fmt(a - b) : "—");
      dev = "<tr><th>" + esc(t("target")) + '</th><td class="num">' + tm.kcal + '</td><td class="num">' + tm.p + '</td><td class="num">' + tm.c + '</td><td class="num">' + tm.f + '</td><td class="num">—</td><td class="num">—</td></tr>' +
        "<tr><th>" + esc(t("deviation")) + '</th><td class="num">' + d(s.kcal, tm.kcal) + '</td><td class="num">' + d(s.p, tm.p) + '</td><td class="num">' + d(s.c, tm.c) + '</td><td class="num">' + d(s.f, tm.f) + '</td><td class="num">—</td><td class="num">—</td></tr>';
    }
    return '<table class="data"><thead><tr><th></th><th class="num">' + esc(t("kcal")) + '</th><th class="num">' + esc(t("protein")) + '</th><th class="num">' + esc(t("carbs")) + '</th><th class="num">' + esc(t("fat")) + '</th><th class="num">' + esc(t("fiber")) + '</th><th class="num">' + esc(t("sugar")) + "</th></tr></thead><tbody>" +
      row(t("perServing"), v.serving) + row(t("perPiece"), v.piece) + row(t("per100"), v.per100) + dev + "</tbody></table>" +
      '<p class="note">' + esc(t("nutriHow")) + "</p>";
  }

  function renderProduct(app, id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) { app.innerHTML = "<p>Not found.</p>"; return; }
    const cat = TPL.categories[p.category];
    const storage = p.storageOverride || cat.storage;
    let scale = 1;

    const ingTable = (s) => {
      const c = costView(p, s);
      const b = batchNutrition(p, s);
      return '<table class="data"><thead><tr><th>' + esc(t("ingredient")) + '</th><th class="num">' + esc(t("qty")) + "</th><th>" + esc(t("specs")) + "</th><th>" + esc(t("subs")) + "</th></tr></thead><tbody>" +
        p.ingredients.map((it) => {
          const ing = ING[it.key];
          return "<tr><td><b>" + esc(L(ing.name)) + "</b></td><td class=\"num\">" + fmt(it.qtyG * s, 0) + "</td><td>" +
            esc(L(ing.spec)) + (it.note ? " — " + esc(L(it.note)) : "") + "</td><td>" + (it.sub ? esc(L(it.sub)) : "—") + "</td></tr>";
        }).join("") +
        '<tr class="totalrow"><td>' + esc(t("rawTotal")) + '</td><td class="num">' + fmt(b.rawG, 0) + "</td><td colspan=\"2\"></td></tr>" +
        "</tbody></table>";
    };

    const costTable = (s) => {
      const c = costView(p, s);
      const salePrice = p.priceAED || 0;
      return '<table class="data"><thead><tr><th>' + esc(t("item")) + '</th><th class="num">' + esc(t("qty")) + '</th><th class="num">' + esc(t("unitPrice")) + '</th><th class="num">' + esc(t("cost")) + "</th></tr></thead><tbody>" +
        c.rows.map((r) => "<tr><td>" + esc(L(ING[r.key].name)) + '</td><td class="num">' + fmt(r.qtyG, 0) + ' g</td><td class="num">' + fmt(r.price, 2) + '</td><td class="num">' + fmt(r.cost, 2) + "</td></tr>").join("") +
        c.packRows.map((r) => "<tr><td>" + esc(L(PACK[r.key].name)) + '</td><td class="num">' + fmt(r.qty, 0) + ' × </td><td class="num">' + fmt(r.price, 2) + '</td><td class="num">' + fmt(r.cost, 2) + "</td></tr>").join("") +
        '<tr class="totalrow"><td>' + esc(t("ingCost")) + '</td><td></td><td></td><td class="num">' + fmt(c.ingCost, 2) + "</td></tr>" +
        '<tr class="totalrow"><td>' + esc(t("packCost")) + '</td><td></td><td></td><td class="num">' + fmt(c.packCost, 2) + "</td></tr>" +
        '<tr class="totalrow"><td>' + esc(t("batchCost")) + '</td><td></td><td></td><td class="num">' + fmt(c.total, 2) + "</td></tr>" +
        "</tbody></table>" +
        '<dl class="kv" style="margin-top:0.8rem">' +
        "<dt>" + esc(t("costPiece")) + "</dt><dd>" + fmt(c.perPiece, 2) + " AED</dd>" +
        "<dt>" + esc(t("costServing")) + "</dt><dd>" + fmt(c.perServing, 2) + " AED</dd>" +
        "<dt>" + esc(t("costKg")) + "</dt><dd>" + fmt(c.perKg, 2) + " AED</dd>" +
        (salePrice ? "<dt>" + esc(t("margin")) + "</dt><dd>" + fmt(salePrice - c.perServing, 2) + " AED (" + fmt(((salePrice - c.perServing) / salePrice) * 100, 0) + "%)</dd>" : "") +
        "</dl>" +
        '<p class="note">' + esc(t("costNote")) + "</p>";
    };

    const list = (arr) => "<ul class=\"checks\">" + arr.map((x) => "<li>" + esc(L(x)) + "</li>").join("") + "</ul>";
    const f = p.qcFinished;

    app.innerHTML =
      '<div class="crumb no-print"><a href="#/">' + esc(t("back")) + "</a></div>" +
      '<div class="p-head"><div><h1>' + esc(L(p.name)) + "</h1>" +
      '<div class="sub">' + p.id + (p.sourceNum ? " · #" + p.sourceNum : "") + " · " + esc(L(cat.label)) + "</div></div>" +
      '<div class="p-actions"><a class="btn primary" href="#/card/' + p.id + '">' + esc(t("printCard")) + '</a>' +
      '<button class="btn" onclick="window.print()">' + esc(t("printPage")) + "</button></div></div>" +
      (p.status === "estimated" ? '<div class="est-banner">' + esc(t("estBanner")) + "</div>" : "") +

      '<section class="section"><h2>' + esc(t("s1")) + '</h2><dl class="kv">' +
      "<dt>" + esc(t("prodName")) + "</dt><dd>" + esc(p.name.en) + " / " + esc(p.name.ar) + "</dd>" +
      "<dt>" + esc(t("category")) + "</dt><dd>" + esc(L(cat.label)) + "</dd>" +
      "<dt>" + esc(t("desc")) + "</dt><dd>" + esc(L(p.desc)) + "</dd>" +
      "<dt>" + esc(t("portion")) + "</dt><dd>" + esc(L(p.portionDesc)) + "</dd>" +
      "<dt>" + esc(t("pieceW")) + "</dt><dd>~" + p.pieceWeightG + " g</dd>" +
      "<dt>" + esc(t("batchYield")) + "</dt><dd>~" + fmt(p.batchYieldG / 1000, 2) + " kg</dd>" +
      "<dt>" + esc(t("pcsBatch")) + "</dt><dd>" + p.pieces + " " + esc(t("pcs")) + "</dd>" +
      "<dt>" + esc(t("servSize")) + "</dt><dd>" + p.servingPieces + " × " + p.pieceWeightG + " g</dd>" +
      (p.priceAED ? "<dt>" + esc(t("price")) + "</dt><dd>AED " + p.priceAED + "</dd>" : "") +
      "</dl></section>" +

      '<section class="section"><h2>' + esc(t("s2")) + "</h2>" +
      '<div class="scaler no-print"><label>' + esc(t("scaleLbl")) + '</label><input type="number" id="scl" min="0.5" max="10" step="0.5" value="1"></div>' +
      '<div id="ingbox">' + ingTable(1) + "</div></section>" +

      '<section class="section"><h2>' + esc(t("s3")) + "</h2>" + macroTable(p) + "</section>" +
      '<section class="section"><h2>' + esc(t("s4")) + '</h2><div id="costbox">' + costTable(1) + "</div></section>" +

      '<section class="section"><h2>' + esc(t("s5")) + "</h2>" +
      "<h3>" + esc(t("preTitle")) + "</h3>" +
      '<dl class="kv"><dt>' + esc(t("equip")) + "</dt><dd>" + cat.equipment.map((x) => esc(L(x))).join(" · ") + "</dd>" +
      "<dt>" + esc(t("tools")) + "</dt><dd>" + cat.tools.map((x) => esc(L(x))).join(" · ") + "</dd></dl>" +
      "<h3>" + esc(t("hygiene")) + "</h3>" + list(TPL.hygiene.steps) +
      "<h3>" + esc(t("preCheck")) + "</h3>" + list(TPL.preChecklist.items) +
      "<h3>" + esc(t("steps")) + '</h3><ol class="steps">' + p.sop.map((x) => "<li>" + esc(L(x)) + "</li>").join("") + "</ol></section>" +

      '<section class="section"><h2>' + esc(t("s6")) + "</h2>" +
      "<h3>" + esc(t("qcBefore")) + "</h3>" + list(cat.qcBefore) +
      "<h3>" + esc(t("qcDuring")) + "</h3>" + list(p.qcDuring) +
      "<h3>" + esc(t("qcFinished")) + '</h3><dl class="kv">' +
      "<dt>" + esc(t("appearance")) + "</dt><dd>" + esc(L(f.appearance)) + "</dd>" +
      "<dt>" + esc(t("color")) + "</dt><dd>" + esc(L(f.color)) + "</dd>" +
      "<dt>" + esc(t("texture")) + "</dt><dd>" + esc(L(f.texture)) + "</dd>" +
      "<dt>" + esc(t("weight")) + "</dt><dd>" + esc(L(f.weight)) + "</dd>" +
      "<dt>" + esc(t("dims")) + "</dt><dd>" + esc(L(f.dims)) + "</dd>" +
      "<dt>" + esc(t("defects")) + "</dt><dd>" + esc(L(f.defects)) + "</dd>" +
      "<dt>" + esc(t("failRule")) + "</dt><dd>" + esc(L(f.fail)) + "</dd></dl></section>" +

      '<section class="section"><h2>' + esc(t("s7")) + '</h2><dl class="kv">' +
      "<dt>" + esc(t("portMethod")) + "</dt><dd>" + esc(L(p.portioning.method)) + "</dd>" +
      "<dt>" + esc(t("pieceW")) + "</dt><dd>~" + p.pieceWeightG + " g</dd>" +
      "<dt>" + esc(t("pcsBatch")) + "</dt><dd>" + p.pieces + "</dd>" +
      "<dt>" + esc(t("portCheck")) + "</dt><dd>" + esc(L(p.portioning.check)) + "</dd></dl></section>" +

      '<section class="section"><h2>' + esc(t("s8")) + "</h2>" +
      "<h3>" + esc(t("packMaterials")) + "</h3><ul class=\"checks\">" +
      (p.packaging || []).map((pk) => "<li>" + esc(L(PACK[pk.key].name)) + " × " + pk.qty + "</li>").join("") + "</ul>" +
      "<h3>" + esc(t("packProc")) + '</h3><ol class="steps">' + cat.packProcedure.map((x) => "<li>" + esc(L(x)) + "</li>").join("") + "</ol>" +
      "<h3>" + esc(t("labeling")) + "</h3><p>" + esc(L(TPL.labelRule)) + "</p></section>" +

      '<section class="section"><h2>' + esc(t("s9")) + '</h2><dl class="kv">' +
      "<dt>" + esc(t("stTemp")) + "</dt><dd>" + esc(L(storage.temp)) + "</dd>" +
      "<dt>" + esc(t("stCond")) + "</dt><dd>" + esc(L(storage.conditions)) + "</dd>" +
      "<dt>" + esc(t("stShelf")) + "</dt><dd>" + esc(L(storage.shelfLife)) + "</dd>" +
      "<dt>" + esc(t("stExpiry")) + "</dt><dd>" + esc(L(storage.expiry)) + "</dd>" +
      "<dt>" + esc(t("stHandle")) + "</dt><dd>" + esc(L(storage.handling)) + "</dd></dl></section>" +

      '<section class="section"><h2>' + esc(t("s12")) + "</h2><p>" + esc(L(p.verification)) + "</p></section>";

    const scl = document.getElementById("scl");
    if (scl) scl.addEventListener("input", () => {
      const s = parseFloat(scl.value) || 1;
      document.getElementById("ingbox").innerHTML = ingTable(s);
      document.getElementById("costbox").innerHTML = costTable(s);
    });
  }

  // ---------------- production card ----------------
  function renderCard(app, id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) { app.innerHTML = "<p>Not found.</p>"; return; }
    const cat = TPL.categories[p.category];
    const v = nutritionViews(p).serving;
    app.innerHTML =
      '<div class="crumb no-print"><a href="#/p/' + p.id + '">← ' + esc(L(p.name)) + '</a> · <button class="btn primary" onclick="window.print()">' + esc(t("printCard")) + "</button></div>" +
      '<div class="prod-card">' +
      "<h1>" + esc(L(p.name)) + "</h1>" +
      '<div class="pc-meta"><span>' + p.id + "</span><span><b>" + fmt(v.kcal, 0) + "</b> kcal · <b>" + fmt(v.p, 0) + "g</b> P</span>" +
      "<span>" + esc(t("cardPortion")) + ": <b>" + esc(L(p.portionDesc)) + "</b></span>" +
      (p.status === "estimated" ? '<span class="badge est">' + esc(t("estimated")) + "</span>" : "") + "</div>" +
      '<div class="pc-grid">' +
      '<div class="pc-block"><h2>' + esc(t("cardIngs")) + "</h2><ul>" +
      p.ingredients.map((it) => "<li>" + esc(L(ING[it.key].name)) + " — <b>" + it.qtyG + " g</b></li>").join("") + "</ul></div>" +
      '<div class="pc-block"><h2>' + esc(t("cardSteps")) + "</h2><ol>" +
      p.sop.map((x) => "<li>" + esc(L(x)) + "</li>").join("") + "</ol></div>" +
      '<div class="pc-block"><h2>' + esc(t("cardBatch")) + " / " + esc(t("cardYield")) + "</h2>" +
      "<ul><li>" + esc(t("cardBatch")) + ": <b>" + p.pieces + " " + esc(t("pcs")) + "</b></li>" +
      "<li>" + esc(t("cardYield")) + ": <b>~" + fmt(p.batchYieldG / 1000, 2) + " kg</b></li>" +
      "<li>" + esc(t("pieceW")) + ": <b>~" + p.pieceWeightG + " g</b></li></ul>" +
      "<h2>" + esc(t("cardEquip")) + "</h2><ul>" + cat.equipment.map((x) => "<li>" + esc(L(x)) + "</li>").join("") + "</ul></div>" +
      '<div class="pc-block"><h2>' + esc(t("cardTemps")) + "</h2><ul><li>" + esc(L(p.cardTemps)) + "</li></ul>" +
      "<h2>" + esc(t("cardTimes")) + "</h2><ul><li>" + esc(L(p.cardTimes)) + "</li></ul>" +
      "<h2>" + esc(t("cardPack")) + "</h2><ul>" +
      (p.packaging || []).map((pk) => "<li>" + esc(L(PACK[pk.key].name)) + " × " + pk.qty + "</li>").join("") + "</ul>" +
      "<h2>" + esc(t("cardQC")) + "</h2><ul>" +
      p.qcDuring.map((x) => "<li>" + esc(L(x)) + "</li>").join("") + "</ul></div>" +
      "</div></div>";
  }

  // ---------------- price editor ----------------
  function renderPrices(app) {
    const ingRows = Object.keys(ING).map((k) =>
      "<tr><td><b>" + esc(L(ING[k].name)) + '</b></td><td class="num">' + fmt(ING[k].priceAEDperKg, 2) + "</td>" +
      '<td class="num"><input class="price-input" data-key="ing:' + k + '" type="number" min="0" step="0.1" value="' + ingPrice(k) + '"></td></tr>'
    ).join("");
    const packRows = Object.keys(PACK).map((k) =>
      "<tr><td><b>" + esc(L(PACK[k].name)) + '</b></td><td class="num">' + fmt(PACK[k].priceAED, 2) + "</td>" +
      '<td class="num"><input class="price-input" data-key="pack:' + k + '" type="number" min="0" step="0.05" value="' + packPrice(k) + '"></td></tr>'
    ).join("");
    app.innerHTML =
      "<h1>" + esc(t("priceEditTitle")) + "</h1><p>" + esc(t("priceEditNote")) + "</p>" +
      '<div class="price-tools">' +
      '<button class="btn primary" id="saveBtn">' + esc(t("saveAll")) + "</button>" +
      '<button class="btn" id="resetBtn">' + esc(t("resetAll")) + "</button>" +
      '<button class="btn" id="csvBtn">' + esc(t("exportPrices")) + "</button>" +
      '<span id="flash"></span></div>' +
      '<section class="section"><h2>' + esc(t("ingredientsHdr")) + '</h2><table class="data"><thead><tr><th>' + esc(t("item")) + '</th><th class="num">' + esc(t("defaultP")) + '</th><th class="num">' + esc(t("current")) + "</th></tr></thead><tbody>" + ingRows + "</tbody></table></section>" +
      '<section class="section"><h2>' + esc(t("packagingHdr")) + '</h2><table class="data"><thead><tr><th>' + esc(t("item")) + '</th><th class="num">' + esc(t("defaultP")) + '</th><th class="num">' + esc(t("current")) + "</th></tr></thead><tbody>" + packRows + "</tbody></table></section>";

    const save = () => {
      document.querySelectorAll(".price-input").forEach((inp) => {
        const k = inp.dataset.key;
        const v = parseFloat(inp.value);
        const def = k.startsWith("ing:") ? ING[k.slice(4)].priceAEDperKg : PACK[k.slice(5)].priceAED;
        if (!isNaN(v) && v !== def) overrides[k] = v; else delete overrides[k];
      });
      localStorage.setItem(LS_KEY, JSON.stringify(overrides));
      document.getElementById("flash").innerHTML = '<span class="saved-flash">' + esc(t("saved")) + "</span>";
      setTimeout(() => { const f = document.getElementById("flash"); if (f) f.innerHTML = ""; }, 2000);
    };
    document.getElementById("saveBtn").addEventListener("click", save);
    document.querySelectorAll(".price-input").forEach((inp) => {
      inp.addEventListener("keydown", (e) => { if (e.key === "Enter") save(); });
      inp.addEventListener("input", () => inp.classList.add("changed"));
    });
    document.getElementById("resetBtn").addEventListener("click", () => {
      overrides = {}; localStorage.setItem(LS_KEY, "{}"); renderPrices(app);
    });
    document.getElementById("csvBtn").addEventListener("click", () => {
      let csv = "type,key,name_en,name_ar,default,current\n";
      Object.keys(ING).forEach((k) => { csv += 'ingredient,"' + k + '","' + ING[k].name.en + '","' + ING[k].name.ar + '",' + ING[k].priceAEDperKg + "," + ingPrice(k) + "\n"; });
      Object.keys(PACK).forEach((k) => { csv += 'packaging,"' + k + '","' + PACK[k].name.en + '","' + PACK[k].name.ar + '",' + PACK[k].priceAED + "," + packPrice(k) + "\n"; });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
      a.download = "24snack_prices.csv"; a.click();
    });
  }

  // ---------------- common SOP page ----------------
  function renderCommon(app) {
    const list = (arr) => "<ul class=\"checks\">" + arr.map((x) => "<li>" + esc(L(x)) + "</li>").join("") + "</ul>";
    app.innerHTML =
      "<h1>" + esc(t("commonTitle")) + "</h1>" +
      '<section class="section"><h2>' + esc(L(TPL.hygiene.title)) + "</h2>" + list(TPL.hygiene.steps) + "</section>" +
      '<section class="section"><h2>' + esc(L(TPL.preChecklist.title)) + "</h2>" + list(TPL.preChecklist.items) + "</section>" +
      '<section class="section"><h2>' + esc(t("labeling")) + "</h2><p>" + esc(L(TPL.labelRule)) + "</p></section>" +
      Object.keys(TPL.categories).map((c) => {
        const cat = TPL.categories[c];
        return '<section class="section"><h2>' + esc(L(cat.label)) + "</h2>" +
          "<h3>" + esc(t("equip")) + "</h3><p>" + cat.equipment.map((x) => esc(L(x))).join(" · ") + "</p>" +
          "<h3>" + esc(t("stTemp")) + "</h3><p>" + esc(L(cat.storage.temp)) + " — " + esc(L(cat.storage.shelfLife)) + "</p></section>";
      }).join("");
  }

  // ---------------- language ----------------
  function applyLang() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.getElementById("langBtn").textContent = lang === "ar" ? "English" : "العربية";
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    route();
  }
  document.getElementById("langBtn").addEventListener("click", () => {
    lang = lang === "en" ? "ar" : "en";
    localStorage.setItem(LS_LANG, lang);
    applyLang();
  });

  window.addEventListener("hashchange", route);
  applyLang();
})();
