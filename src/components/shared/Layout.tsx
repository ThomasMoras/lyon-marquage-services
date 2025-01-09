import React from "react";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="app">
      <Header />
      <main className="main">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
