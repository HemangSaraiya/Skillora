function calculateMatchScore(profile, internship) {
    const currentYear = profile.currentYear;
    const cgpa = profile.cgpa;

    const eligibility = internship.eligibility || {};

    if (
        eligibility.minYear !== undefined &&
        currentYear < eligibility.minYear
    ) {
        return null;
    }

    if (
        eligibility.maxYear !== undefined &&
        currentYear > eligibility.maxYear
    ) {
        return null;
    }

    if (
        eligibility.minimumCGPA !== undefined &&
        cgpa < eligibility.minimumCGPA
    ) {
        return null;
    }
    const studentSkills = (profile.skills || []).map(skill =>
        skill.toLowerCase().trim()
    )
    const requiredSkills = (internship.requiredSkills || []).map(skill =>
        skill.toLowerCase().trim()
    )
    const preferredSkills = (internship.preferredSkills || []).map(skill =>
        skill.toLowerCase().trim()
    )
    const preferredDomains = (profile.preferredDomains || []).map(domain =>
        domain.toLowerCase().trim()
    )
    const matchedRequiredSkills = requiredSkills.filter(skill =>
        studentSkills.includes(skill)
    );
    const requiredSkillScore =
        requiredSkills.length > 0
            ? matchedRequiredSkills.length / requiredSkills.length
            : 0;
    const matchedPreferredSkills = preferredSkills.filter(skill =>
        studentSkills.includes(skill)
    );

    const preferredSkillScore =
        preferredSkills.length > 0
            ? matchedPreferredSkills.length / preferredSkills.length
            : 0;
    const domainMatch = preferredDomains.includes(
        internship.domain.toLowerCase().trim()
    );

    const domainScore = domainMatch ? 1 : 0;
    const score =
        requiredSkillScore * 0.5 +
        preferredSkillScore * 0.2 +
        domainScore * 0.3;

    return {
        score: Math.round(score * 100),
        matchedRequiredSkills,
        matchedPreferredSkills,
        domainMatch
    };
}

module.exports = { calculateMatchScore };