import { markAllReadOrNotReadService } from "../src/services/NotificationService";
import assert from "assert";

describe("markAllReadOrNotReadService", () => {

  it("this should return a number ", async () => {

    let userId = "5efa52d618450a357cb2f728";
    let readValue = true;

    let documentNotification = await markAllReadOrNotReadService(userId, readValue)

    assert.strictEqual(typeof documentNotification, "object")

  });
});
