export interface Education {
    degree: string;
    institution: string;
    specialization?: string;
    year: string; // Passing Year
    grade: string; // CGPA/Percentage
}

export interface ExperienceTeaching {
    institution: string;
    role: string; // Designation during that time
    duration: string; // From - To
    responsibilities?: string;
}

export interface ExperienceAdmin {
    role: string;
    description: string;
}

export interface Publication {
    title: string;
    journal_name: string; // Renamed from journal to match request often, keeping compatible
    indexing: 'Scopus' | 'SCI' | 'Others';
    quartile: 'Q1' | 'Q2' | 'Q3' | 'Q4';
    volume?: string;
    issue_number?: string;
    year_of_publication: string;
    paper_file?: string; // URL to file
    doi_link?: string;
}

export interface AwardItem {
    title: string;
    year: string;
    issuer: string;
}

export interface Project {
    title: string;
    summary: string;
    year: string;
    outcome?: string;
    agency?: string; // Funding Agency
    amount?: string; // Grant Amount
}

export interface Membership {
    organization: string; // IST, ICE, CSI etc
    id?: string;
    year?: string; // Active Since
    type?: string;
}

export interface EventItem {
    title: string;
    type: 'Attended' | 'Organized' | 'Guest Lecture';
    date: string;
    location?: string; // Institute
}

export interface GalleryItem {
    id: string;
    url: string; // Storage URL
    caption?: string;
    category?: 'Classroom' | 'Conference' | 'Student' | 'Other';
    status: 'pending' | 'approved' | 'rejected';
}

export interface StudentInteraction {
    timetable_link?: string;
    mentorship_batch?: string;
    feedback_link?: string;
}

export interface SocialLinks {
    linkedin?: string;
    google_scholar?: string;
    research_gate?: string;
    twitter?: string;
    website?: string;
}

export interface UserProfile {
    // Identity
    full_name: string;
    employee_id: string; // Read-only
    username: string;
    email: string; // Legacy/Display email

    // Detailed Name
    first_name?: string;
    middle_name?: string;
    last_name?: string;

    // New E-mails
    official_email?: string;
    personal_email?: string;

    phone: string; // Contact Number
    profile_photo?: string;

    // Personal (New)
    gender?: string;
    dob?: string;
    dor?: string; // Date of Retirement
    blood_group?: string;
    aadhar_number?: string;
    pan_number?: string;
    apaar_id?: string;

    // Addresses
    address?: string; // Keeping for backward compat
    communication_address?: string;
    permanent_address?: string;

    // Professional
    designation: string;
    program: string; // Department - Read Only after onboarding
    subjects?: string[];
    doj?: string; // Date of Joining

    // Experience
    experience_years: string; // Total Teaching Experience
    teaching_experience_years?: string; // Explicit field if needed
    post_mtech_experience?: string;
    post_teaching_experience?: string;

    office_room?: string;
    availability?: string; // Office Hours

    // Bio & Philosophy
    bio: string;
    teaching_philosophy?: string;

    // Complex Lists
    education?: Education[];
    experience_teaching?: ExperienceTeaching[];
    experience_admin?: ExperienceAdmin[];
    publications?: Publication[]; // Array of Publication objects
    projects?: Project[];
    awards?: AwardItem[];
    events?: EventItem[];
    memberships?: Membership[];

    // Media & Student
    gallery?: GalleryItem[];
    student_interaction?: StudentInteraction;
    social_links?: SocialLinks;

    skills?: string;
    qualification?: string; // Highest qualification
}
