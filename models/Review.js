const {DataTypes} = require('sequelize');
const db = require('../config/db');

const Task = require('./Task'),
      User = require('./User'),
      Badge = require('./Badge');


const Review = db.define('review', {
    review_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    review_score: {
        type: DataTypes.INTEGER
    },
    task_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'tasks'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users'
        }
    },
    badge_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'badges'
        }
    }
}, {
    tableName: 'reviews',
    timestamps: false
});

Review.hasOne(Task);
Task.hasMany(Review, {foreignKey: 'task_id'});

Review.hasOne(User);
User.hasMany(Review, {foreignKey: 'user_id'});

Review.hasOne(Badge);
Badge.hasMany(Review, {foreignKey: 'badge_id'});

module.exports = Review;