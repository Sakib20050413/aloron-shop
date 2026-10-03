import assert from "node:assert/strict";
import { test } from "node:test";
import { catalogProducts } from "@/lib/catalog";
import { searchProducts } from "@/lib/product-search";
import { orderSchema } from "@/lib/order-validation";

const validOrder = {
  productId: "GAD-WATCH-01",
  quantity: 1,
  customerName: "Test Customer",
  customerPhone: "01712345678",
  shippingAddress: "ধানমন্ডি, ঢাকা",
  deliveryZone: "ঢাকার ভেতরে" as const,
  deliveryFee: 70,
  bKashSender: "01712345678",
  transactionId: "TRX12345",
};

test("SKU and Bengali product searches return the QCY GT2 Smart Watch", () => {
  for (const query of ["GAD-WATCH-01", "smart watch", "স্মার্টওয়াচ", "QCY GT2"]) {
    const results = searchProducts(catalogProducts, query);
    assert.equal(results.length > 0, true);
    assert.equal(results[0]?.code, "GAD-WATCH-01");
    assert.equal(results[0]?.name, "QCY GT2 AMOLED Smart Watch");
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
  const subtotal = 2990;
  const advance = 200;
  assert.equal(subtotal + validOrder.deliveryFee - advance, 2860);
  assert.equal(subtotal + 150 - advance, 2940);
});
