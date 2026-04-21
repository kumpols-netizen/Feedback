import './globals.css';

export const metadata = {
  title: 'Feedback Atelier',
  description: 'Academic feedback recording and dashboard system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=account_balance,analytics,arrow_drop_down,arrow_forward,arrow_upward,check_circle,download,edit_note,expand_more,forum,history,horizontal_rule,menu,menu_book,sentiment_neutral,sentiment_satisfied,terrain,visibility" rel="stylesheet" />
      </head>
      <body className="min-h-screen selection:bg-primary/10 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
