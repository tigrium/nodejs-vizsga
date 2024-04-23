export const MIN_PASS_LENGTH = 8;
export const MIN_NICKNAME_LENGTH = 2;

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  picturePath?: string;
};

export type OriginalPost = {
  id: string;
  userId: string;
  text: string;
  ts: number;
};

export type RePost = {
  id: string;
  userId: string;
  postId: string;
  ts: number;
};

export type Post = OriginalPost | RePost;

export type ForgotPass = {
  userId: string;
  secret: string;
  valid: number;
};
