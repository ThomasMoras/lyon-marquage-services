import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Generic error handler for API routes
 */
export function handleError(error: unknown) {
  console.error("API Error:", error);

  let message = "An unknown error occurred";
  if (error instanceof Error) message = error.message;
  else if (typeof error === "string") message = error;

  return NextResponse.json({ error: message }, { status: 500 });
}

/**
 * Validate request body against a Zod schema
 */
export async function validateRequest<T>(
  request: Request,
  schema: z.ZodType<T>
): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
  try {
    const body = await request.json();
    console.log("Validating body:", JSON.stringify(body, null, 2));

    const result = schema.safeParse(body);

    if (!result.success) {
      // Format the error and log it
      const formattedErrors = result.error.format();
      console.error("Validation errors:", JSON.stringify(formattedErrors, null, 2));

      return {
        success: false,
        response: NextResponse.json(
          { error: "Validation failed", details: formattedErrors },
          { status: 400 }
        ),
      };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error parsing request body:", error);
    return {
      success: false,
      response: NextResponse.json({ error: "Failed to parse request body" }, { status: 400 }),
    };
  }
}
