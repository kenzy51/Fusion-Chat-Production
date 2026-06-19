import { cookies } from "next/headers";
import BotConfigComponent from "./BotConfigComponent";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  let tenantData = null;
  const BASE_URL = "http://localhost:3003";

  if (token) {
    try {
      const res = await fetch(`${BASE_URL}/tenant/config`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });

      if (res.ok) {
        tenantData = await res.json();
      }
    } catch (err) {
      console.error("Server-side architecture fetch dropped:", err);
    }
  }

  // 🚀 Pass the server data straight down into your interactive Client View
  return <BotConfigComponent initialData={tenantData} />;
}