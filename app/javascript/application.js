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
const starRating = document.querySelector("#star-rating");
const newReviewForm = document.querySelector("#new-review-form");
const addReviewBtn = document.querySelector("#add-review");
const editProductBtn = productOverlay.querySelector("#edit");
let userId = undefined;

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
    if (!userId) {
        fetch("/users/random").then(res => res.json()).then(user => {
            loginBtn.style.transition = "none";
            loginBtn.textContent = user.name;
            loginBtn.style.mask = "none";
            loginBtn.style.background = "transparent";
            addBtn.style.display = "block";
            userId = user.id;
        });
    }
}

function handleAdd() {
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
        reviewDiv.className = "review";
        reviewDiv.innerHTML = `
            <img src="${user.profile_img}" class="profile-pic"><strong>${user.name}</strong><p>${review.content}</p>
        `
        reviewContainer.insertBefore(reviewDiv, reviewContainer.querySelector("form"));
    });
}

function averageRating(product) {
    if (product.reviews.length == 0) {
        return "-"
    } else {
        return (product.reviews.reduce((acc, r) => acc + r.rating, 0)/product.reviews.length).toFixed(2);
    }
}

function showProduct(clickEvent) {
    const productId = this.dataset.productId;
        fetch(`/products/${productId}`).then(res => res.json()).then(product => {
            productOverlay.classList.add("open");
            productOverlay.dataset.productId = productId;
            productOverlay.querySelector("#product-image").src = product.img_url;
            productOverlay.querySelector("#product-name").childNodes[0].nodeValue = product.name;
            productOverlay.querySelector("#product-name").childNodes[1].href = product.link;
            productOverlay.querySelector("#product-info").textContent = `$${product.price}, ⭐️ ${averageRating(product)}`;
            productOverlay.querySelector("#product-description").textContent = product.description;
            productOverlay.querySelector("#edit").style.display = (product.recommender_id == userId) ? "block" : "none";
            productOverlay.querySelector("#add-review").style.display = userId ? "block" : "none";
            reviewContainer.querySelectorAll(".review").forEach(e => e.remove());
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
    data.append('recommender_id', userId);
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

function showAddReview(e) {
    if (this.className == "submit-review") {
        const productId = productOverlay.dataset.productId;
        const data = {
            "product_id": productId,
            "content": newReviewForm.content.value,
            "rating": starRating.dataset.rating,
            "user_id": userId
        }
        fetch('/reviews', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(_ => {
            addReviewBtn.className = "";
            newReviewForm.style.display = "none";
            starRating.addEventListener("mousemove", displayStars);
            newReviewForm.content.value = "";
            starRating.className = "";
            closeOverlay();
        });
    } else {
        this.className = "submit-review";
        newReviewForm.style.display = "flex";
    }
}

addReviewBtn.addEventListener("click", showAddReview);

function displayStars(e) {
    const { x, y } = starRating.getBoundingClientRect();
    //starRating.style.width = ` px`;
    const goldPercentage = 100*(e.clientX - x)/180;
    const grayPercentage = 100 - goldPercentage;
    starRating.style.setProperty("--gold-percentage", `${goldPercentage}%`);
    starRating.style.setProperty("--gray-percentage", `${grayPercentage}%`);
}

starRating.addEventListener("mousemove", displayStars);

function setRating(e) {
    const { x, y } = starRating.getBoundingClientRect();
    const stars = 5*(e.clientX - x)/180
    this.dataset.rating = stars;
    this.removeEventListener("mousemove", displayStars);
    this.className = "set-rating";
}

starRating.addEventListener("click", setRating);

function updateProduct(submitEvent) {
    submitEvent.preventDefault();
    var data = new FormData();
    const productId = productOverlay.dataset.productId;
    data.append('name', newProductForm.name.value);
    data.append('link', newProductForm.link.value);
    data.append('description', newProductForm.description.value);
    data.append('price', newProductForm.price.value);
    if (fileInput.files[0]) data.append('img', fileInput.files[0]);
    fetch(`/products/${productId}`, {
        method: 'PATCH',
        body: data
    }).then(res => res.json()).then(product => {
        closeOverlay();
        clearForm();
        document.querySelector(`.product[data-product-id="${product.id}"]`).remove();
        createProduct(product);
        newProductForm.removeEventListener("submit", updateProduct);
        newProductForm.addEventListener("submit", handleNewProduct);
    });
}

function editProduct() {
    const productId = productOverlay.dataset.productId;
    fetch(`/products/${productId}`).then(res => res.json()).then(product => {
        newProductForm.name.value = product.name;
        newProductForm.link.value = product.link;
        newProductForm.description.value = product.description;
        newProductForm.price.value = product.price;
        const label = document.querySelector(".image-input label");
        label.classList.add("uploaded-image");
        label.style.backgroundImage = 'url(' + product.img_url + ')';
        newProductForm.removeEventListener("submit", handleNewProduct);
        newProductForm.addEventListener("submit", updateProduct);
        closeOverlay();
        handleAdd();
    });
}

editProductBtn.addEventListener("click", editProduct);