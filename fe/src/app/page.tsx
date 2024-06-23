import Head from 'next/head';
// import AnimatedTextWord from '@/components/AnimatedTextWord';
import dynamic from 'next/dynamic';
const AnimatedTextWord = dynamic(() => import('@/components/AnimatedTextWord'), {
  ssr: false, // Ensure this component is only rendered on the client side
});
import Link from 'next/link';


export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Head>
        <title>Admotion</title>
        <meta name="description" content="Your new virtual AI companion" />
      </Head>

      <main className="flex w-full px-4 md:px-20">
        <div className="flex flex-col items-center justify-center w-1/2">
          <div className="w-full h-full flex items-center justify-center">
            <img src="/images/logo.png" alt="vPets Logo" className="w-full" />
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center w-1/2 text-center">
          <header className="mb-12">
            <h1 className="text-5xl font-bold text-gray-800">
              <AnimatedTextWord text = "Welcome to Viewmo" />
            </h1>
            <div className="mt-4 text-2xl text-gray-600">
              <AnimatedTextWord text="Monitor viewer expressions" />
            </div>
          </header>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-800">Viewmo</h2>
            <ul className="mt-6 text-lg text-gray-600 list-disc list-inside">
              <li>Get emotional feedbacks from viewers</li>
              <li>Analyze your emotion consuming media</li>
            </ul>
          </section>
          <div className = 'flex flex-row'>
          <Link href={'/chat'}>
          <button className="px-8 mx-4 drop-shadow-lg border-4 border-indigo-200 rounded-lg bg-buttonColor py-4 text-xl font-bold bg-emerald-500 text-white hover:bg-matcha" >
            Tester
          </button>
          </Link>
          <Link href={'/provider'}>
          <button className="px-8 mx-4 border-4 drop-shadow-lg border-indigo-200 rounded-lg bg-buttonColor py-4 text-xl font-bold bg-red-500 text-white hover:bg-matcha" >
            Provider
          </button>
          </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
