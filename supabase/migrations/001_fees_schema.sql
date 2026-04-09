-- Members (seeded from BNI_INFINITY_MASTER.csv)
-- Note: all monetary amounts are stored as whole rupees (integer)
CREATE TABLE members (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  phone        text UNIQUE NOT NULL,
  category     text,
  company      text,
  power_team   text,
  join_date    date,
  status       text NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'churned', 'pending_onboarding')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Payment plans (monthly or 6-month advance)
-- amount_paid: total amount paid upfront (2500 for monthly, 14500 for 6month)
CREATE TABLE payment_plans (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id       uuid NOT NULL REFERENCES members(id) ON DELETE RESTRICT,
  plan_type       text NOT NULL CHECK (plan_type IN ('monthly', '6month')),
  term_start      date NOT NULL,
  term_end        date NOT NULL,
  amount_paid     int NOT NULL,
  discount        int NOT NULL DEFAULT 0,
  active          bool NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Meeting sessions (offline meetings trigger collection; online meetings do not)
CREATE TABLE meeting_sessions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_date     date NOT NULL UNIQUE,
  type             text NOT NULL CHECK (type IN ('offline', 'online')),
  collection_open  bool NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- One-time or additional fees per member (arrears, penalties, special charges)
CREATE TABLE fees (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id    uuid NOT NULL REFERENCES members(id) ON DELETE RESTRICT,
  fee_type     text NOT NULL CHECK (fee_type IN ('one_time', 'arrear', 'penalty')),
  amount       int NOT NULL,
  due_date     date,
  status       text NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'paid', 'written_off')),
  description  text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- All payment submissions (UPI/Cash/CC)
-- verified_by references members(id): ST and headtable members verify payments
CREATE TABLE payments (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id        uuid NOT NULL REFERENCES members(id) ON DELETE RESTRICT,
  amount           int NOT NULL,
  method           text NOT NULL CHECK (method IN ('UPI', 'Cash', 'CC', 'Barter')),
  transaction_ref  text,
  proof_url        text,
  period_month     int NOT NULL CHECK (period_month BETWEEN 1 AND 12),
  period_year      int NOT NULL,
  status           text NOT NULL DEFAULT 'pending_verification'
                    CHECK (status IN ('pending_verification', 'verified', 'rejected')),
  verified_by      uuid REFERENCES members(id) ON DELETE SET NULL,
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- Visitor payments (walk-ins on meeting day — not linked to members table)
CREATE TABLE visitor_payments (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_name   text NOT NULL,
  phone          text,
  invited_by     uuid REFERENCES members(id) ON DELETE SET NULL,
  amount         int NOT NULL,
  meeting_id     uuid NOT NULL REFERENCES meeting_sessions(id) ON DELETE CASCADE,
  collector_name text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- OTP sessions for phone-based login
CREATE TABLE otp_sessions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone       text NOT NULL,
  otp_hash    text NOT NULL,
  expires_at  timestamptz NOT NULL,
  used        bool NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Indexes on hot FK paths used by member_balance view and API routes
CREATE INDEX idx_payment_plans_member_id  ON payment_plans(member_id);
CREATE INDEX idx_fees_member_id           ON fees(member_id);
CREATE INDEX idx_payments_member_id       ON payments(member_id);
CREATE INDEX idx_payments_period          ON payments(period_month, period_year);
CREATE INDEX idx_visitor_payments_meeting ON visitor_payments(meeting_id);
CREATE INDEX idx_otp_sessions_phone       ON otp_sessions(phone, used);

-- Balance view: total due per active member
CREATE VIEW member_balance AS
SELECT
  m.id,
  m.name,
  m.phone,
  m.power_team,
  m.status,
  -- Unpaid one-time/arrear fees
  COALESCE(
    (SELECT SUM(f.amount) FROM fees f
     WHERE f.member_id = m.id AND f.status = 'pending'),
    0
  ) AS unpaid_fees,
  -- Total verified payments (all time)
  COALESCE(
    (SELECT SUM(p.amount) FROM payments p
     WHERE p.member_id = m.id AND p.status = 'verified'),
    0
  ) AS total_paid,
  -- Whether member has an active 6-month plan covering today
  EXISTS (
    SELECT 1 FROM payment_plans pp
    WHERE pp.member_id = m.id
      AND pp.plan_type = '6month'
      AND pp.active = true
      AND CURRENT_DATE BETWEEN pp.term_start AND pp.term_end
  ) AS has_term_plan
FROM members m
WHERE m.status = 'active';

-- Seed: 6 offline meeting dates for Apr-Sep 2026 term (1st Wednesday of each month)
INSERT INTO meeting_sessions (meeting_date, type, collection_open) VALUES
  ('2026-04-01', 'offline', false),
  ('2026-05-06', 'offline', false),
  ('2026-06-03', 'offline', false),
  ('2026-07-01', 'offline', false),
  ('2026-08-05', 'offline', false),
  ('2026-09-02', 'offline', false);
