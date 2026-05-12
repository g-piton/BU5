import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { employeeSchema } from "@/lib/validations/employee";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = employeeSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const firstKey = Object.keys(errors)[0] as keyof typeof errors | undefined;
      const message =
        (firstKey ? errors[firstKey]?.[0] : undefined) ??
        "Não foi possível validar o cadastro do colaborador.";

      return NextResponse.json({ message }, { status: 400 });
    }

    const { email, managerName, name, project, role, startDate } = result.data;

    const existingEmployee = await prisma.employee.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingEmployee) {
      return NextResponse.json(
        { message: "Já existe um colaborador cadastrado com este e-mail." },
        { status: 409 },
      );
    }

    const employee = await prisma.employee.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: role.trim(),
        project: project.trim(),
        managerName: managerName.trim(),
        startDate: new Date(startDate),
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({ id: employee.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Ocorreu um erro ao cadastrar o colaborador." },
      { status: 500 },
    );
  }
}
