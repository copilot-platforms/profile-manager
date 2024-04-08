export class CopilotApiError extends Error {
  readonly status: number;
  readonly body: {
    message: string;
  };

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.body = { message };
  }
}

export const matchesCopilotApiError = (err: unknown) => {
  return 'body' in (err as { body: { message: string } }) && 'status' in (err as { status: number });
};
