export type ApplicantProfileDraft = {
  fullName: string;
  university: string;
  courseOrGraduationYear: string;
  phone: string;
  skills: string;
  projectsExperience: string;
  repoLinks: string;
};

export type CompanyProfileDraft = {
  companyName: string;
  about: string;
  industry: string;
  website: string;
  socialLinks: string;
  officePhotoUrl: string;
  videoPresentationUrl: string;
};

const applicantKey = (userId: string) => `profile:applicant:${userId}`;

const companyKey = (companyId: string) => `profile:company:${companyId}`;

const parseJson = <T>(raw: string | null, fallback: T): T => {
  if (!raw) {
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const readApplicantProfileDraft = (userId: string): ApplicantProfileDraft => {
  const parsed = parseJson<Record<string, unknown>>(localStorage.getItem(applicantKey(userId)), {});
  const legacyAbout = typeof parsed.about === 'string' ? parsed.about : '';

  return {
    fullName: typeof parsed.fullName === 'string' ? parsed.fullName : '',
    university: typeof parsed.university === 'string' ? parsed.university : '',
    courseOrGraduationYear:
      typeof parsed.courseOrGraduationYear === 'string' ? parsed.courseOrGraduationYear : '',
    phone: typeof parsed.phone === 'string' ? parsed.phone : '',
    skills: typeof parsed.skills === 'string' ? parsed.skills : '',
    projectsExperience:
      typeof parsed.projectsExperience === 'string'
        ? parsed.projectsExperience
        : legacyAbout,
    repoLinks: typeof parsed.repoLinks === 'string' ? parsed.repoLinks : '',
  };
};

export const writeApplicantProfileDraft = (userId: string, draft: ApplicantProfileDraft) => {
  localStorage.setItem(applicantKey(userId), JSON.stringify(draft));
};

export const readCompanyProfileDraft = (companyId: string): CompanyProfileDraft => {
  const parsed = parseJson<Partial<CompanyProfileDraft>>(localStorage.getItem(companyKey(companyId)), {});
  return {
    companyName: typeof parsed.companyName === 'string' ? parsed.companyName : '',
    about: typeof parsed.about === 'string' ? parsed.about : '',
    industry: typeof parsed.industry === 'string' ? parsed.industry : '',
    website: typeof parsed.website === 'string' ? parsed.website : '',
    socialLinks: typeof parsed.socialLinks === 'string' ? parsed.socialLinks : '',
    officePhotoUrl: typeof parsed.officePhotoUrl === 'string' ? parsed.officePhotoUrl : '',
    videoPresentationUrl:
      typeof parsed.videoPresentationUrl === 'string' ? parsed.videoPresentationUrl : '',
  };
};

export const writeCompanyProfileDraft = (companyId: string, draft: CompanyProfileDraft) => {
  localStorage.setItem(companyKey(companyId), JSON.stringify(draft));
};
