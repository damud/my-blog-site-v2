import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from "next/image";
import { sanityClient, urlFor } from "@/sanity";
import { GetStaticProps } from "next";
import { Post } from "@/typings";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface Props {
  post: Post;
}

type Inputs = {
  _id: string;
  name: string;
  email: string;
  comment: string;
};

const Post = ({ post }: Props) => {
  const { data: session } = useSession();
  const [userErr, setUserErr] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = data => {
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        setSubmitted(true);
      })
      .catch(error => {
        setSubmitted(false);
      });
  };
  const handleUserErr = () => {
    if (!session) {
      setUserErr("Please sign in to Comment");
    } else {
      setUserErr("");
    }
  };
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
      <div className="max-w-3xl mx-auto mb-10">
        <article className="w-full max-auto p-5 bg-secondaryColor/10">
          <h1 className="font-titleFont font-medium text-[32px] text-primary border-b-[1px] border-b-cyan-800 mt-10 mb-3">
            {post.title}
          </h1>
          <h2 className="font-bodyFont text-[18px] text-gray-500 mb-2">
            {post.description}
          </h2>
          <div className="flex items-center gap-2">
            <Image
              className="rounded-full w-12 h-12 object-cover bg-red-400"
              src={urlFor(post.author.image).url()}
              width={500}
              height={500}
              alt="Author post image"
            />
            <p className="font-bodyFont text-base">
              Blog post by{" "}
              <span className="font-bold text-secondaryColor">
                {post.author.name}
              </span>{" "}
              - Published At {new Date(post.publishedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-10">
            <PortableText
              dataset={process.env.NEXT_PUBLIC_SANITY_DATASET || "production"}
              projectId={
                process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "klpx2x7i"
              }
              content={post.body}
              serializers={{
                h1: (props: any) => (
                  <h1
                    className="text-3xl font-bold my-5 font-titleFont"
                    {...props}
                  />
                ),
                h2: (props: any) => (
                  <h2
                    className="text-2xl font-bold my-5 font-titleFont"
                    {...props}
                  />
                ),
                h3: (props: any) => (
                  <h3
                    className="text-2xl font-bold my-5 font-titleFont"
                    {...props}
                  />
                ),
                li: ({ children }: any) => (
                  <li className="ml-4 list-disc">{children}</li>
                ),
                link: ({ href, children }: any) => (
                  <a href={href} className="text-cyan-500 hover:underline">
                    {children}
                  </a>
                ),
              }}
            />
          </div>
        </article>
        <hr className="max-w-lg my-5 mx-auto border[1px] border-secondaryColor" />
        {submitted ? (
          <div className="flex flex-col items-center gap-2 p-10 my-10 bg-bgColor text-white mx-auto">
            <h1 className="text-2xl font-bold">
              Thank you for submitting your comment!
            </h1>
            <p>Once it has been approved, it will appear below! </p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-secondaryColor uppercase font-titleFont font-bold">
              Enjoyed this aritcle?
            </p>
            <h3 className="font-titleFont text-3xl font-bold">
              Leave a Comment below!
            </h3>
            <hr className="py-3 mt-2" />
            <input
              {...register("_id")}
              type="hidden"
              name="_id"
              value={post._id}
            />
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-7 flex flex-col gap-6"
            >
              <label className="flex flex-col">
                <span className="font-titleFont font-semibold text-base">
                  Name
                </span>
                <input
                  {...register("name", { required: true })}
                  className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                  type="text"
                  placeholder="Enter your name"
                />
                {/* name input validation */}
                {errors.name && (
                  <p className="text-sm font-titleFont font-semibold text-red-500 my-1 px-4">
                    Name is required
                    <span className="text-base font-bold italic mr-2">!!!</span>
                  </p>
                )}
              </label>
              <label className="flex flex-col">
                <span className="font-titleFont font-semibold text-base">
                  Email
                </span>
                <input
                  {...register("email", { required: true })}
                  className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                  type="email"
                  placeholder="Enter your Email"
                />
                {/*  email input validation */}
                {errors.email && (
                  <p className="text-sm font-titleFont font-semibold text-red-500 my-1 px-4">
                    Email is required
                    <span className="text-base font-bold italic mr-2">!!!</span>
                  </p>
                )}
              </label>
              <label className="flex flex-col">
                <span className="font-titleFont font-semibold text-base">
                  Comment:
                </span>
                <textarea
                  {...register("comment", { required: true })}
                  className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                  placeholder="Enter your Comments"
                  rows={6}
                />
                      {/*  comment input validation */}
                      {errors.email && (
                  <p className="text-sm font-titleFont font-semibold text-red-500 my-1 px-4">
                    Comment is required
                    <span className="text-base font-bold italic mr-2">!!!</span>
                  </p>
                )}
              </label>
              {session && (
                <button
                  className="w-full bg-bgColor text-white text-base font-titleFont font-semibold tracking-wider uppercase py-2 rounded-sm hover:bg-secondaryColor duration-300"
                  type="submit"
                >
                  Submit
                </button>
              )}
            </form>
            {!session && (
              <button
                onClick={handleUserErr}
                className="w-full bg-secondaryColor text-white text-base font-titleFont font-semibold tracking-wider uppercase py-2 rounded-sm hover:bg-bgColor duration-300"
              >
                Submit
              </button>
            )}
            {userErr && (
              <p className="text-sm font-titleFont text-center font-semibold text-red-500 underline underline-offset-2 my-1 px-4 animate-bounce">
                {userErr}{" "}
                <span className="text-base font-bold italic mr-2">!!!</span>
              </p>
            )}
            <div className="w-full flex flex-col p-10 m-10 mx-auto shadow-bgColor shadow-lg space-y-2">
              <h3 className="texy-3xl font-titleFont font-semibold">
                Comments
              </h3>
              <hr />
              {post.comments.map(comment => (
                <div key={comment._id}>
                  <p>
                    <span className="text-secondaryColor">{comment.name}</span>{" "}
                    {comment.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
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
        "comments": *[_type == "comment" && post._ref == ^._id && approved == true],
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
