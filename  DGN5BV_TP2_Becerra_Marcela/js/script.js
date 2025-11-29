document.addEventListener('DOMContentLoaded', function() {
    
    /* ----------------------------------------------------------- */
    /* 1. Funcionalidad del Menú de Navegación Móvil (Toggle) & Search */
    /* ----------------------------------------------------------- */
    const menuToggle = document.getElementById('menu-toggle');
    const navEnlaces = document.getElementById('nav-enlaces');
    
    // Lógica del Buscador
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');
    const searchButton = searchContainer ? searchContainer.querySelector('.search-button') : null;

    // Función que ejecuta la simulación de búsqueda y redirección
    function executeSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase(); // Convertir a minúsculas
        
        // Simulación: Palabras que sí encuentran algo y van al catálogo
        if (searchTerm === 'cafe' || searchTerm === 'torta' || searchTerm === 'pasteleria') {
            console.log('Simulación de búsqueda exitosa: Redireccionando a catálogo.');
            window.location.href = 'catalogo.html?search=' + encodeURIComponent(searchTerm); 
            return true;
        } 
        
        // Si la palabra no está vacía y no es una palabra clave exitosa, SIMULAMOS EL ERROR 404
        else if (searchTerm !== '') {
            console.log('Simulación de búsqueda fallida: Redireccionando a página 404.');
            window.location.href = '404.html'; 
            return true;
        }
        
        return false;
    }

    if (menuToggle && navEnlaces) {
        menuToggle.addEventListener('click', function() {
            navEnlaces.classList.toggle('show');
            
            // Alternar el ícono de la hamburguesa (fa-bars <-> fa-times)
            const icon = menuToggle.querySelector('i');
            if (navEnlaces.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times'); 
                menuToggle.setAttribute('aria-expanded', 'true');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
            
            // Si el menú se abre en mobile, asegurar que el buscador esté oculto
            if (window.innerWidth <= 768 && navEnlaces.classList.contains('show') && searchContainer) {
                searchContainer.classList.remove('active');
            }
        });
        
        // Ocultar el menú al hacer clic en un enlace (para navegación interna en mobile)
        const links = navEnlaces.querySelectorAll('li a:not(.nav-icon)'); // Excluir el icono del carrito
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navEnlaces.classList.remove('show');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Lógica del Toggle del Buscador (Desktop)
    if (searchButton && searchContainer && searchInput) {
        
        // 1. Lógica para el click en el botón de la lupa
        searchButton.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            // Si el input está activo y tiene contenido, intenta buscar.
            if (searchContainer.classList.contains('active')) {
                if (executeSearch()) {
                    return; // Si la búsqueda se ejecuta, detenemos el flujo aquí.
                }
            }
            
            // Toggle la clase activa para mostrar/ocultar el input
            searchContainer.classList.toggle('active');

            // Enfocar el input si se abre
            if (searchContainer.classList.contains('active')) {
                searchInput.focus();
            } else {
                searchInput.value = ''; // Limpiar al ocultar
            }
        });

        // 2. Lógica para la tecla Enter en el input
        searchInput.addEventListener('keypress', (e) => {
            // Check for Enter key (key: 'Enter' or keyCode: 13)
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault(); // Evita el envío de formularios o saltos de línea
                executeSearch(); // Ejecuta la búsqueda
            }
        });
        
        // 3. Ocultar al hacer clic fuera 
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target) && window.innerWidth > 768) {
                searchContainer.classList.remove('active');
                searchInput.value = '';
            }
        });
    }


    /* ----------------------------------------------------------- */
    /* 2. Funcionalidad del Contador para el Evento (index.html) */
    /* ----------------------------------------------------------- */
    const countdownElement = document.getElementById('countdown'); 
    if (countdownElement) {
        // La fecha del evento (23 de Diciembre de 2025, 10:00 AM)
        const eventDate = new Date(2025, 11, 23, 10, 0, 0).getTime();
        let x; 

        // Función que calcula y actualiza el contador
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = eventDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // 1. Mostrar el resultado
            if (document.getElementById("dias")) {
                document.getElementById("dias").innerText = String(days).padStart(2, '0');
                document.getElementById("horas").innerText = String(hours).padStart(2, '0');
                document.getElementById("minutos").innerText = String(minutes).padStart(2, '0');
                document.getElementById("segundos").innerText = String(seconds).padStart(2, '0');
            }

            // 2. Detener si ha pasado el tiempo
            if (distance < 0) {
                clearInterval(x);
                countdownElement.innerHTML = "<span class='texto-condensado-negrita'>¡EL EVENTO COMENZÓ!</span>";
            }
        }
        
        // Ejecutar inmediatamente para mostrar el valor correcto al cargar
        updateCountdown(); 
        
        // Configurar el intervalo para actualizar cada segundo
        x = setInterval(updateCountdown, 1000);
    }


    /* ----------------------------------------------------------- */
    /* 3. Funcionalidad de Navegación por Pasos (checkout.html) */
    /* ----------------------------------------------------------- */

    // --- Control de Flujo Multi-Paso ---
    let currentStep = 1;
    const totalSteps = 4;
    const formSteps = document.querySelectorAll('.form-step');
    const progressBarItems = document.querySelectorAll('.progress-bar li');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    const checkoutForm = document.getElementById('checkoutForm');
    const summaryContent = document.getElementById('summary-content');

    // Datos de Usuario Registrado (Simulación)
    const REGISTERED_USERS = ["usuario@ejemplo.com", "cliente.recurrente@ejemplo.com"]; 
    const REGISTERED_DATA = {
        "cliente.recurrente@ejemplo.com": {
            name: "Facundo Ivan",
            lastname: "Romero",
            address: "Av. Libertador 1234, Piso 5",
            city: "CABA",
            postalCode: "C1425",
            phone: "+54 9 11 5555-4444"
        }
    };

    // Función para precargar datos si el usuario inicia sesión (Simulación)
    function prefillRegisteredData(email) {
        const data = REGISTERED_DATA[email.toLowerCase()];
        if (data) {
            document.getElementById('name').value = data.name;
            document.getElementById('lastname').value = data.lastname;
            document.getElementById('address').value = document.getElementById('address').value || data.address;
            document.getElementById('city').value = document.getElementById('city').value || data.city;
            document.getElementById('postal-code').value = document.getElementById('postal-code').value || data.postalCode;
            document.getElementById('phone').value = document.getElementById('phone').value || data.phone;
        }
    }

    // Función para manejar el flujo de login/invitado (on blur del email)
    window.checkUserRegistration = function(email) {
        const guestFields = document.getElementById('guest-fields');
        const loginPrompt = document.getElementById('login-prompt');
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');

        emailInput.classList.remove('error-field'); 

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email) && email.trim() !== '') {
            emailError.textContent = "Por favor, verifica el formato del email (ej: usuario@dominio.com).";
            emailError.style.display = 'block';
            emailInput.classList.add('error-field'); 
            if(guestFields) guestFields.classList.remove('hidden');
            if(loginPrompt) loginPrompt.classList.add('hidden');
            // Re-evaluar los botones de navegación
            updateSteps(); 
            return;
        }

        emailError.style.display = 'none';

        const isRegistered = REGISTERED_USERS.includes(email.toLowerCase());

        if (isRegistered && guestFields && loginPrompt) {
            guestFields.classList.add('hidden');
            loginPrompt.classList.remove('hidden');
            const name = REGISTERED_DATA[email.toLowerCase()] ? REGISTERED_DATA[email.toLowerCase()].name : email;
            loginPrompt.querySelector('h4').textContent = `👋 ¡Hola ${name}!`;
        } else if (guestFields && loginPrompt) {
            guestFields.classList.remove('hidden');
            loginPrompt.classList.add('hidden');
        }
        
        // Re-evaluar los botones de navegación después de cambiar la visibilidad del prompt
        updateSteps(); 
    }

    // Función para simular el inicio de sesión y avanzar
    window.loginUser = function() {
        const email = document.getElementById('email').value.toLowerCase();
        const password = document.getElementById('login-password').value;
        const loginError = document.getElementById('login-error');
        
        if (password.length > 0) {
            prefillRegisteredData(email);
            alert('Simulación: Usuario autenticado y datos precargados. Continuando al siguiente paso.');
            loginError.style.display = 'none';
            
            document.getElementById('login-prompt').classList.add('hidden');
            document.getElementById('guest-fields').classList.add('hidden'); 
            
            currentStep++;
            updateSteps();
            
        } else {
            loginError.textContent = 'Por favor, ingrese su contraseña.';
            loginError.style.display = 'block';
        }
    }

    // Función para continuar como invitado
    window.continueAsGuest = function() {
        document.getElementById('login-prompt').classList.add('hidden');
        document.getElementById('guest-fields').classList.remove('hidden');
        
        if (validateStep(currentStep)) { 
            currentStep++;
            updateSteps();
        }
    }


    // Función para obtener los valores del formulario
    function getFormData() {
        return {
            // Paso 1: Contacto
            email: document.getElementById('email').value,
            name: document.getElementById('name').value,
            lastname: document.getElementById('lastname').value,
            // Paso 2: Envío
            country: document.getElementById('country').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postal-code').value,
            phone: document.getElementById('phone').value,
            // Paso 3: Pago
            cardNumber: document.getElementById('card-number').value.replace(/\s/g, ''), 
            cardLogo: document.getElementById('card-logo').textContent, // Esto se actualizará con el innerHTML del icono
            expiryDate: document.getElementById('expiry-date').value,
            // Datos simulados para el resumen
            subtotal: 100.00,
            shipping: 5.99,
            total: 105.99
        };
    }

    // Función para generar el resumen de la orden (Paso 4)
    function generateSummary() {
        const data = getFormData();
        
        // Simulación de items en el carrito
        const items = [
            { name: "Café de Especialidad - Blend Expresso", price: 25.00, qty: 2 },
            { name: "Torta de Coco y Limón (Mediana)", price: 50.00, qty: 1 }
        ];

        let itemsHtml = items.map(item => 
            `<li>${item.qty} x ${item.name} - $${(item.price * item.qty).toFixed(2)}</li>`
        ).join('');

        const lastFour = data.cardNumber.length >= 4 ? data.cardNumber.slice(-4) : '####';
        
        // Obtener el HTML del icono para mostrarlo en el resumen
        const cardIconHtml = document.getElementById('card-logo').innerHTML;

        summaryContent.innerHTML = `
            <h3>Resumen del Pedido</h3>
            <div style="border-bottom: 1px dashed #ccc; padding-bottom: 10px; margin-bottom: 10px;">
                <h4>Productos:</h4>
                <ul class="lista-menu">${itemsHtml}</ul>
            </div>

            <h4>Información de Contacto:</h4>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Nombre:</strong> ${data.name} ${data.lastname}</p>

            <h4>Dirección de Envío:</h4>
            <p>${data.address}, ${data.city}, ${data.postalCode}</p>
            <p>País: ${data.country === 'AR' ? 'Argentina' : data.country}</p>
            <p>Teléfono: ${data.phone}</p>

            <h4>Detalles de Pago:</h4>
            <p><strong>Tarjeta:</strong> ${cardIconHtml} (Terminada en: **** ${lastFour})</p>
            
            <h3 class="total" style="margin-top: 20px; color: var(--color-complementary);">
                Total a Pagar: $${data.total.toFixed(2)}
            </h3>
        `;
    }

    // *** FUNCIÓN DE PASARELA DE PAGO (incluye el gatillo 404) ***
    function handleCheckoutSubmit(event) {
        event.preventDefault(); 

        if (currentStep !== totalSteps) return;

        if (!validateStep(currentStep)) {
            alert('Por favor, complete correctamente los datos de pago antes de finalizar la compra.');
            return;
        }
        
        const cvv = document.getElementById('cvv').value.trim();
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Procesando Pago...';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Finalizar Compra';
            
            if (cvv === '404') {
                alert('Error 404: No se pudo conectar con el servidor de pagos. Redireccionando a la página de aviso.');
                window.location.href = '404.html'; 
                return;
            } 
            
            if (cvv === '000') {
                const failureHtml = `
                    <div class="confirmation-box" style="border: 2px solid var(--color-error);">
                        <i class="fas fa-times-circle" style="color: var(--color-error); font-size: 3rem; margin-bottom: 1rem;"></i>
                        <h3>¡Pago Rechazado!</h3>
                        <p>Su banco ha denegado la transacción (Código de error: 000).</p>
                        <p>Por favor, revise los datos de su tarjeta o intente nuevamente.</p>
                        <button type="button" class="btn-primary" onclick="goToPaymentStep()">Volver a Pago</button>
                    </div>
                `;
                document.getElementById('step-4').innerHTML = failureHtml;
                document.querySelector('.navigation').classList.add('hidden');
                return; 
            }

            const transactionId = 'TXN-' + Math.random().toString(36).substring(2, 11).toUpperCase();
            
            const successHtml = `
                <div class="confirmation-box">
                    <i class="fas fa-check-circle" style="color: var(--color-success);"></i>
                    <h3>¡Compra Exitosa!</h3>
                    <p>Su pedido ha sido procesado con éxito.</p>
                    <p><strong>ID de Transacción:</strong> ${transactionId}</p>
                    <p>Recibirá un email de confirmación en breve.</p>
                    <button type="button" class="btn-primary" onclick="window.location.href='index.html'">Volver al Inicio</button>
                </div>
            `;
            document.getElementById('step-4').innerHTML = successHtml;
            document.querySelector('.navigation').classList.add('hidden');
            
        }, 3000); 
    }
    // *** FIN FUNCIÓN DE PASARELA DE PAGO ***

    // Función de Reset
    window.resetCheckout = function() {
        checkoutForm.reset();
        currentStep = 1;
        
        //  campos del demo
        document.getElementById('email').value = "cliente.recurrente@ejemplo.com";
        document.getElementById('name').value = "Facundo Ivan";
        document.getElementById('lastname').value = "Romero";
        document.getElementById('address').value = "Av. Libertador 1234, Piso 5";
        document.getElementById('city').value = "CABA";
        document.getElementById('postal-code').value = "C1425";
        document.getElementById('phone').value = "+54 9 11 5555-4444";
        
        // Restaurar Step 4
        document.getElementById('step-4').innerHTML = '<h2>Revisar y Confirmar</h2><p>Por favor, revise los detalles de su pedido y haga clic en **"Finalizar Compra"** para confirmar.</p><div id="summary-content" class="order-summary"><p>Cargando resumen del pedido...</p></div>';
        
        const guestFields = document.getElementById('guest-fields');
        const loginPrompt = document.getElementById('login-prompt');
        if (guestFields) guestFields.classList.remove('hidden');
        if (loginPrompt) loginPrompt.classList.add('hidden');
        
        const passwordMeter = document.getElementById('password-strength-meter');
        if (passwordMeter) passwordMeter.value = 0;
        document.getElementById('password-strength-text').textContent = 'Mínimo 8 caracteres, mayúscula y un número (Opcional si no deseas registrarte).';
        
        // Limpiar el icono de la tarjeta
        document.getElementById('card-logo').innerHTML = '';
        
        document.querySelectorAll('.error-message').forEach(err => err.style.display = 'none');
        document.querySelector('.navigation').classList.remove('hidden'); 
        
        updateSteps();
    }

    // *** FUNCIÓN GLOBAL PARA VOLVER AL PASO DE PAGO ***
    window.goToPaymentStep = function() {
        document.getElementById('step-4').innerHTML = '<h2>Revisar y Confirmar</h2><p>Por favor, revise los detalles de su pedido y haga clic en **"Finalizar Compra"** para confirmar.</p><div id="summary-content" class="order-summary"><p>Cargando resumen del pedido...</p></div>';
        
        currentStep = 3; 
        updateSteps(); 
        document.getElementById('cvv').value = ''; 
        document.querySelector('.navigation').classList.remove('hidden'); 
    }


    // Muestra/Oculta el paso actual y actualiza la barra de progreso
    function updateSteps() {
        
        const isConfirmationSuccessOrFailure = document.getElementById('step-4').querySelector('.confirmation-box');

        formSteps.forEach((step, index) => {
            step.classList.toggle('active', index + 1 === currentStep);
            step.classList.toggle('hidden', index + 1 !== currentStep);
        });
        
        progressBarItems.forEach((circle, index) => {
            circle.classList.toggle('active', index + 1 <= currentStep);
        });
        
        
        // --- 1. Lógica para el manejo de botones en el checkout ---
        
        const loginPromptVisible = currentStep === 1 && 
                document.getElementById('login-prompt') && 
                !document.getElementById('login-prompt').classList.contains('hidden');

        // Ocultar la navegación completa si hay una confirmación/error final
        if (isConfirmationSuccessOrFailure) {
            document.querySelector('.navigation').classList.add('hidden');
            return; // No ejecutar más lógica de botones
        } else {
            document.querySelector('.navigation').classList.remove('hidden');
        }


        // 1. Controlar los botones ATRÁS, SIGUIENTE y FINALIZAR COMPRA
        
        // Botón FINALIZAR COMPRA: Solo visible en el Paso 4 (totalSteps)
        submitBtn.classList.toggle('hidden', currentStep !== totalSteps);
        
        // Si el prompt de login está visible en el Paso 1, ocultar la navegación principal
        if (loginPromptVisible) {
            prevBtn.classList.add('hidden');
            nextBtn.classList.add('hidden');
        } else {
            // Botón ATRÁS (visible en pasos 2, 3, 4)
            prevBtn.classList.toggle('hidden', currentStep === 1); 

            // Botón SIGUIENTE / REVISAR (visible en pasos 1, 2, 3)
            // Se muestra si NO estamos en el paso final (totalSteps)
            nextBtn.classList.toggle('hidden', currentStep === totalSteps); 
            
            // Cambiar texto del botón en el paso 3 (Pago) a "Revisar Compra"
            if (currentStep === 3) {
                nextBtn.textContent = 'Revisar Compra →';
            } else {
                nextBtn.textContent = 'Siguiente →';
            }
        }
        
        // --- 2. Lógica de contenido ---

        // Vuelve a chequear el registro (importante para la carga inicial/re-renderizado de botones)
        if (currentStep === 1) {
            const email = document.getElementById('email').value;
            window.checkUserRegistration(email); 
        }
        

        if (currentStep === totalSteps && !isConfirmationSuccessOrFailure) {
            generateSummary();
        }
    }

    // Función de validación 
    function validateStep(step) {
        let isValid = true;
        const currentStepContainer = document.getElementById(`step-${step}`);
        
        if (step === 1) {
            const loginPrompt = document.getElementById('login-prompt');
            const guestFields = document.getElementById('guest-fields');
            const emailInput = document.getElementById('email');

            if (!emailInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
                emailInput.classList.add('error-field');
                isValid = false;
            } else {
                emailInput.classList.remove('error-field');
            }

            // Si el prompt de login está visible, permite continuar solo con los botones del prompt.
            // Si los campos de invitado están visibles, valida esos campos.
            if (!guestFields.classList.contains('hidden')) {
                currentStepContainer.querySelectorAll('#guest-fields input[required]').forEach(input => {
                    if (!input.value.trim()) {
                        const errorDisplay = input.parentNode.querySelector('.error-message');
                        if (errorDisplay) {
                            errorDisplay.textContent = `Por favor, complete el campo ${input.id.toUpperCase().replace('-', ' ')}.`; 
                            errorDisplay.style.display = 'block';
                        }
                        isValid = false;
                    } else {
                        const errorDisplay = input.parentNode.querySelector('.error-message');
                        if (errorDisplay) errorDisplay.style.display = 'none';
                    }
                });
            }
        } else {
            currentStepContainer.querySelectorAll('input[required], select[required]').forEach(input => {
                if (!input.value.trim() || !input.checkValidity()) {
                    const errorDisplay = input.parentNode.querySelector('.error-message');
                    if (errorDisplay) {
                        errorDisplay.textContent = `Por favor, complete el campo ${input.id.toUpperCase().replace('-', ' ')}.`; 
                        errorDisplay.style.display = 'block';
                    }
                    isValid = false;
                } else {
                    const errorDisplay = input.parentNode.querySelector('.error-message');
                    if (errorDisplay) errorDisplay.style.display = 'none';
                }
            });
        }

        return isValid;
    }


    // Lógica de avance
    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            currentStep++;
            updateSteps();
        }
    });

    // Lógica de retroceso
    prevBtn.addEventListener('click', () => {
        currentStep--;
        updateSteps();
    });

    // Listener para la simulación de Finalizar Compra
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);

    // Inicializar vista
    updateSteps(); 


    // --- Módulo de Lógica de Tarjetas (Icono y Formato) ---
    window.formatCardNumber = function(input) {
        let value = input.value.replace(/\D/g, ''); // Remover no dígitos
        let formattedValue = '';
        const binPrefix = value.substring(0, 4);
        const cardLogo = document.getElementById('card-logo');
        
        
        cardLogo.innerHTML = '';
        cardLogo.className = 'card-icon'; // Reset a la clase base

        if (value.length > 0) {
            let iconClass = '';
            let cardType = 'Genérica';

            // 1. Detectar Tipo de Tarjeta y asignar Icono (usando Font Awesome 6 classes)
            if (binPrefix.startsWith('4')) {
                cardType = 'VISA';
                iconClass = 'fab fa-cc-visa';
            } 
            else if (binPrefix >= '5100' && binPrefix <= '5599') {
                cardType = 'Mastercard';
                iconClass = 'fab fa-cc-mastercard';
            }
            else if (binPrefix.startsWith('34') || binPrefix.startsWith('37')) {
                cardType = 'Amex';
                iconClass = 'fab fa-cc-amex';
            }
            
            // 2. Aplicar Formato: 4-6-5 para Amex, 4-4-4-4 para el resto
            if (cardType === 'Amex') {
                if (value.length <= 4) {
                    formattedValue = value;
                } else if (value.length <= 10) {
                    formattedValue = value.replace(/(\d{4})(\d{1,6})/, '$1 $2');
                } else {
                    formattedValue = value.replace(/(\d{4})(\d{6})(\d{1,5})/, '$1 $2 $3').trim();
                }
            } else {
                // Visa, Mastercard, Genérica: 4-4-4-4
                formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
            }

            // 3. Mostrar Icono si se detectó
            if (iconClass) {
                cardLogo.innerHTML = `<i class="${iconClass}"></i>`;
            } else if (value.length > 0) {
                // Icono de fallback si no se reconoce (Credit Card Genérico)
                cardLogo.innerHTML = `<i class="fas fa-credit-card"></i>`;
            }
        }

        input.value = formattedValue;
    }
    // ----------------------------------------------------------------------

    window.updatePasswordStrength = function(password) {
        const meter = document.getElementById('password-strength-meter');
        const text = document.getElementById('password-strength-text');
        if (!meter || !text) return;

        let score = 0;

        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        
        meter.value = score;
        const strengthMap = { 0: "Muy Débil", 1: "Débil", 2: "Aceptable", 3: "Buena", 4: "Fuerte" };
        text.textContent = strengthMap[score];
    }

    window.formatExpiryDate = function(input) {
        let value = input.value.replace(/\D/g, '');

        if (value.length === 2 && input.value.indexOf('/') === -1) {
            input.value = value + '/';
        } else if (value.length > 2) {
            input.value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
    }

    // Función para mostrar ayuda de CVV
    window.showCvvHelp = function(event) {
        event.preventDefault();
        const cvvHelp = document.getElementById('cvv-help-message');
        cvvHelp.classList.toggle('hidden');
    }

    /* ========================================================================= */
    /* 4. Funcionalidad de Redirección 404 y Contador (Integrado para 404.html) */
    /* ========================================================================= */
        
        // Verifica si los elementos del contador existen (solo en 404.html)
        if (document.getElementById('countdown-timer')) {
            let countdownInterval;

            function startCountdown() {
                const display = document.getElementById('countdown-timer');
                
                // Se inicializa en 6 para que el primer decremento muestre 5.
                let remaining = 6; 
                
                function updateTimer() {
                    remaining--; // Primero decrementamos

                    if (remaining < 0) { //  comprobación si se acabó el tiempo
                        clearInterval(countdownInterval);
                        window.location.href = 'index.html'; // Redirección final
                        return;
                    }
                    
                    display.textContent = remaining; // actualización del display
                }
                
                // FIX: Ejecuta la función inmediatamente para que empiece en 5
                updateTimer(); 
                
                // Configurar el intervalo para actualizar cada segundo
                countdownInterval = setInterval(updateTimer, 1000);
            }

            // Iniciar el contador al cargar la página de error
            startCountdown();
        }

    // Exportar funciones globales (aunque ya están en window, es para claridad)
    window.loginUser = window.loginUser;
    window.continueAsGuest = window.continueAsGuest;
    window.checkUserRegistration = window.checkUserRegistration;
    window.updatePasswordStrength = window.updatePasswordStrength;
    window.formatCardNumber = window.formatCardNumber;
    window.formatExpiryDate = window.formatExpiryDate;
    window.resetCheckout = window.resetCheckout;
    window.goToPaymentStep = window.goToPaymentStep;
    window.showCvvHelp = window.showCvvHelp;
});