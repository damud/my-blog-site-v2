import Head from "next/head";
import "slick-carousel/slick/slick.css";
import Banner from "../components/Slider";
import BannerBottom from "../components/Banner";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <Head>
        <title>My Blog | Explore the new horizon</title>
        <link rel="icon" href="/smallLogo.ico" />
      </Head>

      <main className="font-bodyFont">
        <Header />

        <Banner />

        <div className="max-w-7xl mx-auto h-60 relative">
          <BannerBottom />
        </div>

        <div className="max-w-7xl mx-auto py-20 px-4">Posts will go here</div>

        <Footer />
      </main>
    </div>
  );
}
