import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? "bg-cream/95 shadow-sm" : "bg-cream/80"}`}>
      <div className="container-custom py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-terracotta font-playfair text-2xl md:text-3xl font-bold">
            OmFlor Wellness
          </Link>
          
          <div className="hidden md:flex space-x-8 items-center">
            <NavLink href="/" active={isActive("/")}>Home</NavLink>
            <NavLink href="/about" active={isActive("/about")}>About</NavLink>
            <NavLink href="/offerings" active={isActive("/offerings")}>Offerings</NavLink>
            <NavLink href="/shop" active={isActive("/shop")}>Shop</NavLink>
            <NavLink href="/contact" active={isActive("/contact")}>Contact</NavLink>
          </div>
          
          <button 
            className="md:hidden text-deepblue"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pb-4 overflow-hidden"
            >
              <div className="flex flex-col space-y-4">
                <MobileNavLink href="/" active={isActive("/")} onClick={closeMenu}>Home</MobileNavLink>
                <MobileNavLink href="/about" active={isActive("/about")} onClick={closeMenu}>About</MobileNavLink>
                <MobileNavLink href="/offerings" active={isActive("/offerings")} onClick={closeMenu}>Offerings</MobileNavLink>
                <MobileNavLink href="/shop" active={isActive("/shop")} onClick={closeMenu}>Shop</MobileNavLink>
                <MobileNavLink href="/contact" active={isActive("/contact")} onClick={closeMenu}>Contact</MobileNavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active: boolean;
  onClick?: () => void;
}

function NavLink({ href, children, active }: NavLinkProps) {
  return (
    <Link href={href}>
      <a className={`tab-underline text-deepblue hover:text-terracotta transition duration-300 ${active ? 'active-tab' : ''}`}>
        {children}
      </a>
    </Link>
  );
}

function MobileNavLink({ href, children, active, onClick }: NavLinkProps) {
  return (
    <Link href={href}>
      <a 
        className={`text-deepblue hover:text-terracotta transition duration-300 py-2 border-b border-neutral ${active ? 'font-medium' : ''}`}
        onClick={onClick}
      >
        {children}
      </a>
    </Link>
  );
}
