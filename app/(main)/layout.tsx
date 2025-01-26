import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-2FD2N2NPM3"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-2FD2N2NPM3');
            `,
          }}
        />
      </head>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
