// Flat UI strings for EN / FR / AR. Structured lists live in content.ts.
export type Lang = "en" | "fr" | "ar";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ar", label: "ع" },
];

type Dict = Record<string, string>;

export const STRINGS: Record<Lang, Dict> = {
  en: {
    appName: "NESU",
    tagline: "NUR Energy Settlement Unit",
    initiative: "A research & policy initiative of Digital-UNI AI Labs",
    footerDisclaimer:
      "NESU is a conceptual research and policy initiative, not an investment product, security, or currently operating financial instrument. Pledges are symbolic expressions of support only.",

    // tabs
    tab_home: "Home",
    tab_how: "Model",
    tab_corridors: "Corridors",
    tab_comparison: "Compare",
    tab_pledge: "Pledge",
    tab_research: "Docs",

    // home
    home_summary:
      "NESU is a zero-interest, gold- and commodity-backed settlement unit designed for nation-to-nation energy and mineral trade. It is a sovereign-scope concept for settling cross-border trade — not a public cryptocurrency, not tradable, and not open to retail investment.",
    home_for_title: "Who this is for",
    home_for_1: "Sovereign states & central banks",
    home_for_2: "National energy & mineral authorities",
    home_for_3: "Multilateral settlement institutions",
    home_notfor_title: "Who this is NOT for",
    home_notfor_1: "Retail or individual investors",
    home_notfor_2: "Crypto traders or speculators",
    home_notfor_3: "Anyone seeking a tradable asset",

    // how it works
    how_callout_title: "SERVICE ≠ MONEY",
    how_callout_body:
      "NESU settles the service of moving energy and minerals across borders. It is not a currency, not a token to hold, and not a store of speculative value.",
    how_layers_title: "Six-layer architecture",
    how_layers_sub: "A high-level view of how the settlement framework is organised.",

    // corridors
    corridors_title: "Green Corridors",
    corridors_video_title: "Explainer",
    corridors_video_pending: "Explainer video — pending upload",
    corridors_tokens_title: "Corridor Tokens",
    tag_lead: "Lead Corridor",
    tag_roadmap: "Roadmap",

    // comparison
    comp_title: "NESU vs. Bitcoin",
    comp_sub: "How an asset-backed settlement unit differs from a speculative digital asset.",
    comp_dimension: "Dimension",
    comp_nesu: "NESU",
    comp_bitcoin: "Bitcoin",
    comp_precedents_title: "Real-world precedents",
    comp_precedents_sub: "Established initiatives this design builds on.",

    // pledge
    pledge_title: "Pledge of Support",
    pledge_sub: "A symbolic, non-monetary expression of institutional support. No funds are collected.",
    pledge_totals_title: "Total Symbolic Pledges",
    pledge_totals_by_region: "By region",
    pledge_tier: "Pledge tier",
    pledge_name: "Full name",
    pledge_institution: "Institution",
    pledge_country: "Country",
    pledge_email: "Email",
    pledge_message: "Message (optional)",
    pledge_region: "Region",
    pledge_region_hint: "Select exactly one region for the regional breakdown.",
    pledge_privacy:
      "The information you submit is used only to record your symbolic support and to compile aggregate regional totals. No payment is collected and no security or currency is issued.",
    pledge_submit: "Submit symbolic pledge",
    pledge_submitting: "Submitting…",
    pledge_required: "Please complete all required fields with a valid email.",
    pledge_success: "Symbolic pledge recorded. Your certificate is ready.",
    pledge_error: "Could not submit right now. Please try again.",

    // certificate
    cert_title: "Certificate of Pledged Support",
    cert_watermark: "Symbolic Pledge — No Funds Exchanged, No Security or Currency Issued",
    cert_tier: "Tier",
    cert_name: "Name",
    cert_institution: "Institution",
    cert_region: "Region",
    cert_date: "Date",
    cert_issued: "Issued by Digital-UNI AI Labs — NESU Initiative",
    cert_save: "Save / Share certificate",
    cert_preparing: "Preparing certificate…",
    cert_new: "Make another pledge",
    cert_saved: "Certificate saved to your device.",
    cert_shared: "Certificate ready to share.",
    cert_export_unsupported:
      "Saving the certificate image requires the built app (not Expo Go). The certificate is shown above.",

    // research
    research_title: "Research & Governance",
    research_sub: "Primary documents and multilingual counsel briefs.",
    research_open: "Open",
    research_pending: "Document pending",
    doc_proposal: "NESU Conceptual Proposal",
    doc_brief: "Swiss Counsel Engagement Brief",
    doc_standin: "Preview copy",

    // share card
    share_title: "NESU vs. Bitcoin at a glance",
    share_subtitle: "Asset-backed settlement unit vs. speculative digital asset",
    share_heading: "Share the concept",
    share_after_cert: "Spread the concept",
    share_cta: "Share summary card",
    share_preparing: "Preparing card…",
    share_ready: "Summary card ready to share.",
    share_unsupported: "Sharing the card image requires the built app (not Expo Go). The card is shown above.",
    share_footer: "NESU Initiative — Digital-UNI AI Labs · Conceptual research; not an investment product",

    retry: "Retry",
    loading: "Loading…",
  },

  fr: {
    appName: "NESU",
    tagline: "Unité de Règlement Énergétique NUR",
    initiative: "Une initiative de recherche et de politique de Digital-UNI AI Labs",
    footerDisclaimer:
      "NESU est une initiative conceptuelle de recherche et de politique, et non un produit d’investissement, un titre financier ou un instrument financier en activité. Les engagements sont uniquement des expressions symboliques de soutien.",

    tab_home: "Accueil",
    tab_how: "Modèle",
    tab_corridors: "Couloirs",
    tab_comparison: "Comparer",
    tab_pledge: "Soutien",
    tab_research: "Docs",

    home_summary:
      "NESU est une unité de règlement à taux zéro, adossée à l’or et aux matières premières, conçue pour le commerce énergétique et minier entre États. C’est un concept de portée souveraine pour régler le commerce transfrontalier — ni une cryptomonnaie publique, ni un actif négociable, ni ouvert à l’investissement de détail.",
    home_for_title: "À qui cela s’adresse",
    home_for_1: "États souverains et banques centrales",
    home_for_2: "Autorités nationales de l’énergie et des mines",
    home_for_3: "Institutions de règlement multilatérales",
    home_notfor_title: "À qui cela ne s’adresse PAS",
    home_notfor_1: "Investisseurs particuliers",
    home_notfor_2: "Traders ou spéculateurs crypto",
    home_notfor_3: "Toute personne cherchant un actif négociable",

    how_callout_title: "SERVICE ≠ ARGENT",
    how_callout_body:
      "NESU règle le service de transport de l’énergie et des minéraux à travers les frontières. Ce n’est pas une monnaie, ni un jeton à conserver, ni une réserve de valeur spéculative.",
    how_layers_title: "Architecture à six couches",
    how_layers_sub: "Une vue de haut niveau de l’organisation du cadre de règlement.",

    corridors_title: "Couloirs Verts",
    corridors_video_title: "Vidéo explicative",
    corridors_video_pending: "Vidéo explicative — en attente",
    corridors_tokens_title: "Jetons de Couloir",
    tag_lead: "Couloir Pilote",
    tag_roadmap: "Feuille de route",

    comp_title: "NESU vs. Bitcoin",
    comp_sub: "En quoi une unité de règlement adossée à des actifs diffère d’un actif numérique spéculatif.",
    comp_dimension: "Dimension",
    comp_nesu: "NESU",
    comp_bitcoin: "Bitcoin",
    comp_precedents_title: "Précédents concrets",
    comp_precedents_sub: "Initiatives établies sur lesquelles ce modèle s’appuie.",

    pledge_title: "Engagement de Soutien",
    pledge_sub: "Une expression symbolique et non monétaire de soutien institutionnel. Aucun fonds n’est collecté.",
    pledge_totals_title: "Total des Engagements Symboliques",
    pledge_totals_by_region: "Par région",
    pledge_tier: "Palier d’engagement",
    pledge_name: "Nom complet",
    pledge_institution: "Institution",
    pledge_country: "Pays",
    pledge_email: "E-mail",
    pledge_message: "Message (facultatif)",
    pledge_region: "Région",
    pledge_region_hint: "Sélectionnez une seule région pour la répartition régionale.",
    pledge_privacy:
      "Les informations que vous soumettez servent uniquement à enregistrer votre soutien symbolique et à compiler des totaux régionaux agrégés. Aucun paiement n’est collecté et aucun titre ni monnaie n’est émis.",
    pledge_submit: "Envoyer l’engagement symbolique",
    pledge_submitting: "Envoi…",
    pledge_required: "Veuillez remplir tous les champs requis avec un e-mail valide.",
    pledge_success: "Engagement symbolique enregistré. Votre certificat est prêt.",
    pledge_error: "Envoi impossible pour le moment. Veuillez réessayer.",

    cert_title: "Certificat de Soutien Engagé",
    cert_watermark: "Engagement Symbolique — Aucun Fonds Échangé, Aucun Titre ni Monnaie Émis",
    cert_tier: "Palier",
    cert_name: "Nom",
    cert_institution: "Institution",
    cert_region: "Région",
    cert_date: "Date",
    cert_issued: "Émis par Digital-UNI AI Labs — Initiative NESU",
    cert_save: "Enregistrer / Partager le certificat",
    cert_preparing: "Préparation du certificat…",
    cert_new: "Faire un autre engagement",
    cert_saved: "Certificat enregistré sur votre appareil.",
    cert_shared: "Certificat prêt à partager.",
    cert_export_unsupported:
      "L’enregistrement de l’image du certificat nécessite l’application compilée (pas Expo Go). Le certificat est affiché ci-dessus.",

    research_title: "Recherche & Gouvernance",
    research_sub: "Documents primaires et notes de conseil multilingues.",
    research_open: "Ouvrir",
    research_pending: "Document en attente",
    doc_proposal: "Proposition Conceptuelle NESU",
    doc_brief: "Note d’Engagement du Conseil Suisse",
    doc_standin: "Copie de prévisualisation",

    share_title: "NESU vs. Bitcoin en un coup d’œil",
    share_subtitle: "Unité de règlement adossée à des actifs vs actif numérique spéculatif",
    share_heading: "Partager le concept",
    share_after_cert: "Diffuser le concept",
    share_cta: "Partager la carte résumé",
    share_preparing: "Préparation de la carte…",
    share_ready: "Carte résumé prête à partager.",
    share_unsupported:
      "Le partage de l’image nécessite l’application compilée (pas Expo Go). La carte est affichée ci-dessus.",
    share_footer: "Initiative NESU — Digital-UNI AI Labs · Recherche conceptuelle ; pas un produit d’investissement",

    retry: "Réessayer",
    loading: "Chargement…",
  },

  ar: {
    appName: "نيسو",
    tagline: "وحدة تسوية الطاقة نور",
    initiative: "مبادرة بحثية وسياساتية من مختبرات Digital-UNI AI",
    footerDisclaimer:
      "نيسو مبادرة بحثية ومفاهيمية في مجال السياسات، وليست منتجًا استثماريًا أو ورقة مالية أو أداة مالية قيد التشغيل حاليًا. التعهدات هي تعبيرات رمزية عن الدعم فقط.",

    tab_home: "الرئيسية",
    tab_how: "الآلية",
    tab_corridors: "الممرات",
    tab_comparison: "مقارنة",
    tab_pledge: "تعهد",
    tab_research: "وثائق",

    home_summary:
      "نيسو وحدة تسوية بدون فائدة، مدعومة بالذهب والسلع الاستراتيجية، مصمّمة لتجارة الطاقة والمعادن بين الدول. إنها مفهوم ذو نطاق سيادي لتسوية التجارة العابرة للحدود — وليست عملة مشفّرة عامة، ولا أصلاً قابلاً للتداول، ولا متاحة لاستثمار الأفراد.",
    home_for_title: "لمن هذا موجّه",
    home_for_1: "الدول ذات السيادة والبنوك المركزية",
    home_for_2: "الهيئات الوطنية للطاقة والمعادن",
    home_for_3: "مؤسسات التسوية متعددة الأطراف",
    home_notfor_title: "لمن هذا غير موجّه",
    home_notfor_1: "المستثمرون الأفراد",
    home_notfor_2: "متداولو أو مضاربو العملات المشفّرة",
    home_notfor_3: "كل من يبحث عن أصل قابل للتداول",

    how_callout_title: "الخدمة ≠ المال",
    how_callout_body:
      "تُسوّي نيسو خدمة نقل الطاقة والمعادن عبر الحدود. إنها ليست عملة، ولا رمزًا للاحتفاظ به، ولا مخزنًا لقيمة مضاربية.",
    how_layers_title: "بنية من ست طبقات",
    how_layers_sub: "نظرة عامة على كيفية تنظيم إطار التسوية.",

    corridors_title: "الممرات الخضراء",
    corridors_video_title: "فيديو توضيحي",
    corridors_video_pending: "الفيديو التوضيحي — قيد الرفع",
    corridors_tokens_title: "رموز الممرات",
    tag_lead: "الممر الرائد",
    tag_roadmap: "خارطة الطريق",

    comp_title: "نيسو مقابل بيتكوين",
    comp_sub: "كيف تختلف وحدة تسوية مدعومة بالأصول عن أصل رقمي مضاربي.",
    comp_dimension: "المعيار",
    comp_nesu: "نيسو",
    comp_bitcoin: "بيتكوين",
    comp_precedents_title: "سوابق واقعية",
    comp_precedents_sub: "مبادرات قائمة يستند إليها هذا التصميم.",

    pledge_title: "تعهّد بالدعم",
    pledge_sub: "تعبير رمزي غير مالي عن الدعم المؤسسي. لا يتم تحصيل أي أموال.",
    pledge_totals_title: "إجمالي التعهدات الرمزية",
    pledge_totals_by_region: "حسب المنطقة",
    pledge_tier: "فئة التعهّد",
    pledge_name: "الاسم الكامل",
    pledge_institution: "المؤسسة",
    pledge_country: "البلد",
    pledge_email: "البريد الإلكتروني",
    pledge_message: "رسالة (اختياري)",
    pledge_region: "المنطقة",
    pledge_region_hint: "اختر منطقة واحدة فقط للتوزيع الإقليمي.",
    pledge_privacy:
      "تُستخدم المعلومات التي تقدّمها فقط لتسجيل دعمك الرمزي وتجميع إجماليات إقليمية. لا يتم تحصيل أي دفعة ولا إصدار أي ورقة مالية أو عملة.",
    pledge_submit: "إرسال التعهّد الرمزي",
    pledge_submitting: "جارٍ الإرسال…",
    pledge_required: "يرجى إكمال جميع الحقول المطلوبة ببريد إلكتروني صحيح.",
    pledge_success: "تم تسجيل التعهّد الرمزي. شهادتك جاهزة.",
    pledge_error: "تعذّر الإرسال الآن. يرجى المحاولة مرة أخرى.",

    cert_title: "شهادة دعم متعهَّد به",
    cert_watermark: "تعهّد رمزي — لا تبادل للأموال، ولا إصدار لأي ورقة مالية أو عملة",
    cert_tier: "الفئة",
    cert_name: "الاسم",
    cert_institution: "المؤسسة",
    cert_region: "المنطقة",
    cert_date: "التاريخ",
    cert_issued: "صادرة عن Digital-UNI AI Labs — مبادرة نيسو",
    cert_save: "حفظ / مشاركة الشهادة",
    cert_preparing: "جارٍ تجهيز الشهادة…",
    cert_new: "تقديم تعهّد آخر",
    cert_saved: "تم حفظ الشهادة على جهازك.",
    cert_shared: "الشهادة جاهزة للمشاركة.",
    cert_export_unsupported:
      "يتطلب حفظ صورة الشهادة التطبيق المُجمَّع (وليس Expo Go). الشهادة معروضة أعلاه.",

    research_title: "البحث والحوكمة",
    research_sub: "الوثائق الأساسية وملخصات المستشارين متعددة اللغات.",
    research_open: "فتح",
    research_pending: "الوثيقة قيد الإعداد",
    doc_proposal: "المقترح المفاهيمي لنيسو",
    doc_brief: "ملخص ارتباط المستشار السويسري",
    doc_standin: "نسخة معاينة",

    share_title: "نيسو مقابل بيتكوين في لمحة",
    share_subtitle: "وحدة تسوية مدعومة بالأصول مقابل أصل رقمي مضاربي",
    share_heading: "شارك المفهوم",
    share_after_cert: "انشر المفهوم",
    share_cta: "مشاركة بطاقة الملخص",
    share_preparing: "جارٍ تجهيز البطاقة…",
    share_ready: "بطاقة الملخص جاهزة للمشاركة.",
    share_unsupported: "تتطلب مشاركة صورة البطاقة التطبيق المُجمَّع (وليس Expo Go). البطاقة معروضة أعلاه.",
    share_footer: "مبادرة نيسو — Digital-UNI AI Labs · بحث مفاهيمي؛ ليس منتجًا استثماريًا",

    retry: "إعادة المحاولة",
    loading: "جارٍ التحميل…",
  },
};
