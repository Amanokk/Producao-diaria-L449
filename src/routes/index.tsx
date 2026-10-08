import { createFileRoute } from "@tanstack/react-router";
import { ProducaoApp } from "@/components/producao/app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <ProducaoApp />;
}
