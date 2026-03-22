-- Seed script for Real Dentistry Scholarships
-- Updated with real-world funding options for UK Dental Students

TRUNCATE TABLE platform_scholarships RESTART IDENTITY CASCADE;

INSERT INTO platform_scholarships (
    guid, title, slug, description, amount_value, amount_currency, 
    deadline, application_link, is_sponsored, target_degree_level, target_location,
    eligibility_criteria_json, created_at, updated_at
) VALUES 
(
    gen_random_uuid(), 'NHS Bursary Scheme', 'nhs-bursary-scheme', 
    'Financial support for medical and dental students in the later years of their course. Covers tuition fees and provides a means-tested bursary for living costs.', 
    0.00, '£', 'During course', 'https://www.nhsbsa.nhs.uk/nhs-bursary-students', 
    true, 'BDS', 'United Kingdom', '{"notes": "Means-tested; automatic eligibility for students in later years."}', now(), now()
),
(
    gen_random_uuid(), 'NHS Learning Support Fund', 'nhs-learning-support-fund', 
    'Additional funding for healthcare students, including those in dental therapy and hygiene. Includes a training grant of £5,000 per year.', 
    5000.00, '£', 'Apply yearly', 'https://www.nhsbsa.nhs.uk/nhs-learning-support-fund-lsf', 
    true, 'BDS', 'United Kingdom', '{"notes": "Apply yearly after enrolment. For healthcare students incl. dentistry."}', now(), now()
),
(
    gen_random_uuid(), 'Queen Mary Bursary', 'queen-mary-bursary', 
    'Awards for undergraduate students from lower-income households. Medicine and dentistry students are eligible in years where they are not NHS-funded.', 
    0.00, '£', '2026-07-31', 'https://www.qmul.ac.uk/undergraduate/fees-and-funding/bursaries-and-scholarships/queen-mary-bursary/', 
    false, 'BDS', 'United Kingdom', '{"notes": "Auto-assessed based on Student Finance application."}', now(), now()
),
(
    gen_random_uuid(), 'UCAS Dentistry Application', 'ucas-dentistry-application', 
    'The primary application route for all UK dentistry programs. Essential for entry and consideration for university-specific funding.', 
    0.00, '£', 'October 15 annually', 'https://www.ucas.com/', 
    false, 'BDS', 'United Kingdom', '{"notes": "Early deadline requirement for all aspiring dental students."}', now(), now()
),
(
    gen_random_uuid(), 'Opportunity Scholarship', 'newcastle-opportunity-scholarship', 
    'Awards for Newcastle University students from low-income backgrounds. Automatically assessed via your UCAS application.', 
    1000.00, '£', 'Automatic', 'https://www.ncl.ac.uk/undergraduate/fees-funding/scholarships-bursaries/opportunity-scholarship/', 
    false, 'BDS', 'United Kingdom', '{"notes": "Income-based; no separate application required."}', now(), now()
),
(
    gen_random_uuid(), 'Dental Scholarships', 'newcastle-dental-scholarships', 
    'Various alumni-funded and department-specific scholarships available to enrolled dental students at Newcastle University.', 
    0.00, '£', 'After enrolment', 'https://www.ncl.ac.uk/dental/study/undergraduate/fees-funding/', 
    false, 'BDS', 'United Kingdom', '{"notes": "Course-specific funds for dental students."}', now(), now()
),
(
    gen_random_uuid(), 'RUK Bursary', 'dundee-ruk-bursary', 
    'Financial support for students from the rest of the UK (non-Scottish) studying at the University of Dundee.', 
    2000.00, '£', '2026-08-27', 'https://www.dundee.ac.uk/scholarships', 
    false, 'BDS', 'United Kingdom', '{"notes": "Specifically for non-Scottish UK residents."}', now(), now()
),
(
    gen_random_uuid(), 'Academic Excellence', 'dundee-academic-excellence', 
    'Merit-based scholarships for students achieving high grades, offering significant tuition or living cost support.', 
    3000.00, '£', '2026-08-27', 'https://www.dundee.ac.uk/scholarships', 
    true, 'BDS', 'United Kingdom', '{"notes": "Grade-based award for high achievers."}', now(), now()
),
(
    gen_random_uuid(), 'UEA Scholarship', 'uea-scholarship', 
    'Competitive scholarships for students at the University of East Anglia, providing support based on merit and financial need.', 
    1000.00, '£', '2026-05-18', 'https://www.uea.ac.uk/study/fees-and-funding/scholarships-finder', 
    false, 'BDS', 'United Kingdom', '{"notes": "Competitive application process."}', now(), now()
),
(
    gen_random_uuid(), 'Kitchener Scholarship', 'kitchener-scholarship', 
    'A prestigious scholarship for the children or dependents of service personnel who have served in the British Armed Forces.', 
    0.00, '£', '2026-05-31', 'https://www.forfars.org.uk/kitchener-scholarships/', 
    false, 'BDS', 'United Kingdom', '{"notes": "Exclusively for military families."}', now(), now()
),
(
    gen_random_uuid(), 'Education Future Scholarship', 'education-future-scholarship', 
    'A global scholarship program aimed at supporting high-potential international students for studies abroad.', 
    15000.00, '$', '2026-04-10', 'https://www.education-future.org/', 
    false, 'BDS', 'Global', '{"notes": "Dedicated to international students."}', now(), now()
),
(
    gen_random_uuid(), 'Kingston Scholarship', 'kingston-scholarship', 
    'Support for undergraduate students who have received an offer to study at Kingston University.', 
    0.00, '£', '2026-04-09', 'https://www.kingston.ac.uk/undergraduate/fees-and-funding/scholarships-and-bursaries/', 
    false, 'BDS', 'United Kingdom', '{"notes": "Offer of study required before application."}', now(), now()
)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    amount_value = EXCLUDED.amount_value,
    eligibility_criteria_json = EXCLUDED.eligibility_criteria_json,
    application_link = EXCLUDED.application_link,
    updated_at = now();
