/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mixpanel, { Dict } from 'mixpanel-browser';
import * as FS from '@fullstory/browser';

import { formatAddress } from '_common/formatters/address';

import { formatName } from '../../employees/utils/formatName';

export const Events = {
  ACTIVATE_CARD: 'Activate Card',
  APPLICATION_APPROVED: 'Application Approved',
  CREATE_ALLOCATION: 'Create Allocation',
  CREATE_CARD: 'Create Card',
  CREATE_CARD_BOTH_PHYSICAL_VIRTUAL: 'Create both physical and virtual cards.',
  CREATE_CARD_PHYSICAL: 'Create physical card',
  CREATE_CARD_VIRTUAL: 'Create virtual card',
  CREATE_EMPLOYEE: 'Create Employee',
  DELETE_ERROR: 'DELETE Error',
  DELETE_SUCCESS: 'DELETE Success',
  DEPOSIT_CASH: 'Deposit Cash',
  EXPORT_CARDS: 'Export Cards',
  EXPORT_EMPLOYEES: 'Export Employees',
  EXPORT_LEDGER: 'Export Ledger',
  EXPORT_TRANSACTIONS: 'Export Transactions',
  GET_ERROR: 'GET Error',
  GET_SUCCESS: 'GET Success',
  LINK_BANK: 'Link Bank',
  LOGIN: 'Login',
  PATCH_ERROR: 'PATCH Error',
  PATCH_SUCCESS: 'PATCH Success',
  POST_ERROR: 'POST Error',
  POST_SUCCESS: 'POST Success',
  PUT_ERROR: 'PUT Error',
  PUT_SUCCESS: 'PUT Success',
  ONBOARDING_COMPLETE: 'Onboarding Complete',
  REALLOCATE_FUNDS: 'Re-allocate funds',
  RESEND_EMAIL_OTP: 'Re-send Email OTP',
  RESEND_PHONE_OTP: 'Re-send Phone OTP',
  SET_PASSWORD: 'Set Password',
  SKIP_DEPOSIT: 'Skip Deposit',
  SUBMIT_NAME_EMAIL: 'Submit Name and Email',
  SUBMIT_BUSINESS_DETAILS: 'Submit Business Details',
  SUBMIT_BUSINESS_LEADERSHIP: 'Submit Business Leadership',
  SUPPLEMENTAL_INFO_REQUIRED: 'Supplemental Info Required',
  SUPPLEMENTAL_INFO_SUBMITTED: 'Supplemental Info Submitted',
  UPDATE_ALLOCATION: 'Update Allocation',
  UPDATE_CARD: 'Update Card',
  UPDATE_EMPLOYEE: 'Update Employee',
  VERIFY_EMAIL: 'Verify Email',
  VERIFY_MOBILE: 'Verify Mobile',
  VIEW_SIGNUP: 'View Sign Up',
  WITHDRAW_CASH: 'Withdraw Cash',
} as const;

export interface AnalyticsEvent {
  name?: string;
  type?: AnalyticsEventType;
  data?: Dict;
}

export interface VendorAnalyticsEvent extends AnalyticsEvent {
  vendors?: AnalyticsVendor[];
}

export enum AnalyticsVendor {
  Mixpanel = 'mixpanel',
  FullStory = 'fullstory',
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
        mixpanel.identify(name);
        break;
      case AnalyticsEventType.AddUserProperties:
        mixpanel.people.set({
          ...data,
          $email: data?.email,
          $name: formatName(data),
          address: formatAddress(data?.address),
        });
        if (data?.businessId) {
          mixpanel.register({ businessId: data.businessId });
        }
        break;
      case AnalyticsEventType.Logout:
        mixpanel.reset();
        break;
      default:
        mixpanel.track(name || '', data || {});
        break;
    }
  },
  [AnalyticsVendor.FullStory]: async ({ name, type, data }: AnalyticsEvent) => {
    switch (type) {
      case AnalyticsEventType.AddUserProperties:
        FS.identify(data?.userId, {
          displayName: formatName(data),
          email: data?.email,
        });
        FS.setUserVars({
          company: data?.businessId,
        });
        break;
      case AnalyticsEventType.Logout:
        FS.anonymize();
        break;
      default:
        FS.log(name || JSON.stringify(data) || '');
        break;
    }
  },
};

export const sendAnalyticsEvent = ({
  name,
  data,
  type = AnalyticsEventType.Track,
  vendors = [AnalyticsVendor.Mixpanel, AnalyticsVendor.FullStory],
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
