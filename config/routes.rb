Rails.application.routes.draw do
  resources :reviews
  resources :users
  resources :products
  get "/products/images/:name", to: "products#get_img", constraints: { name: /[a-zA-Z0-9\.]+/ }
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "public#index"
end
