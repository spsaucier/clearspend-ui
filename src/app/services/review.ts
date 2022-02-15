import { service } from 'app/utils/service';

export async function uploadForApplicationReview(params: Readonly<{}>) {
  return (await service.post<null>('/application-review/document', params)).data;
}
