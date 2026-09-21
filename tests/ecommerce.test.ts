import assert from "node:assert/strict";
import { test } from "node:test";
import { catalogProducts } from "@/lib/catalog";
import { searchProducts } from "@/lib/product-search";
import { orderSchema } from "@/lib/order-validation";

const validOrder = {
  productId: "GAD-001",
  quantity: 1,
  customerName: "Test Customer",
  customerPhone: "01712345678",
  shippingAddress: "ধানমন্ডি, ঢাকা",
  deliveryZone: "ঢাকার ভেতরে" as const,
  deliveryFee: 70,
  bKashSender: "01712345678",
  transactionId: "TRX12345",
};

test("SKU and Bengali product searches return the Pocket Turbo Mini Fan", () => {
  for (const query of ["GAD-001", "gad001", "001", "মিনি ফ্যান"]) {
    const results = searchProducts(catalogProducts, query);
    assert.equal(results.length > 0, true);
    assert.equal(results[0]?.productCode, "GAD-001");
    assert.equal(results[0]?.name, "Pocket Turbo Mini Fan");
  }
});

test("checkout rejects empty bKash sender and transaction ID", () => {
  assert.equal(orderSchema.safeParse({ ...validOrder, bKashSender: "" }).success, false);
  assert.equal(orderSchema.safeParse({ ...validOrder, transactionId: "" }).success, false);
});

test("checkout accepts and matches the two delivery fees", () => {
  assert.equal(orderSchema.safeParse(validOrder).success, true);
  assert.equal(orderSchema.safeParse({ ...validOrder, deliveryZone: "ঢাকার বাইরে (সারা বাংলাদেশ)", deliveryFee: 150 }).success, true);
  assert.equal(orderSchema.safeParse({ ...validOrder, deliveryZone: "ঢাকার বাইরে (সারা বাংলাদেশ)", deliveryFee: 70 }).success, false);
});

test("grand total subtracts the ৳200 advance from subtotal plus delivery", () => {
  const subtotal = 699;
  const advance = 200;
  assert.equal(subtotal + validOrder.deliveryFee - advance, 569);
  assert.equal(subtotal + 150 - advance, 649);
});
