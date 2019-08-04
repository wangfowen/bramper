class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :timeoutable, and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :lockable, :trackable

  enum role: [:user, :manager, :admin]

  after_initialize :set_default_role, :if => :new_record?
  validates :email, uniqueness: { case_sensitive: false }, presence: true, allow_blank: false

  has_many :meals

  def set_default_role
    self.role ||= :user
  end

  def generate_jwt
    JWT.encode(
      {
        id: id,
        exp: 60.days.from_now.to_i
      },
      Rails.application.secrets.secret_key_base
    )
  end
end
