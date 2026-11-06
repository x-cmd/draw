// vendored US 各州 GeoJSON 的最小类型面(数据文件见 us-states.js)
export interface UsStatesGeoJson {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: { name: string };
    geometry: { type: string; coordinates: unknown };
  }>;
}
export declare const usStatesGeoJson: UsStatesGeoJson;
