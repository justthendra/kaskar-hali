import { handlers } from "@/auth";
import { type NextApiRequest, type NextApiResponse } from "next";

export default function auth(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") return handlers.POST(req as any);
    return handlers.GET(req as any);
}
