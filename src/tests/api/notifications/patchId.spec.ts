import { errorSchema } from "data/schemas/index.schema";
import { patchAllNotificationsSchema } from "data/schemas/notifications/getAll.schema";
import { STATUS_CODES } from "data/statusCode";
import { TEST_TAG, COMPONENT_TAG } from "data/types/tags.types";
import { IResponse } from "data/types/core.types";
import { INotificationsResponse } from "data/types/notifications.types";
import { test } from "fixtures/api.fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API][Sales Portal][Notifications][Positive] Mark one notification", () => {
  let token = "";
  let notificationList: IResponse<INotificationsResponse>;

  test.beforeEach(async ({ loginApiService, notificationApi }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test(
    "Succesed one notification mark",
    { tag: [TEST_TAG.REGRESSION, TEST_TAG.POSITIVE, COMPONENT_TAG.NOTIFICATIONS] },
    async ({ notificationApi }) => {
      const notificationList = await notificationApi.getList(token);
      console.log(notificationList.body);
      validateResponse(notificationList, {
        status: STATUS_CODES.OK,
        schema: patchAllNotificationsSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const needId = notificationList.body.Notifications[0]?._id;
      const notificationMarked = await notificationApi.markById(needId!, token);
      console.log(notificationMarked);
      validateResponse(notificationMarked, {
        status: STATUS_CODES.OK,
        schema: patchAllNotificationsSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });
    },
  );
    notificationList = await notificationApi.getList(token);
    validateResponse(notificationList, {
      status: STATUS_CODES.OK,
      schema: patchAllNotificationsSchema,
      IsSuccess: true,
      ErrorMessage: null,
    });
  });

  test("Succesed one notification mark", async ({ notificationApi }) => {
    const needId = notificationList.body.Notifications[0]?._id;
    const notificationMarked = await notificationApi.markById(needId!, token);
    validateResponse(notificationMarked, {
      status: STATUS_CODES.OK,
      schema: patchAllNotificationsSchema,
      IsSuccess: true,
      ErrorMessage: null,
    });
  });

  test("Request without authorization token", async ({ notificationApi }) => {
    token = "";
    const needId = notificationList.body.Notifications[0]?._id;
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
