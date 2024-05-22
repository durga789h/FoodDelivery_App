import React from 'react';
import RestaurantFooter from '../_components/RestaurantFooter';
import RestaurantHeader from '../_components/RestaurantHeader';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <RestaurantHeader/>
        {children}
      </main>
      <RestaurantFooter />
    </div>
  );
};

export default Layout;
