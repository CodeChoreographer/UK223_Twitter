import { DataTypes } from 'sequelize';
import { sequelize } from './database';


export const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
    validate: { isIn: [['user', 'moderator', 'admin']] }
  }
});

export const Tweet = sequelize.define('Tweet', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false }
});

export const Comment = sequelize.define('Comment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  tweetId: { type: DataTypes.INTEGER, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false }
});

export const Like = sequelize.define('Like', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  tweetId: { type: DataTypes.INTEGER, allowNull: true },
  commentId: { type: DataTypes.INTEGER, allowNull: true }
});

export const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  message: { type: DataTypes.STRING, allowNull: false },
  readStatus: { type: DataTypes.BOOLEAN, defaultValue: false }
});


User.hasMany(Tweet, { foreignKey: 'userId' });
User.hasMany(Comment, { foreignKey: 'userId' });
User.hasMany(Like, { foreignKey: 'userId' });
User.hasMany(Notification, { foreignKey: 'userId' });

Tweet.belongsTo(User, { foreignKey: 'userId' });
Tweet.hasMany(Comment, { foreignKey: 'tweetId' });
Tweet.hasMany(Like, { foreignKey: 'tweetId' });

Comment.belongsTo(User, { foreignKey: 'userId' });
Comment.belongsTo(Tweet, { foreignKey: 'tweetId' });
Comment.hasMany(Like, { foreignKey: 'commentId' });

Like.belongsTo(User, { foreignKey: 'userId' });
Like.belongsTo(Tweet, { foreignKey: 'tweetId' });
Like.belongsTo(Comment, { foreignKey: 'commentId' });

Notification.belongsTo(User, { foreignKey: 'userId' });

(async () => {
  try {
    await sequelize.sync({ force: false });
  } catch (error) {
    console.error('❌ Fehler beim Synchronisieren der Datenbanktabellen:', error);
  }
})();
