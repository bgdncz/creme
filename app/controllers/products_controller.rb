class ProductsController < ApplicationController
    skip_before_action :verify_authenticity_token
    def index
        products = Product.all
        render json: products
    end

    def show
        product = Product.find(params[:id])
        render json: product, include: "reviews"
    end

    def write_img(file)
        name = file.original_filename
        path = Rails.root.join("app", "public", "images", name)
        File.open(path, "wb") { |f| f.write(file.read) }
        return "/products/images/#{URI::escape(name)}"
    end

    def get_img
        name = params[:name]
        path = Rails.root.join("app", "public", "images", name)
        send_file path
    end

    def create
        product = Product.create(name: params[:name], link: params[:link], description: params[:description], img_url: write_img(params[:img]), price: params[:price])
        render json: product, include: "reviews"
    end
end
