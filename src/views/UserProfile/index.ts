import ServerReq from "@lib/api/Extension";

class UserProfile {
  userId: number = +window.location.pathname.match(/(?<=-)\d+/);

  constructor() {
    this.FetchUserFromExtensionServer();
  }

  async FetchUserFromExtensionServer() {
    const user = await ServerReq.GetUserByBrainlyID(this.userId);
  
    console.debug("user", user);
  }
}

new UserProfile();