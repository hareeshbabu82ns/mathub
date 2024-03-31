import { Link } from "react-aria-components";

const EmptyPageContent = () => {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Oops!!</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Lost in Space 🚀
          </h3>
          <p className="text-sm text-muted-foreground">
            Probably better off to Dashboard
          </p>
          <Link
            href="/"
            className="mt-4 bg-fuchsia-400 hover:bg-fuchsia-600/90 dark:bg-fuchsia-600 hover:dark:bg-fuchsia-400/90 p-4 text-xl rounded-md"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </>
  );
};

export default EmptyPageContent;
