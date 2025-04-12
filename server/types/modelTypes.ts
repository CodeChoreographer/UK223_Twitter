import { Model } from 'sequelize';

export interface TweetAttributes {
  id: number;
  userId: number;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export type TweetInstance = Model<TweetAttributes> & TweetAttributes;

export interface CommentAttributes {
  id: number;
  userId: number;
  tweetId: number;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export type CommentInstance = Model<CommentAttributes> & CommentAttributes;

export interface UserAttributes {
  id: number;
  username: string;
  password: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export type UserInstance = Model<UserAttributes> & UserAttributes;

export interface RoleAttributes {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type RoleInstance = Model<RoleAttributes> & RoleAttributes;

