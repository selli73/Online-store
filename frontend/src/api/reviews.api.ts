import api from './client';
import type { IReviewInput } from '../models';

export const ReviewsApi = {
    create(dto: IReviewInput) {
        return api.post('/reviews/create', dto);
    },

    change(dto: IReviewInput) {
        return api.patch('/reviews/change', dto);
    },
};
