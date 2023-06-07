import { Router } from 'express';
import { fetchLocationMarks, placeDetails } from '../controllers/tourism.controller';

const router = Router();

router.post('/fetch-all-location-marks', fetchLocationMarks);
router.post('/placeDetails', placeDetails);

export default router;
