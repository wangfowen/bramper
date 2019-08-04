import moment from "moment";

import {TimeHelper} from "./TimePickerField";


it ('converts from date to seconds for API', () => {
  const start = moment().startOf('day');
  expect(TimeHelper.toApiFormat(start)).toEqual(0);

  const night = start.hours(23).minutes(45);
  expect(TimeHelper.toApiFormat(night)).toEqual((23 * 60 * 60) + (45 * 60));

  const noon = start.hours(12).minutes(15);
  expect(TimeHelper.toApiFormat(noon)).toEqual((12 * 60 * 60) + (15 * 60));
});

it ('converts from seconds to date from API', () => {
  const noon = moment().startOf('day').hours(12).minutes(15);
  const returnedNoon = TimeHelper.toApiFormat(noon);
  const from = TimeHelper.fromApiFormat(returnedNoon);
  const fromStr = TimeHelper.fromApiFormat(returnedNoon.toString());
  expect(from.hours()).toEqual(12);
  expect(from.minutes()).toEqual(15);
  expect(fromStr.hours()).toEqual(12);
  expect(fromStr.minutes()).toEqual(15);

  const threeThirty = (3 * 60 * 60) + (30 * 60);
  const fromApi = TimeHelper.fromApiFormat(threeThirty);
  expect(fromApi.hours()).toEqual(3);
  expect(fromApi.minutes()).toEqual(30);
})
