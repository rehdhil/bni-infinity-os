-- Prevent duplicate payments for same member + same month
-- This closes a race condition in the submit route's read-then-write check
--
-- NOTE: This migration will fail if the DB already has duplicate (member_id, period_month, period_year)
-- records. The current seed data has no duplicates (verified), so this is safe for a fresh deploy.
ALTER TABLE payments
  ADD CONSTRAINT payments_member_period_unique
  UNIQUE (member_id, period_month, period_year);
