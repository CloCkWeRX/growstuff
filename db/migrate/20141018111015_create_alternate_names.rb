class CreateAlternateNames < ActiveRecord::Migration
  def change
    create_table :alternate_names do |t|
      t.string :name, null: false
      t.integer :crop_id, null: false
      t.integer :creator_id, null: false

      t.timestamps
    end
  end
end
