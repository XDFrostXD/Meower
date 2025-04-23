// Локальное хранилище для корзины
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentProduct = null; // Текущий выбранный товар

// Основная инициализация
document.addEventListener("DOMContentLoaded", function() {
    // Инициализация элементов модального окна
    const modal = document.getElementById("modal");
    const modalProductImage = document.getElementById("modal-product-image");
    const modalProductName = document.getElementById("modal-product-name");
    const modalProductPrice = document.getElementById("modal-product-price");
    const quantityInput = document.getElementById("quantity");
    const confirmBtn = document.getElementById("confirm-add-to-cart");
    const cancelBtn = document.getElementById("cancel-add-to-cart");
    const closeBtn = document.querySelector(".close");

    // Функция открытия модального окна
    const showModal = (product) => {
        currentProduct = product;
        if (modal && modalProductImage && modalProductName && modalProductPrice) {
            modalProductImage.src = product.image;
            modalProductName.textContent = product.name;
            modalProductPrice.textContent = `${product.price} руб`;
            quantityInput.value = 1;
            modal.style.display = "block";
        }
    };

    // Функция закрытия модального окна
    const hideModal = () => {
        if (modal) modal.style.display = "none";
    };

    // Обработчики для модального окна
    if (closeBtn) closeBtn.addEventListener("click", hideModal);
    if (cancelBtn) cancelBtn.addEventListener("click", hideModal);
    
    if (confirmBtn) {
        confirmBtn.addEventListener("click", function() {
            const quantity = parseInt(quantityInput.value) || 1;
            if (currentProduct && quantity > 0) {
                addToCart(currentProduct, quantity);
            }
            hideModal();
        });
    }

    // Инициализация кнопок "Добавить в корзину"
    const addButtons = document.querySelectorAll(".add-to-cart");
    addButtons.forEach(button => {
        button.addEventListener("click", function() {
            const productCard = this.closest(".product-card");
            const product = {
                id: productCard.dataset.id,
                name: productCard.dataset.name,
                price: parseFloat(productCard.dataset.price),
                image: productCard.querySelector("img").src
            };
            showModal(product);
        });
    });

    // Инициализация корзины
    updateCartCount();
    if (document.getElementById("cart-items")) renderCart();
});

// Функции работы с корзиной
function addToCart(product, quantity) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartCount();
    if (document.getElementById("cart-items")) renderCart();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
    const counter = document.getElementById("cart-count");
    if (counter) {
        counter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

function renderCart() {
    const container = document.getElementById("cart-items");
    const totalElement = document.getElementById("total-price");

    if (!container || !totalElement) return;

    container.innerHTML = "";
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';
        totalElement.textContent = "0";
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-info">
                <h3>${item.name}</h3>
                <p>${item.price} руб × ${item.quantity} = ${item.price * item.quantity} руб</p>
            </div>
            <button class="remove-btn" data-index="${index}">×</button>
        `;
        container.appendChild(itemElement);
        total += item.price * item.quantity;
    });

    totalElement.textContent = total;

    // Обработчики для кнопок удаления
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            cart.splice(parseInt(this.dataset.index), 1);
            saveCart();
            renderCart();
            updateCartCount();
        });
    });
}