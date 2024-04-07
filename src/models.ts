export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
};

export type OriginalPost = {
  id: string;
  userId: string;
  text: string;
  ts: Date;
}

export type RePost = {
  id: string;
  userId: string;
  postId: string;
  ts: Date;
}

export type Post = OriginalPost | RePost;

export type ForgotPass = {
  userId: string;
  secret: string;
  used: Date | null;
}