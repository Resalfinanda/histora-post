"use client";

import { MessageCircle } from "lucide-react";

interface Comment {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
}

interface CommentsListProps {
  comments: Comment[];
  count: number;
}

export function CommentsList({ comments, count }: CommentsListProps) {
  return (
    <section className="my-12 border-t border-gray-200 pt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-foreground" />
        <h2 className="text-xl font-bold text-foreground">Komentar ({count})</h2>
      </div>

      {comments.length === 0 ? (
        <p className="text-foreground/50 text-center py-8">Belum ada komentar</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-transparent rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-foreground">{comment.name}</p>
                <time className="text-xs text-foreground/50">
                  {new Date(comment.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <p className="text-foreground/70">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
