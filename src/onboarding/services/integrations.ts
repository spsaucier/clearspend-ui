import { service } from 'app/utils/service';

export async function getQboIntegrationLink() {
  return service.post(`/codat/quickbooks-online`);
}
