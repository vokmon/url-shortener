"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Snippet,
} from "@nextui-org/react";
import QRCode from "react-qr-code";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { type UrlShortener } from "@prisma/client";
import { api } from "~/trpc/react";

const rowsPerPage = 8;

export default function UrlTable() {
  const myQuery = api.urlShortener.getInfiniteData.useInfiniteQuery(
    { limit: rowsPerPage },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  const [loaderRef, scrollerRef] = useInfiniteScroll({
    hasMore: myQuery.hasNextPage,
    onLoadMore: myQuery.fetchNextPage,
  });

  if (myQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const itemData = myQuery.data?.pages.flatMap((page) => page.items);

  return (
    <Table
      aria-label="List of urls"
      isHeaderSticky
      baseRef={scrollerRef}
      bottomContent={
        myQuery.hasNextPage ? (
          <div className="flex w-full justify-center">
            <Spinner ref={loaderRef} color="white" />
          </div>
        ) : null
      }
      classNames={{
        base: "max-h-[520px] overflow-scroll",
        table: "min-h-[400px]",
      }}
    >
      <TableHeader>
        <TableColumn key="fullUrl">Full Url</TableColumn>
        <TableColumn key="shortUrl">Short Url</TableColumn>
        <TableColumn key="shortUrl">Url (Qr Code)</TableColumn>
        <TableColumn key="counts">Counts</TableColumn>
      </TableHeader>
      <TableBody
        items={itemData}
        isLoading={myQuery.isLoading}
        loadingContent={<Spinner color="white" />}
      >
        {(item: UrlShortener) => (
          <TableRow key={item.shortUrl}>
            <TableCell>
              <a
                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                href={`/${item.fullUrl}`}
                target="_blank"
              >
                {item.fullUrl}
              </a>
            </TableCell>
            <TableCell>
              <Snippet
                symbol=""
                codeString={`${window.location.href}${item.shortUrl}`}
              >
                <a
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  href={`/${item.shortUrl}`}
                  target="_blank"
                >
                  /{item.shortUrl}
                </a>
              </Snippet>
            </TableCell>
            <TableCell align="center">
              <QRCode
                size={80}
                value={`${window.location.href}${item.shortUrl}`}
              />
            </TableCell>
            <TableCell>{item.counts}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
