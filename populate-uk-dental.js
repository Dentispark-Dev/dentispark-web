const axios = require("axios");

const baseURL = "https://api.dentispark.com";
const credentials = {
    emailAddress: "admin@dentispark.com",
    password: "!f@u9sB9bZ3PHw6",
};

const channelHeaders = {
    "Channel-ID": "9c1d11b7-4680-4b60-9b9e-e302ec92e1ad",
    "Channel-Secret": "99T18925x42783H7506692949Q618699"
};

const dentalSchools = [
    { name: "University of Birmingham", location: "Birmingham", website: "https://www.birmingham.ac.uk" },
    { name: "University of Bristol", location: "Bristol", website: "https://www.bristol.ac.uk" },
    { name: "Cardiff University", location: "Cardiff", website: "https://www.cardiff.ac.uk" },
    { name: "University of Dundee", location: "Dundee", website: "https://www.dundee.ac.uk" },
    { name: "University of Glasgow", location: "Glasgow", website: "https://www.gla.ac.uk" },
    { name: "King's College London", location: "London", website: "https://www.kcl.ac.uk" },
    { name: "University of Leeds", location: "Leeds", website: "https://www.leeds.ac.uk" },
    { name: "University of Liverpool", location: "Liverpool", website: "https://www.liverpool.ac.uk" },
    { name: "University of Manchester", location: "Manchester", website: "https://www.manchester.ac.uk" },
    { name: "Newcastle University", location: "Newcastle", website: "https://www.ncl.ac.uk" },
    { name: "University of Plymouth", location: "Plymouth", website: "https://www.plymouth.ac.uk" },
    { name: "Queen Mary University of London", location: "London", website: "https://www.qmul.ac.uk" },
    { name: "Queen's University Belfast", location: "Belfast", website: "https://www.qub.ac.uk" },
    { name: "University of Sheffield", location: "Sheffield", website: "https://www.sheffield.ac.uk" },
    { name: "University of Central Lancashire", location: "Preston", website: "https://www.uclan.ac.uk" },
    { name: "University of Aberdeen", location: "Aberdeen", website: "https://www.abdn.ac.uk" }
];

async function populate() {
    try {
        console.log("Logging in...");
        const loginRes = await axios.post(`${baseURL}/auth/login`, credentials, { headers: channelHeaders });
        const token = loginRes.data.responseData.auth.accessToken;
        console.log("Logged in successfully.");

        const authHeaders = {
            ...channelHeaders,
            "Authorization": `Bearer ${token}`
        };

        // 1. Get existing universities to avoid duplicates
        const existingUnivsRes = await axios.get(`${baseURL}/admin-content/universities/records?pageSize=100`, { headers: authHeaders });
        const existingUnivs = existingUnivsRes.data.responseData.content;
        console.log(`Found ${existingUnivs.length} existing universities.`);

        for (const school of dentalSchools) {
            let univHid = "";
            const existing = existingUnivs.find(u => u.name.toLowerCase().includes(school.name.toLowerCase()) || school.name.toLowerCase().includes(u.name.toLowerCase()));

            if (existing) {
                console.log(`University ${school.name} already exists (HID: ${existing.hid}). Skipping creation.`);
                univHid = existing.hid;
            } else {
                console.log(`Creating university: ${school.name}...`);
                const createRes = await axios.post(`${baseURL}/admin-content/universities`, {
                    name: school.name,
                    location: school.location,
                    websiteUrl: school.website,
                    description: `${school.name} Dental School offers world-class dental education.`,
                    dentalSchoolPathway: "BDS"
                }, { headers: authHeaders });
                // Assuming it returns the ID or we can find it
                console.log(`Created ${school.name}.`);
                // Re-fetch to get HID (slightly inefficient but safe)
                const searchRes = await axios.get(`${baseURL}/admin-content/universities/records?searchKey=${encodeURIComponent(school.name)}`, { headers: authHeaders });
                univHid = searchRes.data.responseData.content[0]?.hid;
            }

            if (univHid) {
                // 2. Check for existing BDS program
                const existingCoursesRes = await axios.get(`${baseURL}/admin-content/courses/records?universityId=${univHid}&pageSize=50`, { headers: authHeaders });
                // Wait, universityId in backend might be numeric ID or HID. The API types say universityId?: number but payload says universityHid: string.
                // Let's try searching by course name and university
                const existingCourses = existingCoursesRes.data.responseData.content;
                const hasBDS = existingCourses.find(c => c.courseName.toUpperCase().includes("BDS") || c.courseName.toUpperCase().includes("DENTAL SURGERY"));

                if (hasBDS) {
                    console.log(`BDS program for ${school.name} already exists. Skipping.`);
                } else {
                    console.log(`Creating BDS program for ${school.name}...`);
                    await axios.post(`${baseURL}/admin-content/courses`, {
                        universityHid: univHid,
                        courseName: "Bachelor of Dental Surgery (BDS)",
                        degreeType: "BDS",
                        durationYears: 5,
                        description: `Five-year undergraduate program in Dental Surgery at ${school.name}.`,
                        entryRequirements: "A-levels in Chemistry and Biology required.",
                        feesDomestic: 9250,
                        feesInternational: 38000
                    }, { headers: authHeaders });
                    console.log(`Created BDS program for ${school.name}.`);
                }
            }
        }

        console.log("Population completed!");

    } catch (error) {
        console.error("Error during population:", error.response ? error.response.data : error.message);
    }
}

populate();
