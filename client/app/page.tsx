import { Navbar } from "../components/navbar";
import Landing from "../components/Landing";
import { Footer } from "../components/footer"

export default function Home() {
  return (
    <div>
      <Navbar /> 
      <Landing />
      <div className="absolute bottom-0 w-full">
        <Footer /> 
      </div>
    </div>
  );
}
