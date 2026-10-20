import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type CommentWithAuthor = {
  id: string;
  body: string;
  createdAt: Date;
  author: {
    name: string | null;
    email: string;
    imageUrl: string | null;
  };
};

type CommentListProps = {
  comments: CommentWithAuthor[];
};
const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  return (
    <div className="space-y-8">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={comment.author.imageUrl as string} />
            <AvatarFallback>{comment.author.name}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="mb-2">
              <span className="font-medium text-foreground">
                {comment.author.name}
              </span>
              <span className="text-sm text-muted-foreground ml-2">
                {comment.createdAt.toDateString()}
              </span>
            </div>
            <p className="text-muted-foreground">{comment.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
