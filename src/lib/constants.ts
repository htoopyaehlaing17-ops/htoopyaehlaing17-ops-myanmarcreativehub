import {
  Home,
  Users,
  ShoppingBag,
  Briefcase,
  Image,
  User,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export const MENU_ITEMS: {
  id: string;
  name: string;
  icon: LucideIcon;
  href: string;
  auth: boolean;
}[] = [
  { id: 'home', name: 'Home', icon: Home, href: '/home', auth: false },
  { id: 'freelancers', name: 'Freelancers', icon: Users, href: '/freelancers', auth: false },
  { id: 'marketplace', name: 'Marketplace', icon: ShoppingBag, href: '/marketplace', auth: false },
  { id: 'jobs', name: 'Jobs', icon: Briefcase, href: '/jobs', auth: false },
  { id: 'portfolio', name: 'Portfolio', icon: Image, href: '/portfolio', auth: false },
  { id: 'profile', name: 'Profile', icon: User, href: '/profile', auth: true },
  { id: 'settings', name: 'Settings', icon: Settings, href: '/settings', auth: true },
];

export const PORTFOLIO_CATEGORIES = [
  "Graphic Design",
  "UI/UX Design",
  "Branding",
  "Photography",
  "Illustration",
  "Web Design",
  "Packaging",
  "Motion Graphics",
  "Architecture",
  "Product Design",
];
