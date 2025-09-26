import type { User, Profile, Portfolio, Job } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const users: User[] = [
  {
    id: 1,
    name: 'Guest User',
    email: 'guest@example.com',
    avatar: getImage('guest-avatar'),
  },
  {
    id: 2,
    name: 'Aung Myat',
    email: 'aung.myat@gmail.com',
    password: 'password123',
    avatar: getImage('aung-myat-avatar'),
  },
];

export const profiles: Profile[] = [
  {
    userId: 1,
    name: 'Guest User',
    title: 'Creative Professional',
    email: 'guest@example.com',
    phone: '',
    location: '',
    bio: 'Welcome to Myanmar Creative Hub! Create an account to showcase your creative work and connect with other professionals.',
    skills: [],
    memberSince: '',
    avatar: getImage('guest-avatar'),
  },
  {
    userId: 2,
    name: 'Aung Myat',
    title: 'Senior UI/UX Designer',
    email: 'aung.myat@gmail.com',
    phone: '+95 9 123 456 789',
    location: 'Yangon, Myanmar',
    bio: 'Passionate UI/UX designer with over 8 years of experience in creating intuitive and beautiful digital experiences. Specializing in mobile apps and complex web applications.',
    skills: ['UI Design', 'UX Research', 'Figma', 'Prototyping', 'Design Systems'],
    memberSince: 'June 2021',
    avatar: getImage('aung-myat-avatar'),
  },
];

export const portfolios: Portfolio[] = [
  {
    id: 1,
    userId: 2,
    title: "Brand Identity for Tech Startup",
    description: "Complete branding package including logo, color palette, and brand guidelines for a cutting-edge technology startup focused on AI solutions.",
    coverImage: getImage('brand-identity-cover'),
    images: [
      getImage('brand-identity-img1'),
      getImage('brand-identity-img2'),
      getImage('brand-identity-img3'),
      getImage('brand-identity-img4'),
    ],
    category: "Branding",
    isPublic: true,
    likes: 24,
    views: 156,
    featured: true
  },
  {
    id: 2,
    userId: 2,
    title: "Mobile App UI Design",
    description: "Comprehensive user interface design for a fitness tracking mobile application with focus on user experience and intuitive navigation.",
    coverImage: getImage('mobile-app-ui-cover'),
    images: [
      getImage('mobile-app-ui-img1'),
      getImage('mobile-app-ui-img2'),
      getImage('mobile-app-ui-img3'),
    ],
    category: "UI/UX Design",
    isPublic: false,
    likes: 18,
    views: 203,
    featured: false
  }
];

export const jobs: Job[] = [
    {
        id: 1,
        clientId: 2,
        title: "Looking for a logo designer for a new coffee shop",
        description: "We are opening a new specialty coffee shop in downtown Yangon and need a talented designer to create a modern and memorable logo. The brand is focused on sustainability and community. We'd like to see a portfolio of previous branding work.",
        category: "Graphic Design",
        skills: ["Logo Design", "Branding", "Adobe Illustrator"],
        budget: 500,
        location: "Yangon, Myanmar (Remote)",
        notes: "Please include a link to your Behance or Dribbble profile in your application."
    },
    {
        id: 2,
        clientId: 1, 
        title: "Website Redesign for a Local NGO",
        description: "Our non-profit organization needs a complete website redesign. The current site is outdated and not mobile-friendly. We need a clean, professional, and easy-to-navigate website that clearly communicates our mission and impact. The freelancer should have experience with WordPress and creating websites for non-profits.",
        category: "Web Design",
        skills: ["UI/UX Design", "WordPress", "Responsive Design", "SEO"],
        budget: 1200,
        location: "Mandalay, Myanmar (Remote optional)",
        notes: "The project has a deadline of 3 months. We are looking for someone who can start immediately."
    }
];
