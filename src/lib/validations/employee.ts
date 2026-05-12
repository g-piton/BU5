import { z } from "zod";

export const employeeSchema = z.object({
  name: z.string().min(3, "Informe o nome do colaborador."),
  email: z.email("Informe um e-mail válido."),
  role: z.string().min(2, "Informe o cargo ou papel."),
  project: z.string().min(2, "Informe o cliente ou projeto."),
  managerName: z.string().min(3, "Informe o gestor responsável."),
  startDate: z.string().min(1, "Informe a data de início."),
});

export type EmployeeInput = z.infer<typeof employeeSchema>;
