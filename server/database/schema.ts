import { DataTypes } from 'sequelize';
import { sequelize } from './database';
import { seedInitialRolesAndRights } from './seed';

export let User: any, Tweet: any, Comment: any, Like: any;
export let Role: any, Right: any, UserRole: any, RoleRight: any;

export const initSchema = () => {
  User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  });

  Tweet = sequelize.define('Tweet', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
  });

  Comment = sequelize.define('Comment', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    tweetId: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
  });

  Like = sequelize.define('Like', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    tweetId: { type: DataTypes.INTEGER, allowNull: true },
    commentId: { type: DataTypes.INTEGER, allowNull: true },
  });

  Role = sequelize.define('Role', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  });

  Right = sequelize.define('Right', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  });

  UserRole = sequelize.define('UserRole', {
    userId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    roleId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  });

  RoleRight = sequelize.define('RoleRight', {
    roleId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    rightId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  });

  User.hasMany(Tweet, { foreignKey: 'userId', onDelete: 'CASCADE' });
  User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
  User.hasMany(Like, { foreignKey: 'userId', onDelete: 'CASCADE' });

  Tweet.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Tweet.hasMany(Comment, { foreignKey: 'tweetId', onDelete: 'CASCADE' });
  Tweet.hasMany(Like, { foreignKey: 'tweetId', onDelete: 'CASCADE' });

  Comment.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Comment.belongsTo(Tweet, { foreignKey: 'tweetId', onDelete: 'CASCADE' });
  Comment.hasMany(Like, { foreignKey: 'commentId', onDelete: 'CASCADE' });

  Like.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Like.belongsTo(Tweet, { foreignKey: 'tweetId', onDelete: 'CASCADE' });
  Like.belongsTo(Comment, { foreignKey: 'commentId', onDelete: 'CASCADE' });

  User.belongsToMany(Role, { through: UserRole, foreignKey: 'userId', onDelete: 'CASCADE' });
  Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleId', onDelete: 'CASCADE' });
  UserRole.belongsTo(Role, { foreignKey: 'roleId' });


  Role.belongsToMany(Right, { through: RoleRight, foreignKey: 'roleId', onDelete: 'CASCADE' });
  Right.belongsToMany(Role, { through: RoleRight, foreignKey: 'rightId', onDelete: 'CASCADE' });
};
