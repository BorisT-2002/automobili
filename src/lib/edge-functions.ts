import { env } from "./env";

const edgeBaseUrl = `${env.supabaseUrl}/functions/v1`;

export const callEdgeFunction = async <TBody extends object>(
  name: string,
  body: TBody,
  accessToken: string,
): Promise<Response> => {
  return fetch(`${edgeBaseUrl}/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });
};
