// Home.jsx

import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import HeroSection from '@/components/HeroSection';
import ProductSection from '@/components/ProductSection';
import Footer from '@/components/Footer';
import { fetchUser } from '@/utils/fetches'; // import the fetchUser function
import Button from '@/components/Button';
import Link from 'next/link';

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(setUser);
  }, []);

  return (
    <main className={'min-h-screen items-center'}>
      <Navbar user={user} />
      <HeroSection imageUrl="/logo_nobg.png">
        <h1>
          {' '}
          Hey There! <br></br>Glad you could make it.
        </h1>
        <br></br>
        <h2 className="md:text-5xl">
          This is MakeIt<span className="text-orange-500">Ai</span>For.
          <span className="text-orange-500">Me</span>
          <br></br>Let&apos;s Put <span className="text-orange-500"> Ai </span>
          to work for <span className="text-orange-500">
            Your Business
          </span>{' '}
          <br></br>🦾🤖🦾
        </h2>
        <Link href="/chat">
          <Button _key={0} text={"Start for Free"} className="lg:text-4xl lg:mb-4"/> 
        </Link> 
      </HeroSection>
      <ProductSection />
      <Footer />
    </main>
  );
};

export default Home;
