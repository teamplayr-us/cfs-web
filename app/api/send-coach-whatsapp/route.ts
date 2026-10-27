// College coach WhatsApp group invite (Dallas) — see lib/coachCampaigns.ts.
import { CAMPAIGNS, coachCampaignHandlers } from "@/lib/coachCampaigns";

export const runtime = "nodejs";
export const maxDuration = 60;

export const { GET, POST } = coachCampaignHandlers(CAMPAIGNS.whatsapp);
