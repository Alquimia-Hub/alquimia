export const ACTION_ERRORS = [
  "unauthorized",
  "forbidden",
  "notFound",
  "notOwner",
  "invalidForm",
  "projectLimitReached",
  "tooFast",
  "notPublished",
  "alreadyReported",
  "cannotDeleteApproved",
  "slugTaken",
  "unexpected",
] as const;

export type ActionErrorKey = (typeof ACTION_ERRORS)[number];

export interface ActionError {
  key: ActionErrorKey;
  values?: Record<string, number | string>;
}

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: ActionError };

export const ok = <T>(data: T): ActionResult<T> => ({ ok: true, data });

export const fail = (
  key: ActionErrorKey,
  values?: Record<string, number | string>
): ActionResult<never> => ({ ok: false, error: { key, values } });
