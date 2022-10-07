import { ServiceLocals } from '@gasbuddy/service';
import { RestApiErrorResponse, RestApiSuccessResponse } from 'rest-api-support';

export interface FakeServLocals extends ServiceLocals {
  services: {
    fakeServ: {
      get_something(): RestApiSuccessResponse<{ things: string[] }> | RestApiErrorResponse;
    }
  }
}
