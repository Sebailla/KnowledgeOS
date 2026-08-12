# Master Catalog Acquisition API Specification


## Requirements

### Requirement: Versioned Catalog and Acquisition
The system MUST expose versioned catalog pages with stable publication, knowledge-object, and version identities. Acquisition MUST be explicit, authorized, cancellable, resumable by validated range, and checksum-verifiable; it SHALL return classified compatibility, authorization, integrity, and transient failures. It MUST NOT transfer Personal Knowledge.

#### Scenario: Acquire an authorized version
- GIVEN an authorized client selects a catalog publication version
- WHEN it requests and completes acquisition
- THEN it receives only the identified bytes and declared checksum
- AND the Local Library remains independent

#### Scenario: Resume mismatched content
- GIVEN a resumed range does not match the declared version or checksum
- WHEN the client validates the response
- THEN acquisition fails with an integrity or compatibility category
