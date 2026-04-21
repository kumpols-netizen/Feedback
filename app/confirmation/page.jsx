'use client';

import { motion } from 'motion/react';
import { CheckCircle2, Home, RefreshCcw } from 'lucide-react';

export default function ConfirmationPage() {
  return (
    <div className="bg-surface min-h-screen flex items-center justify-center p-6">
      <main className="max-w-xl w-full text-center space-y-12">
        <motion.div 
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, stiffness: 100 }}
          className="relative inline-block"
        >
          <div className="absolute inset-0 bg-secondary-container blur-3xl opacity-20" />
          <CheckCircle2 className="w-40 h-40 text-secondary relative z-10" />
        </motion.div>

        <div className="space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-display-lg text-primary"
          >
            Thank you for <br /> your feedback!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl text-on-surface-variant leading-relaxed max-w-md mx-auto"
          >
            Your response has been recorded anonymously and will help shape our academic environment.
          </motion.p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button 
            onClick={() => window.location.href = '/'}
            className="h-14 px-8 bg-primary text-white font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Return Home
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="h-14 px-8 bg-surface-dim text-primary font-bold uppercase tracking-wider rounded-lg hover:bg-surface-dim/80 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-5 h-5" />
            Submit Another
          </button>
        </div>
      </main>
    </div>
  );
}
