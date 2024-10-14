import React from 'react';
import SitterHomePage  from './Sitter/SitterHomePage';



function Home() {


  return (
    <div className='home'>
      <header>
        <h1>Happy Tails</h1>
      </header>
      <main>
        <SitterHomePage />
      </main>
    </div>
  );
}

export default Home;
