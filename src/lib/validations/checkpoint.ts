import { z } from "zod";
import { CHECKPOINT_PHASE_VALUES } from "@/lib/onboarding-catalog";

export const checkpointResponseSchema = z.object({
  questionId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(600).optional().or(z.literal("")),
});

export const checkpointReviewSchema = z.object({
  phase: z.enum(CHECKPOINT_PHASE_VALUES),
  reviewDate: z.string().optional().or(z.literal("")),
  generalComment: z.string().max(2000).optional().or(z.literal("")),
  responses: z.array(checkpointResponseSchema).min(1),
});

export type CheckpointReviewInput = z.infer<typeof checkpointReviewSchema>;
