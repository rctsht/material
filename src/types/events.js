// @flow strict-local
export type DimensionsEventMeasurements = {
  width: number,
  height: number,
  scale: number,
  fontScale: number,
};

export type DimensionsEvent = {
  window: DimensionsEventMeasurements,
  screen: DimensionsEventMeasurements,
};
