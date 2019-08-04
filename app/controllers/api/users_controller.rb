class Api::UsersController < ApplicationController
  before_action :set_user, only: [:show, :update]
  before_action :authenticate_api_user!, only: [:verify, :settings]

  def create
    @user = User.new(user_params)
    if @user.valid? && @user.save
      @current_user = @user
      render :show
    else
      render json: @user.errors.full_messages, status: 400
    end
  end

  def show
    @current_user = current_user
  end

  def update
    if @user.update(user_params)
      @current_user = @user
      render :show
    else
      render json: @user.errors.full_messages, status: 400
    end
  end

  def settings
    @current_user = current_user
  end

  def login
    auth = params[:auth]
    @user = User.find_by(email: auth[:email])

    if @user && @user.valid_password?(auth[:password])
      @current_user = @user
      render :show
    else
      render json: ['Email or password is invalid'], status: :unprocessable_entity
    end
  end

  def verify
    if current_user.id == params[:user]
      head :ok
    else
      render json: ['User does not match'], status: 400
    end
  end

  private

  def set_user
    @user = User.find_by(id: params[:id])
  end

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :expected_calories)
  end
end
