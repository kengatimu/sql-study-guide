-- ============================================================
--  Practice database for the SQL Study Guide
--  A small, fictional company: regions, countries, locations,
--  departments, jobs, employees and their dependents.
--
--  PostgreSQL version - run it in pgAdmin's Query Tool (F5).
--  Some data is deliberately "imperfect" so you can practise:
--    * most employees have no commission  (NULL commission_pct)
--    * one employee has no department yet (Tom Harris)
--    * the Legal department has no employees
--    * some countries have no office locations
--    * two employees have no phone number
--    * a couple of salaries fall outside their job's official range
-- ============================================================


DROP TABLE IF EXISTS dependents;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS countries;
DROP TABLE IF EXISTS regions;

CREATE TABLE regions (
  region_id    INTEGER PRIMARY KEY,
  region_name  TEXT NOT NULL
);

CREATE TABLE countries (
  country_id    TEXT PRIMARY KEY,          -- two-letter code, e.g. 'KE'
  country_name  TEXT NOT NULL,
  region_id     INTEGER NOT NULL REFERENCES regions(region_id)
);

CREATE TABLE locations (
  location_id     INTEGER PRIMARY KEY,
  street_address  TEXT,
  postal_code     TEXT,
  city            TEXT NOT NULL,
  state_province  TEXT,
  country_id      TEXT NOT NULL REFERENCES countries(country_id)
);

CREATE TABLE departments (
  department_id    INTEGER PRIMARY KEY,
  department_name  TEXT NOT NULL,
  location_id      INTEGER REFERENCES locations(location_id)
);

CREATE TABLE jobs (
  job_id      TEXT PRIMARY KEY,
  job_title   TEXT NOT NULL,
  min_salary  INTEGER,
  max_salary  INTEGER
);

CREATE TABLE employees (
  employee_id     INTEGER PRIMARY KEY,
  first_name      TEXT,
  last_name       TEXT NOT NULL,
  email           TEXT NOT NULL UNIQUE,
  phone_number    TEXT,
  hire_date       DATE NOT NULL,
  job_id          TEXT NOT NULL REFERENCES jobs(job_id),
  salary          NUMERIC(10,2) NOT NULL,            -- monthly salary
  commission_pct  NUMERIC(4,2),                     -- only sales staff earn commission
  manager_id      INTEGER REFERENCES employees(employee_id),
  department_id   INTEGER REFERENCES departments(department_id)
);

CREATE TABLE dependents (
  dependent_id  INTEGER PRIMARY KEY,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  relationship  TEXT NOT NULL,
  employee_id   INTEGER NOT NULL REFERENCES employees(employee_id)
);

INSERT INTO regions VALUES
  (1, 'Europe'),
  (2, 'Americas'),
  (3, 'Asia'),
  (4, 'Middle East and Africa');

INSERT INTO countries VALUES
  ('US', 'United States of America', 2),
  ('CA', 'Canada', 2),
  ('BR', 'Brazil', 2),
  ('UK', 'United Kingdom', 1),
  ('DE', 'Germany', 1),
  ('FR', 'France', 1),
  ('KE', 'Kenya', 4),
  ('ZA', 'South Africa', 4),
  ('EG', 'Egypt', 4),
  ('IN', 'India', 3),
  ('JP', 'Japan', 3),
  ('SG', 'Singapore', 3);

INSERT INTO locations VALUES
  (1100, '400 Market Street',     '94105',    'San Francisco', 'California',       'US'),
  (1200, '88 Bay Street',         'M5J 2R8',  'Toronto',       'Ontario',          'CA'),
  (1300, '12 Kingsway',           'WC2B 6AA', 'London',        NULL,               'UK'),
  (1400, 'Friedrichstrasse 101',  '10117',    'Berlin',        NULL,               'DE'),
  (1500, '14 Westlands Road',     '00100',    'Nairobi',       'Nairobi County',   'KE'),
  (1600, '5 Marina Boulevard',    '018940',   'Singapore',     NULL,               'SG'),
  (1700, '2-1 Marunouchi',        '100-0005', 'Tokyo',         'Tokyo Prefecture', 'JP'),
  (1800, '77 MG Road',            '560001',   'Bengaluru',     'Karnataka',        'IN');

INSERT INTO departments VALUES
  (10,  'Executive',        1100),
  (20,  'Finance',          1100),
  (30,  'Human Resources',  1300),
  (40,  'Sales',            1300),
  (50,  'Marketing',        1200),
  (60,  'IT',               1500),
  (70,  'Customer Support', 1500),
  (80,  'Operations',       1400),
  (90,  'Research',         1700),
  (100, 'Legal',            1600);

INSERT INTO jobs VALUES
  ('CEO',     'Chief Executive Officer', 20000, 40000),
  ('VP',      'Vice President',          15000, 30000),
  ('FIN_MGR', 'Finance Manager',          9000, 16000),
  ('ACCT',    'Accountant',               4500,  9000),
  ('HR_REP',  'HR Representative',        4000,  9000),
  ('SA_MAN',  'Sales Manager',           10000, 20000),
  ('SA_REP',  'Sales Representative',     6000, 12000),
  ('MK_MAN',  'Marketing Manager',        9000, 15000),
  ('MK_REP',  'Marketing Specialist',     4000,  9000),
  ('IT_MGR',  'IT Manager',              10000, 18000),
  ('DEV',     'Software Developer',       6000, 14000),
  ('SUP_AGT', 'Support Agent',            3000,  6000),
  ('OPS_MGR', 'Operations Manager',       8000, 15000),
  ('OPS_CLK', 'Operations Clerk',         2500,  5500),
  ('RES_SCI', 'Research Scientist',       8000, 16000);

INSERT INTO employees VALUES
  (100, 'Grace',    'Mwangi',    'gmwangi@company.example',    '+1 415 555 0100', '2012-03-15', 'CEO',     32000, NULL, NULL, 10),
  (101, 'Daniel',   'Okafor',    'dokafor@company.example',    '+1 415 555 0101', '2013-06-01', 'VP',      22000, NULL, 100,  10),
  (102, 'Sofia',    'Lindqvist', 'slindqvist@company.example', '+1 415 555 0102', '2014-01-20', 'VP',      21000, NULL, 100,  10),
  (103, 'Peter',    'Kamau',     'pkamau@company.example',     '+1 415 555 0103', '2015-04-11', 'FIN_MGR', 13500, NULL, 101,  20),
  (104, 'Amara',    'Nwosu',     'anwosu@company.example',     '+1 415 555 0104', '2017-09-03', 'ACCT',     7200, NULL, 103,  20),
  (105, 'Liam',     'O''Brien',  'lobrien@company.example',    '+1 415 555 0105', '2019-02-18', 'ACCT',     6800, NULL, 103,  20),
  (106, 'Mei',      'Tanaka',    'mtanaka@company.example',    '+1 415 555 0106', '2022-07-25', 'ACCT',     5100, NULL, 103,  20),
  (107, 'Fatuma',   'Hassan',    'fhassan@company.example',    '+44 20 7946 0107', '2016-11-07', 'HR_REP',  6500, NULL, 101,  30),
  (108, 'Oliver',   'Smith',     'osmith@company.example',     '+44 20 7946 0108', '2021-03-29', 'HR_REP',  4800, NULL, 107,  30),
  (109, 'Isabella', 'Rossi',     'irossi@company.example',     '+44 20 7946 0109', '2014-08-12', 'SA_MAN', 15000, 0.20, 102,  40),
  (110, 'James',    'Carter',    'jcarter@company.example',    '+44 20 7946 0110', '2016-05-30', 'SA_REP',  9500, 0.15, 109,  40),
  (111, 'Chloe',    'Dubois',    'cdubois@company.example',    '+44 20 7946 0111', '2018-10-15', 'SA_REP',  8700, 0.10, 109,  40),
  (112, 'Brian',    'Otieno',    'botieno@company.example',    '+44 20 7946 0112', '2020-01-06', 'SA_REP',  7800, 0.10, 109,  40),
  (113, 'Hannah',   'Müller',    'hmuller@company.example',    '+44 20 7946 0113', '2023-02-13', 'SA_REP',  6400, 0.05, 109,  40),
  (114, 'Kwame',    'Mensah',    'kmensah@company.example',    '+44 20 7946 0114', '2015-07-21', 'SA_REP', 15500, 0.25, 109,  40),
  (115, 'Nadia',    'Petrova',   'npetrova@company.example',   '+1 416 555 0115', '2016-02-01', 'MK_MAN', 12500, NULL, 102,  50),
  (116, 'Ethan',    'Brown',     'ebrown@company.example',     '+1 416 555 0116', '2019-08-19', 'MK_REP',  6100, NULL, 115,  50),
  (117, 'Zara',     'Ali',       'zali@company.example',       '+1 416 555 0117', '2021-11-22', 'MK_REP',  5600, NULL, 115,  50),
  (118, 'Samuel',   'Njoroge',   'snjoroge@company.example',   '+254 20 555 0118', '2014-10-01', 'IT_MGR', 16000, NULL, 101,  60),
  (119, 'Wanjiru',  'Kariuki',   'wkariuki@company.example',   '+254 20 555 0119', '2016-06-13', 'DEV',    12800, NULL, 118,  60),
  (120, 'Arjun',    'Patel',     'apatel@company.example',     '+254 20 555 0120', '2017-03-06', 'DEV',    11500, NULL, 118,  60),
  (121, 'Lucy',     'Achieng',   'lachieng@company.example',   '+254 20 555 0121', '2019-09-09', 'DEV',     9800, NULL, 118,  60),
  (122, 'Mateo',    'Garcia',    'mgarcia@company.example',    '+254 20 555 0122', '2021-05-17', 'DEV',     8400, NULL, 118,  60),
  (123, 'Aisha',    'Bello',     'abello@company.example',     '+254 20 555 0123', '2023-08-28', 'DEV',     7000, NULL, 118,  60),
  (124, 'Kevin',    'Mutua',     'kmutua@company.example',     '+254 20 555 0124', '2018-04-23', 'SUP_AGT', 4200, NULL, 118,  70),
  (125, 'Emily',    'Clark',     'eclark@company.example',     '+254 20 555 0125', '2020-12-01', 'SUP_AGT', 3900, NULL, 124,  70),
  (126, 'Joseph',   'Wafula',    'jwafula@company.example',    '+254 20 555 0126', '2022-03-14', 'SUP_AGT', 3600, NULL, 124,  70),
  (127, 'Ruth',     'Chebet',    'rchebet@company.example',    NULL,               '2024-01-08', 'SUP_AGT', 2800, NULL, 124,  70),
  (128, 'Hans',     'Becker',    'hbecker@company.example',    '+49 30 555 0128', '2015-09-28', 'OPS_MGR', 11000, NULL, 102,  80),
  (129, 'Anna',     'Schmidt',   'aschmidt@company.example',   '+49 30 555 0129', '2018-06-04', 'OPS_CLK',  4100, NULL, 128,  80),
  (130, 'Lukas',    'Weber',     'lweber@company.example',     '+49 30 555 0130', '2020-10-19', 'OPS_CLK',  3800, NULL, 128,  80),
  (131, 'Yuki',     'Sato',      'ysato@company.example',      '+81 3 5555 0131', '2016-12-12', 'RES_SCI', 14200, NULL, 101,  90),
  (132, 'Kenji',    'Watanabe',  'kwatanabe@company.example',  '+81 3 5555 0132', '2019-04-01', 'RES_SCI', 12100, NULL, 131,  90),
  (133, 'Priya',    'Sharma',    'psharma@company.example',    '+81 3 5555 0133', '2022-09-05', 'RES_SCI',  9800, NULL, 131,  90),
  (134, 'Tom',      'Harris',    'tharris@company.example',    NULL,               '2024-06-17', 'DEV',     7600, NULL, 118,  NULL);

INSERT INTO dependents VALUES
  (1,  'Neema',  'Mwangi',    'Child',  100),
  (2,  'David',  'Mwangi',    'Child',  100),
  (3,  'Chidi',  'Okafor',    'Child',  101),
  (4,  'Erik',   'Lindqvist', 'Spouse', 102),
  (5,  'Wambui', 'Kamau',     'Child',  103),
  (6,  'Ada',    'Nwosu',     'Child',  104),
  (7,  'Sean',   'O''Brien',  'Child',  105),
  (8,  'Marco',  'Rossi',     'Spouse', 109),
  (9,  'Mia',    'Carter',    'Child',  110),
  (10, 'Akosua', 'Mensah',    'Child',  114),
  (11, 'Ivan',   'Petrov',    'Spouse', 115),
  (12, 'Baraka', 'Njoroge',   'Child',  118),
  (13, 'Imani',  'Kariuki',   'Child',  119),
  (14, 'Rohan',  'Patel',     'Child',  120),
  (15, 'Sakura', 'Sato',      'Child',  131);
