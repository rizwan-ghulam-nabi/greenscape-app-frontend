// app/lib/careers/jobs.js
export const POSITIONS = [
  {
    id: 1,
    title: 'Senior Horticulturist',
    department: 'Plant Operations',
    location: 'Faisalabad, PK',
    type: 'Full-time',
    experience: '3+ years',
    desc: 'Lead plant selection, care protocols, and quality control across our catalog.',
    requirements: [
      'Degree in Horticulture, Botany, or related field',
      '3+ years hands-on experience with indoor plants',
      'Strong knowledge of pest control and soil health',
      'Excellent written and verbal communication',
    ],
  },
  {
    id: 2,
    title: 'Full-Stack Developer (MERN)',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    experience: '2+ years',
    desc: 'Build and scale our customer-facing storefront and admin tools.',
    requirements: [
      'Strong JavaScript/TypeScript skills',
      'Experience with React, Next.js, Node.js, MongoDB',
      'Understanding of REST APIs and authentication',
      'Bonus: experience with Cloudinary or payment gateways',
    ],
  },
  {
    id: 3,
    title: 'Customer Experience Specialist',
    department: 'Support',
    location: 'Remote',
    type: 'Full-time',
    experience: '1+ year',
    desc: 'Be the friendly voice our customers hear when they need help with orders or plant care.',
    requirements: [
      'Excellent written English and Urdu',
      'Patience and empathy in every interaction',
      'Comfortable with chat, email, and phone support',
      'Bonus: gardening knowledge',
    ],
  },
  {
    id: 4,
    title: 'Social Media & Content Creator',
    department: 'Marketing',
    location: 'Hybrid (Faisalabad)',
    type: 'Full-time',
    experience: '1+ year',
    desc: 'Create short-form video, photography, and written content to grow our community.',
    requirements: [
      'Strong portfolio of short-form video (Reels/TikTok)',
      'Basic photography and editing skills',
      'Deep understanding of Instagram and TikTok trends',
      'Passion for plants and sustainable living',
    ],
  },
  {
    id: 5,
    title: 'Logistics Coordinator',
    department: 'Operations',
    location: 'Faisalabad, PK',
    type: 'Full-time',
    experience: '2+ years',
    desc: 'Coordinate courier partners and ensure plants arrive healthy, fast, and on time.',
    requirements: [
      'Experience coordinating with courier services',
      'Strong organizational and tracking skills',
      'Ability to work in a fast-paced environment',
      'Comfortable with Excel and logistics software',
    ],
  },
  {
    id: 6,
    title: 'Photography Intern',
    department: 'Marketing',
    location: 'Hybrid (Faisalabad)',
    type: 'Internship · 3 months',
    experience: 'Entry-level',
    desc: 'Shoot beautiful product and lifestyle photos for the store and social media.',
    requirements: [
      'Basic knowledge of DSLR or mirrorless cameras',
      'Portfolio of personal or academic work',
      'Eagerness to learn product photography',
      'Available 20 hours/week',
    ],
  },
];

export function getPositionById(id) {
  return POSITIONS.find((p) => String(p.id) === String(id));
}