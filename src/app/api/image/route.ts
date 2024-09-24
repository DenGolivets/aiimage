import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "You Are Unauthorized" }, { status: 401 });
    }

    const { prompt, model, seed } = await request.json();

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "No User Found" }, { status: 401 });
    }

    // function generateRandomNumber(): number {
    //   return Math.floor(Math.random() * 100000000) + 1;
    // }

    // const randomSeed = generateRandomNumber();
    const imageURL = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=${model}&seed=${seed}&width=1024&height=1200&nologo=true`;
    
    await fetch(imageURL);

    await prisma.post.create({
      data: {
        prompt: prompt,
        url: imageURL,
        userId: user.id,
        seed: seed,
        model: model,
      }
    });

    return NextResponse.json({ url: imageURL });
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "You Are Unauthorized" }, { status: 401 });
  };

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    }
  });

  if (!user) {
    return NextResponse.json({ error: "No User Found" }, { status: 401 });
  };

  const posts = await prisma.post.findMany({
    where: {
      userId: user.id,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
};

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "You Are Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post || post.userId !== session.user.id) {
    return NextResponse.json({ error: "Post Not Found or Unauthorized" }, { status: 404 });
  }

  await prisma.post.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Post deleted successfully" });
}