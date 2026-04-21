'use client';

import { motion } from 'motion/react';
import { ArrowRight, Landmark, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function InstructorLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleBypassLogin = () => {
    setIsLoading(true);
    // Simulate a brief loading state for better UX then "pass through"
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Column - Editorial Atmosphere */}
      <div className="hidden md:flex md:w-5/12 lg:w-1/2 bg-primary relative flex-col justify-between p-12 lg:p-24 overflow-hidden">
        <img 
          src="https://picsum.photos/seed/library/1200/1600" 
          alt="Academy" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2 bg-on-primary/10 rounded-lg">
            <Landmark className="w-8 h-8 text-on-primary" />
          </div>
          <span className="font-bold tracking-[0.3em] uppercase text-on-primary text-xl font-headline">Feedback Atelier</span>
        </div>

        <div className="relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-[4rem] lg:text-[6rem] leading-[0.9] font-black text-on-primary mb-8 font-headline"
          >
            Cultivate<br />Academic<br />Excellence.
          </motion.h1>
          <p className="text-xl text-primary-fixed-dim max-w-md leading-relaxed opacity-80">
            A structured environment for recording, reviewing, and reflecting on student progress and institutional feedback.
          </p>
        </div>
      </div>

      {/* Right Column - Login Canvas */}
      <div className="flex-1 flex flex-col justify-center px-8 py-20 lg:px-24 bg-surface text-center">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile Header */}
          <div className="flex items-center gap-2 mb-16 md:hidden justify-center">
            <Landmark className="w-8 h-8 text-primary" />
            <span className="font-black tracking-widest uppercase text-primary text-lg font-headline">Feedback Atelier</span>
          </div>

          <div className="mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4 font-headline">Instructor Portal</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Access your dashboard to review course feedback and manage academic records.
            </p>
          </div>

          <div className="space-y-6">
            <motion.button
              onClick={handleBypassLogin}
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              className="w-full h-15 bg-primary text-white font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
            
            <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-[0.2em] font-bold font-headline">
              Institutional Access Authorized
            </p>
          </div>

          <p className="mt-24 text-sm text-on-surface-variant">
            By entering, you agree to the institutional <br /> <button className="text-primary font-bold hover:underline">Code of Practice</button>.
          </p>
        </div>
      </div>
    </div>
  );
}
