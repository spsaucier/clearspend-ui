import mixpanel from 'mixpanel-browser';

export const Events = {
  CREATE_ALLOCATION: 'Create Allocation',
  CREATE_CARD: 'Create Card',
  CREATE_EMPLOYEE: 'Create Employee',
  POST_ERROR: 'POST Error',
  POST_SUCCESS: 'POST Success',
  PUT_ERROR: 'PUT Error',
  PUT_SUCCESS: 'PUT Success',
  GET_ERROR: 'GET Error',
  GET_SUCCESS: 'GET Success',
  DELETE_ERROR: 'DELETE Error',
  DELETE_SUCCESS: 'DELETE Success',
  PATCH_ERROR: 'PATCH Error',
  PATCH_SUCCESS: 'PATCH Success',
  LOGIN: 'Login',
  SIGNUP: 'Create Employee',
  UPDATE_ALLOCATION: 'Update Allocation',
  UPDATE_CARD: 'Update Card',
  UPDATE_EMPLOYEE: 'Update Employee',
};

export interface AnalyticsEvent {
  name?: string;
  type?: AnalyticsEventType;
  data?: {} | string;
}

export interface VendorAnalyticsEvent extends AnalyticsEvent {
  vendors?: AnalyticsVendor[];
}

export enum AnalyticsVendor {
  Mixpanel = 'mixpanel',
}

export enum AnalyticsEventType {
  AddEventProperties = 'addEventProperties',
  AddUserProperties = 'addUserProperties',
  ClearEventProperties = 'clearEventProperties',
  Error = 'error',
  Identify = 'identify',
  Init = 'init',
  Log = 'log',
  Logout = 'logout',
  Purchase = 'purchase',
  RemoveEventProperty = 'removeEventProperty',
  ScreenView = 'screenView',
  Track = 'track',
}

const vendorActions = {
  [AnalyticsVendor.Mixpanel]: async ({ name, type, data }: AnalyticsEvent) => {
    switch (type) {
      case AnalyticsEventType.Identify:
        await mixpanel.identify(name);
        break;
      case AnalyticsEventType.Init:
        await mixpanel.init(name || '', data || {});
        break;
      default:
        await mixpanel.track(name || '', data || {});
        break;
    }
  },
};

export const sendAnalyticsEvent = async ({
  name,
  data,
  type = AnalyticsEventType.Track,
  vendors = [AnalyticsVendor.Mixpanel],
}: VendorAnalyticsEvent) => {
  if (location.hostname !== 'localhost') {
    vendors.forEach(async (vendor: AnalyticsVendor) => {
      try {
        const vendorAction = vendorActions[vendor];
        await vendorAction({ name, data, type });
      } catch {}
    });
  }
};
