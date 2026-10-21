
import Navbar from "../components/layout/Navbar";
import Hero from "../components/common/Hero";
import RecommendationList from "../features/recommendations/components/RecommendationList";
import InternshipList from "../features/internships/components/InternshipList";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <Hero />
        <RecommendationList />
        <InternshipList />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-semibold text-slate-800">
            Skillora
          </p>
          <p>
            Helping students discover their next opportunity.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
