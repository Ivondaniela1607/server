import { queryMysql } from "../utils/query.helper";

class TourismModel {
  static fetchLocationMarksDB<T>(body: any) {
    return new Promise<T[]>(async (resolve, reject) => {
      try {
        const query = `
          select * from location_marks
        `
        const result = await queryMysql(query);
        resolve(result);
      } catch (error) {
        console.error('An error ocurred fetchLocationMarksDB: ', error);
        reject(error);
      }
    });
  }
  static placeDetailsDB<T>(body: any) {
    console.log('body', body);
    
    return new Promise<T[]>(async (resolve, reject) => {
      try {
        const query = `
          select * from location_marks
          where id = ${body.id}
        `
        const result = await queryMysql(query);
        resolve(result);
      } catch (error) {
        console.error('An error ocurred placeDetailsDB: ', error);
        reject(error);
      }
    });
  }
}

export default TourismModel;