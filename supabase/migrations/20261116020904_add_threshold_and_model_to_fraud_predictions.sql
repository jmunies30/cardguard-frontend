/*
# Add threshold and model name to fraud_predictions

1. Modified Tables
- `fraud_predictions`
  - `threshold` (double precision, nullable): the decision threshold the backend reported for the prediction.
  - `model_name` (text, nullable): the model name the backend reported for the prediction.

2. Security
- No policy or grant changes. The existing read and insert access already covers the new columns.

3. Important Notes
- Both columns are nullable so rows saved before this change remain valid. No data is removed or altered.
*/

ALTER TABLE fraud_predictions ADD COLUMN IF NOT EXISTS threshold double precision;
ALTER TABLE fraud_predictions ADD COLUMN IF NOT EXISTS model_name text;
