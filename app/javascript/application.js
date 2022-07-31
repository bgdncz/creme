// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails

const main = document.querySelector("main");

function createProduct(product) {
    const productHtml = `
    <div class="product">
        <img src=${product.img_url}/>
    </div>`
    main.innerHTML += productHtml;
}

fetch("/products").then(res => res.json()).then(products => {
    products.forEach(product => {
        createProduct(product);
    });
});