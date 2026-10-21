
function normalize(value) {
    return typeof value === "string"
        ? value.toLowerCase().trim()
        : "";
}

function calculateMatchScore(profile, internship) {
   const currentYear =
    profile.currentYear == null ? NaN : Number(profile.currentYear);

const cgpa =
    profile.cgpa == null ? NaN : Number(profile.cgpa);
    const eligibility = internship.eligibility || {};

    const hasYearRequirement =
        eligibility.minYear != null || eligibility.maxYear != null;

    const hasCGPARequirement = eligibility.minimumCGPA != null;

    if (
        hasYearRequirement &&
        !Number.isFinite(currentYear)
    ) {
        return null;
    }

    if (
        hasCGPARequirement &&
        !Number.isFinite(cgpa)
    ) {
        return null;
    }

  
    if (
        eligibility.minYear != null &&
        currentYear < eligibility.minYear
    ) {
        return null;
    }

    if (
        eligibility.maxYear != null &&
        currentYear > eligibility.maxYear
    ) {
        return null;
    }

    if (
        hasCGPARequirement &&
        cgpa < eligibility.minimumCGPA
    ) {
        return null;
    }

    const studentSkills = new Set(
        (profile.skills || [])
            .map(normalize)
            .filter(Boolean)
    );

    const requiredSkills = (internship.requiredSkills || [])
        .map(normalize)
        .filter(Boolean);

    const preferredSkills = (internship.preferredSkills || [])
        .map(normalize)
        .filter(Boolean);

    const preferredDomains = (profile.preferredDomains || [])
        .map(normalize)
        .filter(Boolean);

    const matchedRequiredSkills = requiredSkills.filter(
        skill => studentSkills.has(skill)
    );

    const missingRequiredSkills = requiredSkills.filter(
        skill => !studentSkills.has(skill)
    );

    const matchedPreferredSkills = preferredSkills.filter(
        skill => studentSkills.has(skill)
    );

    const requiredSkillScore = requiredSkills.length
        ? matchedRequiredSkills.length / requiredSkills.length
        : 0;

    const preferredSkillScore = preferredSkills.length
        ? matchedPreferredSkills.length / preferredSkills.length
        : 0;

    const domainMatch = preferredDomains.includes(
        normalize(internship.domain)
    );

    
    const yearEligible = hasYearRequirement;
    const cgpaEligible = hasCGPARequirement;

    const score =
        requiredSkillScore * 40 +
        preferredSkillScore * 10 +
        (domainMatch ? 25 : 0) +
        (yearEligible ? 15 : 0) +
        (cgpaEligible ? 10 : 0);

    const reasons = [];

    if (matchedRequiredSkills.length > 0) {
        reasons.push(
            `You match ${matchedRequiredSkills.length} of ${requiredSkills.length} required skills.`
        );
    }

    if (matchedPreferredSkills.length > 0) {
        reasons.push(
            `You also have ${matchedPreferredSkills.length} preferred skills.`
        );
    }

    if (domainMatch) {
        reasons.push(
            `The ${internship.domain} domain matches your preferences.`
        );
    }

    if (hasYearRequirement || hasCGPARequirement) {
        reasons.push(
            "Your profile meets the internship's academic eligibility requirements."
        );
    }

    if (reasons.length === 0) {
        reasons.push(
            "You meet the academic eligibility requirements; consider reviewing the role's skills and domain."
        );
    }

    return {
        score: Math.round(score),
        matchedRequiredSkills,
        missingRequiredSkills,
        matchedPreferredSkills,
        domainMatch,
        reasons
    };
}

module.exports = { calculateMatchScore };
