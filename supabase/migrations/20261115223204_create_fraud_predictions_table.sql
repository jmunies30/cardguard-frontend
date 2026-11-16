/*
# Create fraud_predictions table

1. New Tables
- `fraud_predictions`
  - `id` (uuid, primary key): unique record identifier.
  - `transaction_reference` (text, not null): identifier shown to the user for the analyzed transaction.
  - `features` (jsonb, not null): the feature values that were submitted to the model.
  - `prediction_label` (text, not null): the label exactly as returned by the model backend.
  - `is_fraud` (boolean, not null): whether the backend classified the transaction as fraud.
  - `probability` (double precision, nullable): probability returned by the backend, if any.
  - `created_at` (timestamptz): when the prediction was recorded.

2. Security
- Enable row level security on `fraud_predictions`.
- Grant SELECT and INSERT only to `anon` and `authenticated`. The app has no sign-in, so the anon key must read and write history. Updates and deletes are not granted.
- Policies allow select and insert for both roles because the history is intentionally shared within this app.

3. Important Notes
- Rows are only written after the prediction backend returns a result. No simulated records are created.
- The table is idempotent: it can be re-applied safely.
*/

CREATE TABLE IF NOT EXISTS fraud_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_reference text NOT NULL,
  features jsonb NOT NULL,
  prediction_label text NOT NULL,
  is_fraud boolean NOT NULL,
  probability double precision,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS fraud_predictions_created_at_idx ON fraud_predictions (created_at DESC);

ALTER TABLE fraud_predictions ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON fraud_predictions TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_fraud_predictions" ON fraud_predictions;
CREATE POLICY "anon_select_fraud_predictions" ON fraud_predictions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_fraud_predictions" ON fraud_predictions;
CREATE POLICY "anon_insert_fraud_predictions" ON fraud_predictions FOR INSERT
  TO anon, authenticated WITH CHECK (true);
