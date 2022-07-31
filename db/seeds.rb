require 'faker'

Product.delete_all

(1..20).each do |product|
    name = Faker::Commerce.product_name
    link = "https://google.com/"
    price = 10.5
    description = Faker::Lorem.words(number: 10).join(" ")
    img_url = "/assets/product.jpg"
    Product.create(name: name, link: link, price: price, description: description, img_url: img_url)
end
