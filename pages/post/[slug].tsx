import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from "next/image";
import { sanityClient, urlFor } from "@/sanity";
import { GetStaticProps } from "next";
import { Post } from "@/typings";

interface Props {
  post: Post;
}

const Post = ({ post }: Props) => {
  return (
    <div>
      <Header />
      <Image
        width={1000}
        height={1000}
        className="w-full h-96 object-cover"
        src={urlFor(post.mainImage).url()}
        alt="main post image"
      />

      {/* Article */}
      <div className="max-w-3xl mx-auto">
        <article className="w-full max-auto p-5 bg-secondaryColor/10">
          <h1 className="font-titleFont font-medium text-[32px] text-primary border-b-[1px] border-b-cyan-800 mt-10 mb-3">
            {post.title}
          </h1>
          <h2 className="font-bodyFont text-[18px] text-gray-500 mb-2">
            {post.description}
          </h2>
          <div className="flex items-center gap-2">
            <img
              className="rounded-full w-12 h-12 object-cover bg-red-400"
              src={urlFor(post.author.image).url()}
              alt="Author post image"
            />
            <p className="font-bodyFont text-base">
              Blog post by <span className="font-bold text-secondaryColor">{post.author.name}</span> - Published At{" "}
              {new Date(post.publishedAt).toLocaleDateString()}
            </p>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
};

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == post]{
        _id,
        slug{
            current
        }
    }`;
  const posts = await sanityClient.fetch(query);
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        publishedAt,
        title,
        author -> {
            name,
            image,
        },
        description,
        mainImage,
        slug,
        body
    }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};
