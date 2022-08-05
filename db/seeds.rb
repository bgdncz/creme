require 'faker'

# Create users
names = ["Chris", "Bogdan", "Jared", "Matthew", "Raegan", "Monica", "Mark", "Luke", "Sungwoo"]
names.each do |name|
    User.create(name: name, email: Faker::Internet.email, profile_img: "/assets/profile.png")
end

# Create products
Product.create(name: "iPad", link: "https://www.apple.com/ipad/", price: 1000, description: "The iPad is Apple's most affordable and most popular tablet", img_url: "assets/ipad.jpg", recommender: User.find_by(name: "Chris"))
Product.create(name: "Crème", link: "https://bgdn.eu/", price: 5, description: "The best app ever", img_url: "assets/creme.png", recommender: User.find_by(name: "Bogdan"))
Product.create(name: "Mango Dragonfruit Refresher", link: "https://www.starbucks.com", price: 10, description: "A really fruity drink", img_url: "assets/drink.jpg", recommender: User.find_by(name: "Jared"))
Product.create(name: "Honda Civic", link: "https://www.honda.com", price: 30000, description: "Best bang for your buck", img_url: "assets/car.jpg", recommender: User.find_by(name: "Matthew"))
Product.create(name: "Slack", link: "https://www.slack.com", price: 20, description: "Keep your team in check", img_url: "assets/slack.jpg", recommender: User.find_by(name: "Raegan"))
Product.create(name: "Stradivarius violin", link: "https://www.si.edu/spotlight/violins/stradivarius", price: 2000000, description: "One of Cremona's best exports", img_url: "assets/violin.png", recommender: User.find_by(name: "Monica"))
Product.create(name: "Wolfram Mathematica", link: "https://www.wolfram.com/mathematica/", price: 50, description: "Linear algebra ftw!", img_url: "assets/wolfram.png", recommender: User.find_by(name: "Mark"))
Product.create(name: "Airpods", link: "https://www.apple.com/airpods/", price: 250, description: "Crystal clear sound", img_url: "assets/airpods.jpg", recommender: User.find_by(name: "Luke"))
Product.create(name: "49 Inch Curved Gaming Monitor Ultrawide", link: "https://www.samsung.com/sg/monitors/business/curved-monitor-with-32-9-super-ultra-wide-screen-49-inch-lc49j890dkexxs/", price: 2000, description: "See everything!", img_url: "assets/monitor.png", recommender: User.find_by(name: "Sungwoo"))

# Create reviews
Review.create(content: "Great for teaching", rating: 5, user: User.find_by(name: "Chris"), product: Product.find_by(name: "iPad"))
Review.create(content: "Top 5 Starbucks drinks", rating: 4.6, user: User.find_by(name: "Jared"), product: Product.find_by(name: "Mango Dragonfruit Refresher"))
Review.create(content: "Very user-friendly", rating: 5, user: User.find_by(name: "Chris"), product: Product.find_by(name: "Slack"))
Review.create(content: "My favorite app after Tinder", rating: 5, user: User.find_by(name: "Bogdan"), product: Product.find_by(name: "Slack"))
Review.create(content: "I use them for zoom", rating: 4, user: User.find_by(name: "Luke"), product: Product.find_by(name: "Airpods"))