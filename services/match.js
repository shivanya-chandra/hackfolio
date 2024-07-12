const userModel = require("../models/user");

const findMentors = async (user) => {
    try {
        const mentors = await userModel.find({ isMentor: true });
        const mentorScores = {};
        for (let i = 0; i < mentors.length; i++) {
            let mentor = mentors[i];
            console.log(mentor.email);

            if (mentor.isMentor === false) {
                continue;
            }
            if (mentor.email === user.email) {
                continue;
            }
            let score = 0;
            if (mentor.country != "United States") {
                if (mentor.country === user.country) {
                    score += 7;
                }
            }
            if (mentor.college === user.college) {
                score += 10;
            }
            // TODO: Collect college as well
            for (let i = 0; i < mentor.major.length; i++) {
                if (user.major.includes(mentor.major[i])) {
                    score += 15;
                }
            }
            for (let i = 0; i < mentor.minor.length; i++) {
                if (user.minor.includes(mentor.minor[i])) {
                    score += 10;
                }
            }   
            for (let i = 0; i < mentor.interests.length; i++) {
                if (user.interests.includes(mentor.interests[i])) {
                    score += 5;
                }
            }
            mentorScores[mentor.id] = score;
        }
        // sort mentorScores in descending order by the value
        const sortedMentorScores = Object.entries(mentorScores).sort((a, b) => b[1] - a[1]);
        console.log(sortedMentorScores);
        console.log("done")
        return sortedMentorScores;
    }
    catch (e) {
        console.log(e);
        return [];
    }
}

module.exports = { findMentors };