import OpenAI from "openai";
import config from '../config.json' with { type: "json" };

export const openai = new OpenAI(config.openai);