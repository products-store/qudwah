document.addEventListener('DOMContentLoaded', () => {
    // --- Product Data Definition ---
    // Contains all product details including image paths and pricing.
    const productDetails = {
        name: "T-shirt Oversize",
        price: 2900, // Price in DZD
        imagePrefix: "images/product-", // To easily construct image paths
        colors: {
            'black': {
                name: 'أسود', // User-friendly name
                main: 'images/black-1.JPG',
                thumbnails: [
                    'images/black-1.JPG',
                    'images/black-2.JPG',
                    'images/black-3.JPG'
                ],
                availableSizes: ['S', 'M', 'L', 'XL', 'XS'] // XS only for black
            },
            'dark-gray': {
                name: 'رمادي داكن', // User-friendly name
                main: 'images/grey-1.JPG',
                thumbnails: [
                    'images/grey-1.JPG',
                    'images/grey-2.JPG',
                    'images/grey-1.JPG'
                ],
                availableSizes: ['S', 'M', 'L', 'XL']
            },
            'light-gray': {
                name: 'رمادي فاتح', // User-friendly name
                main: 'images/white-1.JPG',
                thumbnails: [
                    'images/white-1.JPG',
                    'images/white-2.JPG',
                    'images/white-3.JPG'
                ],
                availableSizes: ['S', 'M', 'L', 'XL']
            }
        }
    };

    // --- DOM Elements ---
    const mainProductImage = document.getElementById('main-product-image');
    const thumbnailImages = document.querySelectorAll('.thumbnail-images img');
    const colorButtons = document.querySelectorAll('.color-btn');
    const sizeButtons = document.querySelectorAll('.size-btn');
    const quantityInput = document.querySelector('.quantity-input');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const buyNowBtn = document.querySelector('.buy-now-btn');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const cartCountElement = document.querySelector('.cart-count');


    // --- State Variables ---
    let selectedColor = 'black'; // Default selected color
    let selectedSize = 'S';     // Default selected size
    let cart = JSON.parse(localStorage.getItem('qudwahCart')) || []; // Load cart from localStorage


    // --- Functions ---

    // Function to update main image and thumbnails based on color
    const updateProductDisplay = (color) => {
        const colorData = productDetails.colors[color];
        if (!colorData) return;

        // Update main image
        mainProductImage.src = colorData.main;

        // Update thumbnails
        thumbnailImages.forEach((thumb, index) => {
            if (colorData.thumbnails[index]) {
                thumb.src = colorData.thumbnails[index];
                thumb.style.display = 'block';
            } else {
                thumb.style.display = 'none';
            }
            thumb.classList.remove('active'); // Remove active from all thumbnails
        });
        if (thumbnailImages.length > 0) {
            thumbnailImages[0].classList.add('active'); // Set first thumbnail as active for new color
        }

        // Update active color button
        colorButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.color === color) {
                btn.classList.add('active');
            }
        });

        // Update available sizes
        sizeButtons.forEach(btn => {
            const size = btn.dataset.size;
            if (colorData.availableSizes.includes(size)) {
                btn.removeAttribute('disabled');
                btn.classList.remove('disabled');
            } else {
                btn.setAttribute('disabled', 'true');
                btn.classList.add('disabled');
                btn.classList.remove('active'); // Deactivate if not available
            }
        });

        // If the currently selected size is no longer available for the new color,
        // default back to 'S' (or the first available size).
        if (!colorData.availableSizes.includes(selectedSize)) {
            selectedSize = colorData.availableSizes[0] || 'S'; // Fallback to 'S' or first available
            sizeButtons.forEach(btn => btn.classList.remove('active')); // Remove all active size buttons
            const defaultSizeBtn = document.querySelector(`.size-btn[data-size="${selectedSize}"]`);
            if (defaultSizeBtn) {
                defaultSizeBtn.classList.add('active');
            }
        }
    };

    // Function to update cart count in header across all pages
    const updateGlobalCartCount = () => {
        let totalItems = 0;
        cart.forEach(item => {
            totalItems += item.quantity;
        });
        cartCountElement.textContent = totalItems;
    };

    // Function to save cart to localStorage
    const saveCartToLocalStorage = () => {
        localStorage.setItem('qudwahCart', JSON.stringify(cart));
    };


    // --- Event Listeners ---

    // Thumbnail Images
    thumbnailImages.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbnailImages.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            mainProductImage.src = thumb.src;
        });
    });

    // Color Buttons
    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const color = button.dataset.color;
            selectedColor = color;
            updateProductDisplay(color);
        });
    });

    // Size Buttons
    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!button.hasAttribute('disabled')) {
                sizeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                selectedSize = button.dataset.size;
            }
        });
    });

    // Quantity Control
    minusBtn.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    plusBtn.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });

    quantityInput.addEventListener('change', () => {
        if (parseInt(quantityInput.value) < 1 || isNaN(parseInt(quantityInput.value))) {
            quantityInput.value = 1;
        }
    });

    // Hamburger Menu Logic
    hamburgerMenu.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from bubbling up
        mobileNavOverlay.classList.toggle('active'); // Simply toggle active class on the overlay
    });

    // Close mobile nav when clicking on an overlay link
    mobileNavOverlay.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNavOverlay.classList.remove('active');
        });
    });

    // Close mobile nav if a click occurs outside of the nav links
    document.addEventListener('click', (event) => {
        // If the mobile nav is active AND the click was NOT on the hamburger button AND NOT inside the mobile nav overlay
        if (mobileNavOverlay.classList.contains('active') &&
            !hamburgerMenu.contains(event.target) &&
            !mobileNavOverlay.contains(event.target)) {
            mobileNavOverlay.classList.remove('active');
        }
    });

    // Close mobile nav when pressing the Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mobileNavOverlay.classList.contains('active')) {
            mobileNavOverlay.classList.remove('active');
        }
    });


    // Add to Cart Logic
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        const productId = `${selectedColor}-${selectedSize}`; // Unique ID for the product in the cart

        // Get user-friendly color name
        const userFriendlyColor = productDetails.colors[selectedColor].name;

        // Check if the item already exists in the cart
        const existingItemIndex = cart.findIndex(item => item.id === productId);

        if (existingItemIndex > -1) {
            // Update quantity of existing item
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item to cart
            const newItem = {
                id: productId,
                name: productDetails.name,
                color: userFriendlyColor, // Use user-friendly name
                size: selectedSize,
                price: productDetails.price,
                quantity: quantity,
                image: productDetails.colors[selectedColor].main // Use main image for cart
            };
            cart.push(newItem);
        }

        saveCartToLocalStorage(); // Save updated cart
        updateGlobalCartCount(); // Update the cart count in the header
        alert(`تم إضافة ${quantity} قطعة من المنتج إلى السلة!`);
    });

    // Buy Now Logic (Redirects to cart.html after adding to cart)
    buyNowBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        const productId = `${selectedColor}-${selectedSize}`;
        const userFriendlyColor = productDetails.colors[selectedColor].name;

        const existingItemIndex = cart.findIndex(item => item.id === productId);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            const newItem = {
                id: productId,
                name: productDetails.name,
                color: userFriendlyColor,
                size: selectedSize,
                price: productDetails.price,
                quantity: quantity,
                image: productDetails.colors[selectedColor].main
            };
            cart.push(newItem);
        }

        saveCartToLocalStorage();
        updateGlobalCartCount();
        window.location.href = 'cart.html'; // Navigate to cart page
    });


    // --- Initialization ---
    // Initial display of product details based on default color
    updateProductDisplay(selectedColor);
    // Initial update of cart count when any page loads
    updateGlobalCartCount();
});












