// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails

const productGrid = document.querySelector("#product-grid");
const loginBtn = document.querySelector("#login-btn");
let loggedIn = false;

function createProduct(product) {
    const productHtml = `
    <div class="product">
        <img src=${product.img_url}/>
        <div class="extra-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
        </div>
    </div>`
    productGrid.innerHTML += productHtml;
}

fetch("/products").then(res => res.json()).then(products => {
    products.forEach(product => {
        createProduct(product);
    });
});

function handleLogin(clickEvent) {
    if (loggedIn == false) {
        loginBtn.textContent = "Log out";
    } else {
        loginBtn.textContent = "Log in";
    }
    loggedIn = !loggedIn;
}

loginBtn.addEventListener("click", handleLogin);