import { NextResponse } from "next/server";
import { readJson, route } from "@/server/http/respond";
import { parseView } from "@/server/validators/view";
import { recordView } from "@/server/services/viewService";

export const POST = route(async (request) => {
    const input = parseView(await readJson(request));
    return NextResponse.json(await recordView(input));
});
