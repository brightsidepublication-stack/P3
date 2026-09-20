import fs from "node:fs";

const required = [
  "src/features/auth/AuthContext.tsx",
  "src/components/auth/ProtectedRoute.tsx",
  "src/components/auth/RoleGuard.tsx",
  "src/pages/LoginPage.tsx",
  "src/pages/SignupPage.tsx",
  "src/services/auth.service.ts",
  "src/utils/auth-errors.ts",
  "src/utils/safe-redirect.ts",
];

const missing = required.filter((file) => !fs.existsSync(file));

if (missing.length) {
  console.error("FAIL: Missing expected Phase 3 files:");
  for (const file of missing) console.error(` - ${file}`);
  process.exit(1);
}

const roleGuard = fs.readFileSync(
  "src/components/auth/RoleGuard.tsx",
  "utf8"
);

const authContext = fs.readFileSync(
  "src/features/auth/AuthContext.tsx",
  "utf8"
);

const checks = [
  [
    "RoleGuard uses explicit role matching",
    roleGuard.includes("allowed.includes(role)")
  ],
  [
    "No implicit admin-to-agent expansion",
    !roleGuard.includes("effectiveAllowed")
  ],
  [
    "isAgent is strict",
    authContext.includes("role === 'agent'")
  ],
  [
    "Profile request generation protection exists",
    authContext.includes("profileRequestIdRef")
  ],
];

let failed = 0;

for (const [name, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"}: ${name}`);
  if (!ok) failed++;
}

if (failed) process.exit(1);

console.log("PASS: Phase 3 static verification completed.");
