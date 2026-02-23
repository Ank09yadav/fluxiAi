import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Flux AI</h1>
      <Button>Click me</Button>
      <UserButton/>
    </div>
  );
}
