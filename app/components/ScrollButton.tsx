'use client';

interface ScrollButtonProps {
  className?: string;
  children: React.ReactNode;
}

export default function ScrollButton({ className, children }: ScrollButtonProps) {
  const scrollToWaitlist = () => {
    document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button 
      onClick={scrollToWaitlist}
      className={className}
    >
      {children}
    </button>
  );
} 