class AccountType < ApplicationRecord
  has_many :products

  def to_s
    name
  end
end
