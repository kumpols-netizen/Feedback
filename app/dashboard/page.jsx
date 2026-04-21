'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Download, 
  Eye, 
  Mountain, 
  MessageSquare, 
  BookOpen, 
  ArrowUp, 
  ArrowDown, 
  Minus,
  Smile,
  Meh,
  ChevronDown,
  Loader2,
  LogOut
} from 'lucide-react';
import { db, auth, handleFirestoreError } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function InstructorDashboard() {
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState([
    { id: 'clarity', label: 'Clarity', sub: 'Average Rating', val: '0.0', type: 'neutral', icon: Eye, color: 'secondary' },
    { id: 'difficulty', label: 'Difficulty', sub: 'Perceived effort', val: '0.0', type: 'neutral', icon: Mountain, color: 'tertiary' },
    { id: 'engagement', label: 'Engagement', sub: 'Participation level', val: '0.0', type: 'neutral', icon: MessageSquare, color: 'primary' },
    { id: 'materials', label: 'Materials', sub: 'Resource quality', val: '0.0', type: 'neutral', icon: BookOpen, color: 'on-surface-variant' }
  ]);

  useEffect(() => {
    console.log("Dashboard: Starting snapshot listener...");
    const collectRef = collection(db, 'feedback');
    // Removing orderBy to avoid index issues on first launch
    const q = query(collectRef);
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(`Dashboard: Snapshot received with ${snapshot.docs.length} documents`);
      const data = snapshot.docs.map(doc => {
        const docData = doc.data();
        let createdAtStr = new Date().toISOString();
        
        if (docData.createdAt && typeof docData.createdAt.toDate === 'function') {
          createdAtStr = docData.createdAt.toDate().toISOString();
        }

        return {
          id: doc.id,
          ...docData,
          createdAt: createdAtStr
        };
      });
      
      // Sort in memory instead
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setFeedback(data);
      calculateMetrics(data);
      setIsLoading(false);
    }, (error) => {
      console.error("Dashboard Fetch Error:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const calculateMetrics = (data) => {
    if (data.length === 0) {
      setMetrics(prev => prev.map(m => ({ ...m, val: '0.0' })));
      return;
    }

    const sums = data.reduce((acc, curr) => ({
      clarity: acc.clarity + (curr.clarity || 0),
      difficulty: acc.difficulty + (curr.difficulty || 0),
      engagement: acc.engagement + (curr.engagement || 0),
      materials: acc.materials + (curr.usefulness || 0)
    }), { clarity: 0, difficulty: 0, engagement: 0, materials: 0 });

    const count = data.length;
    setMetrics(prev => prev.map(m => {
      const key = m.id === 'materials' ? 'materials' : m.id;
      const avg = (sums[key] / count).toFixed(1);
      return { ...m, val: avg };
    }));
  };

  const handleExportCSV = () => {
    if (feedback.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = [
      "Date",
      "Student ID",
      "Clarity",
      "Difficulty",
      "Engagement",
      "Materials/Usefulness",
      "Success Areas (Like Most)",
      "Points of Friction (Difficulties)"
    ];

    const rows = feedback.map(item => [
      `"${item.createdAt || ''}"`,
      `"${item.studentId || ''}"`,
      item.clarity || 0,
      item.difficulty || 0,
      item.engagement || 0,
      item.usefulness || 0,
      `"${(item.likeMost || '').replace(/"/g, '""')}"`,
      `"${(item.difficulties || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `feedback_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen">
      <header className="hidden md:block fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline">
        <div className="max-w-screen-2xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-black tracking-[0.2em] uppercase text-primary font-headline">Feedback Atelier</h1>
            <nav className="flex gap-6">
              <button className="text-on-surface-variant font-bold hover:text-primary transition-colors flex items-center gap-2 px-4 py-2 rounded-lg">
                <span className="material-symbols-outlined text-xl">edit_note</span>
                Feedback
              </button>
              <button className="text-primary font-bold flex items-center gap-2 px-4 py-2 bg-surface-dim/30 rounded-lg">
                <span className="material-symbols-outlined text-xl fill">analytics</span>
                Dashboard
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-primary">Instructor Session</p>
              <p className="text-[10px] text-on-surface-variant font-headline">authorized_access</p>
            </div>
            <button 
              onClick={handleLogout}
              className="w-10 h-10 rounded-lg border border-outline flex items-center justify-center hover:bg-surface-dim transition-all text-on-surface-variant hover:text-primary"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-6 pt-12 md:pt-32 pb-32">
        <section className="mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div className="max-w-3xl">
            <h2 className="text-display-lg text-primary mb-2 font-headline">Technology for Design Experiment</h2>
            <p className="text-lg text-on-surface-variant font-medium">Global Course Overview • Fall Semester 2024</p>
          </div>
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <button 
              onClick={handleExportCSV}
              className="flex-1 md:flex-none bg-primary text-white h-[50px] px-6 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {metrics.map((m) => (
            <div 
              key={m.id}
              className="bg-white p-6 rounded-xl border border-outline shadow-sm relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-headline">{m.label}</p>
                  <p className="text-[11px] text-on-surface-variant/60 font-medium">{m.sub}</p>
                </div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-dim/30 text-on-surface">
                  <m.icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-4xl font-bold text-primary tracking-tight font-headline">{m.val}</span>
                <span className="text-[12px] font-bold text-on-surface-variant mb-1">--</span>
              </div>
              <div className="w-full h-1.5 bg-surface-dim/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-primary`} 
                  style={{ width: `${(parseFloat(m.val)/5)*100}%` }}
                />
              </div>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-xl border border-outline overflow-hidden">
          <div className="px-8 py-6 border-b border-outline flex justify-between items-center bg-surface-dim/10">
            <h3 className="text-xl font-bold text-primary font-headline">Written Comments</h3>
            <span className="px-3 py-1 bg-surface-dim/20 rounded-full font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">{feedback.length} Responses</span>
          </div>

          <div className="divide-y divide-outline">
            {feedback.length > 0 ? (
              feedback.map((c) => (
                <article key={c.id} className="p-8 hover:bg-surface-dim/5 transition-all">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-full md:w-40 shrink-0 flex flex-row md:flex-col justify-between md:justify-start gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">Student ID</p>
                        <p className="text-base font-bold text-primary">{c.studentId || 'Anonymous'}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit bg-secondary-container/50 text-on-secondary-container`}>
                        <Smile className="w-3 h-3" />
                        Record
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      {c.likeMost && (
                        <div>
                          <p className="text-xs font-bold uppercase text-primary/50 mb-1">Success Areas</p>
                          <p className="text-base text-on-surface leading-relaxed font-medium">"{c.likeMost}"</p>
                        </div>
                      )}
                      {c.difficulties && (
                        <div>
                          <p className="text-xs font-bold uppercase text-tertiary/60 mb-1">Points of Friction</p>
                          <p className="text-base text-on-surface leading-relaxed font-medium">"{c.difficulties}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="p-16 text-center">
                <MessageSquare className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4" />
                <p className="text-on-surface-variant font-medium">No feedback comments recorded for this session yet.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 w-full md:hidden bg-surface/90 backdrop-blur-md border-t border-outline px-6 py-4 flex justify-around items-center z-50">
        <button className="flex flex-col items-center gap-1 text-on-surface-variant" onClick={() => window.location.href = '/'}>
          <span className="material-symbols-outlined">edit_note</span>
          <span className="text-xs font-bold font-headline">Feedback</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined fill">analytics</span>
          <span className="text-xs font-bold font-headline">Dashboard</span>
        </button>
      </nav>
    </div>
  );
}
