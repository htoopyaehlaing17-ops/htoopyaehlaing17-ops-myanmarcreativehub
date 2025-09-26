import type { User, Profile, Portfolio } from './types';
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
