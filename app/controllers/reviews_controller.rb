class ReviewsController < ApplicationController
    skip_before_action :verify_authenticity_token
    def create
        Review.create(content: params[:content], rating: params[:rating], product_id: params[:product_id], user_id: params[:user_id])
    end 
end
