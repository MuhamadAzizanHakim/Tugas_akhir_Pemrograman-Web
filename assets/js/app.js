// =========================================================================
// 1. INITIAL DATA & APPLICATION STATE
// =========================================================================

const COPYWRITING_TEMPLATES = {
  estetik: `Nikmati dinginnya kabut pagi Alahan Panjang dengan nyaman! Tenda ini dirancang khusus dengan sirkulasi udara optimal dan lapisan anti-embun yang menjaga bagian dalam tetap hangat serta kering sepanjang malam.\n\nCocok untuk camping ceria bersama pasangan maupun sahabat. Unit selalu dicuci bersih dan disterilkan sebelum serah terima.`,
  teknis: `Spesifikasi Tangguh untuk Cuaca Pegunungan:\n• Sistem Double Layer anti-kondensasi & tahan hujan deras\n• Frame fiber/alloy kokoh menahan hembusan angin bukit\n• Pemasangan praktis kurang dari 10 menit\n• Sudah termasuk pasak lengkap, tali guyline, dan tas pembawa ringkas.`,
  keluarga: `Liburan keluarga di alam terbuka makin seru tanpa ribet! Ruang kabin ekstra luas memungkinkan seluruh anggota keluarga beristirahat lega lengkap dengan ruang teras depan untuk menyimpan sepatu dan perlengkapan masak.`,
};

const SUGGESTED_TAGS = [
  "Double Layer",
  "Waterproof 3000mm",
  "Free Matras & Pasak",
  "Frame Alloy Kokoh",
  "Teras Luas",
  "Anti Badai & Embun",
];

// Initial 3 realistic tents for "Pemesanan Tenda Alahan"
let state = {
  currentTab: "upload",
  catalogFilter: "Semua",
  catalogSearch: "",
  orderFilter: "Semua",
  reportPeriod: "November 2026",
  tents: [
    {
      id: "TND-001",
      name: "Tenda Dome Borneo 4P Double Layer",
      category: "4 Orang",
      price: 65000,
      stock: 6,
      rented: 2,
      status: "Tersedia",
      tags: ["Double Layer", "Waterproof 3000mm", "Free Matras & Pasak"],
      description:
        "Tenda favorit untuk camping di bukit dan danau Alahan Panjang. Lapisan ganda menahan dingin malam dan hujan deras dengan ruang teras depan untuk menyimpan carrier.",
      svgPreset: "dome4",
      customImageUrl: null,
    },
    {
      id: "TND-002",
      name: "Tenda Guardian 2P Ultralight Pro",
      category: "2 Orang",
      price: 45000,
      stock: 8,
      rented: 3,
      status: "Tersedia",
      tags: ["Frame Alloy Kokoh", "Waterproof 3000mm", "Ringan & Praktis"],
      description:
        "Pilihan ringkas dan ringan untuk solo camper atau berdua. Mudah didirikan dalam 5 menit dengan ventilasi anti-kondensasi yang menjaga udara tetap segar.",
      svgPreset: "ultralight2",
      customImageUrl: null,
    },
    {
      id: "TND-003",
      name: "Tenda Keluarga Arpenaz 6.3 XL",
      category: "6-8 Orang Keluarga",
      price: 135000,
      stock: 4,
      rented: 1,
      status: "Tersedia",
      tags: ["Teras Luas", "Double Layer", "Free Matras & Pasak"],
      description:
        "Tenda keluarga berkapasitas besar dengan tinggi kabin 195 cm sehingga orang dewasa bisa berdiri tegak di dalam. Dilengkapi ruang tamu tengah dan 2 kamar terpisah.",
      svgPreset: "family6",
      customImageUrl: null,
    },
  ],
  orders: [
    {
      id: "INV-2611-01",
      customer: "Rizky Pratama",
      phone: "0812-6744-9910",
      tentName: "Tenda Dome Borneo 4P Double Layer",
      qty: 2,
      nights: 2,
      rentalDate: "15 Nov 2026",
      total: 260000,
      dpAmount: 130000,
      dpStatus: "Menunggu Verifikasi DP",
      bank: "Transfer BSI • a.n. Rizky Pratama",
    },
    {
      id: "INV-2611-02",
      customer: "Nadia Putri Rahma",
      phone: "0852-7411-3028",
      tentName: "Tenda Keluarga Arpenaz 6.3 XL",
      qty: 1,
      nights: 2,
      rentalDate: "16 Nov 2026",
      total: 270000,
      dpAmount: 135000,
      dpStatus: "Menunggu Verifikasi DP",
      bank: "QRIS Dana • Nadia P.",
    },
    {
      id: "INV-2611-03",
      customer: "Fajar Kurniawan",
      phone: "0813-6390-1182",
      tentName: "Tenda Guardian 2P Ultralight Pro",
      qty: 3,
      nights: 1,
      rentalDate: "14 Nov 2026",
      total: 135000,
      dpAmount: 67500,
      dpStatus: "DP Terverifikasi",
      bank: "Transfer BRI • a.n. Fajar K.",
    },
    {
      id: "INV-2611-04",
      customer: "Siti Aisyah",
      phone: "0821-7088-5421",
      tentName: "Tenda Dome Borneo 4P Double Layer",
      qty: 1,
      nights: 3,
      rentalDate: "12 Nov 2026",
      total: 195000,
      dpAmount: 195000,
      dpStatus: "Lunas",
      bank: "Transfer Nagari • Lunas di Tempat",
    },
  ],
  activities: [
    {
      icon: "check-circle-2",
      color: "emerald",
      title: "DP Terverifikasi — Fajar Kurniawan",
      desc: "3x Tenda Guardian 2P Ultralight Pro (Rp 67.500)",
      time: "28 menit lalu",
    },
    {
      icon: "clock",
      color: "amber",
      title: "Bukti Transfer DP Masuk — Rizky Pratama",
      desc: "2x Tenda Dome Borneo 4P • Menunggu konfirmasi admin",
      time: "1 jam lalu",
    },
    {
      icon: "tent",
      color: "slate",
      title: "Unit Kembali & Selesai Dicuci",
      desc: "Tenda Keluarga Arpenaz 6.3 XL kembali ke stok siap sewa",
      time: "3 jam lalu",
    },
  ],
  // Live draft state for "Upload & Tambah Tenda"
  draft: {
    name: "",
    category: "4 Orang",
    price: 65000,
    stock: 5,
    tags: ["Double Layer", "Waterproof 3000mm", "Free Matras & Pasak"],
    description: "",
    svgPreset: "dome4",
    customImageUrl: null,
    customFileName: "",
  },
};

// =========================================================================
// 2. UTILITY HELPERS & CUSTOM SVG TENT ARTWORK
// =========================================================================

function formatRupiah(amount) {
  const num = Number(amount) || 0;
  return "Rp " + new Intl.NumberFormat("id-ID").format(num);
}

function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Generates crisp inline SVG tent artwork (highland Alahan Panjang camping aesthetic)
 * or renders the user's uploaded image from FileReader.
 */
function getTentVisualHTML(item, heightClass = "h-52") {
  if (item.customImageUrl) {
    return `
          <div class="relative ${heightClass} w-full overflow-hidden bg-slate-100">
            <img src="${item.customImageUrl}" alt="${escapeHTML(item.name || "Foto Tenda")}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
        `;
  }

  const preset = item.svgPreset || "dome4";

  if (preset === "ultralight2") {
    return `
          <div class="relative ${heightClass} w-full overflow-hidden bg-gradient-to-b from-slate-800 via-emerald-950 to-emerald-900 flex items-end justify-center">
            <svg viewBox="0 0 400 220" class="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <defs>
                <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#0F172A"/>
                  <stop offset="65%" stop-color="#064E3B"/>
                  <stop offset="100%" stop-color="#047857"/>
                </linearGradient>
                <radialGradient id="glow2" cx="50%" cy="68%" r="35%">
                  <stop offset="0%" stop-color="#FDE68A" stop-opacity="0.55"/>
                  <stop offset="100%" stop-color="#FDE68A" stop-opacity="0"/>
                </radialGradient>
              </defs>
              <rect width="400" height="220" fill="url(#sky2)"/>
              <!-- Stars & Moon -->
              <circle cx="325" cy="42" r="14" fill="#FEF3C7" opacity="0.9"/>
              <circle cx="70" cy="36" r="1.5" fill="#FFF" opacity="0.7"/>
              <circle cx="145" cy="28" r="1.2" fill="#FFF" opacity="0.6"/>
              <circle cx="240" cy="48" r="1.8" fill="#FFF" opacity="0.8"/>
              <!-- Misty Hills -->
              <path d="M0 140 Q95 95 200 135 T400 120 L400 220 L0 220 Z" fill="#065F46" opacity="0.65"/>
              <path d="M0 165 Q140 135 275 160 T400 150 L400 220 L0 220 Z" fill="#022C22"/>
              <circle cx="200" cy="150" r="95" fill="url(#glow2)"/>
              <!-- Pine Trees -->
              <polygon points="55,165 68,125 81,165" fill="#052E16"/>
              <polygon points="322,168 338,118 354,168" fill="#052E16"/>
              <!-- Ultralight A-Frame / Ridge Tent -->
              <line x1="108" y1="175" x2="142" y2="122" stroke="#94A3B8" stroke-width="1.2" stroke-dasharray="3 2"/>
              <line x1="292" y1="175" x2="258" y2="122" stroke="#94A3B8" stroke-width="1.2" stroke-dasharray="3 2"/>
              <polygon points="122,174 200,104 278,174" fill="#10B981"/>
              <polygon points="200,104 278,174 235,174" fill="#047857"/>
              <!-- Glowing Tent Entrance -->
              <polygon points="175,174 200,122 225,174" fill="#FBBF24"/>
              <line x1="200" y1="122" x2="200" y2="174" stroke="#78350F" stroke-width="1.5"/>
            </svg>
          </div>
        `;
  }

  if (preset === "family6") {
    return `
          <div class="relative ${heightClass} w-full overflow-hidden bg-gradient-to-b from-sky-100 via-emerald-50 to-emerald-100 flex items-end justify-center">
            <svg viewBox="0 0 400 220" class="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <defs>
                <linearGradient id="skyFam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#E0F2FE"/>
                  <stop offset="55%" stop-color="#ECFDF5"/>
                  <stop offset="100%" stop-color="#D1FAE5"/>
                </linearGradient>
              </defs>
              <rect width="400" height="220" fill="url(#skyFam)"/>
              <!-- Sun & Soft Clouds -->
              <circle cx="82" cy="48" r="20" fill="#FDE68A"/>
              <ellipse cx="290" cy="46" rx="34" ry="11" fill="#FFFFFF" opacity="0.85"/>
              <ellipse cx="315" cy="50" rx="26" ry="9" fill="#FFFFFF" opacity="0.85"/>
              <!-- Tea Plantation Hills (Alahan Panjang Vibe) -->
              <path d="M0 132 Q110 88 225 128 T400 108 L400 220 L0 220 Z" fill="#6EE7B7" opacity="0.55"/>
              <path d="M0 156 Q160 128 290 152 T400 142 L400 220 L0 220 Z" fill="#10B981" opacity="0.35"/>
              <rect x="0" y="168" width="400" height="52" fill="#059669" opacity="0.22"/>
              <!-- Large Family Tunnel Tent -->
              <path d="M78 174 Q92 94 148 94 L252 94 Q308 94 322 174 Z" fill="#047857"/>
              <path d="M126 174 Q140 94 185 94 L252 94 Q298 94 312 174 Z" fill="#059669"/>
              <!-- Canopy Awning -->
              <polygon points="78,174 118,112 162,112 142,174" fill="#F8FAFC"/>
              <line x1="118" y1="112" x2="112" y2="176" stroke="#334155" stroke-width="2.5"/>
              <!-- Cabin Door & Window -->
              <rect x="178" y="122" width="44" height="52" rx="6" fill="#FEF3C7"/>
              <rect x="242" y="124" width="32" height="22" rx="4" fill="#BAE6FD" stroke="#065F46" stroke-width="2"/>
            </svg>
          </div>
        `;
  }

  // Default: 'dome4'
  return `
        <div class="relative ${heightClass} w-full overflow-hidden bg-gradient-to-b from-emerald-50 via-teal-50 to-slate-100 flex items-end justify-center">
          <svg viewBox="0 0 400 220" class="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
              <linearGradient id="skyDome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#ECFDF5"/>
                <stop offset="60%" stop-color="#D1FAE5"/>
                <stop offset="100%" stop-color="#A7F3D0"/>
              </linearGradient>
            </defs>
            <rect width="400" height="220" fill="url(#skyDome)"/>
            <!-- Mountain Silhouette -->
            <polygon points="0,165 95,82 185,155 275,72 400,165 400,220 0,220" fill="#6EE7B7" opacity="0.55"/>
            <path d="M0 162 Q130 138 260 158 T400 148 L400 220 L0 220 Z" fill="#059669" opacity="0.28"/>
            <!-- Trees -->
            <polygon points="44,172 58,128 72,172" fill="#065F46"/>
            <polygon points="334,172 348,124 362,172" fill="#065F46"/>
            <!-- Guy lines -->
            <line x1="94" y1="176" x2="128" y2="132" stroke="#065F46" stroke-width="1.3" stroke-dasharray="3 2"/>
            <line x1="306" y1="176" x2="272" y2="132" stroke="#065F46" stroke-width="1.3" stroke-dasharray="3 2"/>
            <!-- 4P Double Layer Dome Tent -->
            <path d="M110 176 C118 96, 282 96, 290 176 Z" fill="#059669"/>
            <path d="M150 176 C158 102, 275 102, 290 176 Z" fill="#047857"/>
            <!-- Rainfly Accent Stripe -->
            <path d="M126 142 Q200 116 274 142" fill="none" stroke="#FBBF24" stroke-width="3.5" stroke-linecap="round"/>
            <!-- Open Vestibule Door -->
            <path d="M174 176 C180 128, 220 128, 226 176 Z" fill="#FEF3C7"/>
            <line x1="200" y1="128" x2="200" y2="176" stroke="#92400E" stroke-width="1.5"/>
          </svg>
        </div>
      `;
}

// =========================================================================
// 3. TOAST & CUSTOM MODAL SYSTEM
// =========================================================================

function showToast(title, message = "", type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");

  const styles = {
    success: {
      bg: "bg-slate-900 border-emerald-500/40 text-white",
      iconBg: "bg-emerald-500/20 text-emerald-400",
      icon: "check-circle-2",
    },
    info: {
      bg: "bg-slate-900 border-slate-700 text-white",
      iconBg: "bg-sky-500/20 text-sky-400",
      icon: "info",
    },
    warning: {
      bg: "bg-slate-900 border-amber-500/40 text-white",
      iconBg: "bg-amber-500/20 text-amber-400",
      icon: "alert-triangle",
    },
  }[type] || {
    bg: "bg-slate-900 border-emerald-500/40 text-white",
    iconBg: "bg-emerald-500/20 text-emerald-400",
    icon: "check-circle-2",
  };

  toast.className = `toast-enter pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl ${styles.bg}`;
  toast.innerHTML = `
        <div class="w-8 h-8 rounded-xl ${styles.iconBg} flex items-center justify-center shrink-0 mt-0.5">
          <i data-lucide="${styles.icon}" class="w-4 h-4"></i>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold leading-snug">${escapeHTML(title)}</p>
          ${message ? `<p class="text-xs text-slate-300 mt-0.5 leading-relaxed">${escapeHTML(message)}</p>` : ""}
        </div>
        <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white p-1">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      `;

  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 250);
    }
  }, 4200);
}

function openModal(innerHTML) {
  const modal = document.getElementById("custom-modal");
  const card = document.getElementById("custom-modal-card");
  card.innerHTML = innerHTML;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  lucide.createIcons();
}

function closeModal() {
  const modal = document.getElementById("custom-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// =========================================================================
// 4. NAVIGATION & SIDEBAR STATE
// =========================================================================

function toggleSidebar(open) {
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  if (open) {
    sidebar.classList.remove("-translate-x-full");
    backdrop.classList.remove("hidden");
  } else {
    sidebar.classList.add("-translate-x-full");
    backdrop.classList.add("hidden");
  }
}

function updateSidebarBadges() {
  const catCount = document.getElementById("sidebar-catalog-count");
  const pendingDpCount = document.getElementById("sidebar-pending-dp");
  if (catCount) catCount.textContent = state.tents.length;
  if (pendingDpCount) {
    const pending = state.orders.filter(
      (o) => o.dpStatus === "Menunggu Verifikasi DP",
    ).length;
    pendingDpCount.textContent = pending;
    pendingDpCount.style.display = pending > 0 ? "inline-block" : "none";
  }
}

function navigate(tab) {
  state.currentTab = tab;
  toggleSidebar(false);

  // Update active button style
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    const isTarget = btn.getAttribute("data-nav") === tab;
    if (isTarget) {
      btn.className =
        "nav-btn w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold bg-emerald-600 text-white shadow-md shadow-emerald-950/40 transition-all";
    } else {
      btn.className =
        "nav-btn w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all";
    }
  });

  // Header titles & quick action button
  const meta = {
    upload: {
      title: "Upload & Tambah Tenda",
      subtitle:
        "Unggah foto unit tenda, atur harga sewa, dan susun deskripsi promosi untuk pelanggan.",
      showQuickAdd: false,
    },
    katalog: {
      title: "Katalog Unit Tenda",
      subtitle:
        "Kelola seluruh inventaris tenda yang tampil di etalase pemesanan pelanggan.",
      showQuickAdd: true,
    },
    dashboard: {
      title: "Dashboard Ringkasan",
      subtitle:
        "Pantau ketersediaan unit tenda, transaksi aktif, dan estimasi pendapatan bulanan.",
      showQuickAdd: true,
    },
    pesanan: {
      title: "Pesanan & Verifikasi DP",
      subtitle:
        "Periksa bukti transfer uang muka (DP) penyewa dan konfirmasi jadwal pengambilan tenda.",
      showQuickAdd: false,
    },
    laporan: {
      title: "Laporan Keuangan",
      subtitle:
        "Rekapitulasi pemasukan sewa tenda dan pelunasan transaksi berdasarkan periode.",
      showQuickAdd: false,
    },
  }[tab];

  document.getElementById("header-title").textContent = meta.title;
  document.getElementById("header-subtitle").textContent = meta.subtitle;

  const quickAddBtn = document.getElementById("header-quick-add-btn");
  if (meta.showQuickAdd) {
    quickAddBtn.classList.remove("hidden");
    quickAddBtn.classList.add("inline-flex");
  } else {
    quickAddBtn.classList.add("hidden");
    quickAddBtn.classList.remove("inline-flex");
  }

  updateSidebarBadges();
  renderCurrentView();
}

function renderCurrentView() {
  const container = document.getElementById("main-content");
  if (state.currentTab === "upload") {
    renderUploadView(container);
  } else if (state.currentTab === "katalog") {
    renderCatalogView(container);
  } else if (state.currentTab === "dashboard") {
    renderDashboardView(container);
  } else if (state.currentTab === "pesanan") {
    renderOrdersView(container);
  } else if (state.currentTab === "laporan") {
    renderReportsView(container);
  }
  lucide.createIcons();
}

// =========================================================================
// 5. PAGE 1: UPLOAD & TAMBAH TENDA (SPLIT-SCREEN + LIVE PREVIEW)
// =========================================================================

function renderUploadView(container) {
  const d = state.draft;

  container.innerHTML = `
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-start">
          <!-- LEFT COLUMN: ADMIN INPUT FORM (7 COLS) -->
          <div class="xl:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden">
            <div class="px-6 py-5 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <i data-lucide="pen-tool" class="w-4 h-4"></i>
                </div>
                <div>
                  <h2 class="text-base font-bold text-slate-900">Formulir Data &amp; Promosi Tenda</h2>
                  <p class="text-xs text-slate-500">Setiap perubahan langsung tampil pada pratinjau di samping.</p>
                </div>
              </div>
              <button type="button" onclick="resetDraftForm()" class="text-xs font-medium text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer">
                <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
                Reset Form
              </button>
            </div>

            <form id="tent-upload-form" onsubmit="handlePublishTent(event)" class="p-6 space-y-6">
              <!-- 1. Photo Upload Zone -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-sm font-semibold text-slate-800">
                    Foto Utama Tenda <span class="text-rose-500">*</span>
                  </label>
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs text-slate-400">Uji cepat:</span>
                    <button type="button" onclick="cycleSamplePhoto()" class="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer">
                      <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                      Gunakan Foto Contoh
                    </button>
                  </div>
                </div>

                <!-- Dropzone -->
                <div id="photo-dropzone"
                     ondragover="handleDragOver(event)"
                     ondragleave="handleDragLeave(event)"
                     ondrop="handleDrop(event)"
                     class="relative rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/70 transition-all p-5 text-center">
                  <input type="file" id="tent-file-input" accept="image/*" onchange="handleFileSelect(event)" class="hidden" />

                  <div id="dropzone-content">
                    ${renderDropzoneInner()}
                  </div>
                </div>
              </div>

              <!-- 2. Tent Name -->
              <div>
                <label for="input-tent-name" class="block text-sm font-semibold text-slate-800 mb-1.5">
                  Nama Unit Tenda <span class="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="input-tent-name"
                  value="${escapeHTML(d.name)}"
                  oninput="updateDraftField('name', this.value)"
                  placeholder="Contoh: Tenda Dome Borneo 4P Double Layer"
                  class="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all"
                />
              </div>

              <!-- 3. Category & Capacity -->
              <div>
                <label class="block text-sm font-semibold text-slate-800 mb-2">
                  Kategori &amp; Kapasitas Orang
                </label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5" id="category-pills">
                  ${[
                    "2 Orang",
                    "4 Orang",
                    "6-8 Orang Keluarga",
                    "Tenda Pleton/Event",
                  ]
                    .map((cat) => {
                      const active = d.category === cat;
                      return `
                      <button type="button" onclick="selectCategory('${cat}')"
                        class="px-3 py-2.5 rounded-xl text-xs font-semibold border text-left transition-all flex items-center justify-between gap-1.5 cursor-pointer ${
                          active
                            ? "bg-emerald-50 border-emerald-600 text-emerald-800 shadow-xs"
                            : "bg-white border-[#E2E8F0] text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        }">
                        <span class="truncate">${cat}</span>
                        ${active ? '<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600 shrink-0"></i>' : ""}
                      </button>
                    `;
                    })
                    .join("")}
                </div>
              </div>

              <!-- 4. Price & Stock Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="input-tent-price" class="block text-sm font-semibold text-slate-800 mb-1.5">
                    Harga Sewa per Malam <span class="text-rose-500">*</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">Rp</span>
                    <input
                      type="number"
                      id="input-tent-price"
                      min="5000"
                      step="5000"
                      value="${d.price}"
                      oninput="updateDraftField('price', Number(this.value))"
                      placeholder="65000"
                      class="w-full pl-11 pr-20 py-3 rounded-xl border border-[#E2E8F0] bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all"
                    />
                    <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">/ malam</span>
                  </div>
                </div>

                <div>
                  <label for="input-tent-stock" class="block text-sm font-semibold text-slate-800 mb-1.5">
                    Jumlah Stok Unit <span class="text-rose-500">*</span>
                  </label>
                  <div class="relative flex items-center">
                    <button type="button" onclick="adjustDraftStock(-1)" class="absolute left-2 w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer">
                      <i data-lucide="minus" class="w-4 h-4"></i>
                    </button>
                    <input
                      type="number"
                      id="input-tent-stock"
                      min="1"
                      max="100"
                      value="${d.stock}"
                      oninput="updateDraftField('stock', Math.max(1, Number(this.value)))"
                      class="w-full px-12 py-3 rounded-xl border border-[#E2E8F0] bg-white text-center text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all"
                    />
                    <button type="button" onclick="adjustDraftStock(1)" class="absolute right-2 w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer">
                      <i data-lucide="plus" class="w-4 h-4"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 5. Facility / Equipment Tags -->
              <div>
                <label class="block text-sm font-semibold text-slate-800 mb-1.5">
                  Tag Fasilitas &amp; Kelengkapan
                </label>
                <div class="flex gap-2">
                  <input
                    type="text"
                    id="input-new-tag"
                    onkeydown="if(event.key === 'Enter'){ event.preventDefault(); addCustomTag(); }"
                    placeholder="Ketik fasilitas lalu tekan Tambah (misal: Gratis Lampu Tenda)"
                    class="flex-1 px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
                  />
                  <button type="button" onclick="addCustomTag()" class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shrink-0 transition-colors cursor-pointer">
                    + Tambah
                  </button>
                </div>

                <!-- Active Tags -->
                <div id="active-tags-list" class="flex flex-wrap gap-2 mt-3">
                  ${renderActiveTagsHTML()}
                </div>

                <!-- Quick Suggestion Chips -->
                <div class="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <span class="text-[11px] font-medium text-slate-400 mr-1">Saran cepat:</span>
                  ${SUGGESTED_TAGS.map(
                    (tag) => `
                    <button type="button" onclick="toggleSuggestedTag('${tag}')" class="text-[11px] px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 text-slate-600 transition-colors cursor-pointer">
                      + ${tag}
                    </button>
                  `,
                  ).join("")}
                </div>
              </div>

              <!-- 6. Promotional Copywriting & Description -->
              <div>
                <div class="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <label for="input-tent-desc" class="block text-sm font-semibold text-slate-800">
                    Kata-Kata &amp; Deskripsi Tenda <span class="text-rose-500">*</span>
                  </label>
                  <span id="desc-char-counter" class="text-xs font-medium text-slate-400">${d.description.length} / 500 karakter</span>
                </div>

                <!-- Copywriting Helper Templates -->
                <div class="mb-2.5 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex flex-wrap items-center gap-2">
                  <span class="text-xs font-semibold text-emerald-800 inline-flex items-center gap-1">
                    <i data-lucide="wand-2" class="w-3.5 h-3.5"></i>
                    Bantu Kata-Kata:
                  </span>
                  <button type="button" onclick="applyCopyTemplate('estetik')" class="text-xs font-medium px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer">
                    Santai &amp; Estetik
                  </button>
                  <button type="button" onclick="applyCopyTemplate('teknis')" class="text-xs font-medium px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer">
                    Spesifikasi Tangguh
                  </button>
                  <button type="button" onclick="applyCopyTemplate('keluarga')" class="text-xs font-medium px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer">
                    Paket Keluarga
                  </button>
                </div>

                <textarea
                  id="input-tent-desc"
                  rows="5"
                  maxlength="500"
                  oninput="updateDraftDescription(this.value)"
                  placeholder="Tuliskan keunggulan tenda, kenyamanan saat dipakai bermalam di Alahan Panjang, serta kelengkapan yang didapat penyewa..."
                  class="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white text-sm text-slate-900 placeholder:text-slate-400 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all"
                >${escapeHTML(d.description)}</textarea>
              </div>

              <!-- Submit Bar -->
              <div class="pt-2 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3">
                <p class="text-xs text-slate-500 flex items-center gap-1.5">
                  <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600 shrink-0"></i>
                  Langsung tampil di menu Katalog Unit Tenda setelah dipublikasikan.
                </p>
                <button type="submit" class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-sm font-bold shadow-lg shadow-emerald-600/20 inline-flex items-center justify-center gap-2 transition-all cursor-pointer">
                  <i data-lucide="send" class="w-4 h-4"></i>
                  Publikasikan ke Katalog
                </button>
              </div>
            </form>
          </div>

          <!-- RIGHT COLUMN: LIVE CUSTOMER PREVIEW (5 COLS, STICKY) -->
          <div class="xl:col-span-5 xl:sticky xl:top-24 space-y-4">
            <div class="flex items-center justify-between px-1">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider">Live Preview Pelanggan</h3>
              </div>
              <span class="text-xs font-medium text-slate-500 bg-white px-2.5 py-1 rounded-full border border-[#E2E8F0]">
                Real-time Update
              </span>
            </div>

            <!-- Simulated Customer Storefront Frame -->
            <div class="bg-slate-100/90 p-3 sm:p-4 rounded-3xl border border-[#E2E8F0] shadow-inner">
              <!-- Browser Top Bar Mock -->
              <div class="flex items-center justify-between px-3 py-2 mb-3 rounded-xl bg-white border border-[#E2E8F0]">
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                </div>
                <div class="text-[11px] font-medium text-slate-400 bg-slate-50 px-3 py-0.5 rounded-md border border-slate-200/70 truncate max-w-[200px]">
                  tendaalahan.id/katalog
                </div>
                <i data-lucide="eye" class="w-3.5 h-3.5 text-emerald-600"></i>
              </div>

              <!-- Live Preview Card Container -->
              <div id="live-preview-card-wrapper">
                ${renderLivePreviewCardHTML()}
              </div>
            </div>

            <!-- Tip Card -->
            <div class="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex items-start gap-3">
              <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <i data-lucide="lightbulb" class="w-4 h-4"></i>
              </div>
              <div class="text-xs text-slate-600 leading-relaxed">
                <span class="font-semibold text-slate-800 block mb-0.5">Tips Konversi Penyewa:</span>
                Sebutkan kelengkapan gratis (seperti matras, pasak cadangan, atau lampu tenda) pada tag fasilitas agar calon penyewa langsung yakin tanpa banyak bertanya.
              </div>
            </div>
          </div>
        </div>
      `;
}

function renderDropzoneInner() {
  const d = state.draft;
  if (d.customImageUrl) {
    return `
          <div class="space-y-3">
            <div class="relative h-44 w-full rounded-xl overflow-hidden border border-slate-200 bg-white">
              <img src="${d.customImageUrl}" alt="Pratinjau Foto Unggahan" class="w-full h-full object-cover" />
              <div class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-900/75 text-white text-[11px] font-medium backdrop-blur-xs">
                ${escapeHTML(d.customFileName || "Foto Terunggah")}
              </div>
            </div>
            <div class="flex items-center justify-center gap-2.5">
              <button type="button" onclick="document.getElementById('tent-file-input').click()" class="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 cursor-pointer">
                <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
                Ganti Foto
              </button>
              <button type="button" onclick="clearCustomPhoto()" class="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-xs font-semibold text-rose-700 inline-flex items-center gap-1.5 cursor-pointer">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                Hapus Foto
              </button>
            </div>
          </div>
        `;
  }

  const presetLabels = {
    dome4: "Ilustrasi Contoh: Tenda Dome 4P Bukit Alahan",
    ultralight2: "Ilustrasi Contoh: Tenda Ultralight 2P Malam",
    family6: "Ilustrasi Contoh: Tenda Keluarga Besar",
  };

  return `
        <div class="flex flex-col items-center justify-center py-2">
          <div class="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mb-3">
            <i data-lucide="image-plus" class="w-6 h-6"></i>
          </div>
          <p class="text-sm font-semibold text-slate-800">
            Seret &amp; lepas foto tenda di sini, atau
            <button type="button" onclick="document.getElementById('tent-file-input').click()" class="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-400 underline-offset-2 cursor-pointer">pilih file</button>
          </p>
          <p class="text-xs text-slate-400 mt-1">Mendukung JPG, PNG, WEBP (Maks. 5MB)</p>
          <div class="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-medium text-slate-600">
            <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-600"></i>
            ${presetLabels[d.svgPreset] || presetLabels.dome4}
          </div>
        </div>
      `;
}

function renderActiveTagsHTML() {
  if (!state.draft.tags.length) {
    return `<span class="text-xs text-slate-400 italic">Belum ada tag fasilitas dipilih.</span>`;
  }
  return state.draft.tags
    .map(
      (tag, idx) => `
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <i data-lucide="check" class="w-3 h-3 text-emerald-600"></i>
          ${escapeHTML(tag)}
          <button type="button" onclick="removeDraftTag(${idx})" class="ml-0.5 text-emerald-600 hover:text-rose-600 cursor-pointer" aria-label="Hapus tag">
            <i data-lucide="x" class="w-3.5 h-3.5"></i>
          </button>
        </span>
      `,
    )
    .join("");
}

function renderLivePreviewCardHTML() {
  const d = state.draft;
  const displayTitle =
    d.name.trim() || "Nama Unit Tenda Anda Akan Tampil Di Sini";
  const displayDesc =
    d.description.trim() ||
    "Kata-kata promosi dan deskripsi kenyamanan tenda akan muncul di bagian ini sehingga calon penyewa tertarik untuk langsung memesan.";
  const displayPrice = formatRupiah(d.price || 0);
  const stockCount = Math.max(1, Number(d.stock) || 1);

  return `
        <article class="group bg-white rounded-2xl border border-[#E2E8F0] shadow-md overflow-hidden transition-all">
          <!-- Image / Artwork Header -->
          <div class="relative">
            ${getTentVisualHTML(d, "h-56")}

            <!-- Top Overlays -->
            <div class="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm">
                <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
                Tersedia (${stockCount} Unit)
              </span>
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-800 shadow-xs backdrop-blur-xs">
                <i data-lucide="users" class="w-3.5 h-3.5 text-emerald-600"></i>
                ${escapeHTML(d.category)}
              </span>
            </div>

            <!-- Bottom Location Tag -->
            <div class="absolute bottom-3 left-3">
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-900/75 text-white backdrop-blur-xs">
                <i data-lucide="map-pin" class="w-3 h-3 text-emerald-400"></i>
                Basecamp Alahan Panjang
              </span>
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-5">
            <div class="flex items-start justify-between gap-2">
              <h4 class="text-lg font-bold text-slate-900 leading-snug">
                ${escapeHTML(displayTitle)}
              </h4>
              <div class="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg shrink-0">
                <span>4.9</span>
                <span>★</span>
              </div>
            </div>

            <!-- Facility Badges -->
            <div class="flex flex-wrap gap-1.5 mt-3">
              ${
                d.tags.length
                  ? d.tags
                      .map(
                        (t) => `
                      <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium">
                        ${escapeHTML(t)}
                      </span>
                    `,
                      )
                      .join("")
                  : `<span class="text-xs text-slate-400 italic">Tambahkan tag fasilitas...</span>`
              }
            </div>

            <!-- Customer-facing Copywriting -->
            <div class="mt-3.5 pt-3.5 border-t border-slate-100">
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">${escapeHTML(displayDesc)}</p>
            </div>

            <!-- Price & Booking CTA -->
            <div class="mt-5 pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
              <div>
                <span class="block text-[11px] font-medium text-slate-400">Tarif Sewa</span>
                <div class="flex items-baseline gap-1">
                  <span class="text-lg font-extrabold text-emerald-700">${displayPrice}</span>
                  <span class="text-xs font-medium text-slate-500">/ malam</span>
                </div>
              </div>
              <button type="button" onclick="showToast('Simulasi Tombol Pelanggan', 'Di halaman depan, tombol ini membuka form pemesanan & pembayaran DP penyewa.', 'info')" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer">
                <span>Booking Sekarang</span>
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        </article>
      `;
}

// Live Preview & Form Event Handlers
function refreshLivePreviewOnly() {
  const wrapper = document.getElementById("live-preview-card-wrapper");
  if (wrapper) {
    wrapper.innerHTML = renderLivePreviewCardHTML();
    lucide.createIcons();
  }
}

function updateDraftField(field, value) {
  state.draft[field] = value;
  refreshLivePreviewOnly();
}

function updateDraftDescription(value) {
  state.draft.description = value;
  const counter = document.getElementById("desc-char-counter");
  if (counter) counter.textContent = `${value.length} / 500 karakter`;
  refreshLivePreviewOnly();
}

function selectCategory(cat) {
  state.draft.category = cat;
  // Auto-match sample illustration preset if no custom photo uploaded
  if (!state.draft.customImageUrl) {
    if (cat === "2 Orang") state.draft.svgPreset = "ultralight2";
    else if (cat === "6-8 Orang Keluarga" || cat === "Tenda Pleton/Event")
      state.draft.svgPreset = "family6";
    else state.draft.svgPreset = "dome4";
  }
  renderCurrentView();
}

function adjustDraftStock(delta) {
  const next = Math.max(1, (Number(state.draft.stock) || 1) + delta);
  state.draft.stock = next;
  const input = document.getElementById("input-tent-stock");
  if (input) input.value = next;
  refreshLivePreviewOnly();
}

function addCustomTag() {
  const input = document.getElementById("input-new-tag");
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;
  if (!state.draft.tags.includes(val)) {
    state.draft.tags.push(val);
    input.value = "";
    document.getElementById("active-tags-list").innerHTML =
      renderActiveTagsHTML();
    refreshLivePreviewOnly();
  } else {
    showToast(
      "Tag Sudah Ada",
      `"${val}" sudah terpasang pada daftar fasilitas.`,
      "info",
    );
  }
}

function toggleSuggestedTag(tag) {
  if (!state.draft.tags.includes(tag)) {
    state.draft.tags.push(tag);
    document.getElementById("active-tags-list").innerHTML =
      renderActiveTagsHTML();
    refreshLivePreviewOnly();
  }
}

function removeDraftTag(idx) {
  state.draft.tags.splice(idx, 1);
  document.getElementById("active-tags-list").innerHTML =
    renderActiveTagsHTML();
  refreshLivePreviewOnly();
}

function applyCopyTemplate(key) {
  const text = COPYWRITING_TEMPLATES[key];
  if (!text) return;
  state.draft.description = text;
  const textarea = document.getElementById("input-tent-desc");
  if (textarea) textarea.value = text;
  updateDraftDescription(text);
  showToast(
    "Template Kata-Kata Diterapkan",
    "Silakan sesuaikan teks promosi sesuai kebutuhan unit tenda Anda.",
  );
}

// FileReader API & Drag-and-Drop Photo Handling
function handleDragOver(e) {
  e.preventDefault();
  const dz = document.getElementById("photo-dropzone");
  if (dz) dz.classList.add("border-emerald-600", "bg-emerald-50/50");
}

function handleDragLeave(e) {
  e.preventDefault();
  const dz = document.getElementById("photo-dropzone");
  if (dz) dz.classList.remove("border-emerald-600", "bg-emerald-50/50");
}

function handleDrop(e) {
  e.preventDefault();
  handleDragLeave(e);
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    processImageFile(files[0]);
  }
}

function handleFileSelect(e) {
  const files = e.target?.files;
  if (files && files.length > 0) {
    processImageFile(files[0]);
  }
}

function processImageFile(file) {
  if (!file.type.startsWith("image/")) {
    showToast(
      "Format File Tidak Valid",
      "Harap pilih file gambar (JPG, PNG, atau WEBP).",
      "warning",
    );
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    state.draft.customImageUrl = event.target.result;
    state.draft.customFileName = file.name;
    const dzContent = document.getElementById("dropzone-content");
    if (dzContent) dzContent.innerHTML = renderDropzoneInner();
    refreshLivePreviewOnly();
    showToast(
      "Foto Tenda Berhasil Dimuat",
      `Pratinjau "${file.name}" langsung tampil di sebelah kanan.`,
    );
  };
  reader.readAsDataURL(file);
}

function clearCustomPhoto() {
  state.draft.customImageUrl = null;
  state.draft.customFileName = "";
  const fileInput = document.getElementById("tent-file-input");
  if (fileInput) fileInput.value = "";
  const dzContent = document.getElementById("dropzone-content");
  if (dzContent) dzContent.innerHTML = renderDropzoneInner();
  refreshLivePreviewOnly();
}

function cycleSamplePhoto() {
  const order = ["dome4", "ultralight2", "family6"];
  const nextIdx = (order.indexOf(state.draft.svgPreset) + 1) % order.length;
  state.draft.customImageUrl = null;
  state.draft.customFileName = "";
  state.draft.svgPreset = order[nextIdx];

  const dzContent = document.getElementById("dropzone-content");
  if (dzContent) dzContent.innerHTML = renderDropzoneInner();
  refreshLivePreviewOnly();
}

function resetDraftForm() {
  state.draft = {
    name: "",
    category: "4 Orang",
    price: 65000,
    stock: 5,
    tags: ["Double Layer", "Waterproof 3000mm", "Free Matras & Pasak"],
    description: "",
    svgPreset: "dome4",
    customImageUrl: null,
    customFileName: "",
  };
  renderCurrentView();
  showToast("Formulir Direset", "Siap untuk mengisi data tenda baru.", "info");
}

function handlePublishTent(e) {
  e.preventDefault();
  const d = state.draft;

  if (!d.name.trim()) {
    showToast(
      "Nama Tenda Wajib Diisi",
      "Silakan masukkan nama unit tenda sebelum mempublikasikan.",
      "warning",
    );
    document.getElementById("input-tent-name")?.focus();
    return;
  }

  if (!d.description.trim()) {
    showToast(
      "Deskripsi Tenda Masih Kosong",
      'Gunakan tombol "Bantu Kata-Kata" atau tulis deskripsi singkat tenda.',
      "warning",
    );
    document.getElementById("input-tent-desc")?.focus();
    return;
  }

  const newId = "TND-" + String(state.tents.length + 1).padStart(3, "0");
  const newTent = {
    id: newId,
    name: d.name.trim(),
    category: d.category,
    price: Math.max(5000, Number(d.price) || 50000),
    stock: Math.max(1, Number(d.stock) || 1),
    rented: 0,
    status: "Tersedia",
    tags: [...d.tags],
    description: d.description.trim(),
    svgPreset: d.svgPreset,
    customImageUrl: d.customImageUrl,
  };

  state.tents.unshift(newTent);
  state.activities.unshift({
    icon: "plus-circle",
    color: "emerald",
    title: `Unit Baru Dipublikasikan — ${newTent.name}`,
    desc: `${newTent.stock} unit ditambahkan (${formatRupiah(newTent.price)}/malam)`,
    time: "Baru saja",
  });

  // Reset draft after successful publish
  state.draft = {
    name: "",
    category: "4 Orang",
    price: 65000,
    stock: 5,
    tags: ["Double Layer", "Waterproof 3000mm", "Free Matras & Pasak"],
    description: "",
    svgPreset: "dome4",
    customImageUrl: null,
    customFileName: "",
  };

  updateSidebarBadges();
  renderCurrentView();
  showToast(
    "Berhasil Dipublikasikan!",
    `"${newTent.name}" kini sudah masuk ke Katalog Unit Tenda dan siap disewa pelanggan.`,
  );
}

// =========================================================================
// 6. PAGE 2: KATALOG UNIT TENDA
// =========================================================================

function renderCatalogView(container) {
  const categories = [
    "Semua",
    "2 Orang",
    "4 Orang",
    "6-8 Orang Keluarga",
    "Tenda Pleton/Event",
  ];
  const filtered = state.tents.filter((t) => {
    const matchCat =
      state.catalogFilter === "Semua" || t.category === state.catalogFilter;
    const matchSearch =
      t.name.toLowerCase().includes(state.catalogSearch.toLowerCase()) ||
      t.description.toLowerCase().includes(state.catalogSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalUnits = state.tents.reduce((sum, t) => sum + t.stock, 0);
  const readyUnits = state.tents.reduce(
    (sum, t) =>
      sum + (t.status === "Tersedia" ? Math.max(0, t.stock - t.rented) : 0),
    0,
  );

  container.innerHTML = `
        <div class="space-y-6">
          <!-- Top Summary & Filter Bar -->
          <div class="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="flex flex-wrap items-center gap-2">
              ${categories
                .map((cat) => {
                  const active = state.catalogFilter === cat;
                  return `
                  <button onclick="setCatalogFilter('${cat}')" class="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }">
                    ${cat}
                  </button>
                `;
                })
                .join("")}
            </div>

            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div class="relative">
                <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                <input
                  type="text"
                  value="${escapeHTML(state.catalogSearch)}"
                  oninput="setCatalogSearch(this.value)"
                  placeholder="Cari nama tenda..."
                  class="w-full sm:w-60 pl-10 pr-4 py-2 rounded-xl border border-[#E2E8F0] text-xs sm:text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div class="text-xs font-medium text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-[#E2E8F0] whitespace-nowrap">
                Siap Sewa: <strong class="text-emerald-700">${readyUnits}</strong> / ${totalUnits} Unit
              </div>
            </div>
          </div>

          <!-- Tent Cards Grid -->
          ${
            filtered.length === 0
              ? `
                <div class="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center">
                  <div class="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <i data-lucide="tent" class="w-7 h-7"></i>
                  </div>
                  <h3 class="text-base font-bold text-slate-800">Tidak Ada Unit Tenda Ditemukan</h3>
                  <p class="text-sm text-slate-500 mt-1">Coba ubah filter kategori atau tambahkan unit tenda baru.</p>
                  <button onclick="navigate('upload')" class="mt-4 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 cursor-pointer">
                    + Upload Tenda Baru
                  </button>
                </div>
              `
              : `
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  ${filtered
                    .map((tent) => {
                      const available = Math.max(0, tent.stock - tent.rented);
                      const isActive = tent.status === "Tersedia";
                      return `
                      <div class="group bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col">
                        <div class="relative">
                          ${getTentVisualHTML(tent, "h-48")}
                          <div class="absolute top-3 left-3 flex items-center gap-2">
                            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs ${
                              isActive
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-800 text-slate-200"
                            }">
                              ${isActive ? "Aktif di Katalog" : "Nonaktif / Perawatan"}
                            </span>
                          </div>
                          <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-slate-800 shadow-xs">
                            ${escapeHTML(tent.category)}
                          </span>
                        </div>

                        <div class="p-5 flex-1 flex flex-col">
                          <div class="flex items-start justify-between gap-2">
                            <div>
                              <span class="text-[11px] font-mono font-semibold text-slate-400">${tent.id}</span>
                              <h3 class="text-base font-bold text-slate-900 leading-snug mt-0.5">${escapeHTML(tent.name)}</h3>
                            </div>
                          </div>

                          <p class="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                            ${escapeHTML(tent.description)}
                          </p>

                          <!-- Tags -->
                          <div class="flex flex-wrap gap-1.5 mt-3">
                            ${tent.tags
                              .slice(0, 3)
                              .map(
                                (tag) => `
                              <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">${escapeHTML(tag)}</span>
                            `,
                              )
                              .join("")}
                          </div>

                          <!-- Stock & Price Metrics -->
                          <div class="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                            <div class="bg-slate-50 rounded-xl p-2.5 border border-slate-200/60">
                              <span class="block text-[11px] text-slate-400">Harga / Malam</span>
                              <span class="text-sm font-extrabold text-emerald-700">${formatRupiah(tent.price)}</span>
                            </div>
                            <div class="bg-slate-50 rounded-xl p-2.5 border border-slate-200/60">
                              <span class="block text-[11px] text-slate-400">Stok (Siap / Total)</span>
                              <div class="flex items-center justify-between mt-0.5">
                                <span class="text-sm font-bold text-slate-800">${available} <span class="text-xs font-normal text-slate-400">/ ${tent.stock}</span></span>
                                <div class="flex items-center gap-1">
                                  <button onclick="updateTentStock('${tent.id}', -1)" title="Kurangi Stok" class="w-6 h-6 rounded-md bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer">
                                    <i data-lucide="minus" class="w-3 h-3"></i>
                                  </button>
                                  <button onclick="updateTentStock('${tent.id}', 1)" title="Tambah Stok" class="w-6 h-6 rounded-md bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer">
                                    <i data-lucide="plus" class="w-3 h-3"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Admin Controls -->
                          <div class="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                            <button onclick="toggleTentStatus('${tent.id}')" class="flex-1 px-3 py-2 rounded-xl border text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                              isActive
                                ? "border-amber-200 bg-amber-50/70 text-amber-800 hover:bg-amber-100"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }">
                              <i data-lucide="${isActive ? "pause-circle" : "play-circle"}" class="w-3.5 h-3.5"></i>
                              ${isActive ? "Set Perawatan" : "Aktifkan Sewa"}
                            </button>
                            <button onclick="confirmDeleteTent('${tent.id}')" title="Hapus Unit Tenda" class="p-2 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer">
                              <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    `;
                    })
                    .join("")}
                </div>
              `
          }
        </div>
      `;
}

function setCatalogFilter(cat) {
  state.catalogFilter = cat;
  renderCurrentView();
}

function setCatalogSearch(val) {
  state.catalogSearch = val;
  renderCurrentView();
}

function updateTentStock(id, delta) {
  const tent = state.tents.find((t) => t.id === id);
  if (!tent) return;
  const nextStock = Math.max(tent.rented, tent.stock + delta);
  if (nextStock === tent.stock && delta < 0) {
    showToast(
      "Tidak Bisa Dikurangi",
      `${tent.rented} unit sedang aktif disewa pelanggan.`,
      "warning",
    );
    return;
  }
  tent.stock = nextStock;
  renderCurrentView();
  showToast(
    "Stok Diperbarui",
    `Total stok "${tent.name}" menjadi ${tent.stock} unit.`,
    "info",
  );
}

function toggleTentStatus(id) {
  const tent = state.tents.find((t) => t.id === id);
  if (!tent) return;
  tent.status = tent.status === "Tersedia" ? "Perawatan" : "Tersedia";
  state.activities.unshift({
    icon: "refresh-cw",
    color: tent.status === "Tersedia" ? "emerald" : "amber",
    title: `Status Tenda Diubah — ${tent.name}`,
    desc: `Status unit kini: ${tent.status}`,
    time: "Baru saja",
  });
  renderCurrentView();
  showToast(
    "Status Katalog Diperbarui",
    `"${tent.name}" kini berstatus ${tent.status}.`,
  );
}

function confirmDeleteTent(id) {
  const tent = state.tents.find((t) => t.id === id);
  if (!tent) return;

  openModal(`
        <div class="flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <i data-lucide="trash-2" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900">Hapus Unit dari Katalog?</h3>
            <p class="text-sm text-slate-600 mt-1 leading-relaxed">
              Anda yakin ingin menghapus <strong>"${escapeHTML(tent.name)}"</strong>? Data unit ini akan dihapus dari etalase penyewaan.
            </p>
          </div>
        </div>
        <div class="mt-6 flex items-center justify-end gap-2.5">
          <button onclick="closeModal()" class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
            Batal
          </button>
          <button onclick="executeDeleteTent('${tent.id}')" class="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer">
            Ya, Hapus Tenda
          </button>
        </div>
      `);
}

function executeDeleteTent(id) {
  const idx = state.tents.findIndex((t) => t.id === id);
  if (idx !== -1) {
    const removed = state.tents.splice(idx, 1)[0];
    state.activities.unshift({
      icon: "trash-2",
      color: "slate",
      title: `Unit Dihapus — ${removed.name}`,
      desc: "Dihapus oleh admin dari katalog penyewaan",
      time: "Baru saja",
    });
    updateSidebarBadges();
    closeModal();
    renderCurrentView();
    showToast(
      "Unit Tenda Dihapus",
      `"${removed.name}" telah dihapus dari katalog.`,
      "info",
    );
  }
}

// =========================================================================
// 7. PAGE 3: DASHBOARD RINGKASAN
// =========================================================================

function renderDashboardView(container) {
  const totalUnits = state.tents.reduce((sum, t) => sum + t.stock, 0);
  const rentedUnits = state.tents.reduce((sum, t) => sum + t.rented, 0);
  const readyUnits = state.tents.reduce(
    (sum, t) =>
      sum + (t.status === "Tersedia" ? Math.max(0, t.stock - t.rented) : 0),
    0,
  );

  // Dynamic monthly revenue estimation (base historical + current orders + catalog capacity factor)
  const confirmedOrdersRevenue = state.orders.reduce(
    (sum, o) => sum + o.total,
    0,
  );
  const estimatedMonthly =
    4850000 + confirmedOrdersRevenue + totalUnits * 75000;

  container.innerHTML = `
        <div class="space-y-6">
          <!-- 4 KPI Stat Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
            <!-- KPI 1 -->
            <div class="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Unit Tenda</span>
                <div class="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <i data-lucide="tent" class="w-4 h-4"></i>
                </div>
              </div>
              <div class="mt-3 flex items-baseline gap-2">
                <span class="text-2xl sm:text-3xl font-extrabold text-slate-900">${totalUnits}</span>
                <span class="text-xs font-medium text-slate-500">unit (${state.tents.length} tipe)</span>
              </div>
              <p class="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
                <i data-lucide="trending-up" class="w-3.5 h-3.5"></i>
                Terdaftar di katalog aktif
              </p>
            </div>

            <!-- KPI 2 -->
            <div class="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Sedang Disewa</span>
                <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <i data-lucide="compass" class="w-4 h-4"></i>
                </div>
              </div>
              <div class="mt-3 flex items-baseline gap-2">
                <span class="text-2xl sm:text-3xl font-extrabold text-slate-900">${rentedUnits}</span>
                <span class="text-xs font-medium text-slate-500">unit di lapangan</span>
              </div>
              <p class="mt-2 text-xs text-slate-500">
                Okupansi aktif <strong class="text-slate-700">${totalUnits ? Math.round((rentedUnits / totalUnits) * 100) : 0}%</strong> dari total stok
              </p>
            </div>

            <!-- KPI 3 -->
            <div class="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Siap Sewa</span>
                <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <i data-lucide="check-circle-2" class="w-4 h-4"></i>
                </div>
              </div>
              <div class="mt-3 flex items-baseline gap-2">
                <span class="text-2xl sm:text-3xl font-extrabold text-emerald-700">${readyUnits}</span>
                <span class="text-xs font-medium text-slate-500">unit bersih &amp; siap</span>
              </div>
              <p class="mt-2 text-xs text-emerald-600 font-medium">
                Siap booking akhir pekan ini
              </p>
            </div>

            <!-- KPI 4 -->
            <div class="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Estimasi Pendapatan</span>
                <div class="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <i data-lucide="wallet" class="w-4 h-4"></i>
                </div>
              </div>
              <div class="mt-3">
                <span class="text-xl sm:text-2xl font-extrabold text-slate-900">${formatRupiah(estimatedMonthly)}</span>
              </div>
              <p class="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
                <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
                Proyeksi bulan November 2026
              </p>
            </div>
          </div>

          <!-- Two-Column Detail Section -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <!-- Left: Stock Utilization per Tent Type -->
            <div class="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
              <div class="flex items-center justify-between mb-5">
                <div>
                  <h3 class="text-base font-bold text-slate-900">Ketersediaan per Jenis Tenda</h3>
                  <p class="text-xs text-slate-500 mt-0.5">Perbandingan unit siap sewa dan unit yang sedang dibawa penyewa.</p>
                </div>
                <button onclick="navigate('katalog')" class="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer">
                  Kelola Stok →
                </button>
              </div>

              <div class="space-y-4">
                ${state.tents
                  .map((tent) => {
                    const avail = Math.max(0, tent.stock - tent.rented);
                    const pctReady =
                      tent.stock > 0
                        ? Math.round((avail / tent.stock) * 100)
                        : 0;
                    return `
                    <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                      <div class="flex items-center justify-between gap-2 mb-2">
                        <div>
                          <span class="text-sm font-bold text-slate-800">${escapeHTML(tent.name)}</span>
                          <span class="ml-2 text-[11px] font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">${escapeHTML(tent.category)}</span>
                        </div>
                        <span class="text-xs font-bold text-emerald-700">${avail} Siap / ${tent.stock} Total</span>
                      </div>
                      <div class="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                        <div class="h-full rounded-full bg-emerald-600 transition-all duration-500" style="width: ${pctReady}%"></div>
                      </div>
                    </div>
                  `;
                  })
                  .join("")}
              </div>
            </div>

            <!-- Right: Recent Activity Log -->
            <div class="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
              <div class="flex items-center justify-between mb-5">
                <div>
                  <h3 class="text-base font-bold text-slate-900">Aktivitas Terbaru</h3>
                  <p class="text-xs text-slate-500 mt-0.5">Catatan unggahan katalog &amp; transaksi masuk.</p>
                </div>
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>

              <div class="space-y-4">
                ${state.activities
                  .slice(0, 5)
                  .map((act) => {
                    const badgeMap = {
                      emerald: "bg-emerald-50 text-emerald-600",
                      amber: "bg-amber-50 text-amber-600",
                      slate: "bg-slate-100 text-slate-600",
                    };
                    return `
                    <div class="flex items-start gap-3 pb-3.5 border-b border-slate-100 last:border-0 last:pb-0">
                      <div class="w-8 h-8 rounded-xl ${badgeMap[act.color] || badgeMap.emerald} flex items-center justify-center shrink-0 mt-0.5">
                        <i data-lucide="${act.icon}" class="w-4 h-4"></i>
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">${escapeHTML(act.title)}</p>
                        <p class="text-xs text-slate-500 mt-0.5">${escapeHTML(act.desc)}</p>
                        <span class="inline-block text-[11px] text-slate-400 mt-1">${escapeHTML(act.time)}</span>
                      </div>
                    </div>
                  `;
                  })
                  .join("")}
              </div>
            </div>
          </div>
        </div>
      `;
}

// =========================================================================
// 8. PAGE 4: PESANAN & VERIFIKASI DP
// =========================================================================

function renderOrdersView(container) {
  const filters = [
    "Semua",
    "Menunggu Verifikasi DP",
    "DP Terverifikasi",
    "Lunas",
  ];
  const filteredOrders = state.orders.filter((o) =>
    state.orderFilter === "Semua" ? true : o.dpStatus === state.orderFilter,
  );

  container.innerHTML = `
        <div class="space-y-6">
          <!-- Filter Bar -->
          <div class="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-2">
              ${filters
                .map((f) => {
                  const active = state.orderFilter === f;
                  return `
                  <button onclick="setOrderFilter('${f}')" class="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }">
                    ${f}
                  </button>
                `;
                })
                .join("")}
            </div>
            <div class="text-xs text-slate-500">
              Menampilkan <strong class="text-slate-800">${filteredOrders.length}</strong> pesanan penyewa
            </div>
          </div>

          <!-- Responsive Table Card -->
          <div class="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 border-b border-[#E2E8F0] text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th class="py-3.5 px-5">Kode &amp; Penyewa</th>
                    <th class="py-3.5 px-5">Unit Tenda &amp; Jadwal</th>
                    <th class="py-3.5 px-5">Nominal DP / Total</th>
                    <th class="py-3.5 px-5">Status Pembayaran</th>
                    <th class="py-3.5 px-5 text-right">Tindakan Admin</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-sm">
                  ${filteredOrders
                    .map((order) => {
                      let statusBadge = "";
                      if (order.dpStatus === "Menunggu Verifikasi DP") {
                        statusBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Menunggu Verifikasi DP</span>`;
                      } else if (order.dpStatus === "DP Terverifikasi") {
                        statusBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200"><i data-lucide="check" class="w-3 h-3"></i>DP Terverifikasi</span>`;
                      } else {
                        statusBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><i data-lucide="check-circle-2" class="w-3 h-3"></i>Lunas</span>`;
                      }

                      return `
                      <tr class="hover:bg-slate-50/70 transition-colors">
                        <td class="py-4 px-5 align-top">
                          <span class="text-[11px] font-mono font-semibold text-slate-400 block">${order.id}</span>
                          <span class="font-bold text-slate-900 block mt-0.5">${escapeHTML(order.customer)}</span>
                          <span class="text-xs text-slate-500">${escapeHTML(order.phone)}</span>
                        </td>
                        <td class="py-4 px-5 align-top">
                          <span class="font-semibold text-slate-800 block">${escapeHTML(order.tentName)}</span>
                          <span class="text-xs text-slate-500 block mt-0.5">${order.qty} Unit • ${order.nights} Malam (Mulai ${order.rentalDate})</span>
                        </td>
                        <td class="py-4 px-5 align-top">
                          <span class="font-bold text-emerald-700 block">DP: ${formatRupiah(order.dpAmount)}</span>
                          <span class="text-xs text-slate-500 block">Total Sewa: ${formatRupiah(order.total)}</span>
                          <span class="text-[11px] text-slate-400 block mt-0.5">${escapeHTML(order.bank)}</span>
                        </td>
                        <td class="py-4 px-5 align-top">
                          ${statusBadge}
                        </td>
                        <td class="py-4 px-5 align-top text-right">
                          <div class="inline-flex flex-wrap items-center justify-end gap-2">
                            <button onclick="openProofModal('${order.id}')" class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1 cursor-pointer">
                              <i data-lucide="receipt" class="w-3.5 h-3.5"></i>
                              Bukti
                            </button>
                            ${
                              order.dpStatus === "Menunggu Verifikasi DP"
                                ? `<button onclick="verifyOrderDP('${order.id}')" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1 shadow-xs cursor-pointer">
                                    <i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i>
                                    Verifikasi DP
                                  </button>`
                                : order.dpStatus === "DP Terverifikasi"
                                  ? `<button onclick="markOrderPaid('${order.id}')" class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer">
                                    <i data-lucide="badge-check" class="w-3.5 h-3.5"></i>
                                    Konfirmasi Lunas
                                  </button>`
                                  : `<span class="text-xs font-medium text-emerald-600 px-2">Selesai</span>`
                            }
                          </div>
                        </td>
                      </tr>
                    `;
                    })
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
}

function setOrderFilter(f) {
  state.orderFilter = f;
  renderCurrentView();
}

function verifyOrderDP(id) {
  const order = state.orders.find((o) => o.id === id);
  if (!order) return;
  order.dpStatus = "DP Terverifikasi";
  state.activities.unshift({
    icon: "check-circle-2",
    color: "emerald",
    title: `DP Dikonfirmasi — ${order.customer}`,
    desc: `${order.tentName} (${formatRupiah(order.dpAmount)})`,
    time: "Baru saja",
  });
  updateSidebarBadges();
  renderCurrentView();
  showToast(
    "DP Berhasil Diverifikasi",
    `Pesanan atas nama ${order.customer} telah terkunci di jadwal.`,
  );
}

function markOrderPaid(id) {
  const order = state.orders.find((o) => o.id === id);
  if (!order) return;
  order.dpStatus = "Lunas";
  order.dpAmount = order.total;
  state.activities.unshift({
    icon: "wallet",
    color: "emerald",
    title: `Pelunasan Diterima — ${order.customer}`,
    desc: `Total ${formatRupiah(order.total)} lunas`,
    time: "Baru saja",
  });
  renderCurrentView();
  showToast(
    "Pembayaran Lunas",
    `Transaksi ${order.id} (${order.customer}) telah ditandai lunas.`,
  );
}

function openProofModal(id) {
  const order = state.orders.find((o) => o.id === id);
  if (!order) return;

  openModal(`
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span class="text-[11px] font-mono text-slate-400">${order.id}</span>
            <h3 class="text-base font-bold text-slate-900">Rincian Bukti Pembayaran DP</h3>
          </div>
          <button onclick="closeModal()" class="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <div class="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-500">Nama Penyewa</span>
            <span class="font-bold text-slate-900">${escapeHTML(order.customer)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Metode Transfer</span>
            <span class="font-semibold text-slate-800">${escapeHTML(order.bank)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Unit Disewa</span>
            <span class="font-semibold text-slate-800">${escapeHTML(order.tentName)} (${order.qty}x)</span>
          </div>
          <div class="flex justify-between pt-2 border-t border-slate-200">
            <span class="text-slate-500">Nominal Ditransfer</span>
            <span class="text-sm font-extrabold text-emerald-700">${formatRupiah(order.dpAmount)}</span>
          </div>
        </div>

        <div class="mt-5 flex items-center justify-end gap-2">
          <button onclick="closeModal()" class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
            Tutup
          </button>
          ${
            order.dpStatus === "Menunggu Verifikasi DP"
              ? `<button onclick="closeModal(); verifyOrderDP('${order.id}')" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer">
                  Konfirmasi Valid &amp; Verifikasi
                </button>`
              : ""
          }
        </div>
      `);
}

// =========================================================================
// 9. PAGE 5: LAPORAN KEUANGAN
// =========================================================================

function renderReportsView(container) {
  const periods = {
    "November 2026": {
      gross: 5710000,
      dpCollected: 3120000,
      settled: 2590000,
      rentalsCount: 38,
      weekly: [
        { label: "Minggu 1", amount: 1180000, pct: 62 },
        { label: "Minggu 2", amount: 1890000, pct: 95 },
        { label: "Minggu 3", amount: 1460000, pct: 76 },
        { label: "Minggu 4 (Berjalan)", amount: 1180000, pct: 60 },
      ],
    },
    "Oktober 2026": {
      gross: 6420000,
      dpCollected: 3210000,
      settled: 6420000,
      rentalsCount: 44,
      weekly: [
        { label: "Minggu 1", amount: 1420000, pct: 72 },
        { label: "Minggu 2", amount: 1650000, pct: 84 },
        { label: "Minggu 3", amount: 1980000, pct: 100 },
        { label: "Minggu 4", amount: 1370000, pct: 70 },
      ],
    },
  };

  const data = periods[state.reportPeriod] || periods["November 2026"];

  container.innerHTML = `
        <div class="space-y-6">
          <!-- Period Switcher -->
          <div class="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-2">
              ${Object.keys(periods)
                .map(
                  (p) => `
                <button onclick="setReportPeriod('${p}')" class="px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  state.reportPeriod === p
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }">
                  ${p}
                </button>
              `,
                )
                .join("")}
            </div>
            <button onclick="showToast('Ekspor Ringkasan', 'Laporan keuangan periode ${state.reportPeriod} siap diunduh.', 'info')" class="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-2 cursor-pointer">
              <i data-lucide="download" class="w-4 h-4 text-emerald-600"></i>
              Unduh Rekap PDF/CSV
            </button>
          </div>

          <!-- Revenue Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div class="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Pemasukan Sewa</span>
              <p class="text-2xl font-extrabold text-slate-900 mt-2">${formatRupiah(data.gross)}</p>
              <span class="inline-block mt-2 text-xs font-medium text-emerald-600">Dari ${data.rentalsCount} transaksi penyewaan</span>
            </div>
            <div class="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Dana DP Terverifikasi</span>
              <p class="text-2xl font-extrabold text-emerald-700 mt-2">${formatRupiah(data.dpCollected)}</p>
              <span class="inline-block mt-2 text-xs text-slate-500">Uang muka masuk rekening basecamp</span>
            </div>
            <div class="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Pelunasan Selesai</span>
              <p class="text-2xl font-extrabold text-slate-900 mt-2">${formatRupiah(data.settled)}</p>
              <span class="inline-block mt-2 text-xs text-slate-500">Pembayaran lunas saat serah terima</span>
            </div>
          </div>

          <!-- Weekly Revenue Bar Visualization -->
          <div class="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
            <h3 class="text-base font-bold text-slate-900">Grafik Pemasukan Mingguan — ${state.reportPeriod}</h3>
            <p class="text-xs text-slate-500 mt-0.5 mb-6">Tren penyewaan tenda mingguan (puncak tertinggi biasanya pada akhir pekan).</p>

            <div class="space-y-4">
              ${data.weekly
                .map(
                  (w) => `
                <div>
                  <div class="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span class="text-slate-700">${w.label}</span>
                    <span class="text-emerald-700">${formatRupiah(w.amount)}</span>
                  </div>
                  <div class="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div class="h-full rounded-full bg-emerald-600 transition-all duration-500" style="width: ${w.pct}%"></div>
                  </div>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
        </div>
      `;
}

function setReportPeriod(p) {
  state.reportPeriod = p;
  renderCurrentView();
}

// =========================================================================
// 10. INITIALIZATION ON DOM LOAD
// =========================================================================
window.addEventListener("DOMContentLoaded", () => {
  navigate("upload");
});
