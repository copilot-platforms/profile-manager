// TODO: replace this when copilot exports their ApiError class
export const matchesCopilotApiError = (err: unknown) => {
  return (
    'body' in (err as { body: { message: string } }) &&
    'message' in (err as { body: { message: string } })?.body &&
    'status' in (err as { status: number })
  );
};
