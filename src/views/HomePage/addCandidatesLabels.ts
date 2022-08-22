import _API from "@api/Extension";
import type { Candidate } from "@typings/ServerReq";

class CandidatesBox {
  #box: HTMLDivElement;
  candidates: Candidate[];

  constructor() {
    this.Init();
  }

  async Init() {
    let box: HTMLDivElement = document.querySelector(`div[data-testid="ranking"]`);

    if (!box) return setTimeout(this.Init, 1000);

    this.#box = box;

    try {
      const data = await _API.GetCandidates();

      this.candidates = data;

      this.BindMutationObserver();
      this.RenderLabels();
    } catch (err) {
      flash("error", err);
    }

    this.BindMutationObserver();
    this.RenderLabels();
  }

  private BindMutationObserver() {
    const observer = new MutationObserver(this.RenderLabels.bind(this));
    observer.observe(this.#box, { 
      childList: true, 
      subtree: true 
    });
  }

  private RenderLabels() {
    let items = this.#box.querySelectorAll(`
      .sg-box > .sg-flex--column .sg-flex--column [data-testid="ranking-item"]:not(.candidate)
    `);

    for (let item of items) {
      let userLink: HTMLLinkElement = item.querySelector("a:first-child");
      let userId = +userLink?.href.match(/\d+$/);

      const candidate = this.candidates.find(candidate =>
        userId === candidate.znanijaId
      );

      item.classList.add("candidate", `candidate-${candidate ? "" : "not-"}exists`);

      if (!candidate) continue;
      
      const candidateColor = /отказ/i.test(candidate?.status) ? "red" :
        /актив/i.test(candidate?.status) ? "#6322ff" : "#55ab80";

      item.querySelector(".sg-avatar").insertAdjacentHTML("afterend", `
        <div style="border-color: ${candidateColor}" class="candidate-label" title="Кандидат: ${candidate.status}">К</div>
      `);
    }
  }
}

new CandidatesBox();