# Local Master Library Browser Specification

## Purpose

Define a Master Catalog client.

## Requirements

### Requirement: Authenticated Local Catalog Browsing

The system MUST render protected v1 catalog records after a valid session. It MUST provide empty, unauthorized, and unavailable states, preserve identities/pagination, and MUST NOT read PostgreSQL, paths, or Personal Knowledge.

#### Scenario: Browse authorized catalog records

- GIVEN a valid catalog-read session
- WHEN the operator opens the panel
- THEN it calls protected v1 over HTTPS
- AND renders returned records

#### Scenario: Render an empty catalog

- GIVEN protected v1 returns an authorized empty page
- WHEN it is rendered
- THEN it shows an explicit empty state
- AND does not present an authorization failure

#### Scenario: Deny unauthenticated catalog access

- GIVEN no valid session exists
- WHEN the panel opens or refreshes
- THEN no catalog data is rendered
- AND authentication is required

### Requirement: Protected Acquisition Command Use

The panel MUST initiate acquisition through the protected v1 acquisition-initiation command for a selected version and named Local Library. It MUST NOT bypass authorization, expose descriptors, execute Local Library work, or transfer Personal Knowledge.

#### Scenario: Initiate an authorized acquisition

- GIVEN a session with acquisition permission
- WHEN a catalog version and Local Library are selected
- THEN the panel invokes the protected v1 command
- AND renders its accepted receipt and manifest

#### Scenario: Reject unauthorized acquisition

- GIVEN a session without acquisition permission
- WHEN acquisition is selected
- THEN no receipt, content, or descriptor is exposed
- AND the panel reports an authorization error

### Requirement: Local Browser Session Boundary

The panel MUST clear session state on logout, expiry, or invalidation and require authentication for later protected requests. Diagnostics MUST NOT disclose secrets or content.

#### Scenario: Logout or expiry prevents protected access

- GIVEN logout or an invalid session
- WHEN the panel requests catalog data or acquisition
- THEN it clears state and sends no authenticated retry
- AND requires authentication
