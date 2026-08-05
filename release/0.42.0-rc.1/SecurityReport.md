# Security Report

- High-confidence repository secret scan: passed.
- Diagnostic sanitization: covered by mobile and E2E tests.
- TLS policy: mobile transport rejects insecure non-local endpoints.
- Keychain/App Group/entitlement behavior still requires final validation on signed Apple builds and physical devices.
