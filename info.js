document.addEventListener('DOMContentLoaded', () => {
    // Discord Webhook URL - IMPORTANT: In a real production app, this should be sent from a backend server, not directly from frontend.
    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1381594384361062401/3_aK8hImCgMpv6Vf6W6FDD-KuAdnrs67DuUzp9YJlW333AIRdjmtdwB4NhO6HX6Dj8zr';

    // Data for Algerian Wilayas (Provinces) and delivery prices
    const wilayaPrices = [
        { name: 'أدرار', office: 800, home: 1400 },
        { name: 'الشلف', office: 450, home: 850 },
        { name: 'الأغواط', office: 450, home: 950 },
        { name: 'أم البواقي', office: 450, home: 900 },
        { name: 'باتنة', office: 450, home: 850 },
        { name: 'بجاية', office: 450, home: 850 },
        { name: 'بسكرة', office: 450, home: 950 },
        { name: 'بشار', office: 450, home: 1200 },
        { name: 'البليدة', office: 450, home: 700 },
        { name: 'البويرة', office: 450, home: 700 },
        { name: 'تمنراست', office: 450, home: 1600 },
        { name: 'تبسة', office: 450, home: 900 },
        { name: 'تلمسان', office: 450, home: 850 },
        { name: 'تيارت', office: 450, home: 850 },
        { name: 'تيزي وزو', office: 450, home: 700 },
        { name: 'الجزائر (العاصمة)', office: 350, home: 500 },
        { name: 'الجلفة', office: 450, home: 950 },
        { name: 'جيجل', office: 450, home: 850 },
        { name: 'سطيف', office: 450, home: 850 },
        { name: 'سعيدة', office: 450, home: 900 },
        { name: 'سكيكدة', office: 450, home: 900 },
        { name: 'سيدي بلعباس', office: 450, home: 850 },
        { name: 'عنابة', office: 450, home: 850 },
        { name: 'قالمة', office: 450, home: 900 },
        { name: 'قسنطينة', office: 450, home: 850 },
        { name: 'المدية', office: 450, home: 800 },
        { name: 'مستغانم', office: 450, home: 850 },
        { name: 'المسيلة', office: 450, home: 850 },
        { name: 'معسكر', office: 450, home: 850 },
        { name: 'ورقلة', office: 450, home: 1000 },
        { name: 'وهران', office: 450, home: 850 },
        { name: 'البيض', office: 450, home: 1100 },
        { name: 'إليزي', office: 450, home: 1600 },
        { name: 'برج بوعريريج', office: 450, home: 850 },
        { name: 'بومرداس', office: 250, home: 500 },
        { name: 'الطارف', office: 450, home: 900 },
        { name: 'تندوف', office: 450, home: 1500 },
        { name: 'تيسمسيلت', office: 450, home: 850 },
        { name: 'الوادي', office: 450, home: 1000 },
        { name: 'خنشلة', office: 450, home: 900 },
        { name: 'سوق أهراس', office: 450, home: 900 },
        { name: 'تيبازة', office: 450, home: 700 },
        { name: 'ميلة', office: 450, home: 850 },
        { name: 'عين الدفلى', office: 450, home: 850 },
        { name: 'النعامة', office: 450, home: 1100 },
        { name: 'عين تموشنت', office: 450, home: 850 },
        { name: 'غرداية', office: 450, home: 1000 },
        { name: 'غليزان', office: 450, home: 850 },
        { name: 'تيميمون', office: null, home: 1500 },
        { name: 'أولاد جلال', office: 450, home: 1000 },
        { name: 'بني عباس', office: null, home: 1200 },
        { name: 'عين صالح', office: 800, home: 1600 },
        { name: 'عين قزام', office: null, home: 1600 },
        { name: 'تقرت', office: 450, home: 1000 },
        { name: 'جانت', office: 850, home: 1750 },
        { name: 'المغير', office: null, home: 1000 },
        { name: 'المنيعة', office: null, home: 1000 }
    ];

    // --- DOM Elements ---
    const shippingForm = document.getElementById('shipping-form');
    const fullNameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phone');
    const alternativePhoneInput = document.getElementById('alternativePhone');
    const wilayaSelect = document.getElementById('wilaya');
    const deliveryMethodRadios = document.querySelectorAll('input[name="deliveryMethod"]');
    const deliveryToOfficeRadio = document.getElementById('deliveryToOffice');
    const deliveryToHomeRadio = document.getElementById('deliveryToHome');
    const communeGroup = document.getElementById('commune-group');
    const communeInput = document.getElementById('commune');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const productsSubtotalElement = document.getElementById('products-subtotal');
    const deliveryPriceElement = document.getElementById('delivery-price');
    const orderGrandTotalElement = document.getElementById('order-grand-total');

    // --- Load Cart from localStorage ---
    let cart = JSON.parse(localStorage.getItem('qudwahCart')) || [];

    // --- State Variables ---
    let productsTotalPrice = 0;
    let currentDeliveryPrice = 0;
    let selectedWilayaData = null;
    let selectedDeliveryMethod = 'office'; // Default delivery method

    // Redirect if cart is empty
    if (cart.length === 0) {
        alert('سلة التسوق فارغة! الرجاء إضافة منتجات قبل إتمام الشراء.');
        window.location.href = 'cart.html';
        return;
    }

    // --- Functions ---

    // Function to update cart count in header
    const updateGlobalCartCount = () => {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            let totalItems = 0;
            cart.forEach(item => {
                totalItems += item.quantity;
            });
            cartCountElement.textContent = totalItems;
        }
    };

    // Populate Wilaya dropdown
    const populateWilayas = () => {
        wilayaPrices.forEach(wilaya => {
            const option = document.createElement('option');
            option.value = wilaya.name;
            option.textContent = wilaya.name;
            wilayaSelect.appendChild(option);
        });
    };

    // Calculate product subtotal
    const calculateProductsSubtotal = () => {
        productsTotalPrice = 0;
        cart.forEach(item => {
            productsTotalPrice += item.price * item.quantity;
        });
        productsSubtotalElement.textContent = `${productsTotalPrice.toLocaleString('ar-DZ')} د.ج`;
    };

    // Calculate and update delivery price and grand total
    const updateOrderTotals = () => {
        let currentTotal = productsTotalPrice;
        currentDeliveryPrice = 0;

        if (selectedWilayaData) {
            // Check if selected delivery method is available for the wilaya
            if (selectedDeliveryMethod === 'office' && selectedWilayaData.office === null) {
                alert(`التوصيل للمكتب غير متاح في ولاية ${selectedWilayaData.name}. سيتم تحويلك إلى التوصيل للمنزل.`);
                deliveryToHomeRadio.checked = true;
                selectedDeliveryMethod = 'home';
            }

            if (selectedDeliveryMethod === 'home') {
                currentDeliveryPrice = selectedWilayaData.home;
                communeGroup.style.display = 'block'; // Show commune field for home delivery
                communeInput.setAttribute('required', 'true');
            } else { // 'office'
                currentDeliveryPrice = selectedWilayaData.office;
                communeGroup.style.display = 'none'; // Hide commune field for office delivery
                communeInput.removeAttribute('required');
                communeInput.value = ''; // Clear commune input
            }
        } else {
            // No wilaya selected, hide commune field and set delivery price to 0
            communeGroup.style.display = 'none';
            communeInput.removeAttribute('required');
            communeInput.value = '';
        }

        currentTotal += currentDeliveryPrice;
        deliveryPriceElement.textContent = `${currentDeliveryPrice.toLocaleString('ar-DZ')} د.ج`;
        orderGrandTotalElement.textContent = `${currentTotal.toLocaleString('ar-DZ')} د.ج`;
    };


    // Send data to Discord webhook
    const sendToDiscordWebhook = async (order) => {
        const orderItemsList = order.items.map(item =>
            `  - ${item.name} (${item.color}, ${item.size}) x ${item.quantity} | ${item.price.toLocaleString('ar-DZ')} د.ج/قطعة`
        ).join('\n');

        const embedColor = 0x28A745; // Green color for successful order
        const timestamp = new Date().toISOString();

        const webhookPayload = {
            username: "QUDWAH Order Bot",
            avatar_url: "https://i.imgur.com/your_store_logo.png", // Replace with your store logo/bot avatar URL
            embeds: [
                {
                    title: `✨ طلب جديد رقم ${order.id} ✨`,
                    color: embedColor,
                    description: "تفاصيل طلبية جديدة من متجر QUDWAH.",
                    fields: [
                        { name: "👤 الاسم الكامل", value: order.shippingInfo.fullName, inline: true },
                        { name: "📞 رقم الهاتف الأساسي", value: order.shippingInfo.phone, inline: true },
                        { name: "📱 رقم احتياطي", value: order.shippingInfo.alternativePhone || "لا يوجد", inline: true },
                        { name: "📍 الولاية", value: order.shippingInfo.wilaya, inline: true },
                        { name: "🚚 طريقة التوصيل", value: order.shippingInfo.deliveryMethod === 'home' ? `للمنزل (البلدية: ${order.shippingInfo.commune || 'غير محدد'})` : 'للمكتب', inline: true },
                        { name: "📏 الطول", value: order.shippingInfo.height ? `${order.shippingInfo.height} سم` : "غير محدد", inline: true },
                        { name: "⚖️ الوزن", value: order.shippingInfo.weight ? `${order.shippingInfo.weight} كجم` : "غير محدد", inline: true },
                        { name: "📦 المنتجات المطلوبة", value: orderItemsList, inline: false },
                        { name: "💰 مجموع المنتجات", value: `${order.productsTotal.toLocaleString('ar-DZ')} د.ج`, inline: true },
                        { name: "🛵 سعر التوصيل", value: `${order.deliveryCost.toLocaleString('ar-DZ')} د.ج`, inline: true },
                        { name: "💵 الإجمالي الكلي", value: `${order.totalAmount.toLocaleString('ar-DZ')} د.ج`, inline: true },
                        { name: "💳 طريقة الدفع", value: "الدفع عند الاستلام", inline: true },
                        { name: "⏳ حالة الطلب", value: order.status, inline: true }
                    ],
                    timestamp: timestamp,
                    footer: {
                        text: "QUDWAH Store Order System",
                        icon_url: "https://i.imgur.com/your_store_logo.png" // Replace with your store logo URL
                    }
                }
            ]
        };

        try {
            const response = await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(webhookPayload),
            });

            if (!response.ok) {
                console.error('Failed to send webhook:', response.status, response.statusText);
                alert(`حدث خطأ أثناء إرسال الطلب (${response.status}). الرجاء المحاولة مرة أخرى أو الاتصال بالدعم.`);
                return false;
            }
            console.log('Webhook sent successfully!');
            return true;
        } catch (error) {
            console.error('Error sending webhook:', error);
            alert('حدث خطأ في الاتصال. الرجاء التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.');
            return false;
        }
    };


    // --- Event Listeners and Initial Setup ---

    // Populate wilayas on page load
    populateWilayas();

    // Initial calculation of product subtotal
    calculateProductsSubtotal();
    
    // Set initial delivery method based on radio checked state
    if (deliveryToHomeRadio.checked) {
        selectedDeliveryMethod = 'home';
    } else { // default to office
        selectedDeliveryMethod = 'office';
    }
    updateOrderTotals(); // Initial update of totals (important to show initial delivery price)


    // Event listener for wilaya selection change
    wilayaSelect.addEventListener('change', () => {
        const selectedWilayaName = wilayaSelect.value;
        selectedWilayaData = wilayaPrices.find(w => w.name === selectedWilayaName);
        updateOrderTotals();
    });

    // Event listener for delivery method change
    deliveryMethodRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            selectedDeliveryMethod = event.target.value;
            updateOrderTotals();
        });
    });

    // Form submission
    shippingForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Basic validation
        if (!fullNameInput.value.trim()) {
            alert('الرجاء إدخال الاسم الكامل.');
            return;
        }
        if (!phoneInput.value.trim()) {
            alert('الرجاء إدخال رقم الهاتف الأساسي.');
            return;
        }
        if (phoneInput.value.trim().length < 9 || !/^\d+$/.test(phoneInput.value.trim())) { // At least 9 digits, digits only
             alert('رقم الهاتف الأساسي غير صحيح. الرجاء إدخال 9 أرقام على الأقل.');
             return;
        }
        if (alternativePhoneInput.value.trim() && (alternativePhoneInput.value.trim().length < 9 || !/^\d+$/.test(alternativePhoneInput.value.trim()))) {
            alert('رقم الهاتف الاحتياطي غير صحيح. الرجاء إدخال 9 أرقام على الأقل أو تركه فارغًا.');
            return;
        }

        if (!wilayaSelect.value) {
            alert('الرجاء اختيار الولاية.');
            return;
        }

        if (selectedDeliveryMethod === 'home' && !communeInput.value.trim()) {
            alert('الرجاء إدخال اسم البلدية للتوصيل إلى المنزل.');
            return;
        }

        if (heightInput.value && (parseInt(heightInput.value) < 1 || parseInt(heightInput.value) > 300 || isNaN(parseInt(heightInput.value)))) {
            alert('الرجاء إدخال طول صحيح بين 1 و 300 سم.');
            return;
        }
        if (weightInput.value && (parseInt(weightInput.value) < 1 || parseInt(weightInput.value) > 300 || isNaN(parseInt(weightInput.value)))) {
            alert('الرجاء إدخال وزن صحيح بين 1 و 300 كجم.');
            return;
        }
        
        // Ensure wilaya and delivery method are correctly set before order creation
        if (!selectedWilayaData) {
            // This should ideally not happen if Wilaya select is required, but as a safeguard
            alert('الرجاء اختيار ولاية صالحة قبل تأكيد الطلب.');
            return;
        }


        // Construct shipping information
        const shippingInfo = {
            fullName: fullNameInput.value.trim(),
            phone: phoneInput.value.trim(),
            alternativePhone: alternativePhoneInput.value.trim() || 'لا يوجد',
            wilaya: wilayaSelect.value,
            deliveryMethod: selectedDeliveryMethod,
            commune: selectedDeliveryMethod === 'home' ? communeInput.value.trim() : 'غير قابل للتطبيق',
            height: heightInput.value ? parseInt(heightInput.value) : null,
            weight: weightInput.value ? parseInt(weightInput.value) : null,
            paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value // Always cashOnDelivery for now
        };

        // Construct the full order object
        const order = {
            id: 'ORD-' + Date.now(),
            date: new Date().toLocaleString('ar-DZ', { timeZone: 'Africa/Algiers' }),
            shippingInfo: shippingInfo,
            items: cart,
            productsTotal: productsTotalPrice,
            deliveryCost: currentDeliveryPrice,
            totalAmount: productsTotalPrice + currentDeliveryPrice,
            status: 'Pending'
        };

        // Attempt to send to Discord
        const webhookSent = await sendToDiscordWebhook(order);

        if (webhookSent) {
            // Save the order to localStorage (optional, for history or admin panel)
            let allOrders = JSON.parse(localStorage.getItem('qudwahOrders')) || [];
            allOrders.push(order);
            localStorage.setItem('qudwahOrders', JSON.stringify(allOrders));

            // Clear the cart after placing the order
            localStorage.removeItem('qudwahCart');
            cart = [];
            updateGlobalCartCount(); // Update header count to 0

            // Redirect to confirmation page (create this next)
            alert('تم تأكيد طلبك بنجاح! سيتم إعادة توجيهك للصفحة الرئيسية.');
            window.location.href = 'index.html';
        } else {
            // If webhook failed, alert was already shown by sendToDiscordWebhook
            // Do not clear cart or redirect, allow user to retry
        }
    });

    // Optional: Load saved info if available from previous session (user convenience)
    const savedInfo = JSON.parse(localStorage.getItem('qudwahShippingInfo'));
    if (savedInfo) {
        fullNameInput.value = savedInfo.fullName || '';
        phoneInput.value = savedInfo.phone || '';
        alternativePhoneInput.value = savedInfo.alternativePhone || '';
        heightInput.value = savedInfo.height || '';
        weightInput.value = savedInfo.weight || '';
        
        if (savedInfo.wilaya) {
            wilayaSelect.value = savedInfo.wilaya;
            selectedWilayaData = wilayaPrices.find(w => w.name === savedInfo.wilaya);
        }

        if (savedInfo.deliveryMethod === 'home') {
            deliveryToHomeRadio.checked = true;
            selectedDeliveryMethod = 'home';
            communeInput.value = savedInfo.commune || '';
        } else { // default to office
            deliveryToOfficeRadio.checked = true;
            selectedDeliveryMethod = 'office';
        }
        updateOrderTotals(); // Recalculate totals based on loaded info
    } else {
        // Ensure initial calculation runs even if no saved info
        calculateProductsSubtotal();
        updateOrderTotals();
    }


    // Save info to localStorage on input change (for user convenience, to persist inputs if they leave)
    const saveInfoOnInput = () => {
        const currentInfo = {
            fullName: fullNameInput.value.trim(),
            phone: phoneInput.value.trim(),
            alternativePhone: alternativePhoneInput.value.trim(),
            wilaya: wilayaSelect.value,
            deliveryMethod: selectedDeliveryMethod, // Ensure this reflects current radio selection
            commune: communeInput.value.trim(),
            height: heightInput.value ? parseInt(heightInput.value) : null,
            weight: weightInput.value ? parseInt(weightInput.value) : null
        };
        localStorage.setItem('qudwahShippingInfo', JSON.stringify(currentInfo));
    };

    // Attach saveInfoOnInput to relevant input changes
    fullNameInput.addEventListener('input', saveInfoOnInput);
    phoneInput.addEventListener('input', saveInfoOnInput);
    alternativePhoneInput.addEventListener('input', saveInfoOnInput);
    wilayaSelect.addEventListener('change', saveInfoOnInput);
    deliveryMethodRadios.forEach(radio => radio.addEventListener('change', () => {
        selectedDeliveryMethod = radio.value; // Update selectedDeliveryMethod when radio changes
        saveInfoOnInput();
    }));
    communeInput.addEventListener('input', saveInfoOnInput);
    heightInput.addEventListener('input', saveInfoOnInput);
    weightInput.addEventListener('input', saveInfoOnInput);
});
