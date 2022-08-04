require 'faker'

(1..4).each do |user|
    User.create(name: Faker::Name.name, email: Faker::Internet.email, profile_img: Faker::Avatar.image)
end

(1..20).each do |product|
    name = Faker::Commerce.product_name
    link = "https://google.com/"
    price = 10.5
    description = Faker::Lorem.words(number: 10).join(" ")
    img_url = Faker::LoremFlickr.image(search_terms: name.split(" "))
    Product.create(name: name, link: link, price: price, description: description, img_url: img_url, recommender: User.all.sample)
end

User.all.each do |user|
    (1..5).each do |review|
        # get a random product
        product = Product.all.sample
        content = Faker::Lorem.words(number: 10).join(" ")
        rating = [1,2,3,4,5].sample
        Review.create(content: content, rating: rating, user: user, product: product)
    end
end