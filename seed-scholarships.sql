-- Seed script for Medicine/Healthcare Scholarships
-- Source: WeMakeScholars & HotCoursesAbroad

INSERT INTO platform_scholarship (
    external_id, title, slug, description, amount_value, amount_currency, 
    deadline, application_link, is_sponsored, target_degree_level, target_location,
    created_at, updated_at
) VALUES 
(
    'ext1', 'Education Future International Scholarship 2025', 'education-future-international-scholarship-2025', 
    'A global scholarship program aimed at supporting high-potential international students for studies in the USA and non-USA countries.', 
    15000.00, '$', '2025-10-31', 'https://www.wemakescholars.com/scholarship/education-future-international-scholarship', 
    true, 'BDS', 'Global', now(), now()
),
(
    'ext2', 'Commonwealth Distance Learning Scholarships 2026', 'commonwealth-distance-learning-scholarships-2026', 
    'Targeted at students from developing Commonwealth countries to study for a UK Master''s degree while living in their home country.', 
    12000.00, '£', '2025-12-15', 'https://www.wemakescholars.com/scholarship/commonwealth-distance-learning-scholarships', 
    false, 'Masters', 'United Kingdom', now(), now()
),
(
    'ext3', 'Leverhulme Trade Charities Trust Bursary 2026', 'leverhulme-trade-charities-trust-bursary-2026', 
    'Support for undergraduate students in financial need who are children or spouses of commercial travellers, pharmacists, or grocers.', 
    3000.00, '£', '2026-03-01', 'https://www.wemakescholars.com/scholarship/leverhulme-trade-charities-trust-bursary-at-queen-mary-university-of-london', 
    false, 'BDS', 'United Kingdom', now(), now()
),
(
    'ext4', 'Narotam Sekhsaria PG Scholarship 2026-27', 'narotam-sekhsaria-pg-scholarship-2026-27', 
    'Interest-free loan scholarships for Indian students with consistently high academic records who wish to pursue postgraduate studies globally.', 
    20000.00, '$', '2026-03-15', 'https://www.wemakescholars.com/scholarship/narotam-sekhsaria-pg-scholarship', 
    true, 'Masters', 'Global', now(), now()
),
(
    'ext5', 'Qalaa Holdings Scholarships 2026', 'qalaa-holdings-scholarships-2026', 
    'Scholarships for talented Egyptian students to pursue Master''s and PhD degrees at leading international universities.', 
    30000.00, '$', '2026-04-15', 'https://www.wemakescholars.com/scholarship/qalaa-holdings-scholarship', 
    false, 'PhD', 'Global', now(), now()
),
(
    'ext8', 'Carlsberg Foundation Internationalisation Fellowships 2026', 'carlsberg-foundation-internationalisation-fellowships-2026', 
    'Postdoctoral fellowships for outstanding young researchers to stay at leading international research institutions.', 
    40000.00, '€', '2025-10-01', 'https://www.wemakescholars.com/scholarship/carlsberg-foundation-internationalisation-fellowships', 
    false, 'PhD', 'Global', now(), now()
),
(
    'ext9', 'Kitchener Scholarship 2026', 'kitchener-scholarship-2026', 
    'Scholarships for dependants of those who have served in the British Armed Forces, available for undergraduate and postgraduate study.', 
    5000.00, '£', '2026-05-31', 'https://www.wemakescholars.com/scholarship/kitchener-university-scholarship', 
    false, 'BDS', 'United Kingdom', now(), now()
),
(
    'ext10', 'Canon Foundation Research Fellowships 2026', 'canon-foundation-research-fellowships-2026', 
    'Research fellowships awarded to highly qualified European and Japanese researchers for study in Japan or Europe.', 
    25000.00, '€', '2026-09-15', 'https://www.wemakescholars.com/scholarship/canon-foundation-research-fellowship', 
    false, 'PhD', 'Global', now(), now()
)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    amount_value = EXCLUDED.amount_value,
    updated_at = now();
