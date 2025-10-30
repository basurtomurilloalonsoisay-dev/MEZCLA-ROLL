// Espera a que todo el contenido HTML esté cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DEL MENÚ HAMBURGUESA (Tu código original) ---
    const navSlide = () => {
        const burger = document.querySelector('.burger-menu');
        const nav = document.querySelector('.nav-links');
        const navLinks = document.querySelectorAll('.nav-links li');

        if (burger && nav) { // Verifica que los elementos existan
            burger.addEventListener('click', () => {
                // Toggle (activar/desactivar) el menú
                nav.classList.toggle('nav-active');

                // Animar los enlaces (opcional)
                navLinks.forEach((link, index) => {
                    if (link.style.animation) {
                        link.style.animation = '';
                    } else {
                        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                    }
                });

                // Animación del icono de hamburguesa
                burger.classList.toggle('toggle-burger');
            });
        }
    }
    
    // Llamar a la función del menú
    navSlide();


    // --- NUEVA LÓGICA DEL CARRITO DE COMPRAS ---

    let cart = []; // Array para almacenar los ítems del carrito

    // --- Selectores de elementos ---
    const addToCartButtons = document.querySelectorAll('.add-to-cart-button[data-name]');
    const cartModalOverlay = document.getElementById('cart-modal-overlay');
    const cartModal = document.getElementById('cart-modal');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const openCartBtn = document.getElementById('open-cart-cta');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const cartCountCta = document.getElementById('cart-count-cta');
    const checkoutBtn = document.getElementById('checkout-whatsapp-btn');
    const cartError = document.getElementById('cart-error');

    // --- Funciones del Carrito ---

    /**
     * Añade un producto al carrito o incrementa su cantidad.
     */
    function addToCart(event) {
        const button = event.target;
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price);

        // Buscar si el ítem ya está en el carrito
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity++; // Incrementar cantidad
        } else {
            cart.push({ name, price, quantity: 1 }); // Añadir nuevo ítem
        }
        
        // Mostrar feedback (opcional)
        showFeedback(button);

        updateCartUI(); // Actualizar la UI
    }

    /**
     * Muestra una confirmación visual breve al añadir un ítem.
     */
    function showFeedback(button) {
        const originalText = button.innerText;
        button.innerText = '¡Añadido! ✅';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerText = originalText;
            button.disabled = false;
        }, 1500); // Revierte el texto después de 1.5 segundos
    }

    /**
     * Actualiza toda la interfaz de usuario relacionada con el carrito.
     */
    function updateCartUI() {
        cartItemsList.innerHTML = ''; // Limpiar la lista
        let totalPrice = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p>Tu carrito está vacío.</p>';
        } else {
            cart.forEach(item => {
                const itemTotalPrice = item.price * item.quantity;
                totalPrice += itemTotalPrice;
                totalItems += item.quantity;

                // Crear el HTML para cada ítem del carrito
                const cartItemHTML = `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p>$${item.price.toFixed(2)} x ${item.quantity} = <strong>$${itemTotalPrice.toFixed(2)}</strong></p>
                        </div>
                        <div class="cart-item-controls">
                            <button class="cart-quantity-btn" data-name="${item.name}" data-action="decrease">-</button>
                            <span>${item.quantity}</span>
                            <button class="cart-quantity-btn" data-name="${item.name}" data-action="increase">+</button>
                            <button class="cart-remove-btn" data-name="${item.name}">Eliminar</button>
                        </div>
                    </div>
                `;
                cartItemsList.innerHTML += cartItemHTML;
            });
        }

        // Actualizar totales
        cartTotalPriceEl.innerText = `$${totalPrice.toFixed(2)}`;
        cartCountCta.innerText = totalItems;
        
        // Añadir listeners a los nuevos botones (+, -, Eliminar)
        setupCartEventListeners();
    }

    /**
     * Configura los event listeners para los botones dentro del modal del carrito.
     */
    function setupCartEventListeners() {
        document.querySelectorAll('.cart-quantity-btn').forEach(button => {
            button.addEventListener('click', handleQuantityChange);
        });

        document.querySelectorAll('.cart-remove-btn').forEach(button => {
            button.addEventListener('click', handleRemoveItem);
        });
    }

    /**
     * Maneja los clics en los botones '+' y '-'.
     */
    function handleQuantityChange(event) {
        const name = event.target.dataset.name;
        const action = event.target.dataset.action;
        const item = cart.find(item => item.name === name);

        if (item) {
            if (action === 'increase') {
                item.quantity++;
            } else if (action === 'decrease') {
                item.quantity--;
                if (item.quantity === 0) {
                    // Eliminar el ítem si la cantidad llega a 0
                    cart = cart.filter(cartItem => cartItem.name !== name);
                }
            }
            updateCartUI();
        }
    }

    /**
     * Maneja los clics en el botón 'Eliminar'.
     */
    function handleRemoveItem(event) {
        const name = event.target.dataset.name;
        cart = cart.filter(item => item.name !== name); // Filtra el array, eliminando el ítem
        updateCartUI();
    }

    /**
     * Genera y abre el mensaje de WhatsApp.
     */
    function generateWhatsAppMessage() {
        // --- ¡¡IMPORTANTE!! ---
        // Reemplaza el número de abajo con tu número de WhatsApp
        // Formato: 521 + LADA + NÚMERO (ej: 5214921234567)
        const yourWhatsAppNumber = "524922072904"; // <--- CAMBIA ESTE NÚMERO
        
        if (yourWhatsAppNumber === "521XXXXXXXXXX" || yourWhatsAppNumber === "") {
             cartError.innerText = "Error: El número de WhatsApp no está configurado en script.js";
             return;
        }

        // Recolectar datos del formulario
        const userName = document.getElementById('user-name').value.trim();
        const userAddress = document.getElementById('user-address').value.trim();
        const paymentMethod = document.getElementById('payment-method').value;
        
        // --- CAMBIO AQUÍ: Leer el nuevo campo de peticiones ---
        const userRequests = document.getElementById('user-requests').value.trim();

        // Validar formulario
        if (cart.length === 0) {
            cartError.innerText = "Tu carrito está vacío.";
            return;
        }
        if (!userName || !userAddress) {
            cartError.innerText = "Por favor, completa tu nombre y domicilio.";
            return;
        }
        cartError.innerText = ""; // Limpiar errores

        // Construir el mensaje
        let message = `¡Hola Mezcla Roll! 🍣\n\nMe gustaría hacer el siguiente pedido:\n\n`;

        let totalPrice = 0;
        cart.forEach(item => {
            message += `*${item.quantity}x* - ${item.name} ($${(item.price * item.quantity).toFixed(2)})\n`;
            totalPrice += item.price * item.quantity;
        });

        message += `\n*Total:* $${totalPrice.toFixed(2)}\n`;
        message += `\n*--- Datos de Entrega ---*\n`;
        message += `👤 *Nombre:* ${userName}\n`;
        message += `🏠 *Domicilio:* ${userAddress}\n`;
        message += `💳 *Forma de Pago:* ${paymentMethod}\n`;

        // --- CAMBIO AQUÍ: Añadir las peticiones al mensaje (si existen) ---
        if (userRequests) {
            message += `📝 *Peticiones:* ${userRequests}\n`;
        }
        
        message += `\n¡Muchas gracias!`;

        // Formatear para URL de WhatsApp
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${yourWhatsAppNumber}?text=${encodedMessage}`;

        // Abrir en una nueva pestaña
        window.open(whatsappURL, '_blank');
    }

    // --- Asignación de Event Listeners ---

    // Añadir al carrito
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Abrir y cerrar el modal
    const openModal = () => {
        cartModalOverlay.style.display = 'flex';
        updateCartUI(); // Asegura que el carrito esté actualizado al abrir
    }
    const closeModal = () => cartModalOverlay.style.display = 'none';

    openCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
    cartCloseBtn.addEventListener('click', closeModal);
    cartModalOverlay.addEventListener('click', (e) => {
        // Cierra el modal solo si se hace clic en el fondo (overlay)
        if (e.target === cartModalOverlay) {
            closeModal();
        }
    });

    // Botón final de Checkout
    checkoutBtn.addEventListener('click', generateWhatsAppMessage);

});