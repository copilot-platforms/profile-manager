// TODO: replace this when copilot exports their ApiError class
export declare class CopiltoAPIError {
  body: {
    message: string;
  };
  status: number;
}

export const matchesCopilotApiError = (err: unknown): err is CopiltoAPIError => {
  return (
    'body' in (err as { body: { message: string } }) &&
    'message' in (err as { body: { message: string } })?.body &&
    'status' in (err as { status: number })
  );
};
