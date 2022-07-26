class Popup {
  constructor() {
    this.Init();
  }

  Init() {
    this.AddStyles();
    this.FetchUser();
  }

  AddStyles() {
    $("head").append(`
      <link rel="stylesheet" href="https://styleguide.brainly.com/${STYLEGUIDE_VERSION}/style-guide.css" />
    `);
  }

  async FetchUser() {
    //try {
//
    //} 
  }
}

new Popup();

/* import ServerReq from "@api/Extension";
import type { User } from "@typings/ServerReq";
import createProfileLink from "@utils/createProfileLink";

ServerReq.GetMe().then(me => {
  $(".spinner-border").remove();

  $("body").append(`
  <div class="m-3 d-flex">
    <img src="${me.avatar}" class="rounded-circle" width="100">
    <div class="ml-2 d-flex flex-column">
      <a href="${createProfileLink(me.brainlyId)}" class="link-primary">
        ${me.nick}
      </a>
    </div>
  </div>
  `);
});
*/