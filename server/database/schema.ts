import { DataTypes } from 'sequelize';
import { sequelize } from './database';
import { seedInitialRolesAndRights } from './seed';

export const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
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

// Beziehungen mit CASCADE
User.hasMany(Tweet, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Like, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Notification, { foreignKey: 'userId', onDelete: 'CASCADE' });

Tweet.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
Tweet.hasMany(Comment, { foreignKey: 'tweetId', onDelete: 'CASCADE' });
Tweet.hasMany(Like, { foreignKey: 'tweetId', onDelete: 'CASCADE' });

Comment.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(Tweet, { foreignKey: 'tweetId', onDelete: 'CASCADE' });
Comment.hasMany(Like, { foreignKey: 'commentId', onDelete: 'CASCADE' });

Like.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
Like.belongsTo(Tweet, { foreignKey: 'tweetId', onDelete: 'CASCADE' });
Like.belongsTo(Comment, { foreignKey: 'commentId', onDelete: 'CASCADE' });

Notification.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

User.belongsToMany(Role, { through: UserRole, foreignKey: 'userId', onDelete: 'CASCADE' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleId', onDelete: 'CASCADE' });

UserRole.belongsTo(Role, { foreignKey: 'roleId', onDelete: 'CASCADE' });
Role.hasMany(UserRole, { foreignKey: 'roleId', onDelete: 'CASCADE' });

Role.belongsToMany(Right, { through: RoleRight, foreignKey: 'roleId', onDelete: 'CASCADE' });
Right.belongsToMany(Role, { through: RoleRight, foreignKey: 'rightId', onDelete: 'CASCADE' });

(async () => {
  try {
    await sequelize.sync({ force: false })
    await seedInitialRolesAndRights()
    console.log('✅ Datenbanktabellen erfolgreich synchronisiert')
  } catch (error) {
    console.error('❌ Fehler beim Synchronisieren der Datenbanktabellen:', error)
  }
})()
