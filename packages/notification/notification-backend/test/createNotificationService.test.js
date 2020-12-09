const {
  createNotificationService,
} = require("../src/services/NotificationService");
const assert = require("assert");

describe("createNotificationService", () => {
 
  it("should get an error when no userId is present on createNotificationService", async () => {

    let userId = null;
    let title = "Example title";
    let content = "Example content";
    let type = "Example type";
    let icon = "Example icon";

    return assert.rejects(
      createNotificationService(userId, title, content, type, icon),
      { name: "Error", message: "userId must be provider" }
    );

  });

  it("should get an error when userId is not an objectId valid present on createNotificationService", async () => {

    let userId = 123;
    let title = "Example title";
    let content = "Example content";
    let type = "Example type";
    let icon = "Example icon";

    return assert.rejects(
      createNotificationService(userId, title, content, type, icon),
      { name: "Error", message: "userId must be a valid objectId"}
    );
  });

  it("should get objectId on createNotificationService", async () => {
      
    let userId = "5efa52d618450a357cb2f728";
    let title = "Example title";
    let content = "Example content";
    let type = "Example type";
    let icon = "Example icon";

    let docNotification = await createNotificationService(
      userId,
      title,
      content,
      type,
      icon
    );

    /*  console.log('docNotification: '+docNotification)
     */
    assert.strictEqual(typeof docNotification.id, "string");
  });


  it("should get an error when not title must be provider" , async () => {
    let userId = "5efa52d618450a357cb2f728";
    let title = null;
    let content = "Example content";
    let type = "Example type";
    let icon = "Example icon";

    return assert.rejects(createNotificationService(userId, title, content, type, icon), {
      name: "Error",
      message: "title must be provider"
    })
  })

  it("should get an error when not content must be provider" , async () => {
    let userId = "5efa52d618450a357cb2f728";
    let title = "Example title";
    let content = null;
    let type = "Example type";
    let icon = "Example icon";

    return assert.rejects(createNotificationService(userId, title, content, type, icon), {
      name: "Error",
      message: "content must be provider"
    })
  })

  


});
