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
  Pagination,
} from "@nextui-org/react";
import QRCode from "react-qr-code";
import { type UrlShortener } from "@prisma/client";
import { api } from "~/trpc/react";
import { Suspense, useMemo, useState } from "react";
// import { useSession } from "next-auth/react"

const rowsPerPage = 10;

const getUrl = (item: UrlShortener) => {
  if (typeof window === "undefined") {
    return "";
  }
  return `${window.location.href}${item.shortUrl}`;
};

export default function UrlTable() {
  // const { data: session, status } = useSession()
  // console.log(session, status);

  const [page, setPage] = useState(1);

  const myQuery = api.urlShortener.getPagingData.useQuery(
    {
      limit: rowsPerPage,
      page,
    },
    { suspense: true },
  );

  const pages = useMemo(() => {
    return myQuery.data?.itemCounts
      ? Math.ceil(myQuery.data?.itemCounts / rowsPerPage)
      : 0;
  }, [myQuery.data?.itemCounts, rowsPerPage]);

  const itemData = myQuery.data?.items;

  return (
    <Table
      aria-label="List of urls"
      isHeaderSticky
      bottomContent={
        pages > 0 ? (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page: number) => setPage(page)}
            />
          </div>
        ) : null
      }
    >
      <TableHeader>
        <TableColumn key="fullUrl">Full Url</TableColumn>
        <TableColumn key="shortUrl">Short Url</TableColumn>
        <TableColumn key="qrCode">Url (Qr Code)</TableColumn>
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
                href={`${item.fullUrl}`}
                target="_blank"
              >
                {item.fullUrl}
              </a>
            </TableCell>
            <TableCell>
              <Snippet symbol="" codeString={getUrl(item)}>
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
              <QRCode size={80} value={getUrl(item)} />
            </TableCell>
            <TableCell>{item.counts}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
