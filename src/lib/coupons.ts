export const SAMPLE_COUPONS = {
  CAMPUS10: 10,
  EATS20: 20,
  WELCOME5: 5,
} as const;

export type CouponCode = keyof typeof SAMPLE_COUPONS;

export function getCouponPercentage(code?: string): number
{
  if (!code)
  {
    return 0;
  }

  const normalized = code.trim().toUpperCase() as CouponCode;
  return SAMPLE_COUPONS[normalized] ?? 0;
}

export function isSampleCoupon(code: string): code is CouponCode
{
  return getCouponPercentage(code) > 0;
}