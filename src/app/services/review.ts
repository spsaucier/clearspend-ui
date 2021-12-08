import { service } from 'app/utils/service';

export async function uploadForManualReview(params: Readonly<{}>) {
  return (await service.post('/manual-review', params)).data;
}
