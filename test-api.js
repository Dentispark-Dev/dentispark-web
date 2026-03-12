const axios = require("axios");

const baseURL = "https://api.dentispark.com";
const loginUrl = `${baseURL}/auth/login`; // Or whatever the admin login path is 

async function testStudents() {
    try {
        const loginRes = await axios.post(`${baseURL}/auth/login`, {
            emailAddress: "admin@dentispark.com",
            password: "!f@u9sB9bZ3PHw6",
        }, {
            headers: {
                "Channel-ID": "9c1d11b7-4680-4b60-9b9e-e302ec92e1ad",
                "Channel-Secret": "99T18925x42783H7506692949Q618699"
            }
        });

        console.log("Login Success");
        console.log("Login Response Data:", JSON.stringify(loginRes.data, null, 2));
        const token = loginRes.data.responseData.auth.accessToken;

        const studentRes = await axios.get(`${baseURL}/students/records?pageNumber=0&pageSize=10`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Channel-ID": "9c1d11b7-4680-4b60-9b9e-e302ec92e1ad",
                "Channel-Secret": "99T18925x42783H7506692949Q618699"
            }
        });

        console.log("Students API returned:");
        console.log(JSON.stringify(studentRes.data, null, 2));

        const rolesRes = await axios.get(`${baseURL}/auth-mgt/platform-role`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Channel-ID": "9c1d11b7-4680-4b60-9b9e-e302ec92e1ad",
                "Channel-Secret": "99T18925x42783H7506692949Q618699"
            }
        });
        console.log("Roles API returned:");
        console.log(JSON.stringify(rolesRes.data, null, 2));

        const sampleSid = "STU1772947248597";
        const sampleUnivId = "UNIV1763131742490"; // I'll search for a real univ id if needed
        const variations = [
            `/students/${sampleSid}/detail`,
            `/students/${sampleSid}`,
            `/admin-content/universities/${sampleUnivId}/detail`,
            `/admin-content/universities/${sampleUnivId}`
        ];

        for (const path of variations) {
            try {
                const res = await axios.get(`${baseURL}${path}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Channel-ID": "9c1d11b7-4680-4b60-9b9e-e302ec92e1ad",
                        "Channel-Secret": "99T18925x42783H7506692949Q618699"
                    }
                });
                console.log(`Path ${path} SUCCESS!`);
            } catch (e) {
                console.log(`Path ${path} FAILED: ${e.response?.status || e.message}`);
            }
        }

        const mentorListRes = await axios.get(`${baseURL}/mentors/records?pageNumber=0&pageSize=1`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Channel-ID": "9c1d11b7-4680-4b60-9b9e-e302ec92e1ad",
                "Channel-Secret": "99T18925x42783H7506692949Q618699"
            }
        });
        const mentor = mentorListRes.data.responseData.content[0];
        if (mentor) {
            try {
                const mentorDetailRes = await axios.get(`${baseURL}/mentors/${mentor.hid}/detail`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Channel-ID": "9c1d11b7-4680-4b60-9b9e-e302ec92e1ad",
                        "Channel-Secret": "99T18925x42783H7506692949Q618699"
                    }
                });
                console.log(`Mentor Detail API for ${mentor.hid} returned success`);
            } catch (e) {
                console.error(`Mentor Detail API for ${mentor.hid} failed:`, e.response?.status);
            }
        }


    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

testStudents();
