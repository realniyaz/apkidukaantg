export interface Plan {
  id: string; // Changed to string for UUID
  name: string;
  code: string;
  price_monthly: number;
  price_yearly: number;
  trial_days: number;
  grace_days: number;
  is_active: boolean;
  // We'll manually add features since the DB doesn't store them yet
  features?: string[]; 
}

export enum SubscriptionStatus {
  INCOMPLETE = "incomplete",
  TRIALING = "trialing",
  ACTIVE = "active",
  CANCELLED = "cancelled"
}

export interface Subscription {
  id: number;
  status: SubscriptionStatus;
  plan: Plan;
  billing_cycle: 'monthly' | 'yearly';
  current_period_end: string;
  cancel_at_period_end: boolean;
}