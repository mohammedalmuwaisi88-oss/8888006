// ==========================================================================
// STORE SETTINGS & CONFIGURATION
// ==========================================================================
const STORE_SETTINGS = {
    storeName: "جلف أجرو - Gulf Agro",
    whatsappNumber: "96872420073",
    email: "info@gulfagro.om",
    currency: "ر.ع.",
    deliveryFee: 0.000,
    socialLinks: {
        instagram: "https://instagram.com/gulfagro_om",
        tiktok: "https://tiktok.com/@gulfagro_om",
        facebook: "https://facebook.com/gulfagro.om",
        youtube: "https://youtube.com/@gulfagro_om",
        whatsapp: "https://wa.me/96872420073"
    }
};

// ==========================================================================
// PRODUCTS DATA ARRAY USING REAL GULF AGRO PRODUCT IMAGE
// ==========================================================================
const products = [
    {
        id: 1,
        name: "سماد جلف أجرو السمكي العضوي",
        size: "500 مل",
        price: 3.500,
        description: "عبوة مركزة من سمك السردين، مثالية للحدائق المنزلية والأصص النباتية.",
        image: "product.png"
    },
    {
        id: 2,
        name: "سماد جلف أجرو السمكي العضوي",
        size: "1 لتر",
        price: 6.000,
        description: "الحجم القياسي الأكثر طلباً لأشجار الفاكهة والنباتات والمزروعات المختلفة.",
        image: "product.png"
    },
    {
        id: 3,
        name: "سماد جلف أجرو السمكي العضوي",
        size: "5 لتر",
        price: 22.000,
        description: "عبوة اقتصادية ممتازة للمزارع الصغيرة والمحميات الزراعية.",
        image: "product.png"
    },
    {
        id: 4,
        name: "سماد جلف أجرو السمكي العضوي",
        size: "20 لتر",
        price: 75.000,
        description: "عبوة حقلية كبرى مخصصة للمزارع الكبيرة والإنتاج التجاري.",
        image: "product.png"
    }
];

let cart = [];

document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    renderProducts();
    renderSocialLinks();
    setupEventListeners();
    setupScrollEffects();
});

function renderProducts() {
    const grid = document.getElementById("products-grid");
    if (!grid) return;

    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div>
                <div class="product-card-img-wrapper">
                    <img src="${product.image}" alt="${product.name} - ${product.size}" class="product-card-img" loading="lazy">
                </div>
                <span class="product-size">${product.size}</span>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
            </div>
            <div class="product-footer">
                <div class="product-price">${product.price.toFixed(3)} ${STORE_SETTINGS.currency}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">أضف للسلة 🛒</button>
            </div>
        </div>
    `).join("");
}

function renderSocialLinks() {
    const container = document.getElementById("social-icons-container");
    if (!container) return;

    const links = STORE_SETTINGS.socialLinks;
    container.innerHTML = `
        <a href="${links.instagram}" target="_blank" class="social-link" aria-label="Instagram">📷</a>
        <a href="${links.tiktok}" target="_blank" class="social-link" aria-label="TikTok">🎵</a>
        <a href="${links.facebook}" target="_blank" class="social-link" aria-label="Facebook">📘</a>
        <a href="${links.youtube}" target="_blank" class="social-link" aria-label="YouTube">▶️</a>
        <a href="${links.whatsapp}" target="_blank" class="social-link" aria-label="WhatsApp">💬</a>
    `;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    renderCart();
    showToast(`تمت إضافة "${product.name} - ${product.size}" إلى السلة ✓`);
    openCart();
}

function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        const removedItem = cart[itemIndex];
        cart.splice(itemIndex, 1);
        saveCart();
        renderCart();
        showToast(`تم حذف "${removedItem.name}" من السلة`);
    }
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        renderCart();
    }
}

function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + STORE_SETTINGS.deliveryFee;
    return { subtotal, total };
}

function renderCart() {
    const cartBody = document.getElementById("cart-body");
    const cartCountEl = document.getElementById("cart-count");
    const cartTotalCountEl = document.getElementById("cart-total-count");
    const subtotalEl = document.getElementById("cart-subtotal");
    const deliveryEl = document.getElementById("cart-delivery");
    const totalPriceEl = document.getElementById("cart-total-price");

    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalQty;
    cartTotalCountEl.textContent = totalQty;

    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="text-center" style="padding: 40px 0;">
                <span style="font-size: 3rem; display:block; margin-bottom: 10px;">🛒</span>
                <p style="color: var(--color-text-muted); margin-bottom: 20px;">سلتك فارغة حالياً</p>
                <a href="#products" onclick="closeCart()" class="btn btn-outline">تصفح المنتجات</a>
            </div>
        `;
    } else {
        cartBody.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name} (${item.size})</div>
                    <div class="cart-item-price">${(item.price * item.quantity).toFixed(3)} ${STORE_SETTINGS.currency}</div>
                    <div class="cart-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">حذف</button>
                    </div>
                </div>
            </div>
        `).join("");
    }

    const { subtotal, total } = calculateTotal();
    subtotalEl.textContent = `${subtotal.toFixed(3)} ${STORE_SETTINGS.currency}`;
    deliveryEl.textContent = STORE_SETTINGS.deliveryFee === 0 ? "مجاني" : `${STORE_SETTINGS.deliveryFee.toFixed(3)} ${STORE_SETTINGS.currency}`;
    totalPriceEl.textContent = `${total.toFixed(3)} ${STORE_SETTINGS.currency}`;
}

function saveCart() {
    localStorage.setItem("gulfagro_cart", JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem("gulfagro_cart");
    if (saved) {
        try {
            cart = JSON.parse(saved);
            renderCart();
        } catch (e) {
            cart = [];
        }
    }
}

function openCart() {
    document.getElementById("cart-drawer").classList.add("open");
    document.getElementById("cart-overlay").classList.add("active");
}

function closeCart() {
    document.getElementById("cart-drawer").classList.remove("open");
    document.getElementById("cart-overlay").classList.remove("active");
}

function openCheckoutModal() {
    if (cart.length === 0) {
        showToast("سلتك فارغة! أضف منتجات قبل الطلب.");
        return;
    }
    closeCart();
    document.getElementById("modal-overlay").classList.add("active");
}

function closeCheckoutModal() {
    document.getElementById("modal-overlay").classList.remove("active");
}

function sendWhatsAppOrder(e) {
    e.preventDefault();

    const name = document.getElementById("cust-name").value.trim();
    const phone = document.getElementById("cust-phone").value.trim();
    const state = document.getElementById("cust-state").value.trim();
    const address = document.getElementById("cust-address").value.trim();
    const notes = document.getElementById("cust-notes").value.trim() || "لا يوجد";

    if (!name || !phone || !state || !address) {
        showToast("يرجى ملء كافة الحقول المطلوبة.");
        return;
    }

    const { subtotal, total } = calculateTotal();

    let message = `السلام عليكم، أريد طلب المنتجات التالية من متجر ${STORE_SETTINGS.storeName}:

`;
    message += `🛒 *تفاصيل الطلب:*
`;

    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.name}* (${item.size})
`;
        message += `   - الكمية: ${item.quantity}
`;
        message += `   - السعر: ${(item.price * item.quantity).toFixed(3)} ${STORE_SETTINGS.currency}
`;
    });

    message += `
--------------------------------
`;
    message += `💰 *الإجمالي النهائي:* ${total.toFixed(3)} ${STORE_SETTINGS.currency}
`;
    message += `--------------------------------

`;

    message += `👤 *معلومات العميل:*
`;
    message += `- *الاسم:* ${name}
`;
    message += `- *رقم الهاتف:* ${phone}
`;
    message += `- *الولاية / المدينة:* ${state}
`;
    message += `- *العنوان:* ${address}
`;
    message += `- *ملاحظات:* ${notes}

`;
    message += `أرغب في إتمام الطلب وتأكيد عملية التوصيل.`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${STORE_SETTINGS.whatsappNumber}?text=${encodedMessage}`;

    window.open(waUrl, "_blank");
    closeCheckoutModal();
}

function showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function setupEventListeners() {
    document.getElementById("cart-btn").addEventListener("click", openCart);
    document.getElementById("close-cart-btn").addEventListener("click", closeCart);
    document.getElementById("cart-overlay").addEventListener("click", closeCart);

    document.getElementById("checkout-btn").addEventListener("click", openCheckoutModal);
    document.getElementById("close-modal-btn").addEventListener("click", closeCheckoutModal);

    document.getElementById("checkout-form").addEventListener("submit", sendWhatsAppOrder);

    const hamburgerBtn = document.getElementById("hamburger-btn");
    const navMenu = document.getElementById("nav-menu");

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    }

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
        });
    });
}

function setupScrollEffects() {
    const header = document.getElementById("main-header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".reveal-element").forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)";
        observer.observe(el);
    });
}
