(function () {
  const config = window.FusionAIChatConfig;
  if (!config || !config.tenantSlug) {
    console.error(
      "Fusion AI Error: Missing tenantSlug parameter configuration metric.",
    );
    return;
  }

  // 1. Target your backend setup variables
  const BACKEND_URL = "https://your-nest-backend-app.onrender.com";
  const currentOrigin = typeof document !== "undefined" && document.currentScript 
    ? new URL(document.currentScript.src).origin 
    : "https://fusion-chat-production.vercel.app";

  const FRONTEND_WIDGET_URL = `${currentOrigin}/widget`;
  // 2. Fetch the target styling matrices from your public endpoint
  fetch(`${BACKEND_URL}/public-tenant/${config.tenantSlug}/widget-config`)
    .then((res) => res.json())
    .then((data) => {
      // 3. Programmatically generate a floating launcher action button
      const bubble = document.createElement("div");
      bubble.style.position = "fixed";
      bubble.style.bottom = "24px";
      bubble.style.right = "24px";
      bubble.style.width = "60px";
      bubble.style.height = "60px";
      bubble.style.borderRadius = "50%";
      bubble.style.backgroundColor = data.primaryColor;
      bubble.style.cursor = "pointer";
      bubble.style.zIndex = "999999";
      bubble.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)";
      bubble.style.display = "flex";
      bubble.style.alignItems = "center";
      bubble.style.justifyContent = "center";
      bubble.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;

      // 4. Programmatically generate the hidden chat window layout iframe wrapper
      const frameContainer = document.createElement("iframe");
      frameContainer.src = `${FRONTEND_WIDGET_URL}?slug=${data.slug}`;
      frameContainer.style.position = "fixed";
      frameContainer.style.bottom = "96px";
      frameContainer.style.right = "24px";
      frameContainer.style.width = "400px";
      frameContainer.style.height = "600px";
      frameContainer.style.border = "none";
      frameContainer.style.borderRadius = "24px";
      frameContainer.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)";
      frameContainer.style.zIndex = "999999";
      frameContainer.style.display = "none";

      // Toggle display handle triggers
      bubble.onclick = () => {
        const isHidden = frameContainer.style.display === "none";
        frameContainer.style.display = isHidden ? "block" : "none";
      };

      document.body.appendChild(bubble);
      document.body.appendChild(frameContainer);
    })
    .catch((err) =>
      console.error("Failed loading autonomous voice agent node:", err),
    );
})();
