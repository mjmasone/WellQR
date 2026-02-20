import './globals.css';

export const metadata = {
  title: 'Calendar QR Generator',
  description: 'Generate QR codes that add events to any calendar app',
  icons: {
    icon: '/calendar.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
