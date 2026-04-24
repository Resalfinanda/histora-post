
// import { prisma } from "@/lib/prisma";
// import ArticlesClient from "./articlesClient";

// export default async function ArticlesPage({
//   searchParams,
// }: {
//   searchParams: Promise<{ query?: string; category?: string }>;
// }) {
//   const params = await searchParams;

//   const query = params?.query || "";
//   const category = params?.category || "all";

//   const articles = await prisma.article.findMany({
//     where: {
//       AND: [
//         query
//           ? {
//               title: {
//                 contains: query,
//                 mode: "insensitive",
//               },
//             }
//           : {},
//         category !== "all"
//           ? {
//               category: {
//                 equals: category,
//                 mode: "insensitive",
//               },
//             }
//           : {},
//       ],
//     },
//     include: {
//       author: {
//         select: {
//           name: true,
//         },
//       },
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });

//   const categories = await prisma.article.findMany({
//     select: { category: true },
//     distinct: ["category"],
//   });

//   return (
//     <ArticlesClient
//       articles={articles}
//       query={query}
//       category={category}
//       categories={categories}
//     />
//   );
// }

import { auth } from "@/app/actions/auth";
import {prisma} from "@/lib/prisma";
import ArticlesClient from "./articlesClient";

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; category?: string }>;
}) {
  const params = await searchParams;

  const query = params?.query || "";
  const category = params?.category || "all";

  // Ambil Sesi User
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";
  const userId = session?.user?.id;

  // Logika Role: Jika bukan Admin, wajib filter berdasarkan authorId
  const roleFilter = isAdmin ? {} : { authorId: userId };

  // Eksekusi Kueri dengan Filter Gabungan (Search + Kategori + Role)
  const articles = await prisma.article.findMany({
    where: {
      AND: [
        roleFilter, // <-- Suntikkan filter role di sini
        query
          ? {
              title: {
                contains: query,
                mode: "insensitive",
              },
            }
          : {},
        category !== "all"
          ? {
              category: {
                equals: category,
                mode: "insensitive",
              },
            }
          : {},
      ],
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Ambil daftar kategori unik untuk dropdown filter
  const categories = await prisma.article.findMany({
    select: { category: true },
    distinct: ["category"],
  });

  return (
    <ArticlesClient
      articles={articles}
      query={query}
      category={category}
      categories={categories}
      isAdmin={isAdmin} 
    />
  );
}
