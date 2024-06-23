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
            <img src="/images/logo.png" alt="vPets Logo" className="w-2/3" />
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center w-1/2 text-center">
          <header className="mb-12">
            <h1 className="text-5xl font-bold text-gray-800">
              <AnimatedTextWord text = "Welcome to Admotion" />
            </h1>
            <div className="mt-4 text-2xl text-gray-600">
              <AnimatedTextWord text="Earn coupon while watching ads" />
            </div>
          </header>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-800">Admotion</h2>
            <ul className="mt-6 text-lg text-gray-600 list-disc list-inside">
              <li>Earn coupon to watch ads</li>
              <li>analyze your emotion</li>
            </ul>
          </section>
          <Link href={'/chat'}>
          <button className="px-8 bg-buttonColor py-4 text-xl font-bold text-white hover:bg-emerald-500" >
            Get Started
          </button>
          </Link>

        </div>
      </main>
    </div>
  );
}
