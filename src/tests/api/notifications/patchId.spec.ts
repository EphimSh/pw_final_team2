import { errorSchema } from "data/schemas/index.schema";
import { patchAllNotificationsSchema } from "data/schemas/notifications/getAll.schema";
import { STATUS_CODES } from "data/statusCode";
import { COMPONENT_TAG, TEST_TAG } from "data/types/tags.types";
import { IResponse } from "data/types/core.types";
import { INotificationsResponse } from "data/types/notifications.types";
import { test } from "fixtures/api.fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API][Sales Portal][Notifications][Positive] Mark one notification", () => {
  let token = "";
  let notificationList: IResponse<INotificationsResponse>;

  test.beforeEach(async ({ loginApiService, notificationApi }) => {
    token = await loginApiService.loginAsAdmin();
    notificationList = await notificationApi.getList(token);
    validateResponse(notificationList, {
      status: STATUS_CODES.OK,
      schema: patchAllNotificationsSchema,
      IsSuccess: true,
      ErrorMessage: null,
    });
  });

  test(
    "Succesed one notification mark",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.POSITIVE, COMPONENT_TAG.NOTIFICATIONS] },
    async ({ notificationApi }) => {
      const needId = notificationList.body.Notifications[0]?._id;
      test.skip(!needId, "No notifications to mark");
      const notificationMarked = await notificationApi.markById(needId!, token);
      validateResponse(notificationMarked, {
        status: STATUS_CODES.OK,
        schema: patchAllNotificationsSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });
    },
  );

  test("Request without authorization token", async ({ notificationApi }) => {
    token = "";
    const needId = notificationList.body.Notifications[0]?._id ?? "507f1f77bcf86cd799439011";
    const notificationMarked = await notificationApi.markById(needId!, token);
    validateResponse(notificationMarked, {
      status: STATUS_CODES.UNAUTHORIZED,
      schema: errorSchema,
      IsSuccess: false,
      ErrorMessage: null,
    });
  });

  test("Request without notification Id", async ({ notificationApi }) => {
    const needId = "";
    const notificationMarked = await notificationApi.markById(needId!, token);
    validateResponse(notificationMarked, {
      status: STATUS_CODES.NOT_FOUND,
      IsSuccess: false,
      ErrorMessage: null,
    });
  });
});
