"use client";

import React, { useEffect } from 'react';

const UnityGame = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/unity-build/Build/jogoWeb.loader.js"; // Caminho para o loader
    script.onload = () => {
      const buildUrl = `${window.location.origin}/unity-build/Build`;

      const config = {
        dataUrl: `${buildUrl}/jogoWeb.data.gz`,
        frameworkUrl: `${buildUrl}/jogoWeb.framework.js.gz`,
        codeUrl: `${buildUrl}/jogoWeb.wasm.gz`,
        streamingAssetsUrl: `${window.location.origin}/unity-build/StreamingAssets`,
        companyName: "YourCompanyName",
        productName: "YourProductName",
        productVersion: "1.0",
      };

      // Inicializa o Unity usando createUnityInstance
      createUnityInstance(document.getElementById("unityContainer"), config)
        .then((unityInstance) => {
          console.log("Unity instance created successfully");

          // Se necessário, adicione lógica para destruir a instância do Unity aqui
          return () => {
            if (unityInstance && unityInstance.Quit) {
              unityInstance.Quit();
            }
          };
        })
        .catch((message) => {
          console.error("Error creating Unity instance: " + message);
        });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <div id="unityContainer" style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default UnityGame;
