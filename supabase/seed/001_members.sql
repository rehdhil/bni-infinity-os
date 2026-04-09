-- =============================================================================
-- 001_members.sql — BNI Infinity Chapter Seed Data
-- Term: April–September 2026
-- Source: BNI_INFINITY_MASTER.csv + April 2026 payment collection
--
-- WARNING: Run ONCE only on a fresh database. Not idempotent.
-- =============================================================================


-- =============================================================================
-- SECTION 1: MEMBERS
-- All members from BNI_INFINITY_MASTER.csv
-- Names stored in UPPER CASE to match CSV source
-- Churned members (Nafis K Sidheeq, Lijo Antony) included with status='churned'
-- =============================================================================

INSERT INTO members (name, phone, category, company, power_team, join_date, status) VALUES
  ('MOHAMED ABDULLA',          '+91 9447 304 615', 'Dentist',                               'Dr. Teeth Specialist Dental Clinic',           'Hospitality',  '2017-10-25', 'active'),
  ('MIRKASIM ABU',             '+91 9656 884 445', 'Pharmaceutical',                        'Quickmed',                                     'HNI',          '2025-04-02', 'active'),
  ('LIJO ANTONY',              '+91 9544 950 022', 'Photographer',                          'Nethra Hitech',                                'Marketing',    '2025-11-12', 'churned'),
  ('ATHIRA BINDHU',            '+91 7356 770 318', 'Educational Facility',                  'Bharath Institute of Distance Education',      'SME',          '2025-11-05', 'active'),
  ('BENOY BRIGHT',             '+91 9037 849 799', 'Tax Advisor',                           'Bright Associates',                            'SME',          '2022-07-20', 'active'),
  ('SREEJEEV CHANDRAN',        '+91 9048 270 000', 'Logistics',                             'Stun Sign Logistics Pvt. Ltd.',                'SME',          '2023-09-13', 'active'),
  ('SIJO CHANDRAN',            '+91 9656 465 151', 'Hospitality Consultant',                'Sijochandran Private Limited',                 'Hospitality',  '2025-06-04', 'active'),
  ('SUJITH CHANDRASEKHARAN',   '+91 9846 283 532', 'Civil/Structural Engineer',             'Chandragiri Projects and Infrastructure',      'Construction', '2021-09-22', 'active'),
  ('SANAH CLETUS',             '+91 9061 358 222', 'Fire Protection',                       'Geemacs Fire Systems (P) Ltd',                 'Projects',     '2018-11-28', 'active'),
  ('GERALD D''SOUZA',          '+91 9037 898 113', 'Solar',                                 'Powergene Solar Private Limited',              'HNI',          '2024-11-13', 'active'),
  ('JAGANNATH DHAMODARAN',     '+91 9961 738 844', 'Computer & Programming',                'Scoreplus IT Solutions and Training',          'SME',          '2021-10-27', 'active'),
  ('SHAHUL HAMEED',            '+91 9037 387 357', 'Electrical Contractor',                 'NH Electricals',                               'Construction', '2024-09-18', 'active'),
  ('LIJO ISAC',                '+91 9742 142 994', 'Travel (Others)',                       'Coco Routes',                                  'Hospitality',  '2025-12-10', 'active'),
  ('NOBY MON M JACOB',         '+91 4842 322 888', 'Manufacturer of Water Purifier',        'Austinroz India Pvt Ltd',                      'Projects',     '2017-11-01', 'active'),
  ('ARUN JOSE',                '+91 9746 012 373', 'Business Financing',                    'Envision Financial Services',                  'Marketing',    '2024-12-04', 'active'),
  ('AJISH JOSEPH',             '+91 9946 062 222', 'Printing Services',                     'Firefly',                                      'Marketing',    '2017-11-01', 'active'),
  ('JUSTIN JOSEPH',            '+91 9961 949 983', 'Steel Fabrication',                     'Rainbow Engineers',                            'Construction', '2019-10-09', 'active'),
  ('ANUP JOY',                 '+91 9387 522 002', 'Event Planner',                         'Watermark Event Solutions LLP',                'Marketing',    '2017-10-25', 'active'),
  ('ABHILASH JOY',             '+91 9388 807 624', 'Engineering',                           'Stuba Engineering',                            'HNI',          '2017-11-01', 'active'),
  ('MANUCHANDRAN K',           '+91 7994 443 422', 'Chemical Mechanical Anchoring',         'Cincotech Engineering LLP',                    'Construction', '2020-06-17', 'active'),
  ('JAYAN K',                  '+91 9447 221 899', 'Company Secretary',                     'SVJS & Associates',                            'SME',          '2017-11-01', 'active'),
  ('SEBASTIAN K',              '+91 4842 381 722', 'Ticketing/Visa',                        'Cosima Travel & Trade Links Private Limited',  'Hospitality',  '2017-10-25', 'active'),
  ('LIBIN K G',                '+91 9540 432 321', 'Adventure and Amusement',               'Wonder Valley',                                'Hospitality',  '2024-06-26', 'active'),
  ('SHIJOY K G',               '+91 9846 046 546', 'Business Advisor',                      'Proact Finserv',                               'SME',          '2026-03-04', 'active'),
  ('KRISHNAN KUTTY K N',       '+91 9847 046 614', 'Life and Disability Insurance',         'Invest 4U',                                    'SME',          '2017-10-25', 'active'),
  ('KISHOR K R',               '+91 7012 256 457', 'Prefabricated Buildings',               'FT Infrastructures Pvt Ltd',                   'HNI',          '2017-12-13', 'active'),
  ('KISHORE KRISHNA TK',       '+91 9605 822 211', 'Financial Advisor',                     'TIFS Consulting',                              'HNI',          '2020-02-05', 'active'),
  ('ARJUN K KUMAR',            '+91 6282 113 506', 'Digital Marketing',                     'Mantra IT Solutions',                          'Marketing',    '2024-03-27', 'active'),
  ('KISHORE KUMAR R',          '+91 9539 640 666', 'Opticals',                              'Nayana Eye Clinic & Opticals',                 'Hospitality',  '2025-09-03', 'active'),
  ('SHINJU LAWRENCE',          '+91 9074 869 201', 'Recruiter',                             'Grene HR Consultancy LLP',                     'SME',          '2025-09-17', 'active'),
  ('NIYAS M K',                '+91 9846 073 006', 'Builder-Residential',                   'NJN Homes',                                    'Construction', '2024-09-04', 'active'),
  ('JOBY M P',                 '+91 9961 412 811', 'Skin Clinic',                           'Almeka Medical Centre',                        'Hospitality',  '2023-11-08', 'active'),
  ('GAUTHAM MANOJ',            '+91 8089 808 992', 'Branding',                              'Noun Creatives',                               'Marketing',    '2017-10-25', 'active'),
  ('JUBY SUSAN MATHEW',        '+91 9072 677 501', 'Travel Agent',                          'Auslen Holidays',                              'Hospitality',  '2020-02-05', 'active'),
  ('JOSHY MATHEW C',           '+91 9048 199 913', 'Foreign Exchange',                      'Orient Exchange & Financial Services Pvt Ltd', 'HNI',          '2017-10-25', 'active'),
  ('SHIMJITH METHATTA',        '+91 9744 195 504', 'Computer Accessories',                  'Netcom Services',                              'Marketing',    '2017-10-25', 'active'),
  ('NIJAS NAZER',              '+91 8891 381 834', 'Painting Contractor',                   'Fine Touch IAC',                               'Construction', '2023-12-13', 'active'),
  ('ABHILASH O S',             '+91 7012 752 342', 'Education Services/Tutor',              'Avas Consultants',                             'HNI',          '2020-02-12', 'active'),
  ('RAVISHANKAR P',            '+91 7012 889 340', 'UPS/Inverter',                          'Green Earth Technologies',                     'Construction', '2020-09-16', 'active'),
  ('BINIL PAULY',              '+91 8075 004 863', 'Waterproofing',                         'Fysolutions',                                  'Construction', '2023-01-04', 'active'),
  ('YOGESH PRABHAKARAN',       '+91 9930 019 909', 'Salon/Spa',                             'Thriphala Ayurveda and Spa Consultancy',        'Hospitality',  '2020-02-12', 'active'),
  ('JIM PRINCE',               '+91 9447 025 334', 'Health Insurance',                      'Star Health & Allied Insurance Co. Ltd.',      'HNI',          '2018-05-30', 'active'),
  ('SREEHARI PURUSHOTHAMAN',   '+91 9847 035 901', 'Interior Contractor',                   'City Scapes Designers & Contractors',          'Projects',     '2017-10-25', 'active'),
  ('HARISH R',                 '+91 9847 760 582', 'Civil Contractor',                      'Vardhaki Projects Private Limited',            'Construction', '2018-10-17', 'active'),
  ('VIJAY RAJAN',              '+91 9946 454 999', 'Hotel',                                 'Opulent Hotels',                               'Hospitality',  '2024-02-21', 'active'),
  ('REIZON GEO REJI',          '+91 9747 248 500', 'Industrial Automation',                 'Steel City Industries',                        'Projects',     '2025-03-05', 'active'),
  ('A M FAHIM RIYAZ',          '+91 9249 457 575', 'Roofing & Gutters',                     'AM Mohammed Usman & Brother',                  'Construction', '2017-10-25', 'active'),
  ('BENJAMIN ROY',             '+91 9995 199 273', 'Windows & Doors',                       'Hekur Contractors Pvt Ltd',                    'Construction', '2017-12-27', 'active'),
  -- NOTE: Nabeela Sait's phone in CSV (+91 9447 221 899) is a duplicate of Jayan K — verify and update
  ('NABEELA SAIT',             '+91 0000 000 000', 'Public Address Systems',                'Mecotronics Ernakulam',                         'HNI',          '2017-11-01', 'active'),
  ('ARUN SASI',                '+91 9447 956 973', 'Consulting',                            'Neowave HR Consultants',                       'SME',          '2022-04-06', 'active'),
  ('GEORGE SEBASTIAN',         '+91 8714 422 664', 'Uniforms',                              'JB Creations',                                 'SME',          '2024-02-21', 'active'),
  ('MARIA SHAJI',              '+91 9562 442 789', 'Gifts',                                 'Hamperbells',                                  'Marketing',    '2023-11-29', 'active'),
  ('NAFIS K SIDHEEQ',          '+91 9539 699 595', 'Interior Architecture',                 'Entail Design Arena',                          'Projects',     '2022-02-23', 'churned'),
  ('REHDHIL SIYAD',            '+91 9544 559 292', 'Sales Automation',                      'Tetherlo',                                     'Marketing',    '2023-11-29', 'active'),
  ('P S SUDHEER',              '+91 8891 064 567', 'Elevator Consultant',                   'AEC Asia Inc',                                 'Projects',     '2019-11-13', 'active'),
  ('JACOB THEKKEKARA',         '+91 9940 396 262', 'Solar Electric Vehicles',               'Sugrah Mobility Private Limited',              'Projects',     '2025-01-01', 'active'),
  ('GEORGE THOMAS',            '+91 9847 057 578', 'Security Systems',                      'Universal Systems Corporation',                'Projects',     '2017-10-25', 'active'),
  ('SAJEEV V K',               '+91 9847 031 213', 'ERP Software',                          'Impact Integrated Info Systems (P)Ltd',        'Projects',     '2025-10-01', 'active'),
  ('RIYA ZACHARIAS PAUL',      '+91 9846 348 700', 'Architect',                             'Raspberry Design Architects',                  'HNI',          '2019-12-04', 'active'),
  ('CHRIZTOPHER ZINE',         '+91 9633 491 957', 'Video Production',                      'Dista Solutions Pvt Ltd',                      'Marketing',    '2024-12-04', 'active'),
  ('SAREESH K R',              '+91 9847 036 129', 'Auto/Car Rental/Leasing',               'Kerala Dew Drops',                             'Hospitality',  '2026-02-11', 'active'),
  ('SUMA N',                   '+91 9446 989 996', 'Lawyer',                                'Precise Law House',                            'SME',          '2025-12-03', 'active'),
  ('ADITHYAN EZHAPILLY',       '+91 9633 911 803', 'Family Law',                            'Adv Adithyan Ezhapilly Associates',            'SME',          '2026-03-11', 'active'),
  ('GAYA YOGESH',              '+91 9967 425 757', 'Ayurveda',                              'Thriphala Ayurveda Services Private Limited',  'Hospitality',  '2026-03-25', 'active');


-- =============================================================================
-- SECTION 2: FEES (one-time outstanding fees)
-- =============================================================================

-- Sijo Chandran — ₹10,000 outstanding balance (pending)
INSERT INTO fees (member_id, fee_type, amount, due_date, status, description)
SELECT id, 'arrear', 10000, '2026-04-01', 'pending', 'Outstanding balance'
FROM members WHERE name = 'SIJO CHANDRAN';

-- Sujith Chandrasekharan — ₹5,000 outstanding balance (pending)
INSERT INTO fees (member_id, fee_type, amount, due_date, status, description)
SELECT id, 'arrear', 5000, '2026-04-01', 'pending', 'Outstanding balance'
FROM members WHERE name = 'SUJITH CHANDRASEKHARAN';

-- A M Fahim Riyaz — ₹2,500 arrear (settled with April payment, status=paid)
INSERT INTO fees (member_id, fee_type, amount, due_date, status, description)
SELECT id, 'arrear', 2500, '2026-04-01', 'paid', 'Arrear settled with April 2026 payment'
FROM members WHERE name = 'A M FAHIM RIYAZ';

-- Benoy Bright — ₹2,500 outstanding (still pending)
INSERT INTO fees (member_id, fee_type, amount, due_date, status, description)
SELECT id, 'arrear', 2500, '2026-04-01', 'pending', 'Outstanding balance'
FROM members WHERE name = 'BENOY BRIGHT';

-- Shinju Lawrence — ₹2,500 outstanding (still pending)
INSERT INTO fees (member_id, fee_type, amount, due_date, status, description)
SELECT id, 'arrear', 2500, '2026-04-01', 'pending', 'Outstanding balance'
FROM members WHERE name = 'SHINJU LAWRENCE';

-- Lijo Antony — ₹7,500 written off (churned member)
INSERT INTO fees (member_id, fee_type, amount, due_date, status, description)
SELECT id, 'arrear', 7500, '2026-04-01', 'written_off', 'Written off — churned member'
FROM members WHERE name = 'LIJO ANTONY';


-- =============================================================================
-- SECTION 3: PAYMENTS — April 2026 (all status='verified')
-- =============================================================================

-- Cash payments
INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'Cash', 4, 2026, 'verified', NULL
FROM members WHERE name = 'GAUTHAM MANOJ';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'Cash', 4, 2026, 'verified', NULL
FROM members WHERE name = 'REIZON GEO REJI';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'Cash', 4, 2026, 'verified', NULL
FROM members WHERE name = 'GEORGE THOMAS';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'Cash', 4, 2026, 'verified', NULL
FROM members WHERE name = 'BENOY BRIGHT';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'Cash', 4, 2026, 'verified', NULL
FROM members WHERE name = 'SREEJEEV CHANDRAN';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'Cash', 4, 2026, 'verified', NULL
FROM members WHERE name = 'ADITHYAN EZHAPILLY';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'Cash', 4, 2026, 'verified', NULL
FROM members WHERE name = 'MANUCHANDRAN K';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'Cash', 4, 2026, 'verified', NULL
FROM members WHERE name = 'NIJAS NAZER';

-- A M Fahim Riyaz — April fee only (arrear handled separately in fees table)
INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'Cash', 4, 2026, 'verified', 'April fee only; separate arrear of ₹2,500 settled'
FROM members WHERE name = 'A M FAHIM RIYAZ';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'Cash', 4, 2026, 'verified', NULL
FROM members WHERE name = 'BENJAMIN ROY';

-- Jim Prince — 6-month advance (Cash, ₹14,500)
INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 14500, 'Cash', 4, 2026, 'verified', '6-month advance Apr–Sep 2026'
FROM members WHERE name = 'JIM PRINCE';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'Cash', 4, 2026, 'verified', NULL
FROM members WHERE name = 'NABEELA SAIT';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'Cash', 4, 2026, 'verified', NULL
FROM members WHERE name = 'RIYA ZACHARIAS PAUL';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'Cash', 4, 2026, 'verified', NULL
FROM members WHERE name = 'MOHAMED ABDULLA';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'Cash', 4, 2026, 'verified', NULL
FROM members WHERE name = 'KISHORE KUMAR R';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'Cash', 4, 2026, 'verified', NULL
FROM members WHERE name = 'JOBY M P';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'Cash', 4, 2026, 'verified', NULL
FROM members WHERE name = 'VIJAY RAJAN';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'Cash', 4, 2026, 'verified', NULL
FROM members WHERE name = 'ARUN JOSE';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'Cash', 4, 2026, 'verified', NULL
FROM members WHERE name = 'REHDHIL SIYAD';

-- CC payments
-- P S Sudheer — 6-month advance (CC, ₹14,500)
INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 14500, 'CC', 4, 2026, 'verified', '6-month advance Apr–Sep 2026'
FROM members WHERE name = 'P S SUDHEER';

-- Kishore Krishna TK — 6-month advance (CC, ₹14,500)
INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 14500, 'CC', 4, 2026, 'verified', '6-month advance Apr–Sep 2026'
FROM members WHERE name = 'KISHORE KRISHNA TK';

-- Barter payments
INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'Barter', 4, 2026, 'verified', NULL
FROM members WHERE name = 'MARIA SHAJI';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'Barter', 4, 2026, 'verified', NULL
FROM members WHERE name = 'AJISH JOSEPH';

-- UPI payments
INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'ANUP JOY';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'ARJUN K KUMAR';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'GEORGE SEBASTIAN';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'CHRIZTOPHER ZINE';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'ATHIRA BINDHU';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'JAGANNATH DHAMODARAN';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'JAYAN K';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'SHIJOY K G';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'KRISHNAN KUTTY K N';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'ARUN SASI';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'HARISH R';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'MIRKASIM ABU';

-- Abhilash Joy — 6-month advance (UPI, ₹14,500)
INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 14500, 'UPI', 4, 2026, 'verified', '6-month advance Apr–Sep 2026'
FROM members WHERE name = 'ABHILASH JOY';

-- Payment data says "Kishore K R" — maps to KISHOR K R in CSV
INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'KISHOR K R';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'NIYAS M K';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'ABHILASH O S';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'LIJO ISAC';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'SEBASTIAN K';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'LIBIN K G';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'YOGESH PRABHAKARAN';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'SAREESH K R';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'GAYA YOGESH';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'SHAHUL HAMEED';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'SREEHARI PURUSHOTHAMAN';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'GERALD D''SOUZA';

INSERT INTO payments (member_id, amount, method, period_month, period_year, status, notes)
SELECT id, 2500, 'UPI', 4, 2026, 'verified', NULL
FROM members WHERE name = 'BINIL PAULY';


-- =============================================================================
-- SECTION 4: PAYMENT PLANS (6-month advance members)
-- =============================================================================

-- Jim Prince — Cash advance
INSERT INTO payment_plans (member_id, plan_type, term_start, term_end, amount_paid, discount, active)
SELECT id, '6month', '2026-04-01', '2026-09-30', 14500, 500, true
FROM members WHERE name = 'JIM PRINCE';

-- P S Sudheer — CC advance
INSERT INTO payment_plans (member_id, plan_type, term_start, term_end, amount_paid, discount, active)
SELECT id, '6month', '2026-04-01', '2026-09-30', 14500, 500, true
FROM members WHERE name = 'P S SUDHEER';

-- Kishore Krishna TK — CC advance
INSERT INTO payment_plans (member_id, plan_type, term_start, term_end, amount_paid, discount, active)
SELECT id, '6month', '2026-04-01', '2026-09-30', 14500, 500, true
FROM members WHERE name = 'KISHORE KRISHNA TK';

-- Abhilash Joy — UPI advance
INSERT INTO payment_plans (member_id, plan_type, term_start, term_end, amount_paid, discount, active)
SELECT id, '6month', '2026-04-01', '2026-09-30', 14500, 500, true
FROM members WHERE name = 'ABHILASH JOY';
