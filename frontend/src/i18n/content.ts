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

export const TIERS = [100, 1000, 10000, 100000, 1000000];

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

export const DOCUMENTS: {
  key: string;
  kind: "proposal" | "brief";
  langLabel: string;
  url: string | null;
  standin: boolean;
}[] = [
  { key: "proposal", kind: "proposal", langLabel: "EN", url: EN_PDF, standin: true },
  { key: "brief_en", kind: "brief", langLabel: "English", url: EN_PDF, standin: false },
  { key: "brief_fr", kind: "brief", langLabel: "Français", url: FR_PDF, standin: false },
  { key: "brief_ar", kind: "brief", langLabel: "العربية", url: AR_PDF, standin: false },
  { key: "brief_de", kind: "brief", langLabel: "Deutsch", url: EN_PDF, standin: true },
  { key: "brief_zh", kind: "brief", langLabel: "中文", url: EN_PDF, standin: true },
  { key: "brief_ru", kind: "brief", langLabel: "Русский", url: EN_PDF, standin: true },
];

export const GREEN_CORRIDORS_VIDEO =
  "https://customer-assets-lxgj4vgw.emergentagent.net/job_d641b224-7fce-4fe7-836f-35d1b4bafe40/artifacts/g9lf2fes_nesu-green-corridors.mp4";

export const HERO_MAP_IMAGE =
  "https://images.unsplash.com/photo-1684610529682-553625a1ffed?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDB8MHwxfHNlYXJjaHwxfHxkYXJrJTIwd29ybGQlMjBtYXAlMjBnbG93aW5nJTIwbm9kZXMlMjBuZXR3b3JrfGVufDB8fHx8MTc4OTU4MTQ1MHww&ixlib=rb-4.1.0&q=85";
