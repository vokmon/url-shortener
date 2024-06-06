import { type NextPage } from "next";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";


interface PageProps {
  params: {
    slug: string;
  };
}

const Page: NextPage<PageProps> = async ({ params }) => {
  const result = await api.urlShortener.getFullUrlAndIncrementCount({
    shortUrl: params.slug,
  });

  redirect(result.fullUrl);
};

export default Page;
