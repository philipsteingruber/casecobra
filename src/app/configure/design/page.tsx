interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function DesignPage({ searchParams }: PageProps) {
  const { id } = searchParams;

  return <div>{id}</div>;
}
