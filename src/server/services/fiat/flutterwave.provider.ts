import { Logger } from "@/server/services/logger.service";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "@/server/utils/errors";
import type {
  PaymentProvider,
  DisburseRequest,
  DisburseResult,
  VirtualAccountRequest,
  VirtualAccountResult,
} from "./payment-provider.interface";

export interface FlutterwaveConfig {
  secretKey: string;
  baseUrl: string;
}

async function safeJson(res: Response): Promise<any> {
  try {
    return await res.json();
  } catch {
    throw new BadRequestError(
      `Flutterwave returned an invalid response (HTTP ${res.status})`,
    );
  }
}

export class FlutterwaveProvider implements PaymentProvider {
  private readonly config: FlutterwaveConfig;

  constructor(config: FlutterwaveConfig) {
    this.config = config;
  }

  async disburse(request: DisburseRequest): Promise<DisburseResult> {
    throw new Error("Not implemented");
  }

  async generateVirtualAccount(
    request: VirtualAccountRequest,
  ): Promise<VirtualAccountResult> {
    throw new Error("Not implemented");
  }

  private static mapError(httpStatus: number, message?: string): AppError {
    const msg = message ?? "Flutterwave request failed";
    if (httpStatus === 401 || httpStatus === 403) {
      return new UnauthorizedError(msg);
    }
    if (httpStatus >= 400 && httpStatus < 500) {
      return new BadRequestError(msg);
    }
    return new InternalServerError(msg);
  }
}
