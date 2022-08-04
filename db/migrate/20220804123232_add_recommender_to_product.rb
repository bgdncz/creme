class AddRecommenderToProduct < ActiveRecord::Migration[7.0]
  def change
    add_reference :products, :recommender, references: :users, foreign_key: { to_table: :users}

  end
end
