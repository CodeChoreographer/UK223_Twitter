import { DataTypes } from 'sequelize';
import { sequelize } from './database';
import { seedInitialRolesAndRights } from './seed';

export const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }
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

export const Role = sequelize.define('Role', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
});

export const Right = sequelize.define('Right', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
});

export const UserRole = sequelize.define('UserRole', {
  userId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  roleId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true }
});

export const RoleRight = sequelize.define('RoleRight', {
  roleId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  rightId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true }
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

User.belongsToMany(Role, { through: UserRole, foreignKey: 'userId' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleId' });

Role.belongsToMany(Right, { through: RoleRight, foreignKey: 'roleId' });
Right.belongsToMany(Role, { through: RoleRight, foreignKey: 'rightId' });

(async () => {
  try {
    await sequelize.sync({ force: false })
    await seedInitialRolesAndRights()
    console.log('✅ Datenbanktabellen erfolgreich synchronisiert')
  } catch (error) {
    console.error('❌ Fehler beim Synchronisieren der Datenbanktabellen:', error)
  }
})()
