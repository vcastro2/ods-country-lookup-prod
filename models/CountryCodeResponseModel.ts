/*
    TODO: Refactor to support primary vs. secondary countries
    Primary falls within centroid of polygon
*/
import { ResponseModel } from './ResponseModel';

export class CountryCodeResponseModel extends ResponseModel {
    data: Array<CountryModel>;
}

export class CountryModel {
    gid: number;
    fips: string;
    iso2: string;
    iso3: string;
    un: number;
    name: string;
    area: number;
    pop2005: number;
    region: string;
    subregion: string;
    lat: number;
    lon: number;
    geom?: any;
}
