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
      "NESU is a conceptual research and policy initiative, not an investment product, security, or currently operating financial instrument. Membership requests are subject to review and a signed agreement; no funds are collected in this app.",

    // tabs
    tab_home: "Home",
    tab_how: "Model",
    tab_corridors: "Corridors",
    tab_comparison: "Compare",
    tab_membership: "Membership",
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

    // membership
    mem_title: "Membership",
    mem_sub:
      "Institutional membership of the NESU initiative. Select a tier and submit your request — our team will follow up to complete the agreement.",
    mem_totals_title: "Membership requests",
    mem_totals_by_region: "By region",
    mem_tier: "Membership tier",
    mem_tier_hint: "Membership fees are settled by wire transfer under a signed agreement. Nothing is charged in this app.",
    mem_card_line: "GOV · POWER · TRADE · CARD",
    mem_global_member: "GLOBAL MEMBER",
    mem_membership: "Membership",
    mem_name: "Full name",
    mem_institution: "Institution",
    mem_country: "Country",
    mem_email: "Email",
    mem_message: "Message (optional)",
    mem_region: "Region",
    mem_region_hint: "Select exactly one region for the regional breakdown.",
    mem_privacy:
      "The information you submit is used only to process your membership request and to compile aggregate regional totals. No payment is collected in this app; fees are settled under a signed agreement.",
    mem_submit: "Request Membership",
    mem_required: "Please complete all required fields with a valid email.",
    mem_success: "Membership request received. Your certificate is ready.",
    mem_error: "Could not submit right now. Please try again.",

    // certificate
    cert_title: "Certificate of Membership Request",
    cert_watermark: "Membership Request — Pending Review",
    cert_tier: "Membership tier",
    cert_name: "Name",
    cert_institution: "Institution",
    cert_region: "Region",
    cert_date: "Date",
    cert_status: "Status",
    cert_status_value: "Pending review — subject to a signed agreement",
    cert_issued: "Issued by Digital-UNI AI Labs — NESU Initiative",
    cert_save: "Save / Share certificate",
    cert_preparing: "Preparing certificate…",
    cert_new: "Submit another request",
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
      "NESU est une initiative conceptuelle de recherche et de politique, et non un produit d’investissement, un titre financier ou un instrument financier en activité. Les demandes d’adhésion sont soumises à examen et à un accord signé ; aucun fonds n’est collecté dans cette application.",

    tab_home: "Accueil",
    tab_how: "Modèle",
    tab_corridors: "Couloirs",
    tab_comparison: "Comparer",
    tab_membership: "Adhésion",
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

    mem_title: "Adhésion",
    mem_sub:
      "Adhésion institutionnelle à l’initiative NESU. Sélectionnez un palier et soumettez votre demande — notre équipe vous recontactera pour finaliser l’accord.",
    mem_totals_title: "Demandes d’adhésion",
    mem_totals_by_region: "Par région",
    mem_tier: "Palier d’adhésion",
    mem_tier_hint:
      "Les frais d’adhésion sont réglés par virement bancaire dans le cadre d’un accord signé. Aucun montant n’est prélevé dans cette application.",
    mem_card_line: "GOV · POWER · TRADE · CARD",
    mem_global_member: "MEMBRE GLOBAL",
    mem_membership: "Adhésion",
    mem_name: "Nom complet",
    mem_institution: "Institution",
    mem_country: "Pays",
    mem_email: "E-mail",
    mem_message: "Message (facultatif)",
    mem_region: "Région",
    mem_region_hint: "Sélectionnez une seule région pour la répartition régionale.",
    mem_privacy:
      "Les informations que vous soumettez servent uniquement à traiter votre demande d’adhésion et à compiler des totaux régionaux agrégés. Aucun paiement n’est collecté dans cette application ; les frais sont réglés dans le cadre d’un accord signé.",
    mem_submit: "Demander l’adhésion",
    mem_required: "Veuillez remplir tous les champs requis avec un e-mail valide.",
    mem_success: "Demande d’adhésion reçue. Votre certificat est prêt.",
    mem_error: "Envoi impossible pour le moment. Veuillez réessayer.",

    cert_title: "Certificat de Demande d’Adhésion",
    cert_watermark: "Demande d’Adhésion — En Cours d’Examen",
    cert_tier: "Palier d’adhésion",
    cert_name: "Nom",
    cert_institution: "Institution",
    cert_region: "Région",
    cert_date: "Date",
    cert_status: "Statut",
    cert_status_value: "En cours d’examen — sous réserve d’un accord signé",
    cert_issued: "Émis par Digital-UNI AI Labs — Initiative NESU",
    cert_save: "Enregistrer / Partager le certificat",
    cert_preparing: "Préparation du certificat…",
    cert_new: "Soumettre une autre demande",
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
      "نيسو مبادرة بحثية ومفاهيمية في مجال السياسات، وليست منتجًا استثماريًا أو ورقة مالية أو أداة مالية قيد التشغيل حاليًا. تخضع طلبات العضوية للمراجعة ولاتفاقية موقّعة؛ ولا يتم تحصيل أي أموال في هذا التطبيق.",

    tab_home: "الرئيسية",
    tab_how: "الآلية",
    tab_corridors: "الممرات",
    tab_comparison: "مقارنة",
    tab_membership: "العضوية",
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

    mem_title: "العضوية",
    mem_sub:
      "عضوية مؤسسية في مبادرة نيسو. اختر الفئة وأرسل طلبك — سيتواصل فريقنا معك لاستكمال الاتفاقية.",
    mem_totals_title: "طلبات العضوية",
    mem_totals_by_region: "حسب المنطقة",
    mem_tier: "فئة العضوية",
    mem_tier_hint: "تُسدَّد رسوم العضوية عبر تحويل بنكي بموجب اتفاقية موقّعة. لا يتم تحصيل أي مبلغ في هذا التطبيق.",
    mem_card_line: "GOV · POWER · TRADE · CARD",
    mem_global_member: "عضو عالمي",
    mem_membership: "عضوية",
    mem_name: "الاسم الكامل",
    mem_institution: "المؤسسة",
    mem_country: "البلد",
    mem_email: "البريد الإلكتروني",
    mem_message: "رسالة (اختياري)",
    mem_region: "المنطقة",
    mem_region_hint: "اختر منطقة واحدة فقط للتوزيع الإقليمي.",
    mem_privacy:
      "تُستخدم المعلومات التي تقدّمها فقط لمعالجة طلب عضويتك وتجميع إجماليات إقليمية. لا يتم تحصيل أي دفعة في هذا التطبيق؛ تُسدَّد الرسوم بموجب اتفاقية موقّعة.",
    mem_submit: "طلب العضوية",
    mem_required: "يرجى إكمال جميع الحقول المطلوبة ببريد إلكتروني صحيح.",
    mem_success: "تم استلام طلب العضوية. شهادتك جاهزة.",
    mem_error: "تعذّر الإرسال الآن. يرجى المحاولة مرة أخرى.",

    cert_title: "شهادة طلب عضوية",
    cert_watermark: "طلب عضوية — قيد المراجعة",
    cert_tier: "فئة العضوية",
    cert_name: "الاسم",
    cert_institution: "المؤسسة",
    cert_region: "المنطقة",
    cert_date: "التاريخ",
    cert_status: "الحالة",
    cert_status_value: "قيد المراجعة — رهناً باتفاقية موقّعة",
    cert_issued: "صادرة عن Digital-UNI AI Labs — مبادرة نيسو",
    cert_save: "حفظ / مشاركة الشهادة",
    cert_preparing: "جارٍ تجهيز الشهادة…",
    cert_new: "تقديم طلب آخر",
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
