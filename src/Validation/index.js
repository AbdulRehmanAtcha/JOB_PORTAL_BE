import { z } from "zod";

export const RegistraionValidation = z.object({
  role: z.enum(["HR", "Candidate"]),
  fullName: z.string().min(3, "Name atleast have 3 characters"),
  email: z.email("Email is required"),
  companyName: z.string().optional(),
  designation: z.string().optional(),
  phone: z
    .string()
    .regex(/^03[0-9]{9}$/, "Phone number must start with 03 and be 11 digits"),
  password: z.string().min(5, "Password must have atleast 5 characters"),
});

export const LoginValidation = z.object({
  email: z.email("Email is required"),
  password: z.string().min(5, "Password must have atleast 5 characters"),
});

export const jobPostValidation = z.object({
  title: z.string().min(3, "Job title must have atleast 3 characters"),
  description: z
    .string()
    .min(3, "Job description must have atleast 3 characters"),
  type: z.enum([
    "Full-time",
    "Internship",
    "Remote",
    "On-site",
    "Hybrid",
    "Contract",
  ]),
  city: z.string(),
  tags: z.array(z.string()).optional(),
});
