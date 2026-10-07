import { describe, it, expect } from "vitest";
import { getCouponPercentage, isSampleCoupon } from "@/lib/coupons";
import { priceOrder } from "@/store/campusStore";
import type { MenuItem } from "@/types/campus";

const menu: MenuItem[] = [{ id: "meal", vendorId: "vendor", name: "Meal", price: 100 }];

describe("sample coupons", () => {
  it.each([
    ["CAMPUS10", 10],
    ["EATS20", 20],
    ["WELCOME5", 5],
  ])("applies %s as a %d percent discount", (code, percentage) => {
    expect(getCouponPercentage(code)).toBe(percentage);
    expect(isSampleCoupon(code)).toBe(true);
  });

  it("rejects unknown coupon codes", () => {
    expect(getCouponPercentage("NOTREAL")).toBe(0);
    expect(isSampleCoupon("NOTREAL")).toBe(false);
  });

  it("combines the student and coupon discounts in the order total", () => {
    const pricing = priceOrder([{ itemId: "meal", quantity: 1 }], menu, "Student", "CAMPUS10");
    expect(pricing.studentDiscount).toBe(3);
    expect(pricing.couponDiscount).toBe(12);
    expect(pricing.discount).toBe(15);
    expect(pricing.total).toBe(105);
  });
});
