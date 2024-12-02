import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import '../globals.css';

export const metadata = {
  title: 'Trello Clone',
  description: 'A simple Trello clone using Next.js with App Router',
};

export default function RootLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen" style={{  backgroundColor: "#1A202C"}}>
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-4">
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
