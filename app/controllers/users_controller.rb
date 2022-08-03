class UsersController < ApplicationController
    def show
        user = User.find(params[:id])
        render json: user
    end

    def random
        user = User.all.sample
        render json: user
    end
end
