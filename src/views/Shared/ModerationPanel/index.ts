import _API from "@lib/api/Brainly/Legacy";
import storage from "@lib/storage";
import Build from "@lib/styleguide/Build";
import { MeDataType } from "@typings/Brainly";

class ModerationPanel {
  private newPanel: HTMLElement;
  private oldPanel: HTMLElement;
  private user: MeDataType;

  constructor() {
    this.Init();
  }

  async Init() {
    const modPanelEnabled = await storage.get<boolean>("newModPanelEnabled");
    if (!modPanelEnabled) return;

    this.newPanel = document.querySelector(".brn-moderation-panel");
    this.oldPanel = document.querySelector("#moderate-functions > ul");

    this.user = await _API.GetMe();

    if (!this.newPanel) {
      this.RenderNewPanel();
    }
  }

  RenderNewPanel() {
    const panel = Build("nav", {
      html: `
        <div class="sg-content-box">
          <div class="sg-content-box__actions sg-content-box__actions--with-elements-to-left js-moderation-panel-toggle">
            <button class="brn-moderation-panel__button sg-button sg-button--solid sg-button--s" title="Панель модератора">
              <span class="sg-button__text">M</span>
            </button>
          </div>
        </div>
        <div class="brn-moderation-panel__content sg-box sg-box--padding-m sg-box--shadow js-moderation-panel-content">
          <div class="sg-content-box">
            <div class="sg-content-box__title">
              <h3 class="sg-headline sg-headline--small">Панель модератора</h3></div>
              <div class="sg-content-box__content">
                <div class="brn-moderation-panel__list">
                  <ul class="sg-menu-list sg-menu-list--small">
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      classList: [
        "extension-moderation-panel", 
        "brn-moderation-panel", 
        "js-moderation-panel", 
        "sg-hide-for-small-only"
      ]
    });

    document.querySelector("#moderate-functions-panel")?.remove();
    document.body.prepend(panel);
  }

  /*AddNewLinksToPanelOnNewPage() {
    this.newPanel.insertAdjacentHTML("afterend", `
      <li class="sg-menu-list__element"><a class="sg-menu-list__link" href="${forumLink}">Форум</a></li>`
    );
  }*/
  /*RenderPanelForNewPage() {
    const panel = Build("nav", {
      html: `
        <div class="sg-content-box">
          <div class="sg-content-box__actions sg-content-box__actions--with-elements-to-left js-moderation-panel-toggle">
            <button class="brn-moderation-panel__button sg-button sg-button--solid sg-button--s" title="Панель модератора">
              <span class="sg-button__text">M</span>
            </button>
          </div>
        </div>
        <div class="brn-moderation-panel__content sg-box sg-box--padding-m sg-box--shadow js-moderation-panel-content hidden">
          <div class="sg-content-box">
            <div class="sg-content-box__title">
              <h3 class="sg-headline sg-headline--small">Панель модератора</h3></div>
              <div class="sg-content-box__content">
                <div class="brn-moderation-panel__list">
                  <ul class="sg-menu-list sg-menu-list--small">
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      classList: [
        "extension-moderation-panel", 
        "brn-moderation-panel", 
        "js-moderation-panel", 
        "sg-hide-for-small-only"
      ]
    });
    /*`<nav class="extension-panel brn-moderation-panel js-moderation-panel sg-hide-for-small-only">
      <div class="sg-content-box">
        <div class="sg-content-box__actions sg-content-box__actions--with-elements-to-left js-moderation-panel-toggle">
          <button class="brn-moderation-panel__button sg-button sg-button--solid sg-button--s" title="Панель модератора">
            <span class="sg-button__text">M</span>
          </button>
          </div>
        </div>
        <div class="brn-moderation-panel__content sg-box sg-box--padding-m sg-box--shadow js-moderation-panel-content hidden">
        <div class="sg-content-box">
          <div class="sg-content-box__title"><h3 class="sg-headline sg-headline--small">Панель модератора</h3></div>
          <div class="sg-content-box__content"><div class="brn-moderation-panel__list">
            <ul class="sg-menu-list sg-menu-list--small">
              <li class="sg-menu-list__element action-count" style="font-size: 16px;" >Акции сегодня:</li>
              <li class="sg-menu-list__element">
                <a class="sg-menu-list__link" href="${newMVSetted?"/question/add?reported_content":"/tasks/archive_mod"}">Модерировать все</a>
              </li>
              <li class="sg-menu-list__element"><a class="sg-menu-list__link" href="${forumLink}">Форум</a></li>
              <li class="sg-menu-list__element history" style="height:auto;"><a target="_blank" class="sg-menu-list__link" href="${link}">История действий</a><ul class="students sg-menu-list sg-menu-list--small hidden"></ul></li>
              <li class="sg-menu-list__element"><a class="sg-menu-list__link" href="${archiveLink}">Архив</a></li>
              <li class="sg-menu-list__element"><a class="sg-menu-list__link" href="/moderators/mod_list">Список модераторов</a></li>
              <li class="sg-menu-list__element"><a class="sg-menu-list__link" href="/moderation/ranking">Рейтинг Модераторов</a></li>
              <li class="sg-menu-list__element"><a class="sg-menu-list__link" href="/moderators/holidays_show">Каникулы</a></li>
            </ul>
          </div></div>
        </div>
      </div>
    </nav>`;*/
  //}
}

new ModerationPanel();