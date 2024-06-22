import Head from 'next/head';

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Head>
        <title>vPets - Your Virtual AI Pet</title>
        <meta name="description" content="Your new virtual AI companion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full px-4 md:px-20">
        <div className="flex flex-col items-center justify-center w-1/2">
          <div className="w-full h-full flex items-center justify-center">
            <img src="/images/logo.png" alt="vPets Logo" className="w-2/3" />
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center w-1/2 text-center">
          <header className="mb-12">
            <h1 className="text-5xl font-bold text-gray-800">Welcome to vPets</h1>
            <p className="mt-4 text-2xl text-gray-600">Your new virtual AI companion</p>
          </header>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-800">Features</h2>
            <ul className="mt-6 text-lg text-gray-600 list-disc list-inside">
              <li>Interactive virtual pets</li>
              <li>Personalized pet care</li>
              <li>Fun activities and games</li>
            </ul>
          </section>

          <button className="px-8 bg-buttonColor py-4 text-xl font-bold text-white hover:bg-emerald-500 ">
            Get Started
          </button>
        </div>
      </main>
    </div>
  );
}
