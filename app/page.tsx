import Link from "next/link";

export default function Home() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Binder Web</h1>
      <p className="text-gray-600">
        Versi web untuk chat & notes berbasis grup. Mulai dari tab{" "}
        <Link className="underline" href="/space">
          Space
        </Link>{" "}
        atau{" "}
        <Link className="underline" href="/you">
          You
        </Link>
        .
      </p>
    </section>
  );
}
