/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // pdfkit читает свои шрифтовые файлы с диска — не бандлим его
  experimental: { serverComponentsExternalPackages: ["pdfkit"] },
};

module.exports = nextConfig;
