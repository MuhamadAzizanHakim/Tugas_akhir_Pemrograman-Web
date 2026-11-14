// Sample Product Catalog Data
const products = [
    {
        id: 1,
        name: 'Tenda Eiger Guardian 4P',
        category: 'keluarga',
        capacity: '4-6',
        price: '55.000',
        rating: 4.9,
        badge: 'Terpopuler',
        waterproof: '3000mm',
        img: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 2,
        name: 'Tenda Consina Soloist 1P',
        category: 'solo',
        capacity: '1-2',
        price: '30.000',
        rating: 4.8,
        badge: 'Ringan 1.5kg',
        waterproof: '2500mm',
        img: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 3,
        name: 'Paket Glamping Canvas Bell 6P',
        category: 'glamping',
        capacity: 'glamping',
        price: '180.000',
        rating: 5.0,
        badge: 'Mewah Complete',
        waterproof: '5000mm',
        img: 'https://images.unsplash.com/photo-1563299796-17596ed6b017?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 4,
        name: 'Kompor Portable + Nesting Set',
        category: 'alat',
        capacity: 'all',
        price: '25.000',
        rating: 4.7,
        badge: 'Siap Pakai',
        waterproof: 'Stainless',
        img: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 5,
        name: 'Tenda Great Outdoor Java 4',
        category: 'keluarga',
        capacity: '4-6',
        price: '45.000',
        rating: 4.9,
        badge: 'Anti Badai',
        waterproof: '3000mm',
        img: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 6,
        name: 'Matras Inflatable Single',
        category: 'alat',
        capacity: '1-2',
        price: '15.000',
        rating: 4.8,
        badge: 'Empuk',
        waterproof: 'Waterproof',
        img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 7,
        name: 'Tenda Naturehike Cloud Up 2P',
        category: 'solo',
        capacity: '1-2',
        price: '40.000',
        rating: 4.9,
        badge: 'Ultralight',
        waterproof: '4000mm',
        img: 'https://images.unsplash.com/photo-1508873696983-2df515122519?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 8,
        name: 'Lampu Gantung Camp + Powerbank',
        category: 'alat',
        capacity: 'all',
        price: '12.000',
        rating: 4.6,
        badge: 'Tahan 24 Jam',
        waterproof: 'IPX4',
        img: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?q=80&w=800&auto=format&fit=crop'
    }
];

// Render Products
function renderProducts(items) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-12 text-brand-muted font-medium">Tidak ada peralatan yang sesuai dengan kriteria pencarian.</div>`;
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-3xl overflow-hidden border border-brand-sand custom-shadow hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between';
        card.innerHTML = `
            <div>
                <div class="relative h-48 overflow-hidden">
                    <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
                    <span class="absolute top-3 left-3 bg-brand-green/90 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md">
                        ${item.badge}
                    </span>
                </div>
                <div class="p-5 space-y-3">
                    <div class="flex items-center justify-between text-xs text-brand-muted font-semibold">
                        <span class="flex items-center gap-1">⛺ ${item.waterproof}</span>
                        <span class="text-amber-500 font-bold">★ ${item.rating}</span>
                    </div>
                    <h3 class="font-bold text-base text-brand-dark line-clamp-1">${item.name}</h3>
                </div>
            </div>
            <div class="p-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-2">
                <div>
                    <p class="text-[10px] uppercase font-bold text-brand-muted">Sewa Harian</p>
                    <p class="text-lg font-extrabold text-brand-green">Rp ${item.price}</p>
                </div>
                <button onclick="openModal('${item.name}', '${item.price}', '${item.img}')" class="px-4 py-2 rounded-xl bg-brand-sand text-brand-green font-bold text-xs hover:bg-brand-accent hover:text-white transition">
                    Detail / Sewa
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Category Filter
function filterCategory(category) {
    // Update Active Tab Styles
    const buttons = document.querySelectorAll('.cat-btn');
    buttons.forEach(btn => {
        btn.classList.remove('bg-brand-green', 'text-white', 'border-brand-green');
        btn.classList.add('bg-white', 'text-brand-dark', 'border-brand-sand');
    });
    event.currentTarget.classList.remove('bg-white', 'text-brand-dark', 'border-brand-sand');
    event.currentTarget.classList.add('bg-brand-green', 'text-white', 'border-brand-green');

    if (category === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

// Search Bar Filter
function filterCatalogFromSearch() {
    const cap = document.getElementById('capacitySelect').value;
    const searchVal = document.getElementById('searchInput').value.toLowerCase();

    let filtered = products;

    if (cap !== 'all') {
        filtered = filtered.filter(p => p.capacity === cap);
    }

    if (searchVal.trim() !== '') {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchVal));
    }

    renderProducts(filtered);

    // Scroll smoothly to catalog
    document.getElementById('katalog').scrollIntoView({ behavior: 'smooth' });
}

// Calculator Logic
function updateCalculator() {
    const people = parseInt(document.getElementById('peopleSlider').value);
    const days = parseInt(document.getElementById('daysSlider').value);

    document.getElementById('calcPeople').innerText = people;
    document.getElementById('calcDays').innerText = days;

    // Calculations
    const tentsNeeded = Math.ceil(people / 4);
    const matsNeeded = people;
    const stoveNeeded = Math.ceil(people / 6);

    const bundleList = document.getElementById('calcBundleList');
    bundleList.innerHTML = `
        <li class="flex justify-between"><span>• ${tentsNeeded}x Tenda Dome Kapasitas 4-5P</span> <span class="text-brand-muted">Clean & Waterproof</span></li>
        <li class="flex justify-between"><span>• ${matsNeeded}x Matras Camping Thermal</span> <span class="text-brand-muted">Standard Empuk</span></li>
        <li class="flex justify-between"><span>• ${stoveNeeded}x Set Kompor Windproof & Cooking Gear</span> <span class="text-brand-muted">Siap Pakai</span></li>
    `;

    // Estimasi Biaya
    const basePerDay = (tentsNeeded * 45000) + (matsNeeded * 10000) + (stoveNeeded * 20000);
    const totalPrice = basePerDay * days;

    document.getElementById('calcTotalPrice').innerText = 'Rp ' + totalPrice.toLocaleString('id-ID');
}

// Modal Logic
function openModal(title, price, img) {
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalPrice').innerText = 'Rp ' + price;
    document.getElementById('modalImg').src = img;
    document.getElementById('bookingModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('bookingModal').classList.add('hidden');
}

function submitBooking(e) {
    e.preventDefault();
    alert('Permintaan sewa berhasil terkirim! Tim TeduhAlam akan mengirimkan konfirmasi via WhatsApp.');
    closeModal();
}

// Mobile Menu Toggle
document.getElementById('menuBtn').addEventListener('click', () => {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
});

// Initial Load
window.onload = function() {
    renderProducts(products);
    updateCalculator();
};
