import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const firstKey = Object.keys(errors)[0] as keyof typeof errors | undefined;
      const message =
        (firstKey ? errors[firstKey]?.[0] : undefined) ??
        "Nao foi possivel validar os dados.";

      return NextResponse.json({ message }, { status: 400 });
    }

    const { email, name, password } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Ja existe uma conta com este e-mail." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({ id: user.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Ocorreu um erro ao criar a conta." },
      { status: 500 },
    );
  }
}
