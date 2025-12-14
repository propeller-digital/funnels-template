import { CMS_SPEC_URL } from "./config";
import { landingPageSpecSchema, LandingPageSpec } from "./cms-schema";

type CmsSpecResult =
  | { success: true; data: LandingPageSpec }
  | { success: false; error: string };

export async function fetchCmsSpec(): Promise<CmsSpecResult> {
  if (!CMS_SPEC_URL) {
    return { success: false, error: "CMS_SPEC_URL is not configured" };
  }

  const response = await fetch(CMS_SPEC_URL, { cache: "no-store" });

  if (!response.ok) {
    return { success: false, error: `CMS API request failed: ${response.statusText}` };
  }

  const json = await response.json();

  const result = landingPageSpecSchema.safeParse(json);

  if (!result.success) {
    return { success: false, error: `Invalid CMS response: ${result.error.message}` };
  }

  return { success: true, data: result.data };
}
