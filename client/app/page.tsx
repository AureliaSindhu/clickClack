import { Navbar } from "../components/navbar";
import Landing from "../components/Landing";
import { Footer } from "../components/footer"

export default function Home() {
  return (
    <div className="flex flex-col bg-[var(--canvas)] items-center justify-center min-h-screen">
      <Navbar /> 
      <Landing />
      <div className="absolute bottom-0 w-full">
        <Footer /> 
      </div>
    </div>
  );
}
