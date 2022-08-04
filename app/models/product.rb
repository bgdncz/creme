class Product < ApplicationRecord
    has_many :reviews
    belongs_to :recommender, class_name: "User"
end
