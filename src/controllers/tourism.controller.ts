import { Request, Response } from 'express';
import tourismModel from '../models/tourism.model';

export const fetchLocationMarks = async (req: Request, res: Response) => {
  try {
    const result = await tourismModel.fetchLocationMarksDB(req.body);
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Ha ocurrido un error fetchLocationMarks: ',
      error,
    });
  }
};

export const placeDetails = async (req: Request, res: Response) => {
  try {
    const result = await tourismModel.placeDetailsDB(req.body);
    console.log('result :D', result);
    let data = [];
    result.forEach((element:any) => {
      let detail = {
        "html_attributions": [],
        "next_page_token": 'token',
        "result": [
          {
            "geometry": {
              "location": {
                "lat": element.latitude,
                "lng": element.longitude
              },
              "viewport": {
                "northeast": {
                  "lat": element.latitude,
                "lng": element.longitude
                }
              }
            
            },
            "icon": "aca va el icon",
            "id": element.id,
            "name": "aca va el nombre del negocio",
            "place_id": "aca va el nombre del placeid",
            "reference": "lorem"
          }
        ]
      }
      console.log('detalll', detail);
      
      data.push(detail);
      console.log('dataaaa', data);
      
    });
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Ha ocurrido un error placeDetails: ',
      error,
    });
  }
};
