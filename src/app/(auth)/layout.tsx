'use client'

import {PageTitle, TitleProvider} from "@/lib";
import Image from "next/image";
import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <TitleProvider defaultTitle="Card Hive">
      <div className="min-h-screen w-full flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center justify-center mb-12">
            <div className="mb-8 flex items-center justify-center">
              <Image src={"/logo.png"} width={64} height={64} alt="logo" />
            </div>

            <PageTitle />
          </div>
          {children}
        </div>
      </div>
    </TitleProvider>
  );
};

export default AuthLayout;
