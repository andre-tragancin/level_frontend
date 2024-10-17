/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async headers() {
      return [
        {
          source: '/unity-build/Build/jogoWeb.data.gz', // Nome exato do arquivo
          headers: [
            {
              key: 'Content-Encoding',
              value: 'gzip', // Indica que o arquivo está compactado com Gzip
            },
            {
              key: 'Content-Type',
              value: 'application/octet-stream', // Tipo de conteúdo para arquivos .data.gz
            },
          ],
        },
        {
          source: '/unity-build/Build/jogoWeb.framework.js.gz', // Nome exato do arquivo
          headers: [
            {
              key: 'Content-Encoding',
              value: 'gzip', // Indica que o arquivo está compactado com Gzip
            },
            {
              key: 'Content-Type',
              value: 'application/javascript', // Tipo de conteúdo para arquivos .js
            },
          ],
        },
        {
          source: '/unity-build/Build/jogoWeb.loader.js', // Nome exato do arquivo
          headers: [
            {
              key: 'Content-Type',
              value: 'application/javascript', // Tipo de conteúdo para arquivos .js
            },
          ],
        },
        {
          source: '/unity-build/Build/jogoWeb.wasm.gz', // Nome exato do arquivo
          headers: [
            {
              key: 'Content-Encoding',
              value: 'gzip', // Indica que o arquivo está compactado com Gzip
            },
            {
              key: 'Content-Type',
              value: 'application/wasm', // Tipo de conteúdo para arquivos .wasm
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
  