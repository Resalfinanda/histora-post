// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth"; // import dari file auth.ts di root

export const { GET, POST } = handlers;