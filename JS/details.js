window.onload = function() {
    const productName = localStorage.getItem('productName');
    const productImg = localStorage.getItem('productImg');
    const productPrice = localStorage.getItem('productPrice');
    const productId = localStorage.getItem('productId'); 

    if (productName && productImg && productPrice && productId) {
        document.getElementById('product-title').textContent = productName;
        document.getElementById('product-img').src = productImg;
        document.getElementById('product-price').textContent = productPrice;

        const cartButton = document.querySelector('.btn-cart');
        cartButton.setAttribute('data-id', productId);

    } else {
        Swal.fire({
            icon: 'error',
            title: 'حدث خطأ',
            text: 'حدث خطأ في تحميل بيانات المنتج.',
            confirmButtonText: 'حسناً',
        }).then(() => {
            window.location.href = 'index.html'; 
        });
    }
};

window.addEventListener("load", function () {
    setTimeout(() => {
        document.querySelector(".loader").style.display = "none";
    }, 800);

    const addedItems = JSON.parse(localStorage.getItem("addedItems")) || [];

    addedItems.forEach(productId => {
        const button = document.querySelector(`.btn.btn-cart[data-id="${productId}"]`);
        if (button) {
            button.classList.add("active");
            button.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> تمت الإضافة`;
        }
    });

    updateCart(); // تحديث السلة
});

document.querySelectorAll(".btn.btn-cart").forEach(button => {
    button.addEventListener("click", function () {
        const productId = this.getAttribute("data-id");

        // تحقق من قيمة data-id
        if (productId) {
            console.log("تم استلام data-id:", productId); // ستظهر في الـ console
        } else {
            console.log("لم يتم استلام data-id");
        }

        const productName = document.getElementById("product-title").textContent;
        const productImg = document.getElementById("product-img").src;
        const productPrice = parseFloat(
            document.getElementById("product-price").textContent.replace(' ر.س', '').trim()
        );

        const selectedProduct = {
            id: productId,
            name: productName,
            img: productImg,
            price: productPrice,
            quantity: 1
        };

        addToCart(selectedProduct);

        // تحديث السلة المخزنة في localStorage
        const addedItems = JSON.parse(localStorage.getItem("addedItems")) || [];
        if (!addedItems.includes(productId)) {
            addedItems.push(productId);
            localStorage.setItem("addedItems", JSON.stringify(addedItems));
        }

        this.classList.add("active");
        this.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> تمت الإضافة`;
    });
});

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const productIndex = cart.findIndex(item => item.id === product.id);

    if (productIndex === -1) {
        cart.push(product);
    } else {
        cart[productIndex].quantity += 1;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

function updateCart() {
    const cartItemsContainer = document.getElementById("cart_items");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    let total_Price = 0;
    let total_count = 0;

    cartItemsContainer.innerHTML = "";

    cart.forEach((item, index) => {
        let total_Price_item = item.price * item.quantity;

        total_Price += total_Price_item;
        total_count += item.quantity;

        cartItemsContainer.innerHTML += `
            <div class="item_cart">
                <img src="${item.img}" alt="">
                <div class="content">
                    <h4>${item.name}</h4>
                    <p class="price_cart">${total_Price_item.toFixed(2)} ر.س</p>
                    <div class="quantity_control">
                        <button class="decrease_quantity" data-index="${index}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="increase_quantity" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="delete_item" data-index="${index}">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
    });

    document.querySelector(".price_cart_toral").innerHTML = `${total_Price.toFixed(2)} ر.س`;
    document.querySelector(".Count_item_cart").innerHTML = total_count;
    document.querySelector(".count_item_header").innerHTML = total_count;

    setupCartButtons();
}

function setupCartButtons() {
    document.querySelectorAll(".increase_quantity").forEach(button => {
        button.addEventListener("click", function () {
            const itemIndex = this.getAttribute("data-index");
            increaseQuantity(itemIndex);
        });
    });

    document.querySelectorAll(".decrease_quantity").forEach(button => {
        button.addEventListener("click", function () {
            const itemIndex = this.getAttribute("data-index");
            decreaseQuantity(itemIndex);
        });
    });

    document.querySelectorAll(".delete_item").forEach(button => {
        button.addEventListener("click", function () {
            const itemIndex = this.getAttribute("data-index");
            removeFromCart(itemIndex);
        });
    });
}

function increaseQuantity(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart[index].quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

function decreaseQuantity(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
    }
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const removedItem = cart.splice(index, 1)[0];
    localStorage.setItem("cart", JSON.stringify(cart));

    const addedItems = JSON.parse(localStorage.getItem("addedItems")) || [];
    const itemIndex = addedItems.indexOf(removedItem.id);
    if (itemIndex !== -1) {
        addedItems.splice(itemIndex, 1);
        localStorage.setItem("addedItems", JSON.stringify(addedItems));
    }

    updateCart();
    updateButtonsState(removedItem.id);
}

function updateButtonsState(productId) {
    document.querySelectorAll(`.btn.btn-cart[data-id="${productId}"]`).forEach(button => {
        button.classList.remove("active");
        button.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> أضف إلى السلة`;
    });
}

updateCart();


