import Link from "next/link";
export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-800 mt-10">
      {/* Hero Section */}
      <section className="bg-[#e1dfd3] py-18 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">OAUSTECH Academic Portal</h1>
        <p className="text-lg max-w-2xl mx-auto mb-6">
          A centralized digital platform tailored for Olusegun Agagu University
          of Science and Technology — streamlining academic processes and
          enhancing student experiences.
        </p>
      </section>

      {/* Call to Action */}
      <section className="bg-[#443227] text-white py-20 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">
          Simplifying OAUSTECH Academics Digitally
        </h2>
        <p className="mb-6 text-lg">
          Log in to the academic portal and experience stress-free school
          management from anywhere.
        </p>
        <Link
          href={"/studentAuth/signin"}
          className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition"
        >
          Login to Portal
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-blue-50 text-center py-6 text-sm text-gray-600">
        &copy; {new Date().getFullYear()} OAUSTECH Academic Portal. All rights
        reserved.
      </footer>
    </main>
  );
}

