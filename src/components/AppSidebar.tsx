'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Target,
} from 'lucide-react';
import { Logo } from '@/components/icons';
import { useAuth } from '@/firebase/auth/use-auth';
import { signOut } from 'firebase/auth';
import { useUser } from '@/firebase/auth/use-user';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  {
    href: '/dashboard/resume-analyzer',
    icon: FileText,
    label: 'Resume Analyzer',
  },
  {
    href: '/dashboard/mock-interview',
    icon: MessageSquare,
    label: 'Mock Interview',
  },
  { href: '/dashboard/skill-gap', icon: Target, label: 'Skill-Gap Analyzer' },
  { href: '/dashboard/job-matcher', icon: Briefcase, label: 'Job Matcher' },
];

export function AppSidebar() {
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Logo className="h-6 w-6" />
          </div>
          <span className="text-lg font-semibold text-primary">
            CareerPilot AI
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  as="a"
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Logout" onClick={handleLogout}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
