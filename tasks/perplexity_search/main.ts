import pRetry from "p-retry";

//#region generated meta
type Inputs = {
    searchText: string;
    token: string;
    model: "sonar" | "sonar-pro" | "sonar-deep-research" | "sonar-reasoning-pro" | "sonar-reasoning" | "r1-1776";
    max_tokens: number;
    temperature: number;
    top_k: number;
    top_p: number;
    presence_penalty: number;
    frequency_penalty: number;
    search_context_size: "low" | "medium" | "high";
    search_recency_filter: "day" | "week" | "month" | "year" | null;
    search_after_date_filter: string | null;
    search_before_date_filter: string | null;
    return_images: boolean;
    return_related_questions: boolean;
    search_domain_filter: string[] | null;
    retryCount: number;
};
type Outputs = {
    raw: Record<string, any>;
    text: string;
};
//#endregion

import type { Context } from "@oomol/types/oocana";

export default async function(
    params: Inputs,
    context: Context<Inputs, Outputs>
): Promise<Partial<Outputs> | undefined | void> {
    const body: Record<string, any> = {
        model: params.model,
        messages: [
            {
                "role": "system",
                "content": "Be precise and concise.",
            },
            {
                "role": "user",
                "content": params.searchText
            }
        ],
        max_tokens: params.max_tokens,
        temperature: params.temperature,
        top_p: params.top_p,
        top_k: params.top_k,
        presence_penalty: params.presence_penalty,
        frequency_penalty: params.frequency_penalty,
        stream: false,
        web_search_options: {
            search_context_size: params.search_context_size,
        },
        return_images: params.return_images,
        return_related_questions: params.return_related_questions,
    }

    if (params.search_recency_filter !== null) {
        body.search_recency_filter = params.search_recency_filter;
    }
    
    if (params.search_domain_filter !== null) {
        body.search_domain_filter = params.search_domain_filter;
    }

    if (params.search_after_date_filter !== null) {
        const [y,m,d] = params.search_after_date_filter.split("-");
        body.search_after_date_filter = `${m}/${d}/${y}`;
    }

    if (params.search_before_date_filter !== null) {
        const [y,m,d] = params.search_before_date_filter.split("-");
        body.search_before_date_filter = `${m}/${d}/${y}`;
    }

    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${params.token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    };

    const run = async () => {
        const resp = await fetch('https://api.perplexity.ai/chat/completions', options);
        return await resp.json();
    }

    const json = await pRetry(run, {
        retries: params.retryCount
    });

    if (json?.choices?.[0]?.message?.content) {
            context.preview({
            type: "markdown",
            data: json.choices[0].message.content,
        });
    } else {
        context.preview({
            type: "json",
            data: json,
        });
    }

    return {
        raw: json,
        text: json?.choices?.[0]?.message?.content || "" 
    };
};
