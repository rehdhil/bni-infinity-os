-- Members (seeded from BNI_INFINITY_MASTER.csv)
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
CREATE TABLE payment_plans (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id       uuid NOT NULL REFERENCES members(id),
  plan_type       text NOT NULL CHECK (plan_type IN ('monthly', '6month')),
  term_start      date NOT NULL,
  term_end        date NOT NULL,
  amount_paid     int NOT NULL,
  discount        int NOT NULL DEFAULT 0,
  active          bool NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Meeting sessions (offline meetings only trigger collection)
CREATE TABLE meeting_sessions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_date     date NOT NULL UNIQUE,
  type             text NOT NULL CHECK (type IN ('offline', 'online')),
  collection_open  bool NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- One-time or additional fees per member
CREATE TABLE fees (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id    uuid NOT NULL REFERENCES members(id),
  fee_type     text NOT NULL CHECK (fee_type IN ('one_time', 'arrear', 'penalty')),
  amount       int NOT NULL,
  due_date     date,
  status       text NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'paid', 'written_off')),
  description  text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- All payment submissions
CREATE TABLE payments (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id        uuid NOT NULL REFERENCES members(id),
  amount           int NOT NULL,
  method           text NOT NULL CHECK (method IN ('UPI', 'Cash', 'CC')),
  transaction_ref  text,
  proof_url        text,
  period_month     int NOT NULL CHECK (period_month BETWEEN 1 AND 12),
  period_year      int NOT NULL,
  status           text NOT NULL DEFAULT 'pending_verification'
                    CHECK (status IN ('pending_verification', 'verified', 'rejected')),
  verified_by      uuid REFERENCES members(id),
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- Visitor payments (not linked to members table)
CREATE TABLE visitor_payments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_name  text NOT NULL,
  phone         text,
  invited_by    uuid REFERENCES members(id),
  amount        int NOT NULL,
  meeting_id    uuid NOT NULL REFERENCES meeting_sessions(id),
  collector_name text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- OTP sessions
CREATE TABLE otp_sessions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone       text NOT NULL,
  otp_hash    text NOT NULL,
  expires_at  timestamptz NOT NULL,
  used        bool NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Balance view: total due per active member
CREATE VIEW member_balance AS
SELECT
  m.id,
  m.name,
  m.phone,
  m.power_team,
  m.status,
  -- Unpaid one-time fees
  COALESCE(
    (SELECT SUM(f.amount) FROM fees f
     WHERE f.member_id = m.id AND f.status = 'pending'),
    0
  ) AS unpaid_fees,
  -- Verified payments total
  COALESCE(
    (SELECT SUM(p.amount) FROM payments p
     WHERE p.member_id = m.id AND p.status = 'verified'),
    0
  ) AS total_paid,
  -- Whether member has active 6-month plan covering today
  EXISTS (
    SELECT 1 FROM payment_plans pp
    WHERE pp.member_id = m.id
      AND pp.plan_type = '6month'
      AND pp.active = true
      AND CURRENT_DATE BETWEEN pp.term_start AND pp.term_end
  ) AS has_term_plan
FROM members m
WHERE m.status = 'active';

-- Seed the 6 offline meeting dates for Apr-Sep 2026 term
INSERT INTO meeting_sessions (meeting_date, type, collection_open) VALUES
  ('2026-04-01', 'offline', false),
  ('2026-05-06', 'offline', false),
  ('2026-06-03', 'offline', false),
  ('2026-07-01', 'offline', false),
  ('2026-08-05', 'offline', false),
  ('2026-09-02', 'offline', false);
