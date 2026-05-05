document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('bookingForm');
    const checkIn = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');
    const roomType = document.getElementById('roomType');
    const mealType = document.getElementById('mealType');

    const nightsCount = document.getElementById('nightsCount');
    const mealSummary = document.getElementById('mealSummary');
    const oldPriceDisplay = document.getElementById('oldPrice');
    const totalPrice = document.getElementById('totalPrice');
    const discountItem = document.getElementById('discountItem');
    const discountValueDisplay = document.getElementById('discountValue');

    const promoInput = document.getElementById('promoCode');
    const applyBtn = document.getElementById('applyPromo');
    const promoMsg = document.getElementById('promoMessage');
    const toast = document.getElementById('toast');

    let appliedDiscountPercent = 0;

    function validateDates() {
        if (!checkIn || !checkOut) return true;
        const arrival = new Date(checkIn.value);
        const departure = new Date(checkOut.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkIn.value && arrival < today) {
            alert("Дата заезда не может быть в прошлом!");
            checkIn.value = "";
            return false;
        }

        if (checkIn.value && checkOut.value && departure <= arrival) {
            alert("Дата выезда должна быть позже даты заезда!");
            checkOut.value = "";
            return false;
        }
        return true;
    }

    function calculateTotal() {
        if (!checkIn || !checkOut || !roomType || !mealType) return;
        
        if (!validateDates()) {
            if (nightsCount) nightsCount.innerText = '0';
            if (totalPrice) totalPrice.innerText = '0 BYN';
            if (oldPriceDisplay) oldPriceDisplay.style.display = 'none';
            if (discountItem) discountItem.style.display = 'none';
            return;
        }

        if (!checkIn.value || !checkOut.value) return;

        const date1 = new Date(checkIn.value);
        const date2 = new Date(checkOut.value);
        const priceRoom = parseInt(roomType.value) || 0;
        const priceMeal = parseInt(mealType.value) || 0;

        const diffDays = Math.ceil(Math.abs(date2 - date1) / (1000 * 3600 * 24));
        let totalBase = diffDays * (priceRoom + priceMeal);

        let autoDiscount = (diffDays >= 7) ? 0.30 : 0;
        let finalPercent = Math.max(autoDiscount, appliedDiscountPercent);

        if (mealSummary && mealType) {
            const mealText = mealType.options[mealType.selectedIndex].text;
            mealSummary.innerText = mealText.split(' —')[0].split(' (')[0];
        }

        if (nightsCount) nightsCount.innerText = diffDays;

        if (finalPercent > 0) {
            let discountSum = totalBase * finalPercent;
            let finalSum = totalBase - discountSum;

            if (oldPriceDisplay) {
                oldPriceDisplay.innerText = Math.round(totalBase) + ' BYN';
                oldPriceDisplay.style.display = 'block';
            }
            if (totalPrice) totalPrice.innerText = Math.round(finalSum) + ' BYN';
            if (discountItem) discountItem.style.display = 'flex';
            if (discountValueDisplay) discountValueDisplay.innerText = '-' + Math.round(discountSum) + ' BYN';
        } else {
            if (oldPriceDisplay) oldPriceDisplay.style.display = 'none';
            if (totalPrice) totalPrice.innerText = Math.round(totalBase) + ' BYN';
            if (discountItem) discountItem.style.display = 'none';
        }
    }

    if (checkIn && checkOut && roomType && mealType) {
        [checkIn, checkOut, roomType, mealType].forEach(el => {
            if (el) el.addEventListener('change', calculateTotal);
        });
    }

    if (applyBtn && promoInput && promoMsg) {
        applyBtn.addEventListener('click', () => {
            const code = promoInput.value.trim().toUpperCase();
            const arrivalDate = new Date(checkIn.value);
            const today = new Date();
            const daysToArrival = Math.ceil((arrivalDate - today) / (1000 * 3600 * 24));

            if (code === 'EARLY20') {
                if (daysToArrival >= 30) {
                    appliedDiscountPercent = 0.20;
                    promoMsg.innerText = "✓ Промокод применен (-20%)";
                    promoMsg.style.color = "#27ae60";
                } else {
                    promoMsg.innerText = "✕ Нужно бронировать минимум за 30 дней";
                    promoMsg.style.color = "#e74c3c";
                    appliedDiscountPercent = 0;
                }
            } else if (code === 'ROMANCE') {
                appliedDiscountPercent = 0.15;
                promoMsg.innerText = "✓ Скидка 15% за романтик!";
                promoMsg.style.color = "#b08d57";
            } else {
                promoMsg.innerText = "✕ Неверный код";
                promoMsg.style.color = "#e74c3c";
                appliedDiscountPercent = 0;
            }
            calculateTotal();
        });
    }

    const subscribeForm = document.querySelector('.main-footer form');
    if (subscribeForm && toast) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = subscribeForm.querySelector('input').value;
            if (email) {
                toast.innerHTML = `<i class="fas fa-check-circle"></i> Успешно! Письмо отправлено на ${email}`;
                toast.classList.add('active');
                subscribeForm.reset();
                setTimeout(() => toast.classList.remove('active'), 4000);
            }
        });
    }

    if (bookingForm && checkIn && checkOut && toast) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!checkIn.value || !checkOut.value) {
                alert("Пожалуйста, выберите даты!");
                return;
            }
            toast.innerHTML = `<i class="fas fa-check-circle"></i> Бронирование успешно оформлено!`;
            toast.classList.add('active');
            setTimeout(() => {
                toast.classList.remove('active');
                window.location.href = 'index.html';
            }, 3000);
        });
    }

    // ========== АКТИВНЫЕ ССЫЛКИ ==========
    const currentUrl = window.location.pathname.split("/").pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentUrl) {
            link.classList.add('active');
        }
    });

    // ========== БУРГЕР-МЕНЮ ==========
    let burger = document.querySelector('.burger');
    
    if (!burger) {
        burger = document.createElement('button');
        burger.className = 'burger';
        burger.innerHTML = '<span></span><span></span><span></span>';
        const navFlex = document.querySelector('.main-header .nav-flex');
        if (navFlex) navFlex.appendChild(burger);
    }
    
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }
    
    const navMenu = document.querySelector('.nav-menu');

    if (navMenu && !navMenu.querySelector('.mobile-booking-btn')) {
        const bookingLi = document.createElement('li');
        bookingLi.className = 'mobile-booking-btn';
        bookingLi.innerHTML = '<a href="booking.html">Забронировать</a>';
        navMenu.appendChild(bookingLi);
    }
    
    function toggleMenu() {
        if (!burger || !navMenu || !overlay) return;
        burger.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('menu-open', navMenu.classList.contains('active'));
    }
    
    function closeMenu() {
        if (!burger || !navMenu || !overlay) return;
        burger.classList.remove('active');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
    
    if (burger && navMenu) {
        burger.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', closeMenu);
        
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
});