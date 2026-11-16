/*
# Restrict fraud_predictions to read and insert

1. Modified Tables
- `fraud_predictions`: removed UPDATE and DELETE privileges that were inherited from project defaults.

2. Security
- `anon` and `authenticated` keep only SELECT and INSERT, matching the existing row level security policies.
- Prediction history is append-only from the app's point of view.

3. Important Notes
- This migration does not remove any data.
*/

REVOKE UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON fraud_predictions FROM anon, authenticated;
GRANT SELECT, INSERT ON fraud_predictions TO anon, authenticated;
