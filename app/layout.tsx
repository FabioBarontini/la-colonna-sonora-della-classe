import "./globals.css";
export const metadata = { title:"La colonna sonora della classe", description:"La musica della nostra classe" };
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="it"><body>{children}</body></html>;
}