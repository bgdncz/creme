// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails

const productGrid = document.querySelector("#product-grid");
const loginBtn = document.querySelector("#login-btn");
const productOverlay = document.querySelector("#product-overlay");
const closeBtn = document.querySelector(".close");
const addBtn = document.querySelector("#add-btn");
const reviewContainer = document.querySelector("#review-container")
let loggedIn = false;

function createProduct(product) {
    const productDiv = document.createElement("div");
    productDiv.className = "product";
    productDiv.dataset.productId = product.id;
    productDiv.innerHTML = `
        <img src=${product.img_url}/>
        <div class="extra-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
        </div>
    `
    productDiv.addEventListener("click", showProduct);
    productGrid.appendChild(productDiv);
}

fetch("/products").then(res => res.json()).then(products => {
    products.forEach(product => {
        createProduct(product);
    });
});

function handleLogin(clickEvent) {
    if (!loggedIn) {
        loginBtn.style.transition = "none";
        loginBtn.textContent = "Bogdan";
        loginBtn.style.mask = "none";
        loginBtn.style.background = "transparent";
        addBtn.style.display = "block";
        loggedIn = true;
    }
}

function handleAdd(clickEvent) {
    productOverlay.className = "open";
}

async function getUser(userId) {
    const res = await fetch(`/users/${userId}`);
    const user = await res.json();
    return user;
}

function makeReview(review) {
    getUser(review["user_id"]).then(user => {
        const reviewDiv = document.createElement("div");
        reviewDiv.innerHTML = `
            <img src="${user.profile_img}" class="profile-pic"><p>${review.content}</p>
        `
        reviewContainer.appendChild(reviewDiv);
    });
}

function showProduct(clickEvent) {
    const productId = this.dataset.productId;
        fetch(`/products/${productId}`).then(res => res.json()).then(product => {
            productOverlay.className = "open";
            productOverlay.children[1].src = product.img_url;
            productOverlay.children[2].textContent = product.name;
            productOverlay.children[3].textContent = product.description;
            reviewContainer.innerHTML = "";
            product.reviews.forEach(makeReview);
        });
}

function closeOverlay() {
    productOverlay.className = "";
}

loginBtn.addEventListener("click", handleLogin);
addBtn.addEventListener("click", handleAdd);
closeBtn.addEventListener("click", closeOverlay);