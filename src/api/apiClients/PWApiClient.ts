import { test, APIRequestContext, APIResponse, TestStepInfo } from "@playwright/test";
import _ from "lodash";
import { BaseApiClient } from "./BaseApiClient";
import { IRequestOptions, IResponse } from "data/types/core.types";

export class PlaywrightApiClient extends BaseApiClient {
  constructor(private requestContext: APIRequestContext) {
    super();
  }

  private response: APIResponse | undefined;

  async send<T extends object | null>(options: IRequestOptions): Promise<IResponse<T>> {
    return await test.step(`Request ${options.method.toUpperCase()} ${options.url}`, async (step) => {
      await this.attachRequest(options, step);

      const maxAttempts = 5;
      let lastErr: unknown;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          this.response = await this.requestContext.fetch(
            options.baseURL + options.url,
            _.omit(options, ["baseURL", "url"]),
          );
          const result = await this.transformResponse();
          await this.attachResponse(options, result, step);
          return result;
        } catch (err) {
          lastErr = err;
          const message = (err as Error).message || "";
          const retryable = /ECONNRESET|ETIMEDOUT|ECONNREFUSED/.test(message);

          if (!retryable || attempt === maxAttempts) {
            console.log("Error message: " + message);
            console.log("Cause: " + JSON.stringify((err as Error).cause));
            await step.attach("Error", {
              body: String(err),
              contentType: "text/plain",
            });
            throw err;
          }

          // backoff before retrying to smooth transient network glitches
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        }
      }

      // Should never reach here
      throw lastErr as Error;
    });
  }

  protected async transformResponse() {
    let body;
    const contentType = this.response!.headers()["content-type"] || "";
    if (contentType.includes("application/json")) {
      body = await this.response!.json();
    } else {
      body = await this.response!.text();
    }

    return {
      status: this.response!.status(),
      body,
      headers: this.response!.headers(),
    };
  }

  private async attachRequest(options: IRequestOptions, step: TestStepInfo) {
    await step.attach(`Request ${options.method.toUpperCase()} ${options.url}`, {
      body: JSON.stringify(
        {
          headers: options.headers,
          ...(options.data && { body: options.data }),
        },
        null,
        2,
      ),
      contentType: "application/json",
    });
  }

  private async attachResponse<T extends object | null>(
    options: IRequestOptions,
    response: IResponse<T>,
    step: TestStepInfo,
  ) {
    await step.attach(`Response ${response.status} ${options.method.toUpperCase()} ${options.url}`, {
      body: JSON.stringify(
        {
          headers: response.headers,
          body: response.body,
        },
        null,
        2,
      ),
      contentType: "application/json",
    });
  }
}
