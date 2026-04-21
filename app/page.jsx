'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Menu, 
  ChevronDown, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { db, handleFirestoreError } from '../lib/firebase';
import { collection, doc, setDoc, serverTimestamp, getDocFromServer } from 'firebase/firestore';

export default function StudentFeedbackForm() {
  const [formData, setFormData] = useState({
    clarity: 0,
    difficulty: 0,
    engagement: 0,
    usefulness: 0,
    likeMost: '',
    difficulties: '',
    suggestions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration or network connection.");
        }
      }
    }
    testConnection();
  }, []);

  const handleRating = (metric, value) => {
    setFormData(prev => ({ ...prev, [metric]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Feedback: Attempting submission...", formData);
    
    // Simple validation
    if (formData.clarity === 0 || formData.difficulty === 0 || formData.engagement === 0 || formData.usefulness === 0) {
      alert("Please provide all ratings before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const collectRef = collection(db, 'feedback');
      const docRef = doc(collectRef);
      console.log("Feedback: Generated doc ID:", docRef.id);
      
      const payload = {
        ...formData,
        studentId: `#${Math.floor(Math.random() * 9000 + 1000)}`,
        createdAt: serverTimestamp()
      };

      await setDoc(docRef, payload);
      console.log("Feedback: Success! Redirecting...");
      window.location.href = '/confirmation';
    } catch (error) {
      console.error("Feedback Submission Error:", error);
      alert(`Submission failed: ${error.message}`);
      // handleFirestoreError(error, 'create', 'feedback'); // Keep it silent but alerted
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex justify-between items-center">
          <button className="p-2 hover:bg-surface-container rounded-full transition-colors">
            <Menu className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-xl font-black tracking-[0.2em] uppercase text-primary text-center flex-grow">
            Feedback Atelier
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.location.href = '/login'}
              className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors hidden md:block"
            >
              Instructor Login
            </button>
            <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border-2 border-outline-variant/20">
              <img 
                src="https://picsum.photos/seed/instructor/100/100" 
                alt="Instructor" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-28 pb-32 px-6 max-w-4xl mx-auto w-full relative">
        {/* Header Section */}
        <section className="mb-12 border-b border-outline pb-8">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-on-surface-variant mb-2 font-headline">Student Feedback Record</p>
            <h2 className="text-display-sm text-primary uppercase font-headline">
              Technology for <br /> Design Experiment
            </h2>
          </div>
        </section>

        <form className="space-y-16" onSubmit={handleSubmit}>
          {/* ... (keep existing sections) */}
          <section className="bg-white rounded-xl p-8 md:p-10 border border-outline">
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-primary mb-2 font-headline">Core Metrics</h3>
              <p className="text-on-surface-variant">Please rate the following aspects on a scale from 1 (Needs Improvement) to 5 (Excellent).</p>
            </div>

            <div className="space-y-10">
              {[
                { id: 'clarity', label: 'Clarity of Instruction' },
                { id: 'difficulty', label: 'Difficulty Level' },
                { id: 'engagement', label: 'Engagement Level' },
                { id: 'usefulness', label: 'Usefulness of Materials' }
              ].map((metric) => (
                <div key={metric.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <span className="text-lg font-medium text-on-surface md:w-1/3">{metric.label}</span>
                  <div className="flex gap-2 justify-between md:justify-end flex-wrap">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleRating(metric.id, val)}
                        className={`w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center text-lg font-semibold transition-all ${
                          formData[metric.id] === val 
                            ? 'bg-primary text-white' 
                            : 'bg-surface-dim/30 text-on-surface hover:bg-surface-dim/50'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Qualitative Section */}
          <section className="space-y-10">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-primary mb-2 font-headline">Qualitative Insights</h3>
              <p className="text-on-surface-variant">Your detailed thoughts help us refine the academic experience.</p>
            </div>

            <div className="space-y-8">
              {[
                { id: 'likeMost', label: 'What did you like most?', placeholder: 'Detail specific concepts or activities...' },
                { id: 'difficulties', label: 'What difficulties did you face?', placeholder: 'Mention any confusing topics or technical issues...' },
                { id: 'suggestions', label: 'Suggestions for improvement', placeholder: 'How could this session be more effective?' }
              ].map((field) => (
                <div key={field.id} className="space-y-3">
                  <label className="text-base font-semibold text-on-surface font-headline" htmlFor={field.id}>{field.label}</label>
                  <textarea
                    id={field.id}
                    rows="4"
                    placeholder={field.placeholder}
                    className="w-full bg-white border border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-4 text-base transition-all resize-none"
                    value={formData[field.id]}
                    onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Submit */}
          <div className="flex justify-end pt-8">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              className="w-full md:w-auto px-12 py-4 bg-primary text-white font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Feedback
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        </form>
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 w-full md:hidden bg-surface/90 backdrop-blur-md border-t border-outline-variant/10 px-6 py-4 flex justify-around items-center">
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined fill">edit_note</span>
          <span className="text-xs font-bold">Feedback</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors" onClick={() => window.location.href = '/dashboard'}>
          <span className="material-symbols-outlined">analytics</span>
          <span className="text-xs font-bold">Dashboard</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">history</span>
          <span className="text-xs font-bold">History</span>
        </button>
      </nav>
    </div>
  );
}
