Rails.application.routes.draw do
  resources :reviews
  resources :users
  get 'public/index'
  resources :products
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "public#index"
end
