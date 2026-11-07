// vendored 地图数据的最小类型面
export interface MapGeoJson {
  type: string;
  features: Array<{ type: string; properties: Record<string, unknown>; geometry: { type: string; coordinates: unknown } }>;
}
export declare const deGeoJson: MapGeoJson;
