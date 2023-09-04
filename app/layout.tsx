import './globals.css'
import type {Metadata} from 'next'
import {Poppins} from 'next/font/google'
import Navbar from "@/app/components/nav/Navbar";
import Footer from "@/app/components/footer/Footer";
import {Toaster} from "react-hot-toast";
import CartProvider from "@/providers/CartProvider";

const poppins = Poppins({subsets: ['latin'], weight: ['400', '700']});

export const metadata: Metadata = {
    title: 'E-Shop',
    description: 'Ecommerce app',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={poppins.className}>
        <Toaster
            toastOptions={{
                style: {
                    background: "rgb(51 65 85)",
                    color: "#fff"
                }
            }}
        />
        <CartProvider>
            <div className='flex flex-col min-h-screen'>
                <Navbar/>
                <main className='flex-grow'>{children}</main>
                <Footer/>
            </div>
        </CartProvider>
        </body>
        </html>
    )
}
