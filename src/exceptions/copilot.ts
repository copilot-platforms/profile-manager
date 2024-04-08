export const matchesCopilotApiError = (err: unknown) => {
  return 'body' in (err as { body: { message: string } }) && 'status' in (err as { status: number });
};
