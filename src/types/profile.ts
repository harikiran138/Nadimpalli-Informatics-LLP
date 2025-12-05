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
    journal: string; // Journal/Conference Name
    year: string;
    link?: string; // DOI/URL
    type?: 'Journal' | 'Conference' | 'Book' | 'Patent';
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
    organization: string; // IEEE, ACM
    id?: string;
    year: string; // Active Since
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
    employee_id: string;
    username: string;
    email: string; // College Mail preferred
    phone: string; // Official/Private
    profile_photo?: string;

    // Personal (New)
    gender?: string;
    dob?: string;

    // Professional
    designation: string;
    program: string; // Department
    subjects?: string[]; // Array of subject names
    doj?: string; // Date of Joining
    experience_years: string;
    office_room?: string;
    availability?: string; // Office Hours

    // Bio & Philosophy
    bio: string;
    teaching_philosophy?: string;

    // Complex Lists
    education?: Education[];
    experience_teaching?: ExperienceTeaching[];
    experience_admin?: ExperienceAdmin[];
    publications?: Publication[];
    projects?: Project[];
    awards?: AwardItem[];
    events?: EventItem[];
    memberships?: Membership[];

    // Media & Student
    gallery?: GalleryItem[];
    student_interaction?: StudentInteraction;
    social_links?: SocialLinks;

    skills?: string; // CSV or can be expanded
    address?: string;
    qualification?: string; // Highest qualification shortcut
}
