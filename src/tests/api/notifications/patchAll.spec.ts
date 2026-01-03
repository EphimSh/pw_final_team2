import { errorSchema } from "data/schemas/index.schema";
import { patchAllNotificationsSchema } from "data/schemas/notifications/getAll.schema";
import { STATUS_CODES } from "data/statusCode";
import { COMPONENT_TAG, TEST_TAG } from "data/types/tags.types";
import { test } from "fixtures/api.fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API][Sales Portal][Notifications][Positive] Mark all notifications", () => {
  let token = "";

  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test(
    "Succesed all notifications marked",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.POSITIVE, COMPONENT_TAG.NOTIFICATIONS] },
    async ({ notificationApi }) => {
      const notificationList = await notificationApi.markAll(token);
      validateResponse(notificationList, {
        status: STATUS_CODES.OK,
        schema: patchAllNotificationsSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });
    },
  );

  test("Request without authorization token", async ({ notificationApi }) => {
    token = "";
    const notificationList = await notificationApi.getList(token);
    validateResponse(notificationList, {
      status: STATUS_CODES.UNAUTHORIZED,
      schema: errorSchema,
      IsSuccess: false,
      ErrorMessage: null,
    });
  });
});
