const {DataTypes} = require('sequelize');
const db = require('../config/db');


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



module.exports = Review;