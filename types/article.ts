import { Prisma } from "@prisma/client";

export type Article = {
  id: string;
  title: string;
  category: string;
  author: {
    name: string;
  } | null;
};

export type ArticleWithAuthor = Prisma.ArticleGetPayload<{
  include: {
    author: {
      select: {
        name: true;
      };
    };
  };
}>;
