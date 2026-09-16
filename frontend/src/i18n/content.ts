// Structured trilingual content: layers, corridors, comparison, precedents,
// tiers, regions, documents. Each localized field is { en, fr, ar }.
import type { Lang } from "./strings";

export type LocalizedText = Record<Lang, string>;

export const ARCHITECTURE_LAYERS: {
  key: string;
  icon: string;
  title: LocalizedText;
  desc: LocalizedText;
}[] = [
  {
    key: "asset_reserve",
    icon: "cube",
    title: {
      en: "Asset Reserve Layer",
      fr: "Couche de Réserve d’Actifs",
      ar: "طبقة احتياطي الأصول",
    },
    desc: {
      en: "Gold and strategic commodities held in reserve to anchor every settlement.",
      fr: "Or et matières premières stratégiques détenus en réserve pour ancrer chaque règlement.",
      ar: "الذهب والسلع الاستراتيجية المحتفظ بها كاحتياطي لتثبيت كل عملية تسوية.",
    },
  },
  {
    key: "settlement_ledger",
    icon: "git-network",
    title: {
      en: "Settlement Ledger Layer",
      fr: "Couche du Registre de Règlement",
      ar: "طبقة سجل التسوية",
    },
    desc: {
      en: "A permissioned record of cross-border energy and mineral settlements.",
      fr: "Un registre à accès contrôlé des règlements énergétiques et miniers transfrontaliers.",
      ar: "سجل مُقيَّد الوصول لتسويات الطاقة والمعادن عبر الحدود.",
    },
  },
  {
    key: "corridor_governance",
    icon: "git-branch",
    title: {
      en: "Corridor Governance Layer",
      fr: "Couche de Gouvernance des Couloirs",
      ar: "طبقة حوكمة الممرات",
    },
    desc: {
      en: "Rules and oversight governing each nation-to-nation trade corridor.",
      fr: "Règles et supervision régissant chaque couloir commercial entre nations.",
      ar: "القواعد والإشراف التي تحكم كل ممر تجاري بين الدول.",
    },
  },
  {
    key: "compliance_legal",
    icon: "shield-checkmark",
    title: {
      en: "Compliance & Legal Layer",
      fr: "Couche de Conformité et Juridique",
      ar: "طبقة الامتثال والشؤون القانونية",
    },
    desc: {
      en: "Regulatory, sanctions and legal alignment for participating institutions.",
      fr: "Alignement réglementaire, en matière de sanctions et juridique pour les institutions participantes.",
      ar: "المواءمة التنظيمية والقانونية والمتعلقة بالعقوبات للمؤسسات المشاركة.",
    },
  },
  {
    key: "environmental_gcrs",
    icon: "leaf",
    title: {
      en: "Environmental Accountability Layer (GCRS)",
      fr: "Couche de Responsabilité Environnementale (GCRS)",
      ar: "طبقة المساءلة البيئية (GCRS)",
    },
    desc: {
      en: "A Geographic Climate Responsibility Score attached to each corridor.",
      fr: "Un Score de Responsabilité Climatique Géographique attaché à chaque couloir.",
      ar: "درجة مسؤولية مناخية جغرافية مرتبطة بكل ممر.",
    },
  },
  {
    key: "institutional_access",
    icon: "business",
    title: {
      en: "Institutional Access Layer",
      fr: "Couche d’Accès Institutionnel",
      ar: "طبقة الوصول المؤسسي",
    },
    desc: {
      en: "Restricted onboarding for sovereign and institutional participants only.",
      fr: "Intégration restreinte aux seuls participants souverains et institutionnels.",
      ar: "انضمام مقيّد للمشاركين السياديين والمؤسسيين فقط.",
    },
  },
];

export type CorridorTag = "lead" | "roadmap";

export const CORRIDORS: {
  key: string;
  name: string;
  tag: CorridorTag;
  desc: LocalizedText;
}[] = [
  {
    key: "europe_algeria",
    name: "Europe–Algeria",
    tag: "lead",
    desc: {
      en: "Flagship energy settlement corridor linking European importers with Algerian supply.",
      fr: "Couloir de règlement énergétique phare reliant les acheteurs européens à l’offre algérienne.",
      ar: "الممر الرائد لتسوية الطاقة الذي يربط المشترين الأوروبيين بالإمدادات الجزائرية.",
    },
  },
  {
    key: "usa_algeria",
    name: "USA–Algeria",
    tag: "roadmap",
    desc: {
      en: "Planned corridor for US–Algeria energy and mineral settlement.",
      fr: "Couloir planifié pour le règlement énergétique et minier États-Unis–Algérie.",
      ar: "ممر مخطط له لتسوية الطاقة والمعادن بين الولايات المتحدة والجزائر.",
    },
  },
  {
    key: "brics_algeria",
    name: "BRICS–Algeria",
    tag: "roadmap",
    desc: {
      en: "Proposed multilateral corridor across BRICS economies and Algeria.",
      fr: "Couloir multilatéral proposé entre les économies des BRICS et l’Algérie.",
      ar: "ممر متعدد الأطراف مقترح بين اقتصادات بريكس والجزائر.",
    },
  },
  {
    key: "middle_east_algeria",
    name: "Middle East–Algeria",
    tag: "roadmap",
    desc: {
      en: "Envisioned Gulf–Algeria energy and mineral settlement corridor.",
      fr: "Couloir envisagé de règlement énergétique et minier Golfe–Algérie.",
      ar: "ممر متصوَّر لتسوية الطاقة والمعادن بين الخليج والجزائر.",
    },
  },
  {
    key: "africa_algeria",
    name: "Africa–Algeria",
    tag: "roadmap",
    desc: {
      en: "Continental corridor for intra-African energy and mineral trade.",
      fr: "Couloir continental pour le commerce énergétique et minier intra-africain.",
      ar: "ممر قاري لتجارة الطاقة والمعادن داخل أفريقيا.",
    },
  },
];

export const COMPARISON_ROWS: {
  dimension: LocalizedText;
  nesu: LocalizedText;
  bitcoin: LocalizedText;
}[] = [
  {
    dimension: { en: "Primary purpose", fr: "Objectif principal", ar: "الغرض الأساسي" },
    nesu: {
      en: "Settlement of cross-border energy & mineral trade",
      fr: "Règlement du commerce énergétique et minier transfrontalier",
      ar: "تسوية تجارة الطاقة والمعادن عبر الحدود",
    },
    bitcoin: {
      en: "Speculative store of value / open payments",
      fr: "Réserve de valeur spéculative / paiements ouverts",
      ar: "مخزن قيمة مضاربي / مدفوعات مفتوحة",
    },
  },
  {
    dimension: { en: "Who can transact", fr: "Qui peut transiger", ar: "من يمكنه التعامل" },
    nesu: {
      en: "Sovereign institutions & central banks only",
      fr: "Institutions souveraines et banques centrales uniquement",
      ar: "المؤسسات السيادية والبنوك المركزية فقط",
    },
    bitcoin: {
      en: "Anyone — permissionless retail",
      fr: "N’importe qui — détail sans autorisation",
      ar: "أي شخص — أفراد دون إذن",
    },
  },
  {
    dimension: { en: "Value backing", fr: "Adossement de valeur", ar: "الدعم القيمي" },
    nesu: {
      en: "60% gold / 20% strategic commodities / 20% settlement liquidity",
      fr: "60% or / 20% matières premières stratégiques / 20% liquidité de règlement",
      ar: "60% ذهب / 20% سلع استراتيجية / 20% سيولة تسوية",
    },
    bitcoin: { en: "None", fr: "Aucun", ar: "لا يوجد" },
  },
  {
    dimension: { en: "Volatility", fr: "Volatilité", ar: "التقلّب" },
    nesu: { en: "Low — asset-anchored", fr: "Faible — adossée aux actifs", ar: "منخفض — مثبَّت بالأصول" },
    bitcoin: { en: "High", fr: "Élevée", ar: "مرتفع" },
  },
  {
    dimension: { en: "Energy footprint", fr: "Empreinte énergétique", ar: "البصمة الطاقية" },
    nesu: {
      en: "Minimal — permissioned ledger",
      fr: "Minimale — registre à accès contrôlé",
      ar: "ضئيلة — سجل مُقيَّد الوصول",
    },
    bitcoin: {
      en: "High — proof-of-work mining",
      fr: "Élevée — minage par preuve de travail",
      ar: "مرتفعة — تعدين إثبات العمل",
    },
  },
  {
    dimension: { en: "Cost of capital", fr: "Coût du capital", ar: "تكلفة رأس المال" },
    nesu: { en: "Zero-interest", fr: "Taux zéro", ar: "بدون فائدة" },
    bitcoin: {
      en: "Market-rate financing",
      fr: "Financement au taux du marché",
      ar: "تمويل بسعر السوق",
    },
  },
  {
    dimension: {
      en: "Environmental penalty",
      fr: "Pénalité environnementale",
      ar: "الغرامة البيئية",
    },
    nesu: {
      en: "GCRS climate responsibility score applied",
      fr: "Score de responsabilité climatique GCRS appliqué",
      ar: "تُطبَّق درجة المسؤولية المناخية GCRS",
    },
    bitcoin: { en: "None", fr: "Aucune", ar: "لا يوجد" },
  },
];

export const PRECEDENTS: { name: string; desc: LocalizedText }[] = [
  {
    name: "Project mBridge",
    desc: {
      en: "Multi-central-bank platform for cross-border CBDC settlement.",
      fr: "Plateforme multi-banques centrales pour le règlement CBDC transfrontalier.",
      ar: "منصة متعددة البنوك المركزية لتسوية العملات الرقمية عبر الحدود.",
    },
  },
  {
    name: "Buna (Arab Regional Payments)",
    desc: {
      en: "Regional multi-currency payment and settlement system.",
      fr: "Système régional de paiement et de règlement multidevises.",
      ar: "نظام إقليمي للدفع والتسوية متعدد العملات.",
    },
  },
  {
    name: "BRICS Pay",
    desc: {
      en: "Cross-border payment initiative among BRICS economies.",
      fr: "Initiative de paiement transfrontalier entre les économies des BRICS.",
      ar: "مبادرة للمدفوعات عبر الحدود بين اقتصادات بريكس.",
    },
  },
  {
    name: "China’s e-CNY",
    desc: {
      en: "Sovereign digital currency piloted for domestic and trade use.",
      fr: "Monnaie numérique souveraine pilotée pour usage domestique et commercial.",
      ar: "عملة رقمية سيادية جرى تجريبها للاستخدام المحلي والتجاري.",
    },
  },
];

// Membership tiers — mirrors the NESU GOV · POWER · TRADE · CARD artwork.
// Fees are settled off-app under a signed agreement; the app records the request.
export type MembershipTier = {
  key: string;
  name: LocalizedText;
  amount: LocalizedText;
  tagline: LocalizedText;
  /** Card metal/gem colour — brand constant, identical in every theme. */
  accent: string;
  /** Deep card body tint behind the accent. */
  body: string;
  /** What the tier unlocks — shown when the card is tapped. */
  benefits: LocalizedText[];
};

const ALL_PREVIOUS = (tier: LocalizedText): LocalizedText => ({
  en: `Everything in ${tier.en}`,
  fr: `Tous les avantages ${tier.fr}`,
  ar: `جميع مزايا الفئة ${tier.ar}`,
});
const T_BRONZE = { en: "Bronze", fr: "Bronze", ar: "البرونزية" };
const T_SILVER = { en: "Silver", fr: "Argent", ar: "الفضية" };
const T_GOLD = { en: "Gold", fr: "Or", ar: "الذهبية" };
const T_DIAMOND = { en: "Diamond", fr: "Diamant", ar: "الماسية" };

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    key: "bronze",
    name: { en: "Bronze", fr: "Bronze", ar: "برونزية" },
    amount: { en: "$50 Million", fr: "50 millions $", ar: "50 مليون دولار" },
    tagline: { en: "Access · Network · Opportunities", fr: "Accès · Réseau · Opportunités", ar: "وصول · شبكة · فرص" },
    accent: "#C67C4E",
    body: "#3A1F12",
    benefits: [
      { en: "Observer seat at NESU governance briefings", fr: "Siège d’observateur aux briefings de gouvernance NESU", ar: "مقعد مراقب في إحاطات حوكمة نيسو" },
      { en: "Full access to the research library and counsel briefs", fr: "Accès complet à la bibliothèque de recherche et aux notes de conseil", ar: "وصول كامل إلى مكتبة البحوث وملخصات المستشارين" },
      { en: "Listing in the member network directory", fr: "Inscription à l’annuaire du réseau des membres", ar: "إدراج في دليل شبكة الأعضاء" },
      { en: "Quarterly Green Corridor update calls", fr: "Points trimestriels sur les Corridors Verts", ar: "اجتماعات فصلية لمتابعة الممرات الخضراء" },
    ],
  },
  {
    key: "silver",
    name: { en: "Silver", fr: "Argent", ar: "فضية" },
    amount: { en: "$250 Million", fr: "250 millions $", ar: "250 مليون دولار" },
    tagline: { en: "Expand · Collaborate · Invest", fr: "Développer · Collaborer · Investir", ar: "توسّع · تعاون · استثمار" },
    accent: "#C9CDD3",
    body: "#2A2E35",
    benefits: [
      ALL_PREVIOUS(T_BRONZE),
      { en: "Working-group participation on one Green Corridor", fr: "Participation à un groupe de travail sur un Corridor Vert", ar: "المشاركة في مجموعة عمل لأحد الممرات الخضراء" },
      { en: "Bilateral introductions within the member network", fr: "Mises en relation bilatérales au sein du réseau des membres", ar: "تعارف ثنائي داخل شبكة الأعضاء" },
      { en: "Co-authoring opportunities on NESU policy notes", fr: "Co-rédaction de notes de politique NESU", ar: "فرص المشاركة في تأليف مذكرات سياسات نيسو" },
    ],
  },
  {
    key: "gold",
    name: { en: "Gold", fr: "Or", ar: "ذهبية" },
    amount: { en: "$500 Million", fr: "500 millions $", ar: "500 مليون دولار" },
    tagline: { en: "Lead · Build · Transform", fr: "Diriger · Bâtir · Transformer", ar: "قيادة · بناء · تحوّل" },
    accent: "#D4AF37",
    body: "#3A2E0F",
    benefits: [
      ALL_PREVIOUS(T_SILVER),
      { en: "Voting seat on a corridor steering committee", fr: "Siège votant au comité de pilotage d’un corridor", ar: "مقعد تصويتي في لجنة توجيه أحد الممرات" },
      { en: "Priority participation in pilot settlement studies", fr: "Participation prioritaire aux études pilotes de règlement", ar: "أولوية المشاركة في دراسات التسوية التجريبية" },
      { en: "Named recognition in NESU publications", fr: "Reconnaissance nominative dans les publications NESU", ar: "تقدير بالاسم في منشورات نيسو" },
    ],
  },
  {
    key: "diamond",
    name: { en: "Diamond", fr: "Diamant", ar: "ماسية" },
    amount: { en: "$1 Billion", fr: "1 milliard $", ar: "مليار دولار" },
    tagline: {
      en: "Global Impact · Strategic Partnerships",
      fr: "Impact mondial · Partenariats stratégiques",
      ar: "أثر عالمي · شراكات استراتيجية",
    },
    accent: "#5FB2F0",
    body: "#0E2A44",
    benefits: [
      ALL_PREVIOUS(T_GOLD),
      { en: "Seat on the NESU Governance Council", fr: "Siège au Conseil de Gouvernance NESU", ar: "مقعد في مجلس حوكمة نيسو" },
      { en: "Strategic partnership agreement with Digital-UNI AI Labs", fr: "Accord de partenariat stratégique avec Digital-UNI AI Labs", ar: "اتفاقية شراكة استراتيجية مع Digital-UNI AI Labs" },
      { en: "Lead role in one Roadmap corridor", fr: "Rôle de chef de file sur un corridor de la feuille de route", ar: "دور قيادي في أحد ممرات خارطة الطريق" },
    ],
  },
  {
    key: "platinum",
    name: { en: "Platinum", fr: "Platine", ar: "بلاتينية" },
    amount: { en: "$10 Billion", fr: "10 milliards $", ar: "10 مليارات دولار" },
    tagline: {
      en: "Shape the Future · A Lasting Legacy",
      fr: "Façonner l’avenir · Un héritage durable",
      ar: "صياغة المستقبل · إرث دائم",
    },
    accent: "#E8E6F0",
    body: "#2B2A3C",
    benefits: [
      ALL_PREVIOUS(T_DIAMOND),
      { en: "Founding-member status with a permanent Council seat", fr: "Statut de membre fondateur avec siège permanent au Conseil", ar: "صفة عضو مؤسس مع مقعد دائم في المجلس" },
      { en: "Co-design of the gold & commodity reserve-basket framework", fr: "Co-conception du cadre du panier de réserves or et matières premières", ar: "المشاركة في تصميم إطار سلة احتياطي الذهب والسلع" },
      { en: "Host institution for a NESU corridor summit", fr: "Institution hôte d’un sommet des corridors NESU", ar: "المؤسسة المضيفة لقمة ممرات نيسو" },
    ],
  },
];

export const REGIONS: { key: string; label: LocalizedText }[] = [
  { key: "europe", label: { en: "Europe", fr: "Europe", ar: "أوروبا" } },
  {
    key: "united_states",
    label: { en: "United States", fr: "États-Unis", ar: "الولايات المتحدة" },
  },
  { key: "algeria", label: { en: "Algeria", fr: "Algérie", ar: "الجزائر" } },
  {
    key: "middle_east_gulf",
    label: { en: "Middle East–Gulf", fr: "Moyen-Orient–Golfe", ar: "الشرق الأوسط–الخليج" },
  },
  {
    key: "brics",
    label: { en: "BRICS Countries", fr: "Pays des BRICS", ar: "دول بريكس" },
  },
  { key: "africa", label: { en: "Africa", fr: "Afrique", ar: "أفريقيا" } },
];

// Attached PDFs. EN/FR/AR are the real files; the others reuse an attached PDF
// as an approved temporary stand-in (marked as a preview copy).
const EN_PDF =
  "https://customer-assets-lxgj4vgw.emergentagent.net/job_d641b224-7fce-4fe7-836f-35d1b4bafe40/artifacts/kjmvyhp4_NESU_Swiss_Counsel_Brief_EN.pdf";
const FR_PDF =
  "https://customer-assets-lxgj4vgw.emergentagent.net/job_d641b224-7fce-4fe7-836f-35d1b4bafe40/artifacts/ov3o89gf_NESU_Swiss_Counsel_Brief_FR.pdf";
const AR_PDF =
  "https://customer-assets-lxgj4vgw.emergentagent.net/job_d641b224-7fce-4fe7-836f-35d1b4bafe40/artifacts/80ga446e_NESU_Swiss_Counsel_Brief_AR.pdf";

const DE_PDF =
  "https://customer-assets-0z36b82j.emergentagent.net/job_nesu-settlement/artifacts/l345h4bs_NESU_Swiss_Counsel_Brief_DE.pdf";
const ZH_PDF =
  "https://customer-assets-0z36b82j.emergentagent.net/job_nesu-settlement/artifacts/pffzjql8_NESU_Swiss_Counsel_Brief_ZH.pdf";
const RU_PDF =
  "https://customer-assets-0z36b82j.emergentagent.net/job_nesu-settlement/artifacts/d02t8o7l_NESU_Swiss_Counsel_Brief_RU.pdf";

const PROPOSAL_PDF =
  "https://customer-assets-0z36b82j.emergentagent.net/job_nesu-settlement/artifacts/tzweuyc1_NESU_Conceptual_Proposal_Combined_v2.pdf";

export const DOCUMENTS: {
  key: string;
  kind: "proposal" | "brief";
  langLabel: string;
  url: string | null;
  standin: boolean;
}[] = [
  { key: "proposal", kind: "proposal", langLabel: "EN", url: PROPOSAL_PDF, standin: false },
  { key: "brief_en", kind: "brief", langLabel: "English", url: EN_PDF, standin: false },
  { key: "brief_fr", kind: "brief", langLabel: "Français", url: FR_PDF, standin: false },
  { key: "brief_ar", kind: "brief", langLabel: "العربية", url: AR_PDF, standin: false },
  { key: "brief_de", kind: "brief", langLabel: "Deutsch", url: DE_PDF, standin: false },
  { key: "brief_zh", kind: "brief", langLabel: "中文", url: ZH_PDF, standin: false },
  { key: "brief_ru", kind: "brief", langLabel: "Русский", url: RU_PDF, standin: false },
];

export const GREEN_CORRIDORS_VIDEO =
  "https://customer-assets-lxgj4vgw.emergentagent.net/job_d641b224-7fce-4fe7-836f-35d1b4bafe40/artifacts/g9lf2fes_nesu-green-corridors.mp4";
