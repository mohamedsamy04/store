let cart = JSON.parse(localStorage.getItem("cart"));

if (!Array.isArray(cart)) {
    cart = []; 
}

window.addEventListener("load", function () {
    setTimeout(function () {
        document.querySelector(".loader").style.display = "none";
    }, 600);

    const addedItems = JSON.parse(localStorage.getItem("addedItems")) || [];
    addedItems.forEach(productId => {
        const button = document.querySelector(`.btn_add_cart[data-id="${productId}"]`);
        if (button) {
            button.classList.add("active");
            button.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> تمت الإضافة`;
        }
    });

    updateCart();
});

let category_nav_list = document.querySelector(".category_nav_list");

function Open_Categ_list() {
    category_nav_list.classList.toggle("active");
}

let nav_links = document.querySelector(".nav_links");

function open_Menu() {
    nav_links.classList.toggle("active");
}

var cartElement = document.querySelector(".cart");

function open_close_cart() {
    cartElement.classList.toggle("active");
}

const addToCartButtons = document.querySelectorAll(".btn_add_cart");

addToCartButtons.forEach(button => {
    button.addEventListener("click", function (event) {
        const product = this.closest(".product");

        const productId = this.getAttribute("data-id");
        const productName = product.querySelector(".name_product a").textContent;
        const productImg = product.querySelector(".img_product img").src;
        const productPrice = parseFloat(product.querySelector(".price span").textContent);

        const selectedProduct = {
            id: productId,
            name: productName,
            img: productImg,
            price: productPrice,
            quantity: 1
        };

        addToCart(selectedProduct);

        const addedItems = JSON.parse(localStorage.getItem("addedItems")) || [];
        if (!addedItems.includes(productId)) {
            addedItems.push(productId);
            localStorage.setItem("addedItems", JSON.stringify(addedItems));
        }

        updateButtonsState(productId);
        this.classList.add('active');
        this.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> تمت الإضافة`;
    });
});

function addToCart(product) {
    // استخدم cart المشتركة هنا
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
                    <p class="price_cart">ر.س${total_Price_item.toFixed(2)}</p>
                    <div class="quantity_control">
                        <button class="decrease_quantity" data-index="${index}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="Increase_quantity" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="delete_item" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;
    });

    document.querySelector(".price_cart_toral").innerHTML = `ر.س${total_Price.toFixed(2)}`;
    document.querySelector(".Count_item_cart").innerHTML = total_count;
    document.querySelector(".count_item_header").innerHTML = total_count;

    setupCartButtons();
}

function setupCartButtons() {
    const increaseButtons = document.querySelectorAll(".Increase_quantity");
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
    cart[index].quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
    }
}

function removeFromCart(index) {
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
    const allMatchingButtons = document.querySelectorAll(`.btn_add_cart[data-id="${productId}"]`);
    allMatchingButtons.forEach(button => {
        button.classList.remove("active");
        button.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> أضف إلى السلة`;
    });
}

updateCart();

document.querySelectorAll('.product-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const product = this.closest('.product');  

        const productName = product.querySelector('.name_product a').textContent;
        const productImg = product.querySelector('.img_product img').src;
        const productPrice = product.querySelector('.price span').textContent;
        
        const productId = product.querySelector('.btn_add_cart').getAttribute('data-id');

        localStorage.setItem('productName', productName);
        localStorage.setItem('productImg', productImg);
        localStorage.setItem('productPrice', productPrice);
        localStorage.setItem('productId', productId); 
    });
});

function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}
const slider = document.getElementById('reviewsSlider');
const dotsContainer = document.getElementById('dots');
const reviews = document.querySelectorAll('.review');
let currentIndex = 0;

// Create dots
reviews.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
        currentIndex = index;
        updateSlider();
    });
    dotsContainer.appendChild(dot);
});

const updateSlider = () => {
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
};

setInterval(() => {
    currentIndex = (currentIndex + 1) % reviews.length;
    updateSlider();
}, 3000);

