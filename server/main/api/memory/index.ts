import { readBody } from "../../../shared/http/readBody.js";
import { json } from "../../../shared/http/json.js";
import { listMemories, getMemory, createMemory, updateMemory, deleteMemory } from "../../repository/memory.js";

const handleMemoryApi = async (req, res, path) => {
    if (path === "/api/memory/list" && req.method === "GET") {
        return json(res, { success: true, items: listMemories() });
    }

    if (path === "/api/memory/get" && req.method === "GET") {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const id = Number(url.searchParams.get("id") || 0);
        if (!id) return json(res, { success: false, message: "id is required" }, 400);
        const item = getMemory(id);
        if (!item) return json(res, { success: false, message: "not found" }, 404);
        return json(res, { success: true, item });
    }

    if (path === "/api/memory/create" && req.method === "POST") {
        const body = (await readBody(req)) || {};
        const title = String(body.title || "").trim();
        const content = String(body.content || "").trim();
        if (!title) return json(res, { success: false, message: "title is required" }, 400);
        if (!content) return json(res, { success: false, message: "content is required" }, 400);
        const item = createMemory({
            title,
            description: body.description || "",
            content,
            enabled: body.enabled !== false,
            pinned: !!body.pinned
        });
        return json(res, { success: true, item });
    }

    if (path === "/api/memory/update" && req.method === "POST") {
        const body = (await readBody(req)) || {};
        const id = Number(body.id || 0);
        if (!id) return json(res, { success: false, message: "id is required" }, 400);
        const exists = getMemory(id);
        if (!exists) return json(res, { success: false, message: "not found" }, 404);
        const item = updateMemory(id, {
            title:       body.title,
            description: body.description,
            content:     body.content,
            enabled:     body.enabled,
            pinned:      body.pinned
        });
        return json(res, { success: true, item });
    }

    if (path === "/api/memory/delete" && req.method === "POST") {
        const body = (await readBody(req)) || {};
        const id = Number(body.id || 0);
        if (!id) return json(res, { success: false, message: "id is required" }, 400);
        deleteMemory(id);
        return json(res, { success: true });
    }

    return json(res, { error: "API endpoint not found" }, 404);
};

export { handleMemoryApi };
