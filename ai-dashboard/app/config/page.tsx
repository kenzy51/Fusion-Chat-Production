/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cookies } from "next/headers";
import BotConfigComponent from "./BotConfigComponent";
import { BASE_URL } from "../login/page";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  let tenantData = null;

  if (token) {
    try {
      const res = await fetch(`${BASE_URL}/tenant/config`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
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
  // @ts-ignore
  return <BotConfigComponent initialData={tenantData} />;
}
