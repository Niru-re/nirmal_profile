/**
 * Client-safe service data — ZERO server-side imports.
 * Use this in "use client" components.
 * Server Components should use getAllServices() from services.ts instead.
 */

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
  startingPrice: number;
  currency: string;
  technologies: string[];
  features: string[];
}

export const CURRENCY_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.5,
};
