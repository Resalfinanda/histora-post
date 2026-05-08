import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/actions/auth";
import { AdPlacement, AdTopic } from "@prisma/client";

const validPlacements = Object.values(AdPlacement);
const validTopics = Object.values(AdTopic);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const placement = searchParams.get("placement");
    const topic = searchParams.get("topic");
    const isActive = searchParams.get("isActive");

    type AdvertisementWhereUniqueInput = {
      isActive?: boolean;
      placement?: AdPlacement;
      topics?: {
        hasSome: AdTopic[];
      };
      AND?: Array<{
        OR: Array<{
          startDate?: null | { lte: Date };
          endDate?: null | { gte: Date };
        }>;
      }>;
    };

    const where: AdvertisementWhereUniqueInput = {};

    if (isActive === "true" || isActive === "false") {
      where.isActive = isActive === "true";
    }

    if (placement && validPlacements.includes(placement as AdPlacement)) {
      where.placement = placement as AdPlacement;
    }

    if (topic && validTopics.includes(topic as AdTopic)) {
      where.topics = {
        hasSome: [topic as AdTopic],
      };
    }

    const now = new Date();
    where.AND = [
      {
        OR: [{ startDate: null }, { startDate: { lte: now } }],
      },
      {
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
    ];

    const advertisements = await prisma.advertisement.findMany({
      where,
      orderBy: { priority: "desc" },
    });

    return NextResponse.json(advertisements);
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    return NextResponse.json(
      { error: "Failed to fetch advertisements" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      imageUrl,
      adLink,
      placement,
      topics,
      isActive,
      startDate,
      endDate,
      priority,
    } = body;

    if (!title || !imageUrl || !adLink || !placement) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const advertisement = await prisma.advertisement.create({
      data: {
        title,
        description,
        imageUrl,
        adLink,
        placement,
        topics: topics || [],
        isActive: isActive ?? true,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        priority: priority ? parseInt(priority, 10) : 0,
      },
    });

    return NextResponse.json(advertisement, { status: 201 });
  } catch (error) {
    console.error("Error creating advertisement:", error);
    return NextResponse.json(
      { error: "Failed to create advertisement" },
      { status: 500 },
    );
  }
}
