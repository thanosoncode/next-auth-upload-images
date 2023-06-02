import prisma from "@/prisma/prismaClient";
import { NextResponse } from "next/server";
import * as bcrypt from "bcrypt";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "email and password are required", user: null },
      { status: 400 }
    );
  }

  const exists = await prisma.user.findFirst({ where: { email } });

  if (exists) {
    return NextResponse.json(
      { message: "user already exists", user: null },
      { status: 400 }
    );
  }

  const user = await prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 10),
    },
  });

  return NextResponse.json({ message: "success", user }, { status: 201 });
}
