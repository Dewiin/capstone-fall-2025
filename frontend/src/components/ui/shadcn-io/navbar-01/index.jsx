'use client';;
import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/components/contexts/Contexts';
import { Button } from '@/components/ui/button';
import { 
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar';
import { 
  NavigationMenu, 
  NavigationMenuItem, 
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from '@/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Moon, Sun } from 'lucide-react';
import { GiBrainstorm } from "react-icons/gi";
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

// Simple logo component for the navbar
const Logo = (props) => {
  return (
    <svg
      width='1em'
      height='1em'
      viewBox='0 0 324 323'
      fill='currentColor'
      xmlns='http://www.w3.org/2000/svg'
      {...props}>
      <rect
        x='88.1023'
        y='144.792'
        width='151.802'
        height='36.5788'
        rx='18.2894'
        transform='rotate(-38.5799 88.1023 144.792)'
        fill='currentColor' />
      <rect
        x='85.3459'
        y='244.537'
        width='151.802'
        height='36.5788'
        rx='18.2894'
        transform='rotate(-38.5799 85.3459 244.537)'
        fill='currentColor' />
    </svg>
  );
};

// Hamburger icon component
const HamburgerIcon = ({
  className,
  ...props
}) => (
  <svg
    className={cn('pointer-events-none', className)}
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path
      d="M4 12L20 12"
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]" />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45" />
    <path
      d="M4 12H20"
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]" />
  </svg>
);

// Default navigation links
let defaultNavigationLinks = [
  { href: '/', label: 'Home', active: false },
  { href: '#features', label: 'Features' },
  { href: '#about', label: 'About' },
];

export const Navbar01 = React.forwardRef((
  {
    className,
    logo = <Logo />,
    logoHref = '/',
    navigationLinks = defaultNavigationLinks,
    signInText = 'Log In',
    signInHref = '/form/login',
    ctaText = 'Sign Up',
    ctaHref = '/form/signup',
    logoutText = 'Log Out',
    ...props
  },
  ref
) => {
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode]= useState(true);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onSignInClick = () => navigate(signInHref);
  const onCtaClick = () => navigate(ctaHref);

  useEffect(() => {
      document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]); 

  useEffect(() => {
    const checkWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setIsMobile(width < 768); // 768px is md breakpoint
      }
    };

    checkWidth();

    const resizeObserver = new ResizeObserver(checkWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      defaultNavigationLinks = [
        { href: '/', label: 'Home', active: false },
        { href: '#features', label: 'Features' },
        { href: '#about', label: 'About' },
      ];
    } else {
      defaultNavigationLinks = [
        { href: '/', label: 'Home', active: false },
        { href: '/explore', label: 'Explore' },
        { href: '/generate', label: 'Generate' },
      ];
    }
  }, [user, navigate]);

  // Combine refs
  const combinedRef = React.useCallback((node) => {
    containerRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref]);

  async function logoutSubmit() {
    setLoading(true);

    try{
      const result = await logout();
      
      if(!result.loggedIn) {
        navigate("/");
      } else {
        console.error(`Logout failed`);
      }
    } catch (err) {
      console.error(`Error during logoutSubmit: `, err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      { loading && <LoadingOverlay fixed /> }
      <header
        ref={combinedRef}
        className={cn(
          'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 [&_*]:no-underline',
          className
        )}
        {...props}>
        <div
          className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-2">
            {/* Mobile menu trigger */}
            {isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="group h-9 w-9 hover:bg-accent hover:text-accent-foreground"
                    variant="ghost"
                    size="icon">
                    <HamburgerIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-48 p-2">
                <NavigationMenu className="max-w-none">
                  <NavigationMenuList className="flex-col items-start gap-1">
                    {navigationLinks.map((link, index) => (
                      <NavigationMenuItem key={index} className="w-full">
                        <button
                          onClick={() => navigate(link.href)}
                          className={cn(
                            "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer no-underline",
                            link.active 
                              ? "bg-accent text-accent-foreground" 
                              : "text-foreground/80"
                          )}>
                          {link.label}
                        </button>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}
            {/* Main nav */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate(logoHref)}
                className="flex items-center space-x-3 text-primary hover:text-primary/90 transition-colors cursor-pointer">
                <div className="text-2xl">
                  <GiBrainstorm className='text-2xl' />
                </div>
                <span className="hidden font-bold text-xl sm:inline-block">Brainstorm</span>
              </button>
              {/* Navigation menu */}
              {!isMobile && (
                <NavigationMenu className="flex">
                <NavigationMenuList className="gap-1">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index}>
                      <button
                        onClick={() => navigate(link.href)}
                        className={cn(
                          "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer no-underline",
                          link.active 
                            ? "bg-accent text-accent-foreground" 
                            : "text-foreground/80 hover:text-foreground"
                        )}>
                        {link.label}
                      </button>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
                </NavigationMenu>
              )}
            </div>
          </div>
          {/* Right side */}
            <div className="flex items-center gap-3">
              <Button
                className="font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground"
                variant="ghost"
                onClick={() => {
                  setDarkMode(!darkMode);
                }}>
                { darkMode ? (
                  <Moon 
                  strokeWidth={2} 
                  size={24} />
                ) : (
                  <Sun 
                  strokeWidth={1.5} 
                  size={20} />
                )}
              </Button>
              { !user ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm font-medium px-4 h-9 hover:bg-accent hover:text-accent-foreground"
                    onClick={onSignInClick}>
                    {signInText}
                  </Button>
                  <Button
                    size="sm"
                    className="text-sm font-medium px-4 h-9 rounded-md shadow-sm"
                    onClick={onCtaClick}>
                    {ctaText}
                  </Button>
                </>
                ) : (
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem >
                        <NavigationMenuTrigger 
                          className="flex gap-x-2 p-2"
                          onPointerMove={(e) => e.preventDefault()}
                          onPointerLeave={(e) => e.preventDefault()}
                        >
                          <Avatar className="size-6 rounded-lg">
                            <AvatarImage src="https://github.com/evilrabbit.png" alt="@shadcn" />
                            <AvatarFallback>Icon</AvatarFallback>
                          </Avatar>
                          {user.displayName}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent
                          onPointerEnter={(e) => e.preventDefault()}
                          onPointerLeave={(e) => e.preventDefault()}
                        >
                          <ul className="flex flex-col p-1 w-3xs list-none select-none">
                            <li>
                              <NavigationMenuLink asChild>
                                <p className="text-sm leading-tight text-muted-foreground" onClick={() => navigate(`/account/${user.id}`)}>
                                  Account
                                </p>
                              </NavigationMenuLink>
                            </li>
                            <li>
                              <NavigationMenuLink>
                                <p className="text-sm leading-tight text-muted-foreground">
                                  Settings
                                </p>
                              </NavigationMenuLink>
                            </li>
                            <li onClick={() => logoutSubmit()}>
                              <NavigationMenuLink>
                                <p className="text-sm leading-tight text-muted-foreground">
                                  Log Out
                                </p>
                              </NavigationMenuLink>
                            </li>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                )}
          </div>
        </div>
      </header>
    </>
  );
});

Navbar01.displayName = 'Navbar01';

export { Logo, HamburgerIcon };