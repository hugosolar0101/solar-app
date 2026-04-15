//import "../globals.css";
import AuthProvider from "@/components/AuthProvider";

export const metadata = {
  title: "Solar App",
  description: "Sistema de gestão solar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}