import assert from "node:assert/strict";
import { test } from "node:test";
import { catalogProducts } from "@/lib/catalog";
import { searchProducts } from "@/lib/product-search";
import { rateLimit, resetRateLimits } from "@/lib/rate-limit";
import { orderSchema } from "@/lib/order-validation";

test("SKU normalization matches hyphen, space, casing, and suffix variants", () => {
  for (const query of ["GAD-WATCH-01", "gadwatch01", "gad watch 01", "watch-01"]) {
    assert.equal(searchProducts(catalogProducts, query)[0]?.code, "GAD-WATCH-01");
  }
});

test("authentication limiter blocks rapid attempts in a sliding window", () => {
  resetRateLimits();
  assert.equal(rateLimit("test-auth", 5, 900_000), true);
  assert.equal(rateLimit("test-auth", 5, 900_000), true);
  assert.equal(rateLimit("test-auth", 5, 900_000), true);
  assert.equal(rateLimit("test-auth", 5, 900_000), true);
  assert.equal(rateLimit("test-auth", 5, 900_000), true);
  assert.equal(rateLimit("test-auth", 5, 900_000), false);
});

test("order validation rejects malicious checkout payloads", () => {
  const result = orderSchema.safeParse({
    productId: "GAD-WATCH-01",
    quantity: 1,
    customerName: "Test User",
    customerPhone: "01<script>1234567",
    shippingAddress: "<script>alert(1)</script>",
    deliveryZone: "ঢাকা",
    deliveryFee: 80,
    bKashSender: "01700000000",
    transactionId: "ABCD1234",
  });
  assert.equal(result.success, false);
});
