import "./globals.css";
export const metadata = { title:"La colonna sonora della classe", description:"La musica che racconta la nostra classe" };
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="it"><body><div className="app-shell">{children}</div></body></html>;
}
