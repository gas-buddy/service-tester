import { ServiceLocals, ServiceExpress } from '@gasbuddy/service';
import { RestApiErrorResponse, RestApiSuccessResponse } from 'rest-api-support';

export interface FakeServLocals extends ServiceLocals {
  services: {
    fakeServ: (app: ServiceExpress) => {
      getSomething(): Promise<RestApiSuccessResponse<{ things: string[] }> | RestApiErrorResponse>;
    },
  },
}
