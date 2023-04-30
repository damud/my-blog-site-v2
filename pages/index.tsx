import Head from "next/head";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import Banner from "../components/Slider";
import BannerBottom from "../components/Banner";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "@/typings";

interface Props {
  posts: [Post];
}

export default function Home({ posts }: Props) {
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

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 py-6">
          {posts.map(post => (
            <div>
              <Image
                width={380}
                height={350}
                src={urlFor(post.mainImage).url()!}
                alt="images"
              />
            </div>
          ))}
        </div>
        

        <Footer />
      </main>
    </div>
  );
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
    _id,
    title,
    author -> {
      name,
      image
    },
    description,
    mainImage,
    slug
  }`;

  const posts = await sanityClient.fetch(query);
  return {
    props: {
      posts,
    },
  };
};
