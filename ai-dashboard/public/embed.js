(function () {
  const config = window.FusionAIChatConfig;
  if (!config || !config.tenantSlug) {
    console.error("Fusion AI Error: Missing required configurations.");
    return;
  }

  const BACKEND_URL = "http://localhost:3003";

  // Fetch tenant branding settings anonymously
  fetch(`${BACKEND_URL}/public-tenant/${config.tenantSlug}/widget-config`)
    .then(res => res.json())
    .then(data => {
      // Create Widget Root Container Layer
      const widgetContainer = document.createElement("div");
      widgetContainer.id = "fusion-chat-widget-root";
      widgetContainer.style.position = "fixed";
      widgetContainer.style.bottom = "24px";
      widgetContainer.style.right = "24px";
      widgetContainer.style.zIndex = "999999";
      widgetContainer.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

      // Inject Layout HTML
      widgetContainer.innerHTML = `
        <div id="fusion-launcher" style="width: 56px; height: 56px; border-radius: 50%; background-color: ${data.primaryColor}; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(0,0,0,0.25); transition: transform 0.2s;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>

        <div id="fusion-chat-window" style="display: none; width: 360px; height: 500px; background-color: ${data.backgroundColor}; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; box-shadow: 0 12px 40px rgba(0,0,0,0.5); position: absolute; bottom: 72px; right: 0; flex-direction: column; overflow: hidden;">
          <div style="padding: 16px; border-b: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.02);">
            <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #10b981;"></div>
            <h4 style="margin: 0; font-size: 14px; font-weight: 700; color: ${data.textColor};">${data.widgetTitle}</h4>
          </div>
          <div id="fusion-messages" style="flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; font-size: 13px;">
            <div style="align-self: flex-start; background: rgba(255,255,255,0.05); color: ${data.textColor}; padding: 10px 14px; border-radius: 12px; max-w: 80%;">${data.greeting}</div>
          </div>
          <form id="fusion-form" style="padding: 12px; border-t: 1px solid rgba(255,255,255,0.08); display: flex; gap: 8px; margin: 0;">
            <input id="fusion-input" type="text" placeholder="Type a message..." required style="flex: 1; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px; color: ${data.textColor}; font-size: 13px; outline: none;" />
            <button type="submit" style="background: ${data.primaryColor}; color: black; border: none; border-radius: 10px; padding: 0 14px; font-weight: bold; cursor: pointer;">Send</button>
          </form>
        </div>
      `;

      document.body.appendChild(widgetContainer);

      // DOM Node Handlers
      const launcher = document.getElementById("fusion-launcher");
      const chatWindow = document.getElementById("fusion-chat-window");
      const form = document.getElementById("fusion-form");
      const input = document.getElementById("fusion-input");
      const messagesContainer = document.getElementById("fusion-messages");

      // Toggle Display Window Core Matrix
      launcher.onclick = () => {
        const isHidden = chatWindow.style.display === "none";
        chatWindow.style.display = isHidden ? "flex" : "none";
      };

      // Form Message Pipelines Execution Handlers
      form.onsubmit = async (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        input.value = "";

        // Append User Message Element
        const userMsg = document.createElement("div");
        userMsg.style.cssText = `align-self: flex-end; background: ${data.primaryColor}; color: black; font-weight: 500; padding: 10px 14px; border-radius: 12px; max-w: 80%;`;
        userMsg.innerText = text;
        messagesContainer.appendChild(userMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Append Processing Indicator Token
        const typingIndicator = document.createElement("div");
        typingIndicator.style.cssText = `align-self: flex-start; color: rgba(255,255,255,0.4); font-size: 11px; font-family: monospace; animation: pulse 1s infinite;`;
        typingIndicator.innerText = "TYPING...";
        messagesContainer.appendChild(typingIndicator);

        try {
          // Public-facing router execution endpoint
          const res = await fetch(`${BACKEND_URL}/public-tenant/message`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text, slug: data.slug })
          });
          const responseData = await res.json();
          typingIndicator.remove();

          const botMsg = document.createElement("div");
          botMsg.style.cssText = `align-self: flex-start; background: rgba(255,255,255,0.05); color: ${data.textColor}; padding: 10px 14px; border-radius: 12px; max-w: 80%;`;
          botMsg.innerText = responseData.reply;
          messagesContainer.appendChild(botMsg);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (err) {
          typingIndicator.remove();
          console.error("Fusion AI transmission broken link pipeline:", err);
        }
      };
    })
    .catch(err => console.error("Could not mount autonomous chat network widget node:", err));
})();