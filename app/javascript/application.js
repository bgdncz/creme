// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails

const productGrid = document.querySelector("#product-grid");
const loginBtn = document.querySelector("#login-btn");
const productOverlay = document.querySelector("#product-overlay");
const newProductOverlay = document.querySelector("#new-product-overlay");
const closeBtns = document.querySelectorAll(".close");
const addBtn = document.querySelector("#add-btn");
const reviewContainer = document.querySelector("#review-container");
const newProductForm = document.querySelector("#new-product-form");
const fileInput = document.querySelector("#file");
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
    newProductOverlay.classList.add("open");
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
            productOverlay.classList.add("open");
            productOverlay.children[1].src = product.img_url;
            productOverlay.children[2].textContent = product.name;
            productOverlay.children[3].textContent = product.description;
            reviewContainer.innerHTML = "";
            product.reviews.forEach(makeReview);
        });
}

function closeOverlay() {
    const openOverlay = document.querySelector(".open");
    openOverlay.classList.remove("open");
}

function handleNewProduct(submitEvent) {
    submitEvent.preventDefault();
    var data = new FormData();
    data.append('name', newProductForm.name.value);
    data.append('link', newProductForm.link.value);
    data.append('description', newProductForm.description.value);
    data.append('price', newProductForm.price.value);
    data.append('img', fileInput.files[0]);
    fetch('/products', {
        method: 'POST',
        body: data
    }).then(res => res.json()).then(createProduct);
    closeOverlay();
    clearForm();
}

function clearForm() {
    newProductForm.name.value = "";
    newProductForm.link.value = "";
    newProductForm.description.value = "";
    newProductForm.price.value = "";
    newProductForm.file.value = "";
    const label = document.querySelector(".image-input label");
    label.classList.remove("uploaded-image");
    label.style.backgroundImage = "";
}

function handleImageUpload(event) {
    const reader = new FileReader();
    reader.addEventListener("load", e => {
        const label = document.querySelector(".image-input label");
        label.classList.add("uploaded-image");
        label.style.backgroundImage = 'url(' + e.target.result + ')';
    });
    reader.readAsDataURL(this.files[0]);
}

loginBtn.addEventListener("click", handleLogin);
addBtn.addEventListener("click", handleAdd);
newProductForm.addEventListener("submit", handleNewProduct);
fileInput.addEventListener("change", handleImageUpload);

for (const btn of closeBtns) {
    btn.addEventListener("click", closeOverlay);
}