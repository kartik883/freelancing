import { Button } from "@/components/ui/button";
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
    </>
  );
};

export default Layout;