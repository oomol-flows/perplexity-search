//#region generated meta
/**
 * @typedef {{
 *   input: Record<string, any>;
 * }} Inputs;
 * @typedef {{
 * }} Outputs;
 */
//#endregion

/**
 * @import { Context } from "@oomol/types/oocana"
 * @param {Inputs} params
 * @param {Context<Inputs, Outputs>} context
 * @returns {Promise<Outputs>}
 */
export default async function (params, context) {
    context.preview({ type: "json", data: params.input });
    return;
}
