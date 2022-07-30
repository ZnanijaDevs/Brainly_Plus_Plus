import { getUserAuthToken } from "@utils/getViewer";

/**
 * This class is used to handle and generate real-time user events in the extension.
 */
class LiveAction {
  private liveServerHost = "http://localhost:8000";
  private wsEndpointUrl = `ws://localhost:8000/v1/ws`;

  get serverHost() {
    return this.liveServerHost;
  }

  async Open() {
    const token = await getUserAuthToken();

    const ws = new WebSocket(`${this.wsEndpointUrl}?token=${token}`);
  }
}

export default new LiveAction();