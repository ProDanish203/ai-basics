import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

export const Navbar = () => {
  return (
    <header className="py-4 px-6 flex items-center justify-between">
      <div>
        <Link href="/">AI</Link>
      </div>
      <nav className="capitalize flex items-center gap-x-2">
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Home
        </Link>
        <Link
          href="/chat-with-pdf"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          chat with PDF
        </Link>

        <Link
          href="/image-generation"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Image Generation
        </Link>
      </nav>
    </header>
  );
};
