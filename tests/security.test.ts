import assert from "node:assert/strict";
import { test, beforeEach } from "node:test";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/auth/[...nextauth]/route";
import { getAuthorizedRole } from "@/auth";
import { resetRateLimits } from "@/lib/rate-limit";
import { getAdminRouteDecision } from "@/proxy";

beforeEach(() => resetRateLimits());

test("rapid incorrect login attempts are blocked after five tries", async () => {
  const responses: Response[] = [];
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const request = new NextRequest("http://localhost/api/auth/callback/credentials", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", "x-forwarded-for": "198.51.100.41" },
      body: new URLSearchParams({ email: "brute-force@example.com", password: "wrong-password" }),
    });
    responses.push(await POST(request));
  }
  assert.equal(responses[5]?.status, 429);
});

test("owner emails always resolve to ADMIN", () => {
  for (const email of [
    "mdnajmussakib2003@gmail.com",
    "md.najmus.sakib.rahatul.2005@gmail.com",
    "rakibtoha47@gmail.com",
  ]) {
    assert.equal(getAuthorizedRole(email, "CUSTOMER"), "ADMIN");
  }
});

test("non-admin roles remain customers", () => {
  assert.equal(getAuthorizedRole("customer@example.com", "CUSTOMER"), "CUSTOMER");
});

test("admin route redirects anonymous users and forbids customers", () => {
  assert.equal(getAdminRouteDecision(null), "redirect");
  assert.equal(getAdminRouteDecision("CUSTOMER"), "forbidden");
  assert.equal(getAdminRouteDecision("ADMIN"), "allow");
});
