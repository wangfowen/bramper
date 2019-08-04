Rails.application.routes.draw do
  devise_for :users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  namespace :api do
    get 'users/settings', to: 'users#settings'
    post 'users/login', to: 'users#login'
    post 'users/verify', to: 'users#verify'
    resources :users
  end

  #TODO(separate): remove
  get '*path', to: "application#fallback_index_html", constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end
