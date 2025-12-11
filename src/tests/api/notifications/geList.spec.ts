import { patchAllNotificationsSchema } from "data/schemas/notifications/getAll.schema";
import { STATUS_CODES } from "data/statusCode";
import { test } from "fixtures/api.fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe.only("[API][Sales Portal][Notifications][Positive] Get All Notifications", () => {
  let token = "";

  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test("Succesed getting notification list", async ({ notificationApi }) => {
    const notificationList = await notificationApi.getList(token);
    console.log(notificationList.body);
    validateResponse(notificationList, {
      status: STATUS_CODES.OK,
      schema: patchAllNotificationsSchema,
      IsSuccess: true,
      ErrorMessage: null,
    });
  });
});
