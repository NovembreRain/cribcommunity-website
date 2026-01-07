import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-9xl font-serif font-bold text-primary/20">404</h1>
      <h2 className="text-3xl font-bold mt-4 mb-2">Lost in the woods?</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you are looking for seems to have wandered off the path. Let's get you back to safety.
      </p>
      <Link href="/">
        <Button size="lg">Return Home</Button>
      </Link>
    </div>
  )
}