import { Button } from "@/components/ui/button";
import { Footer } from "@/home/components/footer";
import Header from "@/home/components/header";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
    <Header/>
    <div>
       
      {children}
    </div>
    <Footer/>
    </>
  );
};

export default Layout;