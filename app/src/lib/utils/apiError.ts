import i18n from "i18next";

/** Turns an API error (string, ProblemDetails, validation errors, Axios error) into a message. */
export const errorMessage = (payload: unknown, fallback?: string): string => {
  const generic = fallback ?? i18n.t("static.somethingWentWrong");
  if (!payload) return generic;
  if (typeof payload === "string") return payload;
  if (typeof payload !== "object") return generic;

  const data = payload as Record<string, unknown>;
  const response = data.response as { data?: unknown } | undefined;
  if (response) return response.data ? errorMessage(response.data, generic) : generic;

  if (data.errors && typeof data.errors === "object" && !Array.isArray(data.errors)) {
    const first = Object.values(data.errors as Record<string, unknown>).flat()[0];
    if (typeof first === "string") return first;
  }
  for (const key of ["detail", "message", "title"]) {
    if (typeof data[key] === "string" && data[key]) return data[key] as string;
  }
  return generic;
};
