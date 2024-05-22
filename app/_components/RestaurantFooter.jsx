import Link from 'next/link';
import React from 'react';

export default function RestaurantFooter() {
  return (
    <div className='w-full'>
      <div className='bg-lime-400 text-xl text-white p-7 w-full text-center'>
        <h1>All rights reserved @ testcov</h1>
        <ul style={{ lineHeight: '32px' }} className='leading-6'>
          <li>
            <Link href={"/about"}>About</Link>
          </li>
          <li>
            <Link href={"/contact"}>Contact</Link>
          </li>
          <li>
            <Link href={"/policy"}>Privacy Policy</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
