document.addEventListener('DOMContentLoaded', () => {
    // Array para almacenar los ítems del carrito: [{ id, name, price, quantity, image }]
    let cart = []; 
    
    // Elementos del DOM
    const cartCountElement = document.getElementById('cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const cartEmptyMessage = document.getElementById('cart-empty-message');
    const checkoutBtn = document.getElementById('checkout-btn');

    /**
     * Función para actualizar el contador visual del carrito.
     */
    function updateCartCount() {
        // Calcula la cantidad total de ítems (sumando la 'quantity' de cada producto)
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCountElement.textContent = totalItems;
        
        // Ocultar el badge si el carrito está vacío, mostrarlo si tiene ítems
        if (totalItems > 0) {
            cartCountElement.classList.remove('visually-hidden');
            cartEmptyMessage.classList.add('d-none'); // Ocultar mensaje de vacío
        } else {
            cartCountElement.classList.add('visually-hidden');
            cartEmptyMessage.classList.remove('d-none'); // Mostrar mensaje de vacío
        }
    }

    /**
     * Función para renderizar los ítems dentro del modal del carrito.
     */
    function renderCartItems() {
        cartItemsContainer.innerHTML = ''; // Limpiar contenido anterior
        let cartTotal = 0;

        if (cart.length === 0) {
            cartEmptyMessage.classList.remove('d-none');
            cartTotalElement.textContent = '$0';
            return;
        }

        cartEmptyMessage.classList.add('d-none'); // Asegurar que el mensaje de vacío está oculto

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            cartTotal += itemTotal;

            const itemHTML = `
                <div class="d-flex align-items-center cart-item-row" data-product-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="flex-grow-1">
                        <p class="mb-0 fw-bold">${item.name}</p>
                        <p class="mb-0 text-muted">${formatPrice(item.price)} c/u</p>
                    </div>
                    <div class="d-flex align-items-center mx-3">
                        <button class="btn btn-sm btn-outline-secondary me-2 update-quantity-btn" data-action="decrement" data-id="${item.id}">
                            <i class="bi bi-dash"></i>
                        </button>
                        <span class="fw-bold">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary ms-2 update-quantity-btn" data-action="increment" data-id="${item.id}">
                            <i class="bi bi-plus"></i>
                        </button>
                    </div>
                    <span class="fw-bold text-end">${formatPrice(itemTotal)}</span>
                    <button class="btn btn-sm btn-danger ms-3 remove-item-btn" data-id="${item.id}">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        // Actualizar el total y el modal de checkout
        cartTotalElement.textContent = formatPrice(cartTotal);
        updateCheckoutModal(cartTotal);
    }

    /**
     * Función auxiliar para dar formato de precio (ej. $8.500)
     */
    function formatPrice(price) {
        return '$' + price.toLocaleString('es-CO'); // Usar formato local de Colombia (ejemplo)
    }

    /**
     * Función para añadir o aumentar la cantidad de un producto.
     */
    function addItemToCart(productId) {
        const productElement = document.querySelector(`.product-card[data-product-id="${productId}"]`);
        
        // Obtener la info del HTML (atributos data-*)
        const productInfo = {
            id: productId,
            name: productElement.getAttribute('data-product-name'),
            price: parseInt(productElement.getAttribute('data-product-price')),
            image: productElement.getAttribute('data-product-image'),
        };

        const existingItemIndex = cart.findIndex(item => item.id === productId);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity++;
        } else {
            cart.push({...productInfo, quantity: 1});
        }

        updateCartCount();
        renderCartItems();
        showToast('Producto añadido al carrito.');
    }

    /**
     * Función para gestionar la cantidad del producto en el carrito (incrementar/decrementar).
     */
    function updateCartQuantity(productId, action) {
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            if (action === 'increment') {
                cart[itemIndex].quantity++;
            } else if (action === 'decrement') {
                cart[itemIndex].quantity--;
                
                // Si la cantidad llega a 0, eliminar el ítem
                if (cart[itemIndex].quantity <= 0) {
                    cart.splice(itemIndex, 1);
                    showToast('Producto eliminado del carrito.');
                }
            }
        }
        
        updateCartCount();
        renderCartItems();
    }
    
    /**
     * Función para eliminar un ítem completamente del carrito.
     */
    function removeItemFromCart(productId) {
        const initialLength = cart.length;
        cart = cart.filter(item => item.id !== productId);
        
        if (cart.length < initialLength) {
            updateCartCount();
            renderCartItems();
            showToast('Producto eliminado del carrito.');
        }
    }
    
    // --- Lógica del Checkout y Facturación (Simulación) ---
    
    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));

    function updateCheckoutModal(total) {
        const summaryContainer = document.getElementById('checkout-summary');
        const paymentAmount = document.getElementById('payment-amount');
        
        let summaryHTML = '';
        cart.forEach(item => {
            summaryHTML += `<p class="mb-1">${item.name} x${item.quantity}: ${formatPrice(item.price * item.quantity)}</p>`;
        });
        
        summaryHTML += `<hr class="my-2"><p class="fw-bold mb-0">Total a Pagar: <span class="custom-price-color">${formatPrice(total)}</span></p>`;
        
        summaryContainer.innerHTML = summaryHTML;
        paymentAmount.textContent = formatPrice(total);
    }
    
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            cartModal.hide(); // Ocultar el carrito
            checkoutModal.show(); // Mostrar el modal de Checkout/Factura
        } else {
            showToast('El carrito está vacío. ¡No puedes pagar!');
        }
    });

    document.getElementById('pay-now-btn').addEventListener('click', () => {
        alert('¡Pago de ' + document.getElementById('payment-amount').textContent + ' realizado con éxito! Se ha generado tu factura.');
        // Lógica de reseteo (simulación de compra finalizada)
        cart = [];
        updateCartCount();
        renderCartItems();
        checkoutModal.hide();
    });

    // --- Listeners de Eventos ---

    // 1. Botones de "Añadir al Carrito" en la página
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.getAttribute('data-product-id');
            addItemToCart(productId);
        });
    });

    // 2. Eventos dentro del Modal del Carrito (Delegación de eventos para botones dinámicos)
    cartItemsContainer.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (!target) return; // No es un botón
        
        const productId = target.getAttribute('data-id');
        
        if (target.classList.contains('update-quantity-btn')) {
            const action = target.getAttribute('data-action');
            updateCartQuantity(productId, action);
        } else if (target.classList.contains('remove-item-btn')) {
            removeItemFromCart(productId);
        }
    });

    // 3. Inicializar al cargar (ocultar el '0' inicial si el carrito está vacío)
    updateCartCount(); 
    renderCartItems(); // Renderiza el mensaje de carrito vacío

    // Función simple de notificación (Simulación de Toast de Bootstrap)
    function showToast(message) {
        console.log("TOAST: " + message);
        // Implementación real requeriría el componente Toast en el HTML. 
        // Por ahora, usamos un simple alert para la retroalimentación.
        // alert(message); // Descomentar si se desea una notificación visible simple
    }
});
